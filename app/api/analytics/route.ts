import { NextResponse } from "next/server"
import { readDB } from "@/app/lib/database"

export async function GET() {

  const db = readDB()

  const detectionEvents = db.detections || []
  const sprayEvents = db.sprays || []

  const totalDetections = detectionEvents.length
  const totalSprays = sprayEvents.length

  // =========================
  // SEVERITY BREAKDOWN
  // =========================

  const high = detectionEvents.filter(
    (d: any) => d.severityLevel === "high"
  ).length

  const medium = detectionEvents.filter(
    (d: any) => d.severityLevel === "medium"
  ).length

  const low = detectionEvents.filter(
    (d: any) => d.severityLevel === "low"
  ).length

  // =========================
  // DISEASE FREQUENCY
  // =========================

  const diseaseFrequency: Record<string, number> = {}

  detectionEvents.forEach((d: any) => {
    diseaseFrequency[d.disease] =
      (diseaseFrequency[d.disease] || 0) + 1
  })

  // =========================
  // AVG CONFIDENCE
  // =========================

  const avgConfidence =
    totalDetections === 0
      ? 0
      : detectionEvents.reduce(
          (sum: number, d: any) => sum + (d.confidence || 0),
          0
        ) / totalDetections

  // =========================
  // SPREAD INDEX
  // =========================

  const spreadIndex =
    totalDetections === 0 ? 0 : high / totalDetections

  // =========================
  // DETECTION TIMELINE
  // =========================

  const detectionTimeline: Record<string, number> = {}

  detectionEvents.forEach((d: any) => {
    const date = d.timestamp?.split("T")[0]
    if (!date) return
    detectionTimeline[date] =
      (detectionTimeline[date] || 0) + 1
  })

  // =========================
  // SPRAY TIMELINE
  // =========================

  const sprayTimeline: Record<string, number> = {}

  sprayEvents.forEach((s: any) => {
    const date = s.timestamp?.split("T")[0]
    if (!date) return
    sprayTimeline[date] =
      (sprayTimeline[date] || 0) + 1
  })

  // =========================
  // ZONE BREAKDOWN
  // =========================

  const zoneBreakdown: Record<
    string,
    { detections: number; sprays: number }
  > = {}

  detectionEvents.forEach((d: any) => {
    if (!zoneBreakdown[d.zoneId]) {
      zoneBreakdown[d.zoneId] = {
        detections: 0,
        sprays: 0,
      }
    }
    zoneBreakdown[d.zoneId].detections++
  })

  sprayEvents.forEach((s: any) => {
    if (!zoneBreakdown[s.zoneId]) {
      zoneBreakdown[s.zoneId] = {
        detections: 0,
        sprays: 0,
      }
    }
    zoneBreakdown[s.zoneId].sprays++
  })

  // =========================
  // AI METRICS
  // =========================

  const autoSprayRatio =
    totalDetections === 0 ? 0 : totalSprays / totalDetections

  return NextResponse.json({
    totalDetections,
    totalSprays,

    severityBreakdown: {
      high,
      medium,
      low,
    },

    diseaseFrequency,

    avgConfidence,
    spreadIndex,

    detectionTimeline,
    sprayTimeline,
    zoneBreakdown,

    aiMetrics: {
      highSeverityRatio: spreadIndex,
      autoSprayRatio,
      avgConfidence,
    },
  })
}