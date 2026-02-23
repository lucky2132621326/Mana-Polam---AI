import { pesticideDatabase } from "@/app/data/pesticideDatabase"

export async function runMLPrediction(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch("http://127.0.0.1:5000/predict", {
    method: "POST",
    body: formData,
  })

  const data = await response.json()
  return data
}

export function calculateSeverity(confidence: number

): { level: "low" | "moderate" | "high"; score: number } {
  if (confidence > 0.75) return { level: "high", score: 3 }
  if (confidence > 0.45) return { level: "moderate", score: 2 }
  return { level: "low", score: 1 }
}

export function getTreatmentOptions(disease: string) {
  const chemicals = pesticideDatabase.filter(p =>
    p.approvedFor.includes(disease)
  )

  const organic = [
    "Neem Oil (3-5 ml/L)",
    "Trichoderma bio-fungicide",
    "IPM based monitoring"
  ]

  return { chemicals, organic }
}