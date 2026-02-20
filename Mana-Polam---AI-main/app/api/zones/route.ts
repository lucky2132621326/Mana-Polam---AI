import { NextResponse } from "next/server"
import { zones, updateLiveZones, simulationEnabledRef } from "./data"

export async function GET() {
  if (simulationEnabledRef.value) {
    updateLiveZones()
  }

  return NextResponse.json(zones)
}
