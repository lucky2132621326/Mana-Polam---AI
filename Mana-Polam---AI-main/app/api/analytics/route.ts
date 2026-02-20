import { NextResponse } from "next/server"
import { zones, zoneHistory } from "../zones/data"


export async function GET() {
  const totalZones = zones.length

  const criticalZones = zones.filter(z => z.status === "critical").length
  const warningZones = zones.filter(z => z.status === "warning").length
  const healthyZones = zones.filter(z => z.status === "healthy").length

  const averageHealth =
    zones.reduce((sum, z) => sum + z.healthScore, 0) / totalZones

  const totalSprays = zoneHistory.reduce(
    (sum, h) => sum + h.sprays,
    0
  )
  // 🔥 Find most critical zone
const mostCritical = zones.reduce((prev, current) =>
  current.healthScore < prev.healthScore ? current : prev
)

// 💧 Estimate water saved (assume 5L saved per smart spray)
const estimatedWaterSaved = totalSprays * 5


 return NextResponse.json({
  totalZones,
  criticalZones,
  warningZones,
  healthyZones,
  averageHealth: Math.round(averageHealth),
  totalSprays,
  mostCriticalZone: mostCritical.id,
  lowestHealthScore: mostCritical.healthScore,
  estimatedWaterSaved,
})
}