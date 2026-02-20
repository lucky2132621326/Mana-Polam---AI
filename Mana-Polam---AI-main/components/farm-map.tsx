"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Droplets,
  Thermometer,
  Wind,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Sprout,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react"
import { generateRecommendation } from "@/lib/ai-engine"


interface ZoneData {
  id: string
  row: number
  col: number
  status: "healthy" | "warning" | "critical"
  disease?: string
  lastSprayed: string
  soilMoisture: number
  temperature: number
  humidity: number
  plantCount: number
  healthScore: number
}

export default function FarmMap() {
  const [selectedZone, setSelectedZone] = useState<ZoneData | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)

  const [farmData, setFarmData] = useState<ZoneData[]>([])
  const [isSpraying, setIsSpraying] = useState(false)
  const aiRecommendation = selectedZone
  ? generateRecommendation(selectedZone)
  : null


const fetchZones = async () => {
  try {
    const res = await fetch("/api/zones")
    const data = await res.json()

    setFarmData(data)

    if (selectedZone) {
      const updatedZone = data.find((z: ZoneData) => z.id === selectedZone.id)

      if (updatedZone) {
        setSelectedZone(updatedZone)
      }
    }
  } catch (err) {
    console.error("Failed to fetch zones:", err)
  }
}


useEffect(() => {
  fetchZones()
  const interval = setInterval(fetchZones, 5000)
  return () => clearInterval(interval)
}, [])





  const getZoneColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500 hover:bg-green-600 border-green-600"
      case "warning":
        return "bg-yellow-500 hover:bg-yellow-600 border-yellow-600"
      case "critical":
        return "bg-red-500 hover:bg-red-600 border-red-600"
      default:
        return "bg-gray-400 hover:bg-gray-500 border-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const handleZoomIn = () => setZoomLevel(Math.min(zoomLevel + 0.2, 2))
  const handleZoomOut = () => setZoomLevel(Math.max(zoomLevel - 0.2, 0.6))
  const handleReset = () => {
    setZoomLevel(1)
    setSelectedZone(null)
  }
  const formatDate = (dateString: string) => {
  const date = new Date(dateString)

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}


  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Interactive Farm Map</h1>
            <p className="text-muted-foreground">Click on zones to view detailed information and control spraying</p>
          </div>

          {/* Map Controls */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut} className="bg-transparent">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomIn} className="bg-transparent">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset} className="bg-transparent">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground ml-2">Zoom: {Math.round(zoomLevel * 100)}%</span>
          </div>
        </div>

        {/* Legend */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-green-500 border border-green-600" />
                <span className="text-sm">Healthy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-yellow-500 border border-yellow-600" />
                <span className="text-sm">Warning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-red-500 border border-red-600" />
                <span className="text-sm">Critical</span>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <p className="text-sm text-muted-foreground">Click on any zone for detailed information</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Farm Map */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Farm Layout
                </CardTitle>
                <CardDescription>24 zones across 4 rows and 6 columns</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="grid grid-cols-6 gap-2 p-4 bg-muted/30 rounded-lg overflow-auto"
                  style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top left" }}
                >
                  {farmData.map((zone) => (
                    <div
                      key={zone.id}
                      className={`
                        relative aspect-square rounded-lg border-2 cursor-pointer transition-all duration-200
                        ${getZoneColor(zone.status)}
                        ${selectedZone?.id === zone.id ? "ring-2 ring-primary ring-offset-2" : ""}
                      `}
                      onClick={() => setSelectedZone(zone)}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                        <span className="text-xs font-bold text-white">{zone.id}</span>
                        <span className="text-xs text-white/80">{zone.plantCount}</span>
                      </div>
                      {zone.status !== "healthy" && (
                        <div className="absolute -top-1 -right-1 bg-white rounded-full p-1">
                          {getStatusIcon(zone.status)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Zone Details */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-green-600" />
                  Zone Details
                </CardTitle>
                <CardDescription>
                  {selectedZone ? `Information for ${selectedZone.id}` : "Select a zone to view details"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedZone ? (
                  <div className="space-y-4">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          selectedZone.status === "healthy"
                            ? "default"
                            : selectedZone.status === "warning"
                              ? "secondary"
                              : "destructive"
                        }
                        className="capitalize"
                      >
                        {selectedZone.status}
                      </Badge>
                      <span className="text-sm font-medium">Score: {selectedZone.healthScore}%</span>
                    </div>

                    {/* Disease Info */}
                    {selectedZone.disease && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm font-medium text-destructive">Issue Detected:</p>
                        <p className="text-sm">{selectedZone.disease}</p>
                      </div>
                    )}

                    <Separator />

                    {/* Sensor Data */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Environmental Data</h4>

                      <div className="flex items-center gap-3">
                        <Droplets className="h-4 w-4 text-blue-600" />
                        <div className="flex-1">
                          <p className="text-sm">Soil Moisture</p>
                          <p className="text-lg font-bold">{selectedZone.soilMoisture}%</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Thermometer className="h-4 w-4 text-orange-600" />
                        <div className="flex-1">
                          <p className="text-sm">Temperature</p>
                          <p className="text-lg font-bold">{selectedZone.temperature}°C</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Wind className="h-4 w-4 text-green-600" />
                        <div className="flex-1">
                          <p className="text-sm">Humidity</p>
                          <p className="text-lg font-bold">{selectedZone.humidity}%</p>
                        </div>
                      </div>
                    </div>

                    <Separator />
                    {/* AI Recommendation */}
{aiRecommendation && (
  <div className="mt-4 p-4 rounded-lg border bg-muted/40 space-y-3">

    {/* Header + Severity Badge */}
    <div className="flex items-center justify-between">
      <span className="text-sm font-semibold">AI Risk Analysis</span>

      <Badge
        variant={
          aiRecommendation.severity === "high"
            ? "destructive"
            : aiRecommendation.severity === "medium"
            ? "secondary"
            : "default"
        }
        className="capitalize"
      >
        {aiRecommendation.severity}
      </Badge>
    </div>

    <div className="text-sm">
      <strong>Risk:</strong> {aiRecommendation.riskType}
    </div>

    <div className="text-sm">
      <strong>Reason:</strong> {aiRecommendation.reason}
    </div>

    <div className="text-sm">
      <strong>Action:</strong> {aiRecommendation.action}
    </div>

    <div className="text-sm">
      💧 Water Required: {aiRecommendation.estimatedWaterLitres} L
    </div>

    <div className="text-sm">
      🌿 Nutrients Required: {aiRecommendation.estimatedNutrientMl} ml
    </div>

    <div className="text-xs text-muted-foreground">
      {aiRecommendation.savingsNote}
    </div>

  </div>
)}



                  {/* Additional Info */}
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground">Plant Count:</span>
    <span className="font-medium">{selectedZone.plantCount}</span>
  </div>
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground">Last Sprayed:</span>
    <span className="font-medium">
      {formatDate(selectedZone.lastSprayed)}
    </span>
  </div>
</div>


                    <Separator />

                    {/* Actions */}
                    <div className="space-y-2">
                      <Button
  className="w-full"
  size="sm"
  disabled={isSpraying}
  onClick={async () => {
    if (!selectedZone) return

    setIsSpraying(true)

    await fetch("/api/spray", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ zoneId: selectedZone.id })
    })

    await fetchZones() // immediate refresh

    setTimeout(() => {
      setIsSpraying(false)
    }, 2000)
  }}
>
  <Sprout className="mr-2 h-4 w-4" />
  {isSpraying ? "Spraying..." : "Spray This Zone"}
</Button>



                      <Button variant="outline" className="w-full bg-transparent" size="sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Spraying
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Click on any zone in the map to view its detailed information and control options.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
