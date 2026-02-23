"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

export default function AnalyticsReports() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [showFormula, setShowFormula] = useState(false)
  const [lastSync, setLastSync] = useState<string>("")

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/analytics/trends")
      const data = await res.json()
      setAnalytics(data)
      setLastSync(new Date().toLocaleTimeString())
    }

    fetchData()
    const interval = setInterval(fetchData, 15000)
    return () => clearInterval(interval)
  }, [])

  if (!analytics) return null

  const {
    totalDetections,
    totalSprays,
    severityBreakdown,
    diseaseFrequency,
    detectionTimeline,
    sprayTimeline,
    zoneBreakdown,
  } = analytics

  const high = severityBreakdown?.high || 0
  const medium = severityBreakdown?.medium || 0
  const low = severityBreakdown?.low || 0

  const totalSeverity = high + medium + low || 1

  // =============================
  // CORE CALCULATIONS
  // =============================

  const spreadIndex =
    totalDetections === 0 ? 0 : high / totalDetections

  const stabilityScore = (1 - spreadIndex) * 100

  const autoSprayRatio =
    totalDetections === 0 ? 0 : totalSprays / totalDetections

  const manualSprays = totalDetections * 1.3
  const waterSaved = (manualSprays - totalSprays) * 2
  const yieldGain = (1 - spreadIndex) * 20

  const riskLevel =
    spreadIndex > 0.4
      ? "CRITICAL"
      : spreadIndex > 0.2
      ? "MODERATE"
      : "STABLE"

  const severityBars = [
    {
      label: "High Risk",
      value: high,
      percent: Math.round((high / totalSeverity) * 100),
    },
    {
      label: "Medium Risk",
      value: medium,
      percent: Math.round((medium / totalSeverity) * 100),
    },
    {
      label: "Low Risk",
      value: low,
      percent: Math.round((low / totalSeverity) * 100),
    },
  ]

  const diseaseData = Object.entries(diseaseFrequency || {})
    .map(([name, value]) => ({ name, value }))
    .sort((a: any, b: any) => b.value - a.value)

  const timelineData = Object.keys(detectionTimeline || {}).map(date => ({
    date,
    detections: detectionTimeline[date] || 0,
    sprays: sprayTimeline?.[date] || 0,
  }))

  const zoneEfficiency = Object.entries(zoneBreakdown || {}).map(
    ([zoneId, data]: any) => ({
      zone: zoneId,
      efficiency: Math.max(60, 100 - data.sprays * 5),
      sprays: data.sprays,
    })
  )

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ================= EXECUTIVE COMMAND CENTER ================= */}

        <div className="grid md:grid-cols-5 gap-4">
          <Card>
            <CardHeader><CardTitle>Total Detections</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold text-green-700">
              {totalDetections}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Total Sprays</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold text-green-700">
              {totalSprays}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Farm Stability</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">
              {stabilityScore.toFixed(1)}%
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Escalation Risk</CardTitle></CardHeader>
            <CardContent className="text-xl font-bold">
              {riskLevel}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Last Synced</CardTitle></CardHeader>
            <CardContent>{lastSync}</CardContent>
          </Card>
        </div>

        {/* ================= SEVERITY INTELLIGENCE ================= */}

        <Card>
          <CardHeader onClick={() => toggleSection("severity")} className="cursor-pointer">
            <CardTitle>Severity Intelligence</CardTitle>
            <CardDescription>
              Spread Index: {(spreadIndex * 100).toFixed(2)}%
            </CardDescription>
          </CardHeader>

          {openSection === "severity" && (
            <CardContent className="space-y-4">

              {severityBars.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between font-medium">
                    <span>{item.label}</span>
                    <span>{item.value} ({item.percent}%)</span>
                  </div>
                  <Progress value={item.percent} />
                </div>
              ))}

              <button
                onClick={() => setShowFormula(!showFormula)}
                className="text-sm underline mt-4"
              >
                {showFormula ? "Hide Calculation Method" : "Show Calculation Method"}
              </button>

              {showFormula && (
                <div className="bg-green-100 p-4 rounded-lg text-sm space-y-2">
                  <p>Spread Index = High Severity / Total Detections</p>
                  <p>Stability Score = (1 - Spread Index) × 100</p>
                </div>
              )}

            </CardContent>
          )}
        </Card>

        {/* ================= DISEASE MATRIX ================= */}

        <Card>
          <CardHeader onClick={() => toggleSection("disease")} className="cursor-pointer">
            <CardTitle>Disease Command Matrix</CardTitle>
          </CardHeader>

          {openSection === "disease" && (
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart layout="vertical" data={diseaseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={200} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#16a34a" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          )}
        </Card>

        {/* ================= SPRAYING INTELLIGENCE ================= */}

        <Card>
          <CardHeader onClick={() => toggleSection("spraying")} className="cursor-pointer">
            <CardTitle>Zone Spraying Efficiency</CardTitle>
            <CardDescription>
              Efficiency = 100 - (Sprays × 5)
            </CardDescription>
          </CardHeader>

          {openSection === "spraying" && (
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={zoneEfficiency}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="zone" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="efficiency" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          )}
        </Card>

        {/* ================= AI IMPACT CENTER ================= */}

        <Card>
          <CardHeader onClick={() => toggleSection("impact")} className="cursor-pointer">
            <CardTitle>AI Impact Center</CardTitle>
          </CardHeader>

          {openSection === "impact" && (
            <CardContent className="grid md:grid-cols-4 gap-4">

              <Card>
                <CardHeader><CardTitle>Manual Sprays (Est.)</CardTitle></CardHeader>
                <CardContent className="font-bold">
                  {manualSprays.toFixed(1)}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Water Saved (L)</CardTitle></CardHeader>
                <CardContent className="font-bold">
                  {waterSaved.toFixed(1)} L
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Yield Gain</CardTitle></CardHeader>
                <CardContent className="font-bold">
                  +{yieldGain.toFixed(1)}%
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Auto Spray Ratio</CardTitle></CardHeader>
                <CardContent className="font-bold">
                  {(autoSprayRatio * 100).toFixed(1)}%
                </CardContent>
              </Card>

            </CardContent>
          )}
        </Card>

        {/* ================= TREND INTELLIGENCE ================= */}

        <Card>
          <CardHeader onClick={() => toggleSection("timeline")} className="cursor-pointer">
            <CardTitle>Detection & Spray Trends</CardTitle>
          </CardHeader>

          {openSection === "timeline" && (
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="detections" stroke="#16a34a" />
                  <Line type="monotone" dataKey="sprays" stroke="#f59e0b" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          )}
        </Card>

      </div>
    </div>
  )
}