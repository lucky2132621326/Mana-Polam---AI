import { NextResponse } from "next/server"
import { zones } from "../zones/data"
import { calculateSeverity, getTreatmentOptions } from "@/app/lib/mlProcessor"
import { detectionEvents } from "../data/detectionStore"
import type { DetectionEvent } from "../data/detectionStore"
import { sprayEvents } from "../spray/sprayStore" // if not already



export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const zoneId = formData.get("zoneId") as string
    const file = formData.get("file") as File

    if (!zoneId || !file) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 })
    }

    const flaskForm = new FormData()
    flaskForm.append("file", file)

    const flaskRes = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      body: flaskForm,
    })

    const mlResult = await flaskRes.json()

    const zone = zones.find(z => z.id === zoneId)
    if (!zone) {
      return NextResponse.json({ error: "Zone not found" }, { status: 404 })
    }

    const { level, score } = calculateSeverity(mlResult.confidence)
    const treatments = getTreatmentOptions(mlResult.disease)

const primaryChemical = treatments.chemicals?.[0]

const newDetection: DetectionEvent = {
  id: crypto.randomUUID(),
  zoneId,
  disease: mlResult.disease,
  confidence: mlResult.confidence,
  severityLevel: level as  "low" | "medium" | "high",
  severityScore: score,
  recommendedChemical: primaryChemical?.chemicalName ?? "No chemical required",
  organicAlternative: treatments.organic?.[0] ?? "Neem Oil",
  dosage: primaryChemical?.dosage ?? "As per label",
  timestamp: new Date().toISOString()
}

// 🚿 AUTO SPRAY LOGIC

if (level === "high" || level === "moderate") {
  sprayEvents.push({
    id: crypto.randomUUID(),
    zoneId,
    disease: mlResult.disease,
    chemical: primaryChemical?.chemicalName ?? "Organic Spray",
    dosage: primaryChemical?.dosage ?? "Standard",
    timestamp: new Date().toISOString(),
    triggeredBy: "AI Auto Spray"
  })
}
    detectionEvents.push(newDetection)

    zone.disease = mlResult.disease
    zone.mlConfidence = mlResult.confidence
    zone.severityLevel = level as  "low" | "medium" | "high",
    zone.severityScore = score
    zone.lastAnalyzed = new Date().toISOString()

    if (!zone.treatmentHistory) zone.treatmentHistory = []
    zone.treatmentHistory.push(newDetection)

    return NextResponse.json({
      success: true,
      detection: newDetection
    })
  } catch (err) {
    return NextResponse.json({ error: "Hardware detect failed" }, { status: 500 })
  }
}