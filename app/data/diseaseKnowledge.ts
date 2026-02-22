export type SeverityLevel = "low" | "moderate" | "high"

export interface DiseaseKnowledge {
  displayName: string
  pathogenType: "Fungal" | "Bacterial" | "Viral"
  scientificName: string

  severityThresholds: {
    low: number
    moderate: number
  }

  farmerGuidance: {
    immediateActions: string[]
    recommendedTreatment: string[]
    irrigationAdvice: string
    fertilizerAdvice: string
  }

  scientificInsights: {
    transmission: string
    environmentalTriggers: string
    impact: string
  }
}

export const diseaseKnowledge: Record<string, DiseaseKnowledge> = {
  "Squash___Powdery_mildew": {
    displayName: "Squash – Powdery Mildew",
    pathogenType: "Fungal",
    scientificName: "Podosphaera xanthii",

    severityThresholds: {
      low: 0.4,
      moderate: 0.7
    },

    farmerGuidance: {
      immediateActions: [
        "Remove infected leaves immediately",
        "Increase plant spacing for better airflow"
      ],
      recommendedTreatment: [
        "Apply sulfur-based fungicide",
        "Use potassium bicarbonate spray"
      ],
      irrigationAdvice: "Avoid overhead watering; prefer drip irrigation",
      fertilizerAdvice: "Reduce excess nitrogen fertilization"
    },

    scientificInsights: {
      transmission:
        "Spores spread through air currents and infected plant debris.",
      environmentalTriggers:
        "High humidity with moderate temperatures (15–27°C).",
      impact:
        "Can reduce yield by 20–40% if untreated."
    }
  }
}