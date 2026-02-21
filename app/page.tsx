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


export default function Dashboard() {  // Mock data for demonstration
  const farmHealthScore = 87
  const totalZones = 12
  const healthyZones = 8
  const warningZones = 3
  const infectedZones = 1

  const sensorData = {
    soilMoisture: 68,
    temperature: 24,
    humidity: 72,

  }

  const [mlResult, setMlResult] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    // Load ML result
    const stored = localStorage.getItem("mlResult")
    if (stored) {
      setMlResult(JSON.parse(stored))
    }

    // Live updating clock
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

  const criticalZones = [
    { id: "Zone-A3", severity: "high", disease: "Leaf Blight", lastSprayed: "2 days ago" },
    { id: "Zone-B7", severity: "medium", disease: "Aphid Infestation", lastSprayed: "1 day ago" },
    { id: "Zone-C2", severity: "medium", disease: "Fungal Growth", lastSprayed: "3 days ago" },
  ]

  const recentActivity = [
    { action: "Spraying completed", zone: "Zone-A1", time: "2 hours ago" },
    { action: "Disease detected", zone: "Zone-A3", time: "4 hours ago" },
    { action: "Moisture alert", zone: "Zone-B5", time: "6 hours ago" },
  ]

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
            </span>          </div>
        </div>

        {/* Farm Health Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Healthy Zones</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{healthyZones}</div>
              <p className="text-xs text-muted-foreground">out of {totalZones} zones</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Warning Zones</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{warningZones}</div>
              <p className="text-xs text-muted-foreground">require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
                  <p className="text-2xl font-bold">{sensorData.soilMoisture}%</p>
                  <p className="text-xs text-muted-foreground">Optimal range</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <Thermometer className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Temperature</p>
                  <p className="text-2xl font-bold">{sensorData.temperature}°C</p>
                  <p className="text-xs text-muted-foreground">Good conditions</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <Wind className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Humidity</p>
                  <p className="text-2xl font-bold">{sensorData.humidity}%</p>
                  <p className="text-xs text-muted-foreground">Within range</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              AI Disease Intelligence
            </CardTitle>
            <CardDescription>
              Machine learning powered crop health analysis
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!mlResult ? (
              <p className="text-muted-foreground text-sm">
                No AI detection performed yet. Upload a leaf image to analyze crop health.
              </p>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Latest Detection</p>
                  <p className="text-xl font-bold">
                    Class {mlResult.classIndex}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium">Confidence</p>
                  <Progress value={mlResult.confidence * 100} />
                  <p className="text-xs text-muted-foreground mt-1">
                    {(mlResult.confidence * 100).toFixed(2)}%
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium">Environmental Risk</p>
                  <Badge
                    variant={
                      mlResult.confidence > 0.7 && sensorData.humidity > 75
                        ? "destructive"
                        : mlResult.confidence > 0.4
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {mlResult.confidence > 0.7 && sensorData.humidity > 75
                      ? "High Risk"
                      : mlResult.confidence > 0.4
                        ? "Moderate Risk"
                        : "Low Risk"}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Critical Zones and Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Critical Zones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Zones Requiring Attention
              </CardTitle>
              <CardDescription>Areas with detected issues that need spraying</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {criticalZones.map((zone, index) => (
                <div key={zone.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{zone.id}</p>
                      <p className="text-sm text-muted-foreground">{zone.disease}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={zone.severity === "high" ? "destructive" : "secondary"}>{zone.severity}</Badge>
                    <Button size="sm" variant="outline">
                      Spray Now
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="h-5 w-5 text-green-600" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest actions and alerts from your farm</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.zone} • {activity.time}
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

        {/* Quick Actions */}
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
              {/* <Button variant="outline" className="h-12 bg-transparent">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Alerts
              </Button> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
