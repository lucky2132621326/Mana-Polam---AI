import { NextResponse } from "next/server"
import { zones, zoneHistory, activityLog } from "../zones/data"
import { readDB, writeDB } from "@/app/lib/database"

export async function GET() {
  const db = readDB()
  return NextResponse.json(db.sprays)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { zoneId, disease, chemical, dosage, detectionId } = body

  const zoneIndex = zones.findIndex(z => z.id === zoneId)
  if (zoneIndex === -1) {
    return NextResponse.json({ message: "Zone not found" }, { status: 404 })
  }

  // Update zone state
  zones[zoneIndex] = {
    ...zones[zoneIndex],
    status: "healthy",
    disease: undefined,
    healthScore: 90,
    lastSprayed: new Date().toISOString(),
  }

  const historyEntry = zoneHistory.find(h => h.zoneId === zoneId)
  if (historyEntry) {
    historyEntry.sprays += 1
  }

  activityLog.unshift({
    type: "spray",
    zoneId,
    timestamp: new Date().toISOString()
  })

  const db = readDB()

  // ✅ Create spray object FIRST
  const spray = {
    id: crypto.randomUUID(),
    zoneId,
    disease,
    chemical,
    dosage,
    timestamp: new Date().toISOString(),
    triggeredBy: "Manual Spray"
  }

  db.sprays.push(spray)

  // ✅ Link spray to detection (Lifecycle Update)
  if (detectionId) {
    const detection = db.detections.find((d: any) => d.id === detectionId)

    if (detection) {
      detection.status = "treated"
      detection.treatedAt = spray.timestamp
      detection.linkedSprayId = spray.id
    }
  }

  writeDB(db)

  return NextResponse.json({
    message: `Spray activated for zone ${zoneId}`
  })
}