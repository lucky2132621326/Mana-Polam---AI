import { NextResponse } from "next/server"
import { pendingCommands, activityLog } from "../zones/data"

export async function POST(req: Request) {
  const { zoneId } = await req.json()
  
  if (!zoneId) {
    return NextResponse.json({ message: "Zone ID is required" }, { status: 400 })
  }

  // Queue command for hardware
  if (!pendingCommands[zoneId]) {
    pendingCommands[zoneId] = []
  }
  pendingCommands[zoneId].push("water")

  // Log the activity
  activityLog.unshift({
    type: "water",
    zoneId,
    timestamp: new Date().toISOString()
  })

  return NextResponse.json({ message: `Hydration command sent for zone ${zoneId}` })
}
