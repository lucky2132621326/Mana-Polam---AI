const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Load sample predictions file (can be replaced by real ML output)
const DATA_PATH = path.join(__dirname, 'data', 'predictions.json');
let predictions = null;
function loadPredictions() {
  try {
    predictions = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  } catch (err) {
    predictions = { sensors: { moisture: [] }, zones: [] };
  }
}
loadPredictions();

// Helper: compute efficiency same as frontend
function computeEfficiency(sprays) {
  // mirrors: Math.max(60, 100 - sprays * 5)
  return Math.max(60, 100 - sprays * 5);
}

// Ensure we have session state for 24 zones and each zone has moistureHistory >= 10
function ensureZones() {
  predictions = predictions || {};
  predictions.zones = predictions.zones || [];

  // create or normalize 24 zones (4 rows A-D x 6 cols)
  const rows = ['A','B','C','D'];
  const cols = 6;
  const daysBack = 365; // keep 1 year of daily records

  for (let r = 0; r < rows.length; r++) {
    for (let c = 1; c <= cols; c++) {
      const idx = r * cols + (c - 1);
      const zoneId = `${rows[r]}${c}`;
      const existing = predictions.zones[idx];
      if (!existing || existing.zoneId !== zoneId) {
        // generate daily records for the past year with gentle variations
        const records = [];
        const base = Math.round(30 + Math.random() * 30);
        for (let d = daysBack - 1; d >= 0; d--) {
          const dt = new Date();
          dt.setDate(dt.getDate() - d);
          // create a trend: slow seasonal +/- and random noise
          const seasonal = Math.round(base + Math.sin((d / 365) * Math.PI * 2) * 5 + (Math.random() * 6 - 3));
          records.push({ date: dt.toISOString().slice(0,10), moisture: Math.max(0, seasonal) });
        }
        predictions.zones[idx] = {
          zoneId,
          sprays: 0,
          detections: [],
          records
        };
      } else {
        // ensure fields exist and extend records to 365 days if needed
        existing.zoneId = existing.zoneId || zoneId;
        existing.sprays = typeof existing.sprays === 'number' ? existing.sprays : 0;
        existing.detections = Array.isArray(existing.detections) ? existing.detections : (existing.detections || []);
        existing.records = Array.isArray(existing.records) ? existing.records : [];
        // fill or extend to daysBack with variations
        if (existing.records.length < daysBack) {
          const lastDate = existing.records.length ? new Date(existing.records[existing.records.length - 1].date) : new Date();
          const lastMoisture = existing.records.length ? existing.records[existing.records.length - 1].moisture : Math.round(30 + Math.random() * 30);
          const needed = daysBack - existing.records.length;
          for (let i = 1; i <= needed; i++) {
            const dt = new Date(lastDate);
            dt.setDate(dt.getDate() + i);
            const val = Math.max(0, Math.round(lastMoisture + (Math.random() * 6 - 3)));
            existing.records.push({ date: dt.toISOString().slice(0,10), moisture: val });
          }
        }
        // trim to keep most recent daysBack
        if (existing.records.length > daysBack) existing.records = existing.records.slice(existing.records.length - daysBack);
      }
    }
  }
}

// call once at startup
ensureZones();

// POST new raw predictions (to update what endpoints return)
app.post('/api/predictions', (req, res) => {
  const body = req.body;
  if (!body) return res.status(400).json({ error: 'no body' });
  predictions = body;
  // persist to disk (best-effort)
  try {
    fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
    fs.writeFileSync(DATA_PATH, JSON.stringify(predictions, null, 2));
  } catch (e) {}
  // ensure session zones shape after update
  ensureZones();
  try { fs.writeFileSync(DATA_PATH, JSON.stringify(predictions, null, 2)); } catch (e) {}
  return res.json({ status: 'ok', received: true });
});

