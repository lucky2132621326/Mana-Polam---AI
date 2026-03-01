import { ZoneStatus, ZoneData, ZoneHistoryEntry, DetectionEvent } from "./types"

// --- SINGLETON PATTERN FOR HMR STABILITY ---
const globalMemory = global as any;

// Shared simulation flag
export const simulationEnabledRef = globalMemory.simulationEnabledRef || {
  value: false
}
if (!globalMemory.simulationEnabledRef) globalMemory.simulationEnabledRef = simulationEnabledRef

// Shared zones array
export let zones: ZoneData[] = globalMemory.zones || [
  // Row A
  { id: "A1", row: 0, col: 0, status: "healthy", lastSprayed: "2026-02-17T08:30:00.000Z", soilMoisture: 72, temperature: 23, humidity: 68, plantCount: 45, healthScore: 92 },
  { id: "A2", row: 0, col: 1, status: "healthy", lastSprayed: "2026-02-17T09:10:00.000Z", soilMoisture: 68, temperature: 24, humidity: 70, plantCount: 48, healthScore: 88 },
  { id: "A3", row: 0, col: 2, status: "warning", lastSprayed: "2026-02-17T07:45:00.000Z", soilMoisture: 35, temperature: 26, humidity: 82, plantCount: 42, healthScore: 65 },
  { id: "A4", row: 0, col: 3, status: "critical", lastSprayed: "2026-02-17T10:00:00.000Z", soilMoisture: 20, temperature: 29, humidity: 92, plantCount: 40, healthScore: 45 },
  { id: "A5", row: 0, col: 4, status: "healthy", lastSprayed: "2026-02-16T08:15:00.000Z", soilMoisture: 74, temperature: 22, humidity: 66, plantCount: 50, healthScore: 95 },
  { id: "A6", row: 0, col: 5, status: "healthy", lastSprayed: "2026-02-16T09:40:00.000Z", soilMoisture: 71, temperature: 23, humidity: 69, plantCount: 47, healthScore: 90 },

  // Row B
  { id: "B1", row: 1, col: 0, status: "healthy", lastSprayed: "2026-02-16T07:50:00.000Z", soilMoisture: 69, temperature: 24, humidity: 71, plantCount: 44, healthScore: 87 },
  { id: "B2", row: 1, col: 1, status: "warning", lastSprayed: "2026-02-16T10:25:00.000Z", soilMoisture: 58, temperature: 27, humidity: 65, plantCount: 41, healthScore: 68 },
  { id: "B3", row: 1, col: 2, status: "healthy", lastSprayed: "2026-02-16T11:05:00.000Z", soilMoisture: 73, temperature: 23, humidity: 70, plantCount: 49, healthScore: 91 },
  { id: "B4", row: 1, col: 3, status: "healthy", lastSprayed: "2026-02-16T06:30:00.000Z", soilMoisture: 75, temperature: 22, humidity: 67, plantCount: 51, healthScore: 94 },
  { id: "B5", row: 1, col: 4, status: "warning", lastSprayed: "2026-02-15T08:45:00.000Z", soilMoisture: 78, temperature: 25, humidity: 80, plantCount: 43, healthScore: 65 },
  { id: "B6", row: 1, col: 5, status: "healthy", lastSprayed: "2026-02-15T09:20:00.000Z", soilMoisture: 70, temperature: 24, humidity: 69, plantCount: 46, healthScore: 89 },

  // Row C
  { id: "C1", row: 2, col: 0, status: "healthy", lastSprayed: "2026-02-15T07:10:00.000Z", soilMoisture: 72, temperature: 23, humidity: 68, plantCount: 48, healthScore: 93 },
  { id: "C2", row: 2, col: 1, status: "warning", lastSprayed: "2026-02-15T10:55:00.000Z", soilMoisture: 67, temperature: 26, humidity: 73, plantCount: 40, healthScore: 70 },
  { id: "C3", row: 2, col: 2, status: "healthy", lastSprayed: "2026-02-14T08:05:00.000Z", soilMoisture: 71, temperature: 24, humidity: 70, plantCount: 47, healthScore: 88 },
  { id: "C4", row: 2, col: 3, status: "healthy", lastSprayed: "2026-02-14T09:35:00.000Z", soilMoisture: 74, temperature: 23, humidity: 67, plantCount: 50, healthScore: 92 },
  { id: "C5", row: 2, col: 4, status: "healthy", lastSprayed: "2026-02-14T07:40:00.000Z", soilMoisture: 69, temperature: 24, humidity: 71, plantCount: 45, healthScore: 86 },
  { id: "C6", row: 2, col: 5, status: "healthy", lastSprayed: "2026-02-14T10:10:00.000Z", soilMoisture: 73, temperature: 22, humidity: 68, plantCount: 49, healthScore: 91 },

  // Row D
  { id: "D1", row: 3, col: 0, status: "healthy", lastSprayed: "2026-02-13T08:20:00.000Z", soilMoisture: 75, temperature: 23, humidity: 69, plantCount: 52, healthScore: 95 },
  { id: "D2", row: 3, col: 1, status: "healthy", lastSprayed: "2026-02-13T09:50:00.000Z", soilMoisture: 70, temperature: 24, humidity: 70, plantCount: 46, healthScore: 89 },
  { id: "D3", row: 3, col: 2, status: "healthy", lastSprayed: "2026-02-13T07:25:00.000Z", soilMoisture: 72, temperature: 23, humidity: 68, plantCount: 48, healthScore: 90 },
  { id: "D4", row: 3, col: 3, status: "warning", lastSprayed: "2026-02-12T10:45:00.000Z", soilMoisture: 66, temperature: 25, humidity: 72, plantCount: 39, healthScore: 64 },
  { id: "D5", row: 3, col: 4, status: "healthy", lastSprayed: "2026-02-12T08:55:00.000Z", soilMoisture: 74, temperature: 22, humidity: 67, plantCount: 50, healthScore: 93 },
  { id: "D6", row: 3, col: 5, status: "healthy", lastSprayed: "2026-02-12T09:30:00.000Z", soilMoisture: 71, temperature: 24, humidity: 69, plantCount: 47, healthScore: 87 },
]
if (!globalMemory.zones) globalMemory.zones = zones

