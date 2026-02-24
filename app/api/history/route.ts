import { NextResponse } from "next/server"
import { readDB } from "@/app/lib/database"

export async function GET() {
  const db = readDB()

  const detections = db.detections || []
  const sprays = db.sprays || []

  const totalDetections = detections.length
  const active = detections.filter((d: any) => d.status === "active").length
  const treated = detections.filter((d: any) => d.status === "treated").length
  const resolved = detections.filter((d: any) => d.status === "resolved").length

  return NextResponse.json({
    detections,
    sprays,
    summary: {
      totalDetections,
      active,
      treated,
      resolved
    }
  })
}