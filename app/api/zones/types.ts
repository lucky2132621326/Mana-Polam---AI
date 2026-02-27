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

  treatmentHistory?: DetectionEvent[]
}

export type DetectionEvent = {
  id: string
  zoneId: string
  disease: string
  confidence: number
  severityLevel: "low" | "medium" | "high"
  severityScore: number
  recommendedChemical: string
  organicAlternative: string
  dosage: string
  timestamp: string

  status: "active" | "treated" | "resolved"
  treatedAt: string | null
  postSeverityScore: number | null
  linkedSprayId: string | null
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
  treatmentHistory: DetectionEvent[]
}
