import { NextResponse } from "next/server"
import { detectionEvents } from "../data/detectionStore"
import { sprayEvents } from "../spray/sprayStore"

export async function GET() {

  const totalDetections = detectionEvents.length
  const highSeverity = detectionEvents.filter(d => d.severityLevel === "high").length
  const moderateSeverity = detectionEvents.filter(d => d.severityLevel === "moderate").length

  const totalSprays = sprayEvents.length

  const diseaseFrequency: Record<string, number> = {}

  detectionEvents.forEach(d => {
    diseaseFrequency[d.disease] = (diseaseFrequency[d.disease] || 0) + 1
  })

  return NextResponse.json({
    totalDetections,
    highSeverity,
    moderateSeverity,
    totalSprays,
    diseaseFrequency
  })
}