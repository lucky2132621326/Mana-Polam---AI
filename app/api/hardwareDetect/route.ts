import { NextResponse } from "next/server"
import { zones } from "../zones/data"
import { calculateSeverity, getTreatmentOptions } from "@/app/lib/mlProcessor"

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

    zone.disease = mlResult.disease
    zone.mlConfidence = mlResult.confidence
    zone.severityLevel = level
    zone.severityScore = score
    zone.lastAnalyzed = new Date().toISOString()

    if (!zone.treatmentHistory) zone.treatmentHistory = []

    return NextResponse.json({
      success: true,
      zone,
      treatments
    })
  } catch (err) {
    return NextResponse.json({ error: "Hardware detect failed" }, { status: 500 })
  }
}