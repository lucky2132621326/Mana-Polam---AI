"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"

import {
  Droplets,
  Thermometer,
  Wind,
  Sprout,
  AlertTriangle,
  CheckCircle,
  Activity,
  MapPin,
  Calendar,
  TrendingUp,
  Brain,
  Users,
} from "lucide-react"
import { Trans } from "@/components/language-provider"

export default function Dashboard() {
  const [zones, setZones] = useState<any[]>([])
  const [mlResult, setMlResult] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState("")
  const [isSpraying, setIsSpraying] = useState<string | null>(null)

  const fetchZones = async () => {
    try {
      const res = await fetch("/api/zones")
      const data = await res.json()
      setZones(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchZones()

    const stored = localStorage.getItem("mlResult")
    if (stored) setMlResult(JSON.parse(stored))

    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "medium",
        })
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const totalZones = zones.length
  const healthyZones = zones.filter(z => z.status === "healthy").length
  const warningZones = zones.filter(z => z.status === "warning").length
  const infectedZones = zones.filter(z => z.status === "critical").length

  const farmHealthScore =
    zones.length > 0
      ? Math.round(
          zones.reduce((sum, z) => sum + z.healthScore, 0) / zones.length
        )
      : 0

  const avgMoisture =
    zones.length > 0
      ? Math.round(
          zones.reduce((sum, z) => sum + z.soilMoisture, 0) / zones.length
        )
      : 0

  const temperature = zones[0]?.temperature ?? 0
  const humidity = zones[0]?.humidity ?? 0

  const criticalZones = zones.filter(z => z.status === "critical")

  const recentActivity = zones
    .filter(z => z.lastSprayed)
    .sort((a, b) => new Date(b.lastSprayed).getTime() - new Date(a.lastSprayed).getTime())
    .slice(0, 5)

  const handleSpray = async (zoneId: string) => {
    setIsSpraying(zoneId)

    await fetch("/api/spray", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ zoneId })
    })

    await fetchZones()
    setIsSpraying(null)
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              <Trans en={"Farm Dashboard"} te={"ఫారం డాష్‌బోర్డు"} />
            </h1>
            <p className="text-muted-foreground">
              <Trans
                en={"Monitor crop health and manage pesticide spraying"}
                te={"ఫసలుల ఆరోగ్యాన్ని పర్యవేక్షించండి మరియు పురుగు మందు స్ప్రేయింగ్ నిర్వహించండి"}
              />
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="font-medium text-primary">
              <Trans en={`Live • ${currentTime}`} te={`నేరుగా • ${currentTime}`} />
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                <Trans en={"Farm Health Score"} te={"ఫార్మ్ ఆరోగ్య స్కోరు"} />
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{farmHealthScore}%</div>
              <div className="flex items-center gap-2 mt-2">
                <Progress value={farmHealthScore} className="flex-1" />
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                <Trans en={"Healthy Zones"} te={"ఆరోగ్యవంతమైన ప్రాంతాలు"} />
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{healthyZones}</div>
              <p className="text-xs text-muted-foreground">out of {totalZones} zones</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                <Trans en={"Warning Zones"} te={"జాగ్రత్త ప్రాంతాలు"} />
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{warningZones}</div>
              <p className="text-xs text-muted-foreground">require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                <Trans en={"Infected Zones"} te={"బాధిత ప్రాంతాలు"} />
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{infectedZones}</div>
              <p className="text-xs text-muted-foreground">need immediate action</p>
            </CardContent>
          </Card>
        </div>

        {/* Sensor Data */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Trans en={"Real-time Sensor Data"} te={"నేరుగా సెన్సార్ డేటా"} />
            </CardTitle>
            <CardDescription>
              <Trans
                en={"Current environmental conditions across the farm"}
                te={"ఫార్మ్ మొత్తం ప్రస్తుత పర్యావరణ పరిస్థితులు"}
              />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <Droplets className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">
                    <Trans en={"Soil Moisture"} te={"మట్టి తేమ"} />
                  </p>
                  <p className="text-2xl font-bold">{avgMoisture}%</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <Thermometer className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">
                    <Trans en={"Temperature"} te={"ఉష్ణోగ్రత"} />
                  </p>
                  <p className="text-2xl font-bold">{temperature}°C</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <Wind className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium">
                    <Trans en={"Humidity"} te={"ఆర్ద్రత"} />
                  </p>
                  <p className="text-2xl font-bold">{humidity}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Critical + Activity */}
        <div className="grid gap-6 lg:grid-cols-2">

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <Trans en={"Zones Requiring Attention"} te={"శ్రద్ధ అవసరమైన ప్రాంతాలు"} />
              </CardTitle>
              <CardDescription>
                <Trans
                  en={"Areas with detected issues that need spraying"}
                  te={"సమస్యలు గుర్తించిన ప్రాంతాలు — స్ప్రేయింగ్ అవసరం"}
                />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {criticalZones.map(zone => (
                <div key={zone.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{zone.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {zone.disease ?? <Trans en={"Health Degrading"} te={"ఆరోగ్యం దిగజారుతోంది"} />}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">
                      <Trans en={"High"} te={"ఎత్తు"} />
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isSpraying === zone.id}
                      onClick={() => handleSpray(zone.id)}
                    >
                      {isSpraying === zone.id ? (
                        <Trans en={"Spraying..."} te={"స్ప్రేయింగ్..."} />
                      ) : (
                        <Trans en={"Spray Now"} te={"ఇప్పుడు స్ప్రే చేయండి"} />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="h-5 w-5 text-green-600" />
                <Trans en={"Recent Activity"} te={"ఇటీవల చర్యలు"} />
              </CardTitle>
              <CardDescription>
                <Trans en={"Latest actions and alerts from your farm"} te={"మీ ఫారం నుండి తాజా చర్యలు మరియు అలర్ట్‌లు"} />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map(zone => (
                <div key={zone.id} className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      <Trans en={"Spraying completed"} te={"స్ప్రేయింగ్ పూర్తి జరిగింది"} />
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {zone.id} • {new Date(zone.lastSprayed).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <Separator />
              <Button variant="outline" className="w-full bg-transparent">
                <Trans en={"View All Activity"} te={"అన్ని చర్యలను చూడండి"} />
              </Button>
            </CardContent>
          </Card>

        </div>

        {/* Quick Actions (RESTORED EXACTLY) */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Trans en={"Quick Actions"} te={"త్వరిత చర్యలు"} />
            </CardTitle>
            <CardDescription>
              <Trans en={"Common tasks and controls"} te={"సాధారణ పనులు మరియు నియంత్రణలు"} />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-6">
              <Button className="h-12" asChild>
                <a href="/controls">
                  <Sprout className="mr-2 h-4 w-4" />
                  <Trans en={"Start Auto Spray"} te={"ఆటో స్ప్రే ప్రారంభించండి"} />
                </a>
              </Button>
              <Button variant="outline" className="h-12 bg-transparent" asChild>
                <a href="/map">
                  <MapPin className="mr-2 h-4 w-4" />
                  <Trans en={"View Farm Map"} te={"ఫార్మ్ మ్యాప్ చూడండి"} />
                </a>
              </Button>
              <Button variant="outline" className="h-12 bg-transparent" asChild>
                <a href="/analytics">
                  <Activity className="mr-2 h-4 w-4" />
                  <Trans en={"Analytics"} te={"విశ్లేషణలు"} />
                </a>
              </Button>
              <Button variant="outline" className="h-12 bg-transparent" asChild>
                <a href="/detection">
                  <Brain className="mr-2 h-4 w-4" />
                  <Trans en={"Disease Detection"} te={"రోగ నిర్ధారణ"} />
                </a>
              </Button>
              <Button variant="outline" className="h-12 bg-transparent" asChild>
                <a href="/recommendations">
                  <Brain className="mr-2 h-4 w-4" />
                  <Trans en={"AI Recommendations"} te={"AI సూచనలు"} />
                </a>
              </Button>
              <Button variant="outline" className="h-12 bg-transparent" asChild>
                <a href="/users">
                  <Users className="mr-2 h-4 w-4" />
                  <Trans en={"User Management"} te={"వినియోగదారుల నిర్వహణ"} />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}