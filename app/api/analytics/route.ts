import { NextResponse } from "next/server"
import { readDB } from "@/app/lib/database"

export async function GET() {
  const db = readDB()

  const detections = db.detections || []
  const sprays = db.sprays || []

  const totalDetections = detections.length
  const totalSprays = sprays.length

  /* ============================================================
     SEVERITY MODEL (6 / 3 / 1)
  ============================================================ */

  let high = 0
  let medium = 0
  let low = 0

  detections.forEach((d: any) => {
    if (d.severityLevel === "high") high++
    else if (d.severityLevel === "medium") medium++
    else if (d.severityLevel === "low") low++
  })

  const severityPenalty =
    high * 6 +
    medium * 3 +
    low * 1

  const maxPossiblePenalty =
    totalDetections * 6 || 1

  const weightedRiskPercent =
    (severityPenalty / maxPossiblePenalty) * 100

    const diseaseFrequency: Record<string, number> ={}

  /* ============================================================
     ZONE GROUPING
  ============================================================ */

  const zoneMap: Record<string, any> = {}

  detections.forEach((d: any) => {
    if (!zoneMap[d.zoneId]) {
      zoneMap[d.zoneId] = {
        detections: [],
        sprays: [],
      }
    }
    zoneMap[d.zoneId].detections.push(d)
  })

  detections.forEach((d: any) => {
  const diseaseName = d.diseaseName || d.disease || "Unknown"

  diseaseFrequency[diseaseName] =
    (diseaseFrequency[diseaseName] || 0) + 1
})

  sprays.forEach((s: any) => {
    if (!zoneMap[s.zoneId]) {
      zoneMap[s.zoneId] = {
        detections: [],
        sprays: [],
      }
    }
    zoneMap[s.zoneId].sprays.push(s)
  })

  /* ============================================================
     ZONE INTELLIGENCE MODEL
  ============================================================ */

  const zoneAnalytics: any[] = []

  Object.keys(zoneMap).forEach((zoneId) => {
    const zone = zoneMap[zoneId]
    const zoneDetections = zone.detections
    const zoneSprays = zone.sprays

    let zoneHigh = 0
    let zoneMedium = 0

    zoneDetections.forEach((d: any) => {
      if (d.severityLevel === "high") zoneHigh++
      if (d.severityLevel === "medium") zoneMedium++
    })

    /* ===== Required Spray Logic ===== */

    const requiredSprays =
      zoneHigh * 1 +
      zoneMedium * 0.7

    const actualSprays = zoneSprays.length

    const overSpray =
      Math.max(0, actualSprays - requiredSprays)

    /* ===== Volume Penalty (Logarithmic) ===== */

    const volumePenalty =
      Math.log(actualSprays + 1) * 30

    /* ============================================================
       TRUE RESPONSE DELAY (HOUR BASED)
    ============================================================ */

    let totalDelayPenalty = 0
    let pairedCount = 0

    zoneDetections.forEach((d: any) => {
      const detectionTime = new Date(d.timestamp).getTime()

      const validSprays = zoneSprays
        .filter((s: any) =>
          new Date(s.timestamp).getTime() >= detectionTime
        )
        .sort(
          (a: any, b: any) =>
            new Date(a.timestamp).getTime() -
            new Date(b.timestamp).getTime()
        )

      if (validSprays.length === 0) {
        totalDelayPenalty += 15
        return
      }

      const firstSprayTime =
        new Date(validSprays[0].timestamp).getTime()

      const delayHours =
        (firstSprayTime - detectionTime) /
        (1000 * 60 * 60)

      let penalty = 0

      if (delayHours <= 6) penalty = 0
      else if (delayHours <= 24) penalty = 4
      else if (delayHours <= 48) penalty = 8
      else if (delayHours <= 72) penalty = 12
      else penalty = 15

      totalDelayPenalty += penalty
      pairedCount++
    })

    const avgDelayPenalty =
      pairedCount === 0
        ? 0
        : totalDelayPenalty / pairedCount

    /* ===== Over-Spray Penalty ===== */

    const overPenalty =
      overSpray * 8

    /* ============================================================
       FINAL ZONE EFFICIENCY
    ============================================================ */

    let zoneEfficiency =
      100
      - volumePenalty
      - overPenalty
      - avgDelayPenalty

    zoneEfficiency =
      Math.max(40, zoneEfficiency)

    zoneAnalytics.push({
      zoneId,
      requiredSprays,
      actualSprays,
      overSpray,
      volumePenalty,
      overPenalty,
      avgDelayPenalty,
      zoneEfficiency,
    })
  })

  /* ============================================================
     GLOBAL SPRAY EFFICIENCY
  ============================================================ */

  const globalSprayEfficiency =
    zoneAnalytics.length === 0
      ? 100
      : zoneAnalytics.reduce(
          (sum, z) => sum + z.zoneEfficiency,
          0
        ) / zoneAnalytics.length

  /* ============================================================
     WATER MODELING
  ============================================================ */

  const manualWater =
    (high + medium + low) * 15

  const aiWater =
    totalSprays * 15

  const waterSaved =
    manualWater - aiWater

  const waterReductionPercent =
    manualWater === 0
      ? 0
      : (waterSaved / manualWater) * 100

  /* ============================================================
     RETURN OBJECT
  ============================================================ */

  return NextResponse.json({
  totalDetections,
  totalSprays,

  severityBreakdown: {
    high,
    medium,
    low,
    severityPenalty,
    weightedRiskPercent,
  },

  diseaseFrequency,   // 👈 ADD THIS

  zoneAnalytics,
  globalSprayEfficiency,

  waterModel: {
    manualWater,
    aiWater,
    waterSaved,
    waterReductionPercent,
  },
})
}
