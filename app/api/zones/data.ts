import type { DetectionEvent } from "../data/detectionStore"
export type ZoneStatus =
  | "healthy"
  | "warning"
  | "critical"
  | "uncertain"

export interface ZoneData {
  id: string
  row: number
  col: number
  status: ZoneStatus
  lastSprayed: string
  soilMoisture: number
  temperature: number
  humidity: number
  plantCount: number
  healthScore: number

  // 🔥 NEW ML FIELDS
  disease?: string
  mlConfidence?: number
  severityScore?: number
  severityLevel?: "low" | "medium" | "high"
  lastAnalyzed?: string

  treatmentHistory?:DetectionEvent[]
}

// Shared simulation flag
export const simulationEnabledRef = {
  value: true
}

// Shared zones array

 
  export let zones: ZoneData[] = [
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




  // Keep the rest of your zones A5–D6 here


export function updateLiveZones() {
  const liveIds = ["A1", "A2", "A3", "A4"]

  zones = zones.map(zone => {
    if (!liveIds.includes(zone.id)) return zone

    if (zone.status === "healthy") {
      return {
        ...zone,
        status: "warning",
        soilMoisture: 35,
        humidity: 82,
        healthScore: 65,
      }
    }

    if (zone.status === "warning") {
      return {
        ...zone,
        status: "critical",
        soilMoisture: 20,
        humidity: 92,
        healthScore: 45,
      }
    }

    return {
      ...zone,
      status: "healthy",
      soilMoisture: 70,
      humidity: 65,
      healthScore: 90,
    }
  })
}
export interface ZoneHistoryEntry {
  zoneId: string
  moistureHistory: number[]
  temperatureHistory: number[]
  sprays: number

  // 🔥 NEW ML HISTORY
  diseaseHistory: string[]
  confidenceHistory: number[]
  severityHistory: number[]
  timestampHistory: string[]
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
  type: "spray" | "alert"
  zoneId: string
  timestamp: string
}[] = []