// Task 1: /api/history
app.get('/api/history', (req, res) => {
  // Accept optional query: ?zoneId=zone-1 or ?row=A etc. Default returns global moistureHistory and all zones.
  const queryZoneId = req.query.zoneId;

  ensureZones();

  const zones = predictions.zones || [];

  // global moistureHistory: use sensors.moisture if available, otherwise average of zones last values
  let moistureHistory = (predictions && predictions.sensors && predictions.sensors.moisture) || [];
  if (!Array.isArray(moistureHistory) || moistureHistory.length < 10) {
    // build from zone averages
    moistureHistory = [];
    for (let i = 0; i < 10; i++) {
      const vals = zones.map(z => (Array.isArray(z.moisture) && z.moisture[i] !== undefined) ? z.moisture[i] : null).filter(v => v !== null);
      const avg = vals.length ? Math.round(vals.reduce((a,b)=>a+b,0)/vals.length) : 40;
      moistureHistory.push(avg);
    }
  }

  // Map zone-specific detection data to array of objects { zoneId, sprays, moistureHistory }
  const mappedZones = zones.map((z) => {
    let sprays = 0;
    if (typeof z.sprays === 'number') sprays = z.sprays;
    else if (Array.isArray(z.detections)) sprays = z.detections.filter((d) => (d.confidence || 0) > 0.5).length;

    // ensure we return at least 10 points for each zone's moistureHistory
    const mh = Array.isArray(z.moisture) ? z.moisture.slice() : [];
    while (mh.length < 10) {
      const last = mh.length ? mh[mh.length - 1] : 40;
      mh.unshift(Math.max(0, Math.round(last + (Math.random() * 6 - 3))));
      if (mh.length > 20) break;
    }

    return {
      zoneId: z.zoneId || z.id || null,
      sprays,
      moistureHistory: mh
    };
  });

  // support range parameter: days or preset strings: 7d,30d,90d,365d
  const range = req.query.range || '30d';
  const row = req.query.row; // 'A'|'B'|'C'|'D'
  const presets = { '7d': 7, '30d': 30, '90d': 90, '365d': 365 };
  const days = presets[range] || (parseInt(range, 10) || 30);

  if (queryZoneId) {
    const found = mappedZones.find(z => z.zoneId === queryZoneId);
    if (found) {
      // return time series for this zone
      const rawZone = zones.find(z => z.zoneId === queryZoneId);
      const series = getZoneSeries(rawZone || {}, days);
      return res.json({ zoneId: queryZoneId, moistureHistory: series });
    }
    return res.status(404).json({ error: 'zone not found' });
  }

  // If row specified, return aggregated series for that row
  if (row && /^[A-D]$/.test(row)) {
    const agg = aggregateSeries(zones, days, row);
    return res.json({ row, moistureHistory: agg });
  }

  // default: return farm-wide aggregated series plus per-zone latest series (short)
  const farmSeries = aggregateSeries(zones, days);
  const perZoneShort = mappedZones.map(z => ({ zoneId: z.zoneId, sprays: z.sprays, moistureHistory: getZoneSeries(zones.find(x=>x.zoneId===z.zoneId) || {}, Math.min(30, days)) }));
  return res.json({ moistureHistory: farmSeries, zones: perZoneShort });
});

// Task 2: /api/analytics
app.get('/api/analytics', (req, res) => {
  const zones = (predictions && predictions.zones) || [];

  const mapped = zones.map((z) => {
    const sprays = typeof z.sprays === 'number' ? z.sprays : (Array.isArray(z.detections) ? z.detections.filter(d => (d.confidence||0) > 0.5).length : 0);
    const maxConfidence = Array.isArray(z.detections) && z.detections.length ? Math.max(...z.detections.map(d => d.confidence || 0)) : 0;
    return { zoneId: z.zoneId || z.id || null, sprays, maxConfidence, detections: z.detections || [] };
  });

  const totalSpraying = mapped.reduce((s, z) => s + z.sprays, 0);

  // avgEfficiency: compute per-zone efficiency then average
  const efficiencies = mapped.map(z => computeEfficiency(z.sprays));
  const avgEfficiency = efficiencies.length ? Math.round(efficiencies.reduce((a,b)=>a+b,0)/efficiencies.length) : 100;

  // pesticideSaved: heuristic - saved proportional to fewer sprays and improved efficiency
  const pesticideSaved = Math.round(totalSpraying * (avgEfficiency / 100) * 1.5);

  // diseasesPrevented: count unique high-confidence detections (>0.6)
  const diseasesPrevented = mapped.reduce((set, z) => {
    (z.detections || []).forEach(d => { if ((d.confidence||0) > 0.6) set.add(d.disease || d.label || JSON.stringify(d)); });
    return set;
  }, new Set()).size;

  // yieldImprovement & costReduction: simple estimates based on efficiency
  const yieldImprovement = +(avgEfficiency * 0.12).toFixed(1); // percent
  const costReduction = Math.round(totalSpraying * (avgEfficiency / 100) * 10);

  // zones by severity thresholds
  let criticalZones = 0, warningZones = 0, healthyZones = 0;
  mapped.forEach(z => {
    if (z.maxConfidence > 0.8) criticalZones++;
    else if (z.maxConfidence > 0.5) warningZones++;
    else healthyZones++;
  });

  const result = {
    totalSpraying,
    avgEfficiency,
    pesticideSaved,
    diseasesPrevented,
    yieldImprovement,
    costReduction,
    criticalZones,
    warningZones,
    healthyZones,
    // include per-zone summarized data for frontend if needed
    zones: mapped
  };

  return res.json(result);
});

