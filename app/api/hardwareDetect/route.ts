import { NextResponse } from "next/server"
import { zones } from "../zones/data"
import { calculateSeverity, getTreatmentOptions } from "@/app/lib/mlProcessor"
import { readDB, writeDB } from "@/app/lib/database"
type DetectionEvent = {
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

  status:"active" | "treated" | "resolved"
  treatedAt: string | null
  postSeverityScore: number | null
  linkedSprayId: string | null
  
}
export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const zoneId = formData.get("zoneId") as string
    const file = formData.get("file") as File

    if (!zoneId || !file) {
      return NextResponse.json(
        { error: "Missing zone or image file" },
        { status: 400 }
      )
    }

    // Send image to Flask ML server
    const flaskForm = new FormData()
    flaskForm.append("file", file)

    const flaskRes = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      body: flaskForm,
    })

    if (!flaskRes.ok) {
      return NextResponse.json(
        { error: "ML prediction failed" },
        { status: 500 }
      )
    }

    const mlResult = await flaskRes.json()

    const disease = mlResult?.disease ?? "Unknown"
    const confidence = mlResult?.confidence ?? 0

    const zone = zones.find(z => z.id === zoneId)
    if (!zone) {
      return NextResponse.json(
        { error: "Zone not found" },
        { status: 404 }
      )
    }

    // 🔥 Severity calculation
    const { level, score } = calculateSeverity(confidence)

    // 🔥 Treatment lookup
    const treatments = getTreatmentOptions(disease)
    const primaryChemical = treatments.chemicals?.[0]

    // 🔥 Create detection object
    const newDetection: DetectionEvent = {
      id: crypto.randomUUID(),
      zoneId,
      disease,
      confidence,
      severityLevel: level as "low" | "medium" | "high",
      severityScore: score,
      recommendedChemical:
        primaryChemical?.chemicalName ?? "No chemical required",
      organicAlternative:
        treatments.organic?.[0] ?? "Neem Oil",
      dosage:
        primaryChemical?.dosage ?? "As per label",
      timestamp: new Date().toISOString(),

      status: "active",
      treatedAt: null,
      postSeverityScore: null,
      linkedSprayId: null,

    }

    // 🔥 READ DB
    const db = readDB()

    // Save detection persistently
    db.detections.push(newDetection)

    // 🚿 AUTO SPRAY — Only if severity not low
    if (level !== "low") {
      db.sprays.push({
        id: crypto.randomUUID(),
        zoneId,
        disease,
        chemical:
          primaryChemical?.chemicalName ?? "Organic Spray",
        dosage:
          primaryChemical?.dosage ?? "Standard",
        timestamp: new Date().toISOString(),
        triggeredBy: "AI Auto Spray",
      })
    }

    // 🔥 WRITE DB
    writeDB(db)

    // 🔥 Update live zone state (UI reflection only)
    zone.disease = disease
    zone.mlConfidence = confidence
    zone.severityLevel = level as "low" | "medium" | "high"
    zone.severityScore = score
    zone.lastAnalyzed = new Date().toISOString()

    if (!zone.treatmentHistory) zone.treatmentHistory = []
    zone.treatmentHistory.push(newDetection)

    return NextResponse.json({
      success: true,
      detection: newDetection,
    })

  } catch (err) {
    console.error("Hardware detect error:", err)
    return NextResponse.json(
      { error: "Hardware detect failed" },
      { status: 500 }
    )
  }
}