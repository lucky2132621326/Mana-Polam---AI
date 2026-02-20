import { NextResponse } from "next/server"
import { zoneHistory } from "../zones/data"

export async function GET() {
  return NextResponse.json(zoneHistory)
}
