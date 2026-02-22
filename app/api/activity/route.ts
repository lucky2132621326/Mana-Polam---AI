import { NextResponse } from "next/server"
import { activityLog } from "../zones/data"

export async function GET() {
  return NextResponse.json(activityLog)
}