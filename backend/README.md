# Mana-Polam Backend

Simple Node.js Express backend that exposes endpoints to serve processed ML predictions to the frontend.

Endpoints:
- `GET /api/history` — returns { moistureHistory: number[], zones: [{ zoneId, sprays, moistureHistory }] }
- `GET /api/analytics` — returns aggregated analytics fields: `totalSpraying`, `avgEfficiency`, `pesticideSaved`, `diseasesPrevented`, `yieldImprovement`, `costReduction`, and zone severity counts (`criticalZones`, `warningZones`, `healthyZones`).
- `POST /api/predictions` — upload raw ML predictions JSON to update what the endpoints return.

Install & run:

```bash
cd backend
npm install
npm start
```

The server listens on `:8000` by default. Update or replace `data/predictions.json` with your ML model output; the server will read it on start and accept runtime updates via `POST /api/predictions`.