// Helper: extract last N days of moisture numbers for a zone
function getZoneSeries(zone, days) {
  const series = [];
  const recs = Array.isArray(zone.records) ? zone.records : [];
  const len = recs.length;
  // If we have exact daily records with dates, pick last `days` entries
  if (len >= days) {
    const slice = recs.slice(len - days);
    return slice.map(r => r.moisture);
  }
  // fallback: replicate last value
  const last = len ? recs[len - 1].moisture : 40;
  for (let i = 0; i < days; i++) series.push(last);
  return series;
}

// Helper: aggregate zones by row or whole farm
function aggregateSeries(zones, days, filterRow) {
  // zones: array of zone objects with zoneId & records
  // filterRow optional: 'A'..'D' to select only that row
  const selected = filterRow ? zones.filter(z => z.zoneId && z.zoneId.startsWith(filterRow)) : zones;
  if (!selected.length) return Array(days).fill(0);

  // build per-zone series then average across zones day-by-day
  const perZone = selected.map(z => getZoneSeries(z, days));
  const out = [];
  for (let i = 0; i < days; i++) {
    let sum = 0, cnt = 0;
    for (let j = 0; j < perZone.length; j++) {
      const v = perZone[j][i];
      if (typeof v === 'number') { sum += v; cnt++; }
    }
    out.push(cnt ? Math.round(sum / cnt) : 0);
  }
  return out;
}

// Task: /api/spray - mutate session state for a zone (increase last moisture by 5-10%)
app.post('/api/spray', (req, res) => {
  const { zoneId } = req.body || {};
  if (!zoneId) return res.status(400).json({ error: 'zoneId required' });

  ensureZones();

  const idx = predictions.zones.findIndex(z => z.zoneId === zoneId || z.id === zoneId);
  if (idx === -1) return res.status(404).json({ error: 'zone not found' });

  const zone = predictions.zones[idx];
  zone.sprays = (typeof zone.sprays === 'number') ? zone.sprays + 1 : 1;

  // increase last value by 5-10% and append it to moisture history to show immediate upward trend
  zone.moisture = zone.moisture || [];
  const last = zone.moisture.length ? zone.moisture[zone.moisture.length - 1] : 40;
  const factor = 1 + (0.05 + Math.random() * 0.05); // 1.05 - 1.10
  const increased = Math.round(last * factor);
  zone.moisture.push(increased);
  // cap history size to 24
  if (zone.moisture.length > 24) zone.moisture.shift();

  // optionally add a detection event for demonstration (low-confidence)
  zone.detections = zone.detections || [];
  zone.detections.push({ disease: 'spray-event', confidence: 0.1, timestamp: new Date().toISOString() });

  // persist
  try { fs.writeFileSync(DATA_PATH, JSON.stringify(predictions, null, 2)); } catch (e) {}

  // Return updated zone and a short analytics snapshot
  const analyticsSnapshot = {
    totalSpraying: (predictions.zones || []).reduce((s, z) => s + ((z.sprays) || 0), 0),
    avgEfficiency: Math.round(((predictions.zones || []).map(z => computeEfficiency(z.sprays || 0)).reduce((a,b)=>a+b,0) / (predictions.zones.length || 1)))
  };

  return res.json({ status: 'ok', zone: { zoneId: zone.zoneId, sprays: zone.sprays, moistureHistory: zone.moisture }, analytics: analyticsSnapshot });
});

// Simple health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`ML-backed API listening on http://localhost:${PORT}`);
});
