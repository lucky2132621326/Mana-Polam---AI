import { NextResponse } from "next/server"
import { zones, zoneHistory } from "../zones/data"

export async function POST(req: Request) {
  const body = await req.json()
  const { zoneId } = body

  const zoneIndex = zones.findIndex(z => z.id === zoneId)

  if (zoneIndex === -1) {
    return NextResponse.json({ message: "Zone not found" }, { status: 404 })
  }

  // Update spray time
  zones[zoneIndex] = {
    ...zones[zoneIndex],
    lastSprayed: new Date().toISOString(),
  }

  // ✅ Increment spray count
  const historyEntry = zoneHistory.find(h => h.zoneId === zoneId)
  if (historyEntry) {
    historyEntry.sprays += 1
  }

  return NextResponse.json({
    message: `Spray activated for zone ${zoneId}`
  })
}
