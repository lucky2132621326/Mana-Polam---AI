export type SeverityLevel = "low" | "medium" | "high"

export interface DetectionEvent {
  id: string
  zoneId: string
  disease: string
  confidence: number
  severityLevel: SeverityLevel
  severityScore: number
  recommendedChemical: string
  organicAlternative: string
  dosage: string
  timestamp: string
}

export const detectionEvents: DetectionEvent[] = []