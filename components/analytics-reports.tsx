"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChartIcon,
  Download,
  Droplets,
  Sprout,
  AlertTriangle,
  Activity,
} from "lucide-react"

export default function AnalyticsReports() {
  const [timeRange, setTimeRange] = useState("7d")
  const [selectedZone, setSelectedZone] = useState("all")
  const [analytics, setAnalytics] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([]) 
useEffect(() => {
  const fetchData = async () => {
    try {
      const analyticsRes = await fetch("/api/analytics")
      const analyticsJson = await analyticsRes.json()
      setAnalytics(analyticsJson)

      const historyRes = await fetch("/api/history")
      const historyJson = await historyRes.json()
      setHistory(historyJson)
    } catch (err) {
      console.error("Analytics fetch error:", err)
    }
  }

  fetchData()
  const interval = setInterval(fetchData, 20000)
  return () => clearInterval(interval)
}, [])
console.log("History:", history)




 const selectedZoneHistory =
  selectedZone === "all"
    ? history[0]
    : history.find(h => h.zoneId === selectedZone)

const healthTrendData =
  selectedZoneHistory?.moistureHistory.map((value: number, index: number) => ({
    index,
    moisture: value,
  })) ?? []



 const sprayingData = history.map(zone => ({
  zone: zone.zoneId,
  sessions: zone.sprays,
  efficiency: Math.max(60, 100 - zone.sprays * 5)
}))




  const pesticideUsageData = [
    { name: "Fungicide", value: 45, color: "#22c55e" },
    { name: "Insecticide", value: 30, color: "#3b82f6" },
    { name: "Herbicide", value: 15, color: "#f59e0b" },
    { name: "Bactericide", value: 10, color: "#ef4444" },
  ]

  const monthlyTrendData = [
    { month: "Oct", spraying: 45, diseases: 8, yield: 92 },
    { month: "Nov", spraying: 52, diseases: 12, yield: 88 },
    { month: "Dec", spraying: 38, diseases: 6, yield: 95 },
    { month: "Jan", spraying: 41, diseases: 9, yield: 91 },
    { month: "Feb", spraying: 35, diseases: 5, yield: 97 },
    { month: "Mar", spraying: 48, diseases: 11, yield: 89 },
  ]

 const diseaseBreakdownData = [
  { disease: "High Severity", cases: analytics?.highSeverity ?? 0, severity: "high" },
  { disease: "Medium Severity", cases: analytics?.mediumSeverity ?? 0, severity: "medium" },
  { disease: "Low Severity", cases: analytics?.lowSeverity ?? 0, severity: "low" },
]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const generateReport = () => {
    // Mock report generation
    console.log("Generating report for", timeRange, selectedZone)
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
            <p className="text-muted-foreground">Track performance, analyze trends, and generate insights</p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 3 months</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedZone} onValueChange={setSelectedZone}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zones</SelectItem>
                <SelectItem value="a">Row A</SelectItem>
                <SelectItem value="b">Row B</SelectItem>
                <SelectItem value="c">Row C</SelectItem>
                <SelectItem value="d">Row D</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={generateReport}>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Performance Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spraying Sessions</CardTitle>
              <Sprout className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalSprays}</div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Efficiency</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.avgEfficiency}%</div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>+5% improvement</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pesticide Saved</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.estimatedWaterSaved}%</div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>vs manual spraying</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Diseases Prevented</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalDetections}</div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>Early detection</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Yield Improvement</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{analytics?.yieldImprovement}%</div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>vs last season</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cost Reduction</CardTitle>
              <TrendingDown className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.costReduction}%</div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingDown className="h-3 w-3" />
                <span>Operational costs</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trends">Health Trends</TabsTrigger>
            <TabsTrigger value="spraying">Spraying Analysis</TabsTrigger>
            <TabsTrigger value="diseases">Disease Reports</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Health Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Farm Health Trends
                </CardTitle>
                <CardDescription>Track crop health changes over time</CardDescription>
              </CardHeader>
              <CardContent>
