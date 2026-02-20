import { NextResponse } from "next/server"
import { zones, zoneHistory, simulationEnabledRef } from "../zones/data"

export async function POST(req: Request) {
  const body = await req.json()

  const { zoneId, soilMoisture, temperature, humidity } = body

  // Disable simulation when real sensor sends data
  simulationEnabledRef.value = false

  const zoneIndex = zones.findIndex(z => z.id === zoneId)

  if (zoneIndex === -1) {
    return NextResponse.json({ message: "Zone not found" }, { status: 404 })
  }

  // Calculate status
  let status: "healthy" | "warning" | "critical"

  if (soilMoisture < 25 || humidity > 90) {
    status = "critical"
  } else if (soilMoisture < 40 || humidity > 80) {
    status = "warning"
  } else {
    status = "healthy"
  }

  const healthScore = Math.max(
    40,
    Math.min(95, 100 - Math.abs(60 - soilMoisture))
  )

  zones[zoneIndex] = {
    ...zones[zoneIndex],
    soilMoisture,
    temperature,
    humidity,
    status,
    healthScore,
  }
  // 📊 Update history
const historyEntry = zoneHistory.find(h => h.zoneId === zoneId)

if (historyEntry) {

  historyEntry.moistureHistory = [72, 70, 68, 65, 60]

  historyEntry.moistureHistory.push(soilMoisture)
  historyEntry.temperatureHistory.push(temperature)

  if (historyEntry.moistureHistory.length > 20) {
    historyEntry.moistureHistory.shift()
  }

  if (historyEntry.temperatureHistory.length > 20) {
    historyEntry.temperatureHistory.shift()
  }
}


  return NextResponse.json({ message: "Zone updated successfully" })
}