export function updateLiveZones() {
  const liveIds = ["A1", "A2", "A3", "A4"]

  for (const zone of zones) {
    if (!liveIds.includes(zone.id)) continue

    if (zone.status === "healthy") {
      zone.status = "warning"
      zone.soilMoisture = 35
      zone.humidity = 82
      zone.healthScore = 65
    } else if (zone.status === "warning") {
      zone.status = "critical"
      zone.soilMoisture = 20
      zone.humidity = 92
      zone.healthScore = 45
    } else {
      zone.status = "healthy"
      zone.soilMoisture = 70
      zone.humidity = 65
      zone.healthScore = 90
    }
  }
}
export const zoneHistory: ZoneHistoryEntry[] = zones.map(zone => ({
  zoneId: zone.id,
  moistureHistory: [zone.soilMoisture],
  temperatureHistory: [zone.temperature],
  sprays: 0,

  diseaseHistory: [],
  confidenceHistory: [],
  severityHistory: [],
  timestampHistory: [],
    treatmentHistory: [],
}))
// 🔥 Activity log store
export const activityLog: {
  type: "spray" | "alert" | "water"
  zoneId: string
  timestamp: string
}[] = globalMemory.activityLog || []
if (!globalMemory.activityLog) globalMemory.activityLog = activityLog

export const pendingCommands: Record<string, ("spray" | "water")[]> = globalMemory.pendingCommands || {}
if (!globalMemory.pendingCommands) globalMemory.pendingCommands = pendingCommands
