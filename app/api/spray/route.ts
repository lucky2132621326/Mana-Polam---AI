import { NextResponse } from "next/server"
import { zones, zoneHistory, activityLog } from "../zones/data"

export async function POST(req: Request) {
  const body = await req.json()
  const { zoneId } = body

  const zoneIndex = zones.findIndex(z => z.id === zoneId)

  if (zoneIndex === -1) {
    return NextResponse.json({ message: "Zone not found" }, { status: 404 })
  }

  // 🔥 Update zone to healthy
  zones[zoneIndex] = {
    ...zones[zoneIndex],
    status: "healthy",
    disease: undefined,
    healthScore: 90,
    lastSprayed: new Date().toISOString(),
  }

  // 🔥 Increment spray count
  const historyEntry = zoneHistory.find(h => h.zoneId === zoneId)
  if (historyEntry) {
    historyEntry.sprays += 1
  }

  // 🔥 Log activity
  activityLog.unshift({
    type: "spray",
    zoneId,
    timestamp: new Date().toISOString()
  })

  return NextResponse.json({
    message: `Spray activated for zone ${zoneId}`
  })
}