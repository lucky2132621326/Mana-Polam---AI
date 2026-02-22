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
import { Trans } from "@/components/language-provider"


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
  const [mlData, setMlData] = useState<{
    [zoneId: string]: {
      confidence: number
      suitability: number
      spreadScore: number
      trend: "up" | "down" | "stable"
      lastScan: Date
    }
  }>({})

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

  const calculateSuitability = (zone: ZoneData) => {
    let score = 0

    if (zone.humidity > 85) score += 0.5
    else if (zone.humidity > 70) score += 0.3

    if (zone.temperature >= 18 && zone.temperature <= 28) score += 0.3
    else if (zone.temperature > 28 && zone.temperature <= 32) score += 0.1

    return Math.min(score, 1)
  }

  const getNeighbors = (zone: ZoneData) => {
    return farmData.filter(z =>
      Math.abs(z.row - zone.row) <= 1 &&
      Math.abs(z.col - zone.col) <= 1 &&
      z.id !== zone.id
    )
  }

  const getConfidenceCap = (status: string) => {
    if (status === "healthy") return 0.45
    if (status === "warning") return 0.65
    return 0.85
  }

  useEffect(() => {
    fetchZones()
    const interval = setInterval(fetchZones, 20000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (farmData.length === 0) return

    const calculateML = () => {
      setMlData(prev => {
        const updated = { ...prev }

        const dynamicZones = ["A1", "A2", "A3", "A4"]

        dynamicZones.forEach(zoneId => {
          const zone = farmData.find(z => z.id === zoneId)
          if (!zone) return

          let confidence = 0

          if (
            zone.humidity > 80 &&
            zone.temperature >= 18 &&
            zone.temperature <= 28
          ) {
            confidence = 0.65 + Math.random() * 0.25
          } else if (zone.humidity > 65) {
            confidence = 0.35 + Math.random() * 0.25
          } else {
            confidence = 0.05 + Math.random() * 0.15
          }

          if (zone.status === "healthy") {
            confidence = Math.min(confidence, 0.45)
          } else if (zone.status === "warning") {
            confidence = Math.min(confidence + 0.1, 0.75)
          } else if (zone.status === "critical") {
            confidence = Math.max(confidence, 0.75)
          }

          confidence = Math.min(confidence, 1)




          updated[zone.id] = {
            confidence,
            suitability: calculateSuitability(zone),
            spreadScore: confidence, // use confidence as spread proxy for now
            trend: "stable",
            lastScan: new Date()
          }
        })

        return updated
      })
    }

    // Run immediately
    calculateML()

    // Then run every 20 seconds
    const interval = setInterval(calculateML, 20000)

    return () => clearInterval(interval)
  }, [farmData])

  const getAvgLabel = (avg: number) => {
    if (avg > 0.7) return { en: "High Alert", te: "హెచ్చరిక" }
    if (avg > 0.4) return { en: "Monitor", te: "మానిటర్" }
    return { en: "Stable", te: "స్థిరంగా" }
  }

  const teMap: Record<string, string> = {
    "Healthy Zone": "ఆరోగ్యవంతమైన జోన్",
    "Severe Water Stress": "తీవ్ర నీటి ఒత్తిడి",
    "Moderate Stress": "మధ్యస్థ ఒత్తిడి",
    "Environmental conditions are within optimal range.": "పర్యావరణ పరిస్థితులు ఆప్టిమల్ పరిధిలో ఉన్నాయి.",
    "No immediate action required.": "తక్షణ చర్య అవసరం లేదు.",
    "Targeted irrigation reduces up to 50% water wastage.": "లక్ష్యమైన నీరుల పంపిణీ నీటి వ్యర్థాన్ని 50% వరకు తగ్గిస్తుంది.",
    "No unnecessary spraying performed.": "అవసరం లేని స్ప్రేయింగ్ చేయబడలేదు.",
    "Immediate irrigation and nutrient spray required.": "తక్షణ ఇరిగేషన్ మరియు పోషక స్ప్రే అవసరం.",
    "Controlled irrigation recommended.": "నియంత్రిత ఇరిగేషన్ సిఫార్సు చేయబడుతుంది."
  }

  const t = (en: string) => teMap[en] ?? en

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
            <h1 className="text-3xl font-bold text-foreground">
              <Trans en={"Interactive Farm Map"} te={"ఇంటరాక్టివ్ ఫారం మ్యాప్"} />
            </h1>
            <p className="text-muted-foreground">
              <Trans en={"Click on zones to view detailed information and control spraying"} te={"వివరాలు మరియు స్ప్రేయింగ్ నియంత్రణ కోసం జోన్లపై క్లిక్ చేయండి"} />
            </p>
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
            <span className="text-sm text-muted-foreground ml-2">
              <Trans en={`Zoom: ${Math.round(zoomLevel * 100)}%`} te={`జూమ్: ${Math.round(zoomLevel * 100)}%`} />
            </span>
          </div>
        </div>

        {/* Legend */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-green-500 border border-green-600" />
                <span className="text-sm"><Trans en={"Healthy"} te={"ఆరోగ్యంగా"} /></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-yellow-500 border border-yellow-600" />
                <span className="text-sm"><Trans en={"Warning"} te={"హೆచ్చరిక"} /></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-red-500 border border-red-600" />
                <span className="text-sm"><Trans en={"Critical"} te={"కుటుంబ పరిస్థితి"} /></span>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <p className="text-sm text-muted-foreground"><Trans en={"Click on any zone for detailed information"} te={"వివరాలకు ఏదైనా జోన్‌పై క్లిక్ చేయండి"} /></p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Farm Map */}
          <div className="lg:col-span-2 space-y-6">

            {/* ================= FARM LAYOUT ================= */}
            <Card>
              <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <Trans en={"Farm Layout"} te={"ఫార్మ్ అమరిక"} />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-green-600">
                    <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                    <Trans en={"Live"} te={"లో"} />
                  </div>
                </CardTitle>
                <CardDescription>
                  <Trans en={"24 zones across 4 rows and 6 columns"} te={"4 వరుసలు, 6 కాలములలో 24 జోన్లు"} />
                </CardDescription>
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
  $mlData[zone.id]?.confidence > 0.7
  ? "ring-4 ring-red-400/50"
                          : ""
                        }
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

                      {/* ML Brain Indicator */}
                      {mlData[zone.id] && mlData[zone.id].confidence > 0.7 && (
                        <div className="absolute bottom-1 left-1">
                          <div className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-md animate-pulse" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* ================= FARM ML INTELLIGENCE ================= */}
            <Card className="shadow-md border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    <Trans en={"Farm Intelligence Overview"} te={"ఫార్మ్ ఇంటెలిజెన్స్ అవలోకనం"} />
                  </CardTitle>
                  <CardDescription>
                    <Trans en={"AI-driven ecosystem and outbreak analysis"} te={"AI ఆధారిత పరిసర వ్యవస్థ మరియు వ్యాప్తి విశ్లేషణ"} />
                  </CardDescription>
                </div>

                  {Object.keys(mlData).length > 0 && (() => {
                  const avg =
                    Object.values(mlData).reduce((a, b) => a + b.confidence, 0) /
                    Object.values(mlData).length

                  const labelObj = getAvgLabel(avg)

                  const style =
                    avg > 0.7
                      ? "bg-red-100 text-red-700"
                      : avg > 0.4
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"

                  return (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${style}`}>
                      <Trans en={labelObj.en} te={labelObj.te} />
                    </span>
                  )
                })()}
              </CardHeader>

              <CardContent>
                {farmData.length > 0 && Object.keys(mlData).length > 0 && (
                  <div className="space-y-8">

                    {/* Farm-wide Infection Probability */}
                    {(() => {
                      const confidences = Object.values(mlData).map(m => m.confidence)
                      const avg = confidences.reduce((a, b) => a + b, 0) / confidences.length

                      const labelObjLocal = getAvgLabel(avg)
                      let color = "text-green-600"

                      if (avg > 0.7) {
                        color = "text-red-600"
                      } else if (avg > 0.4) {
                        color = "text-yellow-600"
                      }

                      return (
                        <div className={`mt-3 text-sm font-medium ${color}`}>
                          <Trans en={"Overall Status:"} te={"మొత్తం స్థితి:"} /> <Trans en={labelObjLocal.en} te={labelObjLocal.te} />
                        </div>
                      )
                    })()}
                    {(() => {
                      const confidences = Object.values(mlData).map(m => m.confidence)
                      const avg =
                        confidences.reduce((a, b) => a + b, 0) / confidences.length

                      return (
                        <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-50 via-white to-green-50 border shadow-sm">                          <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            <Trans en={"Farm-wide Infection Probability"} te={"ఫార్మ్-వైడ్ సంక్రమణ సంభావ్యత"} />
                          </span>
                          <span className="text-3xl font-bold tracking-tight">
                            {(avg * 100).toFixed(1)}%
                          </span>
                        </div>

                          <div className="mt-3 h-3 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-700 ${avg > 0.7
                                ? "bg-red-500"
                                : avg > 0.4
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                                }`}
                              style={{ width: `${avg * 100}%` }}
                            />
                          </div>
                        </div>
                      )
                    })()}

                    {/* Highest Spread Risk Zones */}
                    <div>
                      <h4 className="text-sm font-semibold mb-3">
                        <Trans en={"Highest Spread Risk Zones"} te={"అత్యధిక వ్యాప్తి ప్రమాద జోన్లు"} />
                      </h4>

                      <div className="grid md:grid-cols-3 gap-4">
                        {Object.keys(mlData)
                          .sort((a, b) => mlData[b].confidence - mlData[a].confidence)
                          .slice(0, 3)
                          .map((zoneId) => {
                            const score = mlData[zoneId]?.confidence ?? 0
                            const percent = (score * 100).toFixed(0)

                            const label =
                              score > 0.7
                                ? "High Risk"
                                : score > 0.4
                                  ? "Moderate Risk"
                                  : "Low Risk"

                            const style =
                              score > 0.7
                                ? "text-red-600"
                                : score > 0.4
                                  ? "text-yellow-600"
                                  : "text-green-600"

                            return (
                              <div
                                key={zoneId}
                                className="p-4 rounded-lg border bg-white shadow-sm"
                              >
                                <div className="text-xs uppercase text-muted-foreground">
                                  <Trans en={"Zone"} te={"జోన్"} />
                                </div>

                                <div className="text-lg font-semibold">
                                  {zoneId}
                                </div>

                                <div className="text-sm text-muted-foreground">
                                  <Trans en={"Risk Score:"} te={"రిస్క్ స్కోర్:"} /> {percent}%
                                </div>

                                <div className={`mt-2 text-xs font-semibold ${style}`}>
                                  {label === "High Risk" ? <Trans en={"High Risk"} te={"అత్యధిక ప్రమాదం"} /> : label === "Moderate Risk" ? <Trans en={"Moderate Risk"} te={"మధ్యస్థ ప్రమాదం"} /> : <Trans en={"Low Risk"} te={"తక్కువ ప్రమాదం"} />}
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    </div>

                  </div>
                )}
              </CardContent>
            </Card>

          </div>

          {/* Zone Details */}
          <div>
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-green-600" />
                  <Trans en={"Zone Details"} te={"జోన్ వివరాలు"} />
                </CardTitle>
                <CardDescription>
                  {selectedZone ? (
                    <Trans en={`Information for ${selectedZone.id}`} te={`${selectedZone.id} కోసం సమాచారం`} />
                  ) : (
                    <Trans en={"Select a zone to view details"} te={"వివరాలు చూడటానికి ఒక జోన్‌ని ఎంచుకోండి"} />
                  )}
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
                        {selectedZone.status === "healthy" ? <Trans en={"Healthy"} te={"ఆరోగ్యంగా"} /> : selectedZone.status === "warning" ? <Trans en={"Warning"} te={"హెచ్చరిక"} /> : <Trans en={"Critical"} te={"కుటుంబ పరిస్థితి"} />}
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
                      <h4 className="text-sm font-medium"><Trans en={"Environmental Data"} te={"పరిసర డేటా"} /></h4>

                      <div className="flex items-center gap-3">
                        <Droplets className="h-4 w-4 text-blue-600" />
                        <div className="flex-1">
                          <p className="text-sm"><Trans en={"Soil Moisture"} te={"మట్టి తేమ"} /></p>
                          <p className="text-lg font-bold">{selectedZone.soilMoisture}%</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Thermometer className="h-4 w-4 text-orange-600" />
                        <div className="flex-1">
                          <p className="text-sm"><Trans en={"Temperature"} te={"ఉష్ణోగ్రత"} /></p>
                          <p className="text-lg font-bold">{selectedZone.temperature}°C</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Wind className="h-4 w-4 text-green-600" />
                        <div className="flex-1">
                          <p className="text-sm"><Trans en={"Humidity"} te={"ఆर्द్రత"} /></p>
                          <p className="text-lg font-bold">{selectedZone.humidity}%</p>
                        </div>
                      </div>
                    </div>
                    {mlData[selectedZone.id] && (
                      <>
                        <Separator />
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium"><Trans en={"ML Disease Detection"} te={"ML రోగ గుర్తింపు"} /></h4>

                          <div className="text-sm">
                            <strong><Trans en={"Confidence:"} te={"నమ్మకత్వం:"} /></strong>{" "}
                            {(mlData[selectedZone.id].confidence * 100).toFixed(2)}%
                          </div>

                          {(() => {
                            const confidence = mlData[selectedZone.id].confidence
                            const humidity = selectedZone.humidity
                            const status = selectedZone.status

                            let spreadRisk = "Low"

                            if (status === "critical" && confidence > 0.7) {
                              spreadRisk = "High"
                            } else if (
                              (confidence > 0.6 && humidity > 70) ||
                              status === "warning"
                            ) {
                              spreadRisk = "Moderate"
                            }

                            const riskColor =
                              spreadRisk === "High"
                                ? "text-red-600 font-semibold"
                                : spreadRisk === "Moderate"
                                  ? "text-yellow-600 font-semibold"
                                  : "text-green-600 font-semibold"

                            return (
                              <div className="text-sm">
                                <strong><Trans en={"Spread Risk:"} te={"విస్తరణ ప్రమాదం:"} /></strong>{" "}
                                <span className={riskColor}>{spreadRisk === "High" ? <Trans en={"High"} te={"అత్యధిక"} /> : spreadRisk === "Moderate" ? <Trans en={"Moderate"} te={"మధ్యస్థ"} /> : <Trans en={"Low"} te={"తక్కువ"} />}</span>
                              </div>
                            )
                          })()}

                          <div className="text-xs text-muted-foreground">
                            <Trans en={"Last Scan:"} te={"చివరి స్కాన్:"} /> {mlData[selectedZone.id].lastScan.toLocaleTimeString()}
                          </div>
                        </div>
                      </>
                    )}

                    <Separator />
                    {/* AI Recommendation */}
                    {aiRecommendation && (
                      <div className="mt-4 p-4 rounded-lg border bg-muted/40 space-y-3">

                        {/* Header + Severity Badge */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold"><Trans en={"AI Risk Analysis"} te={"AI రిస్క్ విశ్లేషణ"} /></span>

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
                            {aiRecommendation.severity === "high" ? <Trans en={"High"} te={"అత్యధిక"} /> : aiRecommendation.severity === "medium" ? <Trans en={"Medium"} te={"మధ్యస్థ"} /> : <Trans en={"Low"} te={"తక్కువ"} />}
                          </Badge>
                        </div>

                        <div className="text-sm">
                          <strong><Trans en={"Risk:"} te={"రిస్క్:"} /></strong> <Trans en={aiRecommendation.riskType} te={t(aiRecommendation.riskType)} />
                        </div>

                        <div className="text-sm">
                          <strong><Trans en={"Reason:"} te={"కారణం:"} /></strong> <Trans en={aiRecommendation.reason} te={t(aiRecommendation.reason)} />
                        </div>

                        <div className="text-sm">
                          <strong><Trans en={"Action:"} te={"చర్య:"} /></strong> <Trans en={aiRecommendation.action} te={t(aiRecommendation.action)} />
                        </div>

                        <div className="text-sm">
                          💧 <Trans en={"Water Required:"} te={"నీరు అవసరం:"} /> {aiRecommendation.estimatedWaterLitres} L
                        </div>

                        <div className="text-sm">
                          🌿 <Trans en={"Nutrients Required:"} te={"పోషక పదార్థాల అవసరం:"} /> {aiRecommendation.estimatedNutrientMl} ml
                        </div>

                        <div className="text-xs text-muted-foreground">
                          <Trans en={aiRecommendation.savingsNote} te={t(aiRecommendation.savingsNote)} />
                        </div>

                      </div>
                    )}



                    {/* Additional Info */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground"><Trans en={"Plant Count:"} te={"ప్లాంట్‌ల సంఖ్య:"} /></span>
                        <span className="font-medium">{selectedZone.plantCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground"><Trans en={"Last Sprayed:"} te={"చివరిస్ప్రే:"} /></span>
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

                          await fetchZones()
                          setSelectedZone(null)

                          setTimeout(() => {
                            setIsSpraying(false)
                          }, 2000)
                        }}
                      >
                        <Sprout className="mr-2 h-4 w-4" />
                        {isSpraying ? <Trans en={"Spraying..."} te={"స్ప్రే చేస్తున్నాం..."} /> : <Trans en={"Spray This Zone"} te={"ఈ జోన్‌ను స్ప్రే చేయండి"} />}
                      </Button>



                      <Button variant="outline" className="w-full bg-transparent" size="sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        <Trans en={"Schedule Spraying"} te={"స్ప్రేయింగ్ షెడ్యూల్"} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      <Trans en={"Click on any zone in the map to view its detailed information and control options."} te={"మ్యాప్‌లోని ఏదైనా జోన్‌పై క్లిక్ చేసి దాని వివరాలు మరియు నియంత్రణ ఎంపికలు చూడండి."} />
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
