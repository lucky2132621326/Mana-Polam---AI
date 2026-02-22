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
import { Trans } from "@/components/language-provider"

export default function AnalyticsReports() {
  const [timeRange, setTimeRange] = useState("7d")
  const [selectedZone, setSelectedZone] = useState("all")
  const [analytics, setAnalytics] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([]) 
  const [zonesData, setZonesData] = useState<any[]>([])
useEffect(() => {
  const fetchData = async () => {
    try {
      const analyticsRes = await fetch("/api/analytics")
      const analyticsJson = await analyticsRes.json()
      setAnalytics(analyticsJson)

      const historyRes = await fetch("/api/history")
      const historyJson = await historyRes.json()
      // server returns { moistureHistory, zones: [...] } by default
      setHistory(historyJson.zones ?? historyJson)

      // fetch live zones to align disease breakdown with map colors
      try {
        const zonesRes = await fetch("/api/zones")
        const zonesJson = await zonesRes.json()
        setZonesData(zonesJson || [])
      } catch (e) {
        setZonesData([])
      }
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

const [healthTrendDataState, setHealthTrendDataState] = useState<any[]>([])

useEffect(() => {
  // Produce chart data depending on timeRange. Only 7d is dynamic/randomized;
  // other ranges return compact, labeled, deterministic series.
  const zoneBases: Record<string, number> = { a: 50, b: 60, c: 45, d: 70 }

  const deterministicValue = (base: number, idx: number, scale = 8) =>
    Math.max(0, Math.min(100, Math.round(base + Math.sin(idx / 2) * scale + idx * 1)))

  const expandHistory = (source: number[], points: number) => {
    const len = source.length
    return Array.from({ length: points }).map((_, i) => {
      const baseVal = source[i % len] ?? 50
      const noise = Math.round(Math.random() * 6 - 3)
      return { label: `${i + 1}`, moisture: Math.max(0, Math.min(100, baseVal + noise)) }
    })
  }

  const base = selectedZone === "all"
    ? Math.round((zoneBases.a + zoneBases.b + zoneBases.c + zoneBases.d) / 4)
    : zoneBases[selectedZone] ?? 55

  if (timeRange === "7d") {
    const points = 7
    if (selectedZoneHistory?.moistureHistory && selectedZoneHistory.moistureHistory.length) {
      setHealthTrendDataState(expandHistory(selectedZoneHistory.moistureHistory, points))
      return
    }

    const data = Array.from({ length: points }).map((_, i) => {
      const seasonal = Math.round(base + Math.sin(i / 2 + Math.random() * 2) * 10 + (Math.random() * 8 - 4))
      return { label: `${i + 1}`, moisture: Math.max(0, Math.min(100, seasonal)) }
    })
    setHealthTrendDataState(data)
    return
  }

  if (timeRange === "30d") {
    const data = [1, 2, 3, 4].map((w) => ({ label: `Week ${w}`, moisture: deterministicValue(base, w, 6) }))
    setHealthTrendDataState(data)
    return
  }

  if (timeRange === "90d") {
    const data = [1, 2, 3].map((m) => ({ label: `Mon ${m}`, moisture: deterministicValue(base, m, 7) }))
    setHealthTrendDataState(data)
    return
  }

  // 1y or fallback
  const data = [1, 2, 3, 4].map((q) => ({ label: `Q${q}`, moisture: deterministicValue(base, q, 9) }))
  setHealthTrendDataState(data)
}, [selectedZone, selectedZoneHistory, timeRange])



// Build spraying data from analytics.zones when available, otherwise fall back to history
const sprayingData = (analytics && Array.isArray(analytics.zones) ? analytics.zones : (Array.isArray(history) ? history : [])).map((zone: any) => ({
  zone: zone.zoneId || zone.zone,
  sessions: zone.sprays || 0,
  efficiency: Math.max(60, 100 - (zone.sprays || 0) * 5)
}))

// Ensure chart has fallback/synthesized data for rendering
const chartData = healthTrendDataState && healthTrendDataState.length > 0
  ? healthTrendDataState
  : Array.from({ length: 7 }).map((_, i) => ({ label: `${i + 1}`, moisture: Math.max(0, Math.min(100, Math.round(50 + Math.sin(i / 2) * 10))) }))




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

  // derive disease counts from live zones data to match map coloring
  const criticalCount = zonesData.filter(z => z.status === 'critical').length
  const warningCount = zonesData.filter(z => z.status === 'warning').length
  const healthyCount = zonesData.filter(z => z.status === 'healthy').length

  const diseaseBreakdownData = [
  { key: "critical", en: "Critical Zones", te: "తీవ్ర జోన్లు", cases: criticalCount, severity: "high" },
  { key: "warning", en: "Warning Zones", te: "హెచ్చరిక జోన్లు", cases: warningCount, severity: "medium" },
  { key: "healthy", en: "Healthy Zones", te: "ఆరోగ్యవంతమైన జోన్లు", cases: healthyCount, severity: "low" },
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
            <h1 className="text-3xl font-bold text-foreground">
              <Trans en={"Analytics & Reports"} te={"విశ్లేషణలు మరియు నివేదికలు"} />
            </h1>
            <p className="text-muted-foreground">
              <Trans en={"Track performance, analyze trends, and generate insights"} te={"పనితీరును ట్రాక్ చేయండి, ధోరణులను విశ్లేషించండి మరియు అవగాహనలను రూపొందించండి"} />
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d"><Trans en={"Last 7 days"} te={"గత 7 రోజులు"} /></SelectItem>
                <SelectItem value="30d"><Trans en={"Last 30 days"} te={"గత 30 రోజులు"} /></SelectItem>
                <SelectItem value="90d"><Trans en={"Last 3 months"} te={"గత 3 నెలలు"} /></SelectItem>
                <SelectItem value="1y"><Trans en={"Last year"} te={"గత సంవత్సరం"} /></SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedZone} onValueChange={setSelectedZone}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all"><Trans en={"All Zones"} te={"అన్ని జోన్లు"} /></SelectItem>
                <SelectItem value="a"><Trans en={"Row A"} te={"రౌ A"} /></SelectItem>
                <SelectItem value="b"><Trans en={"Row B"} te={"రౌ B"} /></SelectItem>
                <SelectItem value="c"><Trans en={"Row C"} te={"రౌ C"} /></SelectItem>
                <SelectItem value="d"><Trans en={"Row D"} te={"రౌ D"} /></SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={generateReport}>
              <Download className="mr-2 h-4 w-4" />
              <Trans en={"Export Report"} te={"నివేదిక ఎగుమతి చేయండి"} />
            </Button>
          </div>
        </div>

        {/* Key Performance Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium"><Trans en={"Total Spraying Sessions"} te={"మొత్తం స్ప్రేయింగ్ సెషన్లు"} /></CardTitle>
              <Sprout className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalSpraying}</div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span><Trans en={"+12% from last month"} te={"గత నెలతో పోలిస్తే +12%"} /></span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium"><Trans en={"Average Efficiency"} te={"సగటు సామర్థ్యం"} /></CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.avgEfficiency}%</div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span><Trans en={"+5% improvement"} te={"+5% మెరుగుదల"} /></span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium"><Trans en={"Pesticide Saved"} te={"సంరక్షించిన మందు"} /></CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.pesticideSaved}%</div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span><Trans en={"vs manual spraying"} te={"మ్యాన్యువల్ స్ప్రేయింగ్ తో పోలిస్తే"} /></span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium"><Trans en={"Diseases Prevented"} te={"నిరోధించిన వ్యాధులు"} /></CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.diseasesPrevented}</div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span><Trans en={"Early detection"} te={"ముందస్తు గుర్తింపు"} /></span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium"><Trans en={"Yield Improvement"} te={"పంట దిగుమతి మెరుగుదల"} /></CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{analytics?.yieldImprovement}%</div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span><Trans en={"vs last season"} te={"గత సీజన్ తో పోలిస్తే"} /></span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium"><Trans en={"Cost Reduction"} te={"ఖర్చు తగ్గింపు"} /></CardTitle>
              <TrendingDown className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.costReduction}%</div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingDown className="h-3 w-3" />
                <span><Trans en={"Operational costs"} te={"ఆపరేషన్ ఖర్చు"} /></span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="trends" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trends"><Trans en={"Health Trends"} te={"ఆరోగ్య ధోరణులు"} /></TabsTrigger>
            <TabsTrigger value="spraying"><Trans en={"Spraying Analysis"} te={"స్ప్రేయింగ్ విశ్లేషణ"} /></TabsTrigger>
            <TabsTrigger value="diseases"><Trans en={"Disease Reports"} te={"రోగ నివేదికలు"} /></TabsTrigger>
            <TabsTrigger value="performance"><Trans en={"Performance"} te={"పనితీరు"} /></TabsTrigger>
          </TabsList>

          {/* Health Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <Trans en={"Farm Health Trends"} te={"ఫారం ఆరోగ్య ధోరణులు"} />
                </CardTitle>
                <CardDescription><Trans en={"Track crop health changes over time"} te={"కాలానుగుణంగా పంట ఆరోగ్య మార్పులను ట్రాక్ చేయండి"} /></CardDescription>
              </CardHeader>
              <CardContent>
<ResponsiveContainer width="100%" height={400}>
  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="label" type="category" />
    <YAxis domain={[0, 100]} />
    <Tooltip />
    <Legend />

    <Area
      type="monotone"
      dataKey="moisture"
      stroke="#16a34a"
      fill="#bbf7d0"
      fillOpacity={0.6}
      name={"తేమ"}
      dot={{ r: 3 }}
      activeDot={{ r: 5 }}
      connectNulls
    />
  </AreaChart>
</ResponsiveContainer>



              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle><Trans en={"Monthly Performance Overview"} te={"మాసిక పనితీరు అవలోకనం"} /></CardTitle>
                  <CardDescription><Trans en={"Compare spraying frequency, disease incidents, and yield"} te={"స్ప్రేయింగ్ ఫ్రీక్వెన్సీ, వ్యాధి సంఘటనలు, మరియు దిగుబడి తులన చేయండి"} /></CardDescription>
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
                    <Trans en={"Spraying Efficiency by Zone"} te={"ప్రాంతాల వారీగా స్ప్రేయింగ్ సామర్థ్యం"} />
                  </CardTitle>
                  <CardDescription><Trans en={"Compare performance across different zones"} te={"విభిన్న ప్రాంతాల మధ్య పనితీరును పోల్చండి"} /></CardDescription>
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
                    <Trans en={"Pesticide Usage Distribution"} te={"పెస్టిసైడ్ వినియోగ పంపిణీ"} />
                  </CardTitle>
                  <CardDescription><Trans en={"Breakdown of pesticide types used"} te={"వాడిన మందుల రకాల వివరణ"} /></CardDescription>
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
                <CardTitle><Trans en={"Zone Performance Details"} te={"ప్రాంత పనితీరు వివరాలు"} /></CardTitle>
                  <CardDescription><Trans en={"Detailed spraying statistics by zone"} te={"ప్రాంతాల వారీగా స్ప్రేయింగ్ గణాంకాలు"} /></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sprayingData.map((zone) => (
                    <div key={zone.zone} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div className="font-medium"><Trans en={"Zone"} te={"జోన్"} /> {zone.zone}</div>
                        <div className="text-sm text-muted-foreground">
                          {zone.sessions} <Trans en={"sessions"} te={"సెషన్లు"} />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-medium">{zone.efficiency}%</div>
                          <div className="text-xs text-muted-foreground"><Trans en={"Efficiency"} te={"ప్రభావవంతత"} /></div>
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
                  <Trans en={"Disease Breakdown"} te={"రోగాల విభజన"} />
                </CardTitle>
                <CardDescription><Trans en={"Analysis of detected diseases and their severity"} te={"గుర్తించిన రోగాలు మరియు వాటి తీవ్రతల యొక్క విశ్లేషణ"} /></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {diseaseBreakdownData.map((disease, index) => (
                    <div key={disease.key} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className={`h-4 w-4 ${getSeverityColor(disease.severity)}`} />
                        <div>
                          <p className="font-medium"><Trans en={disease.en} te={disease.te} /></p>
                          <p className="text-sm text-muted-foreground"><Trans en={`${disease.cases} cases detected`} te={`${disease.cases} కేసులు గుర్తించబడినవి`} /></p>
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
                <CardTitle><Trans en={"Disease Prevention Success Rate"} te={"రోగ నిరోధక విజయ రేటు"} /></CardTitle>
                <CardDescription><Trans en={"Effectiveness of early detection and treatment"} te={"ముందస్తు గుర్తింపు మరియు చికిత్స యొక్క ప్రభావితత్వం"} /></CardDescription>
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
                  <Trans en={"System Performance Metrics"} te={"సిస్టమ్ పనితీరు మీట్రిక్స్"} />
                </CardTitle>
                <CardDescription><Trans en={"Overall system efficiency and improvements"} te={"మొత్తం సిస్టమ్ సామర్థ్యం మరియు మెరుగుదలలు"} /></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-medium"><Trans en={"Efficiency Improvements"} te={"సమర్థతలో మెరుగుదలలు"} /></h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm"><Trans en={"Pesticide Usage Optimization"} te={"పెస్టిసైడ్ వినియోగ ఆప్టిమైజేషన్"} /></span>
                        <span className="text-sm font-medium text-green-600">-23%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm"><Trans en={"Labor Cost Reduction"} te={"శ్రమ ఖర్చు తగ్గింపు"} /></span>
                        <span className="text-sm font-medium text-green-600">-35%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm"><Trans en={"Response Time Improvement"} te={"స్పందన సమయంలో మెరుగుదల"} /></span>
                        <span className="text-sm font-medium text-green-600">+67%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm"><Trans en={"Crop Yield Increase"} te={"పంట దిగుబడిలో వృద్ధి"} /></span>
                        <span className="text-sm font-medium text-green-600">+12%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium"><Trans en={"System Reliability"} te={"సిస్టమ్ విశ్వసనీయత"} /></h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm"><Trans en={"Uptime"} te={"అప్‌టైమ్"} /></span>
                        <span className="text-sm font-medium">99.7%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm"><Trans en={"Sensor Accuracy"} te={"సెన్సార్ ఖచ్చితత్వం"} /></span>
                        <span className="text-sm font-medium">97.2%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm"><Trans en={"AI Prediction Accuracy"} te={"AI అంచనా ఖచ్చితత్వం"} /></span>
                        <span className="text-sm font-medium">91.8%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm"><Trans en={"False Positive Rate"} te={"భ్రమకర పాజిటివ్ రేటు"} /></span>
                        <span className="text-sm font-medium">3.1%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle><Trans en={"ROI Analysis"} te={"ROI విశ్లేషణ"} /></CardTitle>
                <CardDescription><Trans en={"Return on investment from the intelligent spraying system"} te={"బుద్ధిమంతమైన స్ప్రేయింగ్ వ్యవస్థ నుండి పెట్టుబడి పై తిరుగుబాటు"} /></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-xl font-bold text-primary">$12,450</div>
                    <p className="text-sm text-muted-foreground"><Trans en={"Cost Savings"} te={"ఖర్చు ఆదా"} /></p>
                    <p className="text-xs text-green-600"><Trans en={"vs manual spraying"} te={"మ్యాన్యువల్ స్ప్రేయింగ్‌తో పోలిస్తే"} /></p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-xl font-bold text-primary">156%</div>
                    <p className="text-sm text-muted-foreground"><Trans en={"ROI"} te={"నివేశంపై తిరుగుబాటు"} /></p>
                    <p className="text-xs text-green-600"><Trans en={"12-month period"} te={"12-నెల కాలపరిమితి"} /></p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-xl font-bold text-primary">8.2</div>
                    <p className="text-sm text-muted-foreground"><Trans en={"Payback Period"} te={"పేబ్యాక్ పొడవు"} /></p>
                    <p className="text-xs text-muted-foreground"><Trans en={"months"} te={"నెలలు"} /></p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-xl font-bold text-primary">$45,200</div>
                    <p className="text-sm text-muted-foreground"><Trans en={"Annual Savings"} te={"వార్షిక సేవింగ్స్"} /></p>
                    <p className="text-xs text-green-600"><Trans en={"projected"} te={"అంచనా"} /></p>
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
