import { NextResponse } from "next/server"
import { zones, zoneHistory, activityLog } from "../zones/data"
import { readDB, writeDB } from "@/app/lib/database"

export async function GET() {
  const db = readDB()
  return NextResponse.json(db.sprays)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { zoneId } = body

  const zoneIndex = zones.findIndex(z => z.id === zoneId)
  if (zoneIndex === -1) {
    return NextResponse.json({ message: "Zone not found" }, { status: 404 })
  }

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

  db.sprays.push({
    id: crypto.randomUUID(),
    zoneId,
    timestamp: new Date().toISOString(),
    triggeredBy: "Manual Spray"
  })

  writeDB(db)

  return NextResponse.json({
    message: `Spray activated for zone ${zoneId}`
  })
}