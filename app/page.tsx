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

export default function Dashboard() {

  const [zones, setZones] = useState<any[]>([])
  const [mlResult, setMlResult] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState("")
  const [isSpraying, setIsSpraying] = useState<string | null>(null)

  const fetchZones = async () => {
    const res = await fetch("/api/zones")
    const data = await res.json()
    setZones(data)
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
            <h1 className="text-3xl font-bold text-foreground">Farm Dashboard</h1>
            <p className="text-muted-foreground">Monitor crop health and manage pesticide spraying</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="font-medium text-primary">
              Live • {currentTime}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Farm Health Score</CardTitle>
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
              <CardTitle className="text-sm font-medium">Healthy Zones</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{healthyZones}</div>
              <p className="text-xs text-muted-foreground">out of {totalZones} zones</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Warning Zones</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{warningZones}</div>
              <p className="text-xs text-muted-foreground">require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Infected Zones</CardTitle>
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
            <CardTitle>Real-time Sensor Data</CardTitle>
            <CardDescription>Current environmental conditions across the farm</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <Droplets className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Soil Moisture</p>
                  <p className="text-2xl font-bold">{avgMoisture}%</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <Thermometer className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Temperature</p>
                  <p className="text-2xl font-bold">{temperature}°C</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <Wind className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Humidity</p>
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
                Zones Requiring Attention
              </CardTitle>
              <CardDescription>Areas with detected issues that need spraying</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {criticalZones.map(zone => (
                <div key={zone.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{zone.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {zone.disease ?? "Health Degrading"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">High</Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isSpraying === zone.id}
                      onClick={() => handleSpray(zone.id)}
                    >
                      {isSpraying === zone.id ? "Spraying..." : "Spray Now"}
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
                Recent Activity
              </CardTitle>
              <CardDescription>Latest actions and alerts from your farm</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map(zone => (
                <div key={zone.id} className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Spraying completed</p>
                    <p className="text-xs text-muted-foreground">
                      {zone.id} • {new Date(zone.lastSprayed).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <Separator />
              <Button variant="outline" className="w-full bg-transparent">
                View All Activity
              </Button>
            </CardContent>
          </Card>

        </div>

        {/* Quick Actions (RESTORED EXACTLY) */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and controls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-6">
              <Button className="h-12" asChild>
                <a href="/controls">
                  <Sprout className="mr-2 h-4 w-4" />
                  Start Auto Spray
                </a>
              </Button>
              <Button variant="outline" className="h-12 bg-transparent" asChild>
                <a href="/map">
                  <MapPin className="mr-2 h-4 w-4" />
                  View Farm Map
                </a>
              </Button>
              <Button variant="outline" className="h-12 bg-transparent" asChild>
                <a href="/analytics">
                  <Activity className="mr-2 h-4 w-4" />
                  Analytics
                </a>
              </Button>
              <Button variant="outline" className="h-12 bg-transparent" asChild>
                <a href="/detection">
                  <Brain className="mr-2 h-4 w-4" />
                  Disease Detection
                </a>
              </Button>
              <Button variant="outline" className="h-12 bg-transparent" asChild>
                <a href="/recommendations">
                  <Brain className="mr-2 h-4 w-4" />
                  AI Recommendations
                </a>
              </Button>
              <Button variant="outline" className="h-12 bg-transparent" asChild>
                <a href="/users">
                  <Users className="mr-2 h-4 w-4" />
                  User Management
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}