<ResponsiveContainer width="100%" height={400}>
  <AreaChart data={healthTrendData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="index" />
    <YAxis />
    <Tooltip />
    <Legend />

    <Area
      type="monotone"
      dataKey="moisture"
      stroke="#22c55e"
      fill="#22c55e"
      fillOpacity={0.6}
      name="Moisture"
    />
  </AreaChart>
</ResponsiveContainer>



              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance Overview</CardTitle>
                <CardDescription>Compare spraying frequency, disease incidents, and yield</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="spraying" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="diseases" stroke="#ef4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="yield" stroke="#22c55e" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Spraying Analysis Tab */}
          <TabsContent value="spraying" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Spraying Efficiency by Zone
                  </CardTitle>
                  <CardDescription>Compare performance across different zones</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sprayingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="zone" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="efficiency" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-primary" />
                    Pesticide Usage Distribution
                  </CardTitle>
                  <CardDescription>Breakdown of pesticide types used</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pesticideUsageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pesticideUsageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Zone Performance Details</CardTitle>
                <CardDescription>Detailed spraying statistics by zone</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sprayingData.map((zone) => (
                    <div key={zone.zone} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div className="font-medium">Zone {zone.zone}</div>
                        <div className="text-sm text-muted-foreground">
                          {zone.sessions} sessions 
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-medium">{zone.efficiency}%</div>
                          <div className="text-xs text-muted-foreground">Efficiency</div>
                        </div>
                        <Progress value={zone.efficiency} className="w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Disease Reports Tab */}
          <TabsContent value="diseases" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Disease Breakdown
                </CardTitle>
                <CardDescription>Analysis of detected diseases and their severity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {diseaseBreakdownData.map((disease, index) => (
                    <div key={disease.disease} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className={`h-4 w-4 ${getSeverityColor(disease.severity)}`} />
                        <div>
                          <p className="font-medium">{disease.disease}</p>
                          <p className="text-sm text-muted-foreground">{disease.cases} cases detected</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          disease.severity === "high"
                            ? "destructive"
                            : disease.severity === "medium"
                              ? "secondary"
                              : "default"
                        }
                        className="capitalize"
                      >
                        {disease.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disease Prevention Success Rate</CardTitle>
                <CardDescription>Effectiveness of early detection and treatment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950">
                    <div className="text-2xl font-bold text-green-600">89%</div>
                    <p className="text-sm text-muted-foreground">Early Detection</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                    <div className="text-2xl font-bold text-blue-600">94%</div>
                    <p className="text-sm text-muted-foreground">Treatment Success</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950">
                    <div className="text-2xl font-bold text-purple-600">76%</div>
                    <p className="text-sm text-muted-foreground">Prevention Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  System Performance Metrics
                </CardTitle>
                <CardDescription>Overall system efficiency and improvements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-medium">Efficiency Improvements</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Pesticide Usage Optimization</span>
                        <span className="text-sm font-medium text-green-600">-23%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Labor Cost Reduction</span>
                        <span className="text-sm font-medium text-green-600">-35%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Response Time Improvement</span>
                        <span className="text-sm font-medium text-green-600">+67%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Crop Yield Increase</span>
                        <span className="text-sm font-medium text-green-600">+12%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">System Reliability</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Uptime</span>
                        <span className="text-sm font-medium">99.7%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Sensor Accuracy</span>
                        <span className="text-sm font-medium">97.2%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">AI Prediction Accuracy</span>
                        <span className="text-sm font-medium">91.8%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">False Positive Rate</span>
                        <span className="text-sm font-medium">3.1%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ROI Analysis</CardTitle>
                <CardDescription>Return on investment from the intelligent spraying system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-xl font-bold text-primary">$12,450</div>
                    <p className="text-sm text-muted-foreground">Cost Savings</p>
                    <p className="text-xs text-green-600">vs manual spraying</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-xl font-bold text-primary">156%</div>
                    <p className="text-sm text-muted-foreground">ROI</p>
                    <p className="text-xs text-green-600">12-month period</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-xl font-bold text-primary">8.2</div>
                    <p className="text-sm text-muted-foreground">Payback Period</p>
                    <p className="text-xs text-muted-foreground">months</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-xl font-bold text-primary">$45,200</div>
                    <p className="text-sm text-muted-foreground">Annual Savings</p>
                    <p className="text-xs text-green-600">projected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
