import { NextResponse } from "next/server"
import { zones, zoneHistory, simulationEnabledRef, pendingCommands, activityLog } from "../zones/data"

export async function POST(req: Request) {
  const body = await req.json()

  const { zoneId, soilMoisture, temperature, humidity } = body

  // 🛰️ HARDWARE DIAGNOSTIC LOGGING
  console.log(`\x1b[36m[IOT -> SERVER]\x1b[0m 📶 Incoming data for ${zoneId}: Moisture ${soilMoisture}%, Temp ${temperature}°C`)

  // Disable simulation when real sensor sends data
  if (simulationEnabledRef.value !== false) {
    console.log(`\x1b[35m[SYSTEM]\x1b[0m 🟢 Live hardware detected! Disabling simulation mode automatically.`)
    simulationEnabledRef.value = false
  }

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
  historyEntry.moistureHistory.push(soilMoisture)
  historyEntry.temperatureHistory.push(temperature)

  if (historyEntry.moistureHistory.length > 20) {
    historyEntry.moistureHistory.shift()
  }

  if (historyEntry.temperatureHistory.length > 20) {
    historyEntry.temperatureHistory.shift()
  }
}


  const commandQueue = pendingCommands[zoneId] || []
  const command = commandQueue.length > 0 ? commandQueue.shift() : null

  if (command) {
    const now = new Date().toISOString()
    // ✅ SYNC WITH HARDWARE: Update the zone "lastSprayed" the moment it is DISPATCHED
    if (zones[zoneIndex]) {
      zones[zoneIndex].lastSprayed = now
    }

    console.log(`\x1b[33m[SERVER -> IOT]\x1b[0m 🚀 DISPATCHING COMMAND: ${command.toUpperCase()} to ${zoneId} at ${now}`)
    
    // Create activity log entry
    activityLog.unshift({
      type: command === "water" ? "water" : "spray",
      zoneId: zoneId,
      timestamp: now
    })
    
    if (activityLog.length > 50) activityLog.pop()
  }

  return NextResponse.json({ 
    message: "Zone updated successfully",
    command,
    targetZone: zoneId,
    remainingQueue: commandQueue.length
  })
}

