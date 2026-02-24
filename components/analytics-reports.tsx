"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts"

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [historyData, setHistoryData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const a = await fetch("/api/analytics")
        const aData = await a.json()
        setAnalytics(aData)

        const h = await fetch("/api/history")
        const hData = await h.json()
        setHistoryData(hData)
      } catch (err) {
        console.error("Analytics fetch error:", err)
      }
    }

    fetchData()
  }, [])

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">
          Loading Intelligence Engine...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        <Tabs defaultValue="stability" className="w-full">

          <TabsList className="mb-6">
            <TabsTrigger value="stability">Farm Stability</TabsTrigger>
            <TabsTrigger value="zones">Zone Intelligence</TabsTrigger>
            <TabsTrigger value="spraying">Spraying Intelligence</TabsTrigger>
            <TabsTrigger value="disease">Disease Intelligence</TabsTrigger>
            <TabsTrigger value="impact">AI Impact & Executive</TabsTrigger>
          </TabsList>

          {/* TAB 1 */}
          <TabsContent value="stability">
            <div className="space-y-6">
              {/* ================= SECTION 1A – STABILITY CORE ENGINE ================= */}

{(() => {
  /* ============================================================
     RAW EXTRACTION
  ============================================================ */

  const detections = historyData?.detections || []
  const sprays = historyData?.sprays || []

  const totalDetections = detections.length
  const totalSprays = sprays.length

  let high = 0
  let medium = 0
  let low = 0

  detections.forEach((d: any) => {
    if (d.severityLevel === "high") high++
    else if (d.severityLevel === "medium") medium++
    else if (d.severityLevel === "low") low++
  })

  const totalSeverity = high + medium + low || 1

  /* ============================================================
     FRONTEND RECOMPUTED WEIGHTED RISK
  ============================================================ */

  const weightedRisk =
    (high * 6 + medium * 3 + low * 1) /
    (totalSeverity * 6)

  const weightedRiskPercent = weightedRisk * 100

  /* ============================================================
     DETECTION PRESSURE INDEX
     Measures disease load intensity
  ============================================================ */

  const detectionPressure =
    totalDetections === 0
      ? 0
      : (high * 2 + medium * 1.2 + low * 0.6) /
        totalDetections

  const detectionPressureIndex =
    Math.min(100, detectionPressure * 40)

  /* ============================================================
     SPRAY PRECISION INDEX
  ============================================================ */

  const requiredSprays =
    high * 1 + medium * 0.7

  const sprayPrecision =
    totalSprays === 0
      ? 1
      : requiredSprays / totalSprays

  const sprayPrecisionIndex =
    Math.max(0, Math.min(100, sprayPrecision * 100))

  /* ============================================================
     OVERSPray INDEX
  ============================================================ */

  const overSpray =
    requiredSprays === 0
      ? 0
      : Math.max(
          0,
          ((totalSprays - requiredSprays) /
            requiredSprays) *
            100
        )

  const overSprayIndex =
    Math.max(0, 100 - overSpray)

  /* ============================================================
     DELAY RESPONSIVENESS MODEL (Frontend Paired)
  ============================================================ */

  let totalDelayHours = 0
  let validPairs = 0

  detections.forEach((d: any) => {
    const detectionTime = new Date(d.timestamp).getTime()

    const futureSprays = sprays
      .filter(
        (s: any) =>
          s.zoneId === d.zoneId &&
          new Date(s.timestamp).getTime() >=
            detectionTime
      )
      .sort(
        (a: any, b: any) =>
          new Date(a.timestamp).getTime() -
          new Date(b.timestamp).getTime()
      )

    if (futureSprays.length === 0) return

    const firstSprayTime =
      new Date(
        futureSprays[0].timestamp
      ).getTime()

    const delayHours =
      (firstSprayTime - detectionTime) /
      (1000 * 60 * 60)

    if (delayHours >= 0) {
      totalDelayHours += delayHours
      validPairs++
    }
  })

  const avgDelay =
    validPairs === 0
      ? 0
      : totalDelayHours / validPairs

  const responsivenessIndex =
    Math.max(0, 100 - avgDelay * 3)

  /* ============================================================
     ECOSYSTEM BALANCE INDEX
  ============================================================ */

  const ecosystemBalance =
    100 -
    weightedRiskPercent * 0.5 -
    overSpray * 0.3 +
    responsivenessIndex * 0.2

  const ecosystemBalanceIndex =
    Math.max(0, Math.min(100, ecosystemBalance))

  /* ============================================================
     STABILITY COMPOSITE INDEX
  ============================================================ */

  const stabilityIndex =
    100 -
    weightedRiskPercent * 0.4 -
    detectionPressureIndex * 0.2 -
    (100 - sprayPrecisionIndex) * 0.2 -
    overSpray * 0.1 +
    responsivenessIndex * 0.1

  const finalStability =
    Math.max(40, Math.min(100, stabilityIndex))

  /* ============================================================
     RETURN UI
  ============================================================ */

  return (
    <Card className="border-green-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-green-700">
          Farm Stability Command Center
        </CardTitle>
        <CardDescription>
          Frontend-computed multi-factor ecosystem resilience engine
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">

        {/* ===== STABILITY SCORE ===== */}

        <div className="text-center space-y-4">
          <div className="text-5xl font-bold text-green-700">
            {finalStability.toFixed(1)}%
          </div>
          <div className="text-muted-foreground">
            Stability Composite Index
          </div>
          <Progress value={finalStability} />
        </div>

        {/* ===== METRICS GRID ===== */}

        <div className="grid md:grid-cols-3 gap-4">

          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle>Weighted Risk</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-bold text-green-700">
              {weightedRiskPercent.toFixed(1)}%
            </CardContent>
          </Card>

          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle>Responsiveness</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-bold text-green-700">
              {responsivenessIndex.toFixed(1)}%
            </CardContent>
          </Card>

          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle>Ecosystem Balance</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-bold text-green-700">
              {ecosystemBalanceIndex.toFixed(1)}%
            </CardContent>
          </Card>

        </div>

      </CardContent>
    </Card>
  )
})()}
              {/* ================= SECTION 1B – ADVANCED STABILITY MODELING ================= */}

{(() => {

  const detections = historyData?.detections || []
  const sprays = historyData?.sprays || []

  let high = 0
  let medium = 0
  let low = 0

  detections.forEach((d: any) => {
    if (d.severityLevel === "high") high++
    else if (d.severityLevel === "medium") medium++
    else if (d.severityLevel === "low") low++
  })

  const total = high + medium + low || 1

  /* ============================================================
     SEVERITY DISTRIBUTION MODEL
  ============================================================ */

  const severityData = [
    { name: "High", value: high },
    { name: "Medium", value: medium },
    { name: "Low", value: low },
  ]

  /* ============================================================
     PRESSURE TREND MODEL (Grouped by Date)
  ============================================================ */

  const dateMap: Record<string, number> = {}

  detections.forEach((d: any) => {
    if (!d.timestamp) return

    const date = new Date(d.timestamp)
      .toISOString()
      .split("T")[0]

    if (!dateMap[date]) dateMap[date] = 0

    if (d.severityLevel === "high") dateMap[date] += 3
    else if (d.severityLevel === "medium") dateMap[date] += 2
    else if (d.severityLevel === "low") dateMap[date] += 1
  })

  const pressureTrend = Object.keys(dateMap)
    .sort()
    .map((date) => ({
      date,
      pressure: dateMap[date],
    }))

  /* ============================================================
     SPRAY ACTIVITY TREND
  ============================================================ */

  const sprayDateMap: Record<string, number> = {}

  sprays.forEach((s: any) => {
    if (!s.timestamp) return

    const date = new Date(s.timestamp)
      .toISOString()
      .split("T")[0]

    sprayDateMap[date] =
      (sprayDateMap[date] || 0) + 1
  })

  const sprayTrend = Object.keys(sprayDateMap)
    .sort()
    .map((date) => ({
      date,
      sprays: sprayDateMap[date],
    }))

  /* ============================================================
     INTERVENTION INTENSITY SCORE
  ============================================================ */

  const interventionIntensity =
    total === 0
      ? 0
      : (sprays.length / total) * 100

  const interventionIndex =
    Math.min(100, interventionIntensity)

  /* ============================================================
     RISK CONTAINMENT MODEL
  ============================================================ */

  const containmentRatio =
    100 - (high / total) * 100

  const containmentIndex =
    Math.max(0, containmentRatio)

  /* ============================================================
     RETURN UI
  ============================================================ */

  return (
    <Card className="border-green-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-green-700">
          Stability Intelligence Modeling
        </CardTitle>
        <CardDescription>
          Severity distribution, pressure evolution, and intervention dynamics
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">

        {/* ===== SEVERITY BAR CHART ===== */}

        <div>
          <div className="font-semibold mb-2">
            Severity Distribution
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={severityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ===== PRESSURE TREND ===== */}

        {pressureTrend.length > 0 && (
          <div>
            <div className="font-semibold mb-2">
              Disease Pressure Trend
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={pressureTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="pressure"
                  stroke="#16a34a"
                  fill="#bbf7d0"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ===== SPRAY TREND ===== */}

        {sprayTrend.length > 0 && (
          <div>
            <div className="font-semibold mb-2">
              Spray Activity Trend
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sprayTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sprays"
                  stroke="#15803d"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ===== INTELLIGENCE METRICS ===== */}

        <div className="grid md:grid-cols-3 gap-4">

          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle>Containment</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-bold text-green-700">
              {containmentIndex.toFixed(1)}%
            </CardContent>
          </Card>

          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle>Intervention Intensity</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-bold text-green-700">
              {interventionIndex.toFixed(1)}%
            </CardContent>
          </Card>

          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle>Total Events</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-bold text-green-700">
              {total}
            </CardContent>
          </Card>

        </div>

      </CardContent>
    </Card>
  )
})()}
            </div>
          </TabsContent>

          {/* TAB 2 */}
          <TabsContent value="zones">
            <div className="space-y-6">
              {/* ================= SECTION 2A – ZONE RISK & SPRAY MODELING ================= */}

{(() => {

  const detections = historyData?.detections || []
  const sprays = historyData?.sprays || []

  /* ============================================================
     GROUP BY ZONE
  ============================================================ */

  const zoneMap: Record<string, any> = {}

  detections.forEach((d: any) => {
    if (!zoneMap[d.zoneId]) {
      zoneMap[d.zoneId] = {
        detections: [],
        sprays: []
      }
    }
    zoneMap[d.zoneId].detections.push(d)
  })

  sprays.forEach((s: any) => {
    if (!zoneMap[s.zoneId]) {
      zoneMap[s.zoneId] = {
        detections: [],
        sprays: []
      }
    }
    zoneMap[s.zoneId].sprays.push(s)
  })

  /* ============================================================
     ZONE INTELLIGENCE CALCULATION
  ============================================================ */

  const zoneAnalytics = Object.keys(zoneMap).map((zoneId) => {

    const zoneDetections = zoneMap[zoneId].detections
    const zoneSprays = zoneMap[zoneId].sprays

    let high = 0
    let medium = 0
    let low = 0

    zoneDetections.forEach((d: any) => {
      if (d.severityLevel === "high") high++
      else if (d.severityLevel === "medium") medium++
      else if (d.severityLevel === "low") low++
    })

    const total = high + medium + low || 1

    /* ----- Risk Model ----- */

    const weightedRisk =
      (high * 6 + medium * 3 + low * 1) /
      (total * 6)

    const weightedRiskPercent = weightedRisk * 100

    /* ----- Required Spray Model ----- */

    const requiredSprays =
      high * 1 + medium * 0.7

    const actualSprays =
      zoneSprays.length

    /* ----- Over Spray Model ----- */

    const overSpray =
      requiredSprays === 0
        ? 0
        : Math.max(
            0,
            ((actualSprays - requiredSprays) /
              requiredSprays) *
              100
          )

    /* ----- Zone Spray Precision ----- */

    const sprayPrecision =
      actualSprays === 0
        ? 0
        : requiredSprays / actualSprays

    const sprayPrecisionIndex =
      Math.max(0, Math.min(100, sprayPrecision * 100))

    /* ----- Zone Risk Index ----- */

    const zoneRiskIndex =
      Math.max(
        0,
        100 - weightedRiskPercent
      )

    /* ----- Zone Stability ----- */

    const zoneStability =
      100 -
      weightedRiskPercent * 0.5 -
      overSpray * 0.3 +
      sprayPrecisionIndex * 0.2

    const finalZoneStability =
      Math.max(40, Math.min(100, zoneStability))

    return {
      zoneId,
      high,
      medium,
      low,
      total,
      weightedRiskPercent,
      requiredSprays,
      actualSprays,
      overSpray,
      sprayPrecisionIndex,
      zoneRiskIndex,
      finalZoneStability
    }

  })

  /* ============================================================
     SORT BY RISK (Highest First)
  ============================================================ */

  zoneAnalytics.sort(
    (a, b) =>
      b.weightedRiskPercent -
      a.weightedRiskPercent
  )

  /* ============================================================
     GLOBAL ZONE STABILITY
  ============================================================ */

  const globalZoneStability =
    zoneAnalytics.length === 0
      ? 100
      : zoneAnalytics.reduce(
          (sum, z) =>
            sum + z.finalZoneStability,
          0
        ) / zoneAnalytics.length

  /* ============================================================
     RETURN UI
  ============================================================ */

  return (
    <Card className="border-green-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-green-700">
          Zone Risk & Spray Intelligence
        </CardTitle>
        <CardDescription>
          Frontend-computed zone-level disease pressure and intervention modeling
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">

        {/* GLOBAL ZONE STABILITY */}

        <div className="text-center space-y-2">
          <div className="text-4xl font-bold text-green-700">
            {globalZoneStability.toFixed(1)}%
          </div>
          <div className="text-muted-foreground">
            Global Zone Stability
          </div>
          <Progress value={globalZoneStability} />
        </div>

        {/* ZONE TABLE */}

        <div className="space-y-4">

          {zoneAnalytics.map((zone) => (
            <Card key={zone.zoneId} className="bg-green-50">
              <CardContent className="p-4 grid md:grid-cols-6 gap-4 text-sm">

                <div>
                  <div className="font-semibold">
                    Zone
                  </div>
                  <div>{zone.zoneId}</div>
                </div>

                <div>
                  <div className="font-semibold">
                    Risk %
                  </div>
                  <div>
                    {zone.weightedRiskPercent.toFixed(1)}%
                  </div>
                </div>

                <div>
                  <div className="font-semibold">
                    Required
                  </div>
                  <div>
                    {zone.requiredSprays.toFixed(1)}
                  </div>
                </div>

                <div>
                  <div className="font-semibold">
                    Actual
                  </div>
                  <div>
                    {zone.actualSprays}
                  </div>
                </div>

                <div>
                  <div className="font-semibold">
                    Precision
                  </div>
                  <div>
                    {zone.sprayPrecisionIndex.toFixed(1)}%
                  </div>
                </div>

                <div>
                  <div className="font-semibold">
                    Stability
                  </div>
                  <div>
                    {zone.finalZoneStability.toFixed(1)}%
                  </div>
                </div>

              </CardContent>
            </Card>
          ))}

        </div>

      </CardContent>
    </Card>
  )

})()}
              {/* ================= SECTION 2B – ZONE DELAY & EFFICIENCY ENGINE ================= */}

{(() => {

  const detections = historyData?.detections || []
  const sprays = historyData?.sprays || []

  /* ============================================================
     GROUP BY ZONE (AGAIN – CLEAN LOCAL SCOPE)
  ============================================================ */

  const zoneMap: Record<string, any> = {}

  detections.forEach((d: any) => {
    if (!zoneMap[d.zoneId]) {
      zoneMap[d.zoneId] = {
        detections: [],
        sprays: []
      }
    }
    zoneMap[d.zoneId].detections.push(d)
  })

  sprays.forEach((s: any) => {
    if (!zoneMap[s.zoneId]) {
      zoneMap[s.zoneId] = {
        detections: [],
        sprays: []
      }
    }
    zoneMap[s.zoneId].sprays.push(s)
  })

  /* ============================================================
     DELAY + LOG EFFICIENCY MODEL PER ZONE
  ============================================================ */

  const zoneDelayAnalytics = Object.keys(zoneMap).map((zoneId) => {

    const zoneDetections = zoneMap[zoneId].detections
    const zoneSprays = zoneMap[zoneId].sprays

    let totalDelayHours = 0
    let validPairs = 0

    zoneDetections.forEach((d: any) => {
      if (!d.timestamp) return

      const detectionTime = new Date(d.timestamp).getTime()

      const futureSprays = zoneSprays
        .filter(
          (s: any) =>
            new Date(s.timestamp).getTime() >= detectionTime
        )
        .sort(
          (a: any, b: any) =>
            new Date(a.timestamp).getTime() -
            new Date(b.timestamp).getTime()
        )

      if (futureSprays.length === 0) return

      const firstSprayTime =
        new Date(futureSprays[0].timestamp).getTime()

      const delayHours =
        (firstSprayTime - detectionTime) /
        (1000 * 60 * 60)

      if (delayHours >= 0) {
        totalDelayHours += delayHours
        validPairs++
      }
    })

    const avgDelay =
      validPairs === 0
        ? 0
        : totalDelayHours / validPairs

    /* ----- Responsiveness Index ----- */

    const responsivenessIndex =
      Math.max(0, 100 - avgDelay * 2.5)

    /* ----- Logarithmic Spray Efficiency ----- */

    const actualSprays =
      zoneSprays.length

    const logEfficiency =
      100 - Math.log(1 + actualSprays) * 20

    const efficiencyIndex =
      Math.max(40, logEfficiency)

    /* ----- Combined Zone Efficiency Score ----- */

    const zoneEfficiency =
      responsivenessIndex * 0.6 +
      efficiencyIndex * 0.4

    return {
      zoneId,
      avgDelay,
      responsivenessIndex,
      actualSprays,
      efficiencyIndex,
      zoneEfficiency
    }

  })

  /* ============================================================
     SORT BY LOWEST EFFICIENCY (Weak Zones First)
  ============================================================ */

  zoneDelayAnalytics.sort(
    (a, b) =>
      a.zoneEfficiency -
      b.zoneEfficiency
  )

  /* ============================================================
     PREPARE CHART DATA
  ============================================================ */

  const efficiencyChartData =
    zoneDelayAnalytics.map((z) => ({
      zone: z.zoneId,
      efficiency: Number(
        z.zoneEfficiency.toFixed(1)
      )
    }))

  /* ============================================================
     RETURN UI
  ============================================================ */

  return (
    <Card className="border-green-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-green-700">
          Zone Delay & Efficiency Modeling
        </CardTitle>
        <CardDescription>
          Response delay pairing and logarithmic spray efficiency scoring
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">

        {/* EFFICIENCY CHART */}

        {efficiencyChartData.length > 0 && (
          <div>
            <div className="font-semibold mb-2">
              Zone Efficiency Ranking
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={efficiencyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="zone" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="efficiency"
                  fill="#15803d"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ZONE DETAILS */}

        <div className="space-y-4">

          {zoneDelayAnalytics.map((zone) => (
            <Card key={zone.zoneId} className="bg-green-50">
              <CardContent className="p-4 grid md:grid-cols-5 gap-4 text-sm">

                <div>
                  <div className="font-semibold">
                    Zone
                  </div>
                  <div>{zone.zoneId}</div>
                </div>

                <div>
                  <div className="font-semibold">
                    Avg Delay (hrs)
                  </div>
                  <div>
                    {zone.avgDelay.toFixed(1)}
                  </div>
                </div>

                <div>
                  <div className="font-semibold">
                    Responsiveness
                  </div>
                  <div>
                    {zone.responsivenessIndex.toFixed(1)}%
                  </div>
                </div>

                <div>
                  <div className="font-semibold">
                    Spray Count
                  </div>
                  <div>
                    {zone.actualSprays}
                  </div>
                </div>

                <div>
                  <div className="font-semibold">
                    Efficiency Score
                  </div>
                  <div>
                    {zone.zoneEfficiency.toFixed(1)}%
                  </div>
                </div>

              </CardContent>
            </Card>
          ))}

        </div>

      </CardContent>
    </Card>
  )

})()}
            </div>
          </TabsContent>

          {/* TAB 3*/}
          <TabsContent value="spraying">
            <div className="space-y-6">
             {/* ================= SECTION 3A – PRECISION & OVERSPRAY MODELING ================= */}

{(() => {

  const detections = historyData?.detections || []
  const sprays = historyData?.sprays || []

  let high = 0
  let medium = 0
  let low = 0

  detections.forEach((d: any) => {
    if (d.severityLevel === "high") high++
    else if (d.severityLevel === "medium") medium++
    else if (d.severityLevel === "low") low++
  })

  const totalDetections = high + medium + low
  const totalSprays = sprays.length

  /* ============================================================
     REQUIRED SPRAY MODEL (FRONTEND)
  ============================================================ */

  const requiredSprays =
    high * 1 + medium * 0.7

  /* ============================================================
     PRECISION INDEX
  ============================================================ */

  const precision =
    totalSprays === 0
      ? 0
      : requiredSprays / totalSprays

  const precisionIndex =
    Math.max(0, Math.min(100, precision * 100))

  /* ============================================================
     OVERSPRAY PERCENTAGE
  ============================================================ */

  const overSprayPercent =
    requiredSprays === 0
      ? 0
      : Math.max(
          0,
          ((totalSprays - requiredSprays) /
            requiredSprays) *
            100
        )

  const oversprayIndex =
    Math.max(0, 100 - overSprayPercent)

  /* ============================================================
     UNDER-SPRAY MODEL
  ============================================================ */

  const underSprayPercent =
    totalSprays === 0
      ? 100
      : requiredSprays > totalSprays
        ? ((requiredSprays - totalSprays) /
           requiredSprays) * 100
        : 0

  const underSprayIndex =
    Math.max(0, 100 - underSprayPercent)

  /* ============================================================
     INTERVENTION EFFECTIVENESS SCORE
  ============================================================ */

  const interventionScore =
    precisionIndex * 0.5 +
    oversprayIndex * 0.3 +
    underSprayIndex * 0.2

  const finalInterventionScore =
    Math.max(40, Math.min(100, interventionScore))

  /* ============================================================
     DISTRIBUTION DATA FOR CHART
  ============================================================ */

  const sprayComparisonData = [
    {
      name: "Sprays",
      Required: Number(requiredSprays.toFixed(1)),
      Actual: totalSprays,
    }
  ]

  /* ============================================================
     RETURN UI
  ============================================================ */

  return (
    <Card className="border-green-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-green-700">
          Precision & Overspray Intelligence
        </CardTitle>
        <CardDescription>
          Frontend-computed intervention accuracy and spray deviation modeling
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">

        {/* ===== INTERVENTION SCORE ===== */}

        <div className="text-center space-y-3">
          <div className="text-4xl font-bold text-green-700">
            {finalInterventionScore.toFixed(1)}%
          </div>
          <div className="text-muted-foreground">
            Intervention Effectiveness Score
          </div>
          <Progress value={finalInterventionScore} />
        </div>

        {/* ===== METRICS GRID ===== */}

        <div className="grid md:grid-cols-3 gap-4">

          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle>Precision</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-bold text-green-700">
              {precisionIndex.toFixed(1)}%
            </CardContent>
          </Card>

          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle>Overspray</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-bold text-green-700">
              {overSprayPercent.toFixed(1)}%
            </CardContent>
          </Card>

          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle>Under-Spray</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-bold text-green-700">
              {underSprayPercent.toFixed(1)}%
            </CardContent>
          </Card>

        </div>

        {/* ===== REQUIRED VS ACTUAL CHART ===== */}

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sprayComparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Required" fill="#84cc16" />
            <Bar dataKey="Actual" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>

      </CardContent>
    </Card>
  )

})()}
              {/* ================= SECTION 3B – LOG EFFICIENCY & RESOURCE MODELING ================= */}

{(() => {

  const detections = historyData?.detections || []
  const sprays = historyData?.sprays || []

  let high = 0
  let medium = 0
  let low = 0

  detections.forEach((d: any) => {
    if (d.severityLevel === "high") high++
    else if (d.severityLevel === "medium") medium++
    else if (d.severityLevel === "low") low++
  })

  const totalDetections = high + medium + low
  const totalSprays = sprays.length

  /* ============================================================
     WATER MODEL (FRONTEND RECOMPUTED)
  ============================================================ */

  const waterPerSpray = 15

  const manualWaterUsage =
    totalDetections * waterPerSpray

  const aiWaterUsage =
    totalSprays * waterPerSpray

  const waterSaved =
    manualWaterUsage - aiWaterUsage

  const waterReductionPercent =
    manualWaterUsage === 0
      ? 0
      : (waterSaved / manualWaterUsage) * 100

  const waterEfficiencyIndex =
    Math.max(0, Math.min(100, waterReductionPercent))

  /* ============================================================
     LOGARITHMIC SPRAY LOAD PENALTY
  ============================================================ */

  const logPenalty =
    100 - Math.log(1 + totalSprays) * 25

  const logEfficiencyIndex =
    Math.max(40, logPenalty)

  /* ============================================================
     SPRAY LOAD INDEX
  ============================================================ */

  const sprayLoadIndex =
    totalDetections === 0
      ? 0
      : (totalSprays / totalDetections) * 100

  /* ============================================================
     RESOURCE OPTIMIZATION SCORE
  ============================================================ */

  const resourceScore =
    waterEfficiencyIndex * 0.4 +
    logEfficiencyIndex * 0.4 +
    (100 - sprayLoadIndex) * 0.2

  const finalResourceScore =
    Math.max(40, Math.min(100, resourceScore))

  /* ============================================================
     EFFICIENCY CURVE DATA
  ============================================================ */

  const efficiencyCurve = Array.from({ length: 15 }, (_, i) => {
    const spraysSimulated = i
    return {
      sprays: spraysSimulated,
      efficiency:
        100 - Math.log(1 + spraysSimulated) * 25
    }
  })

  /* ============================================================
     RETURN UI
  ============================================================ */

  return (
    <Card className="border-green-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-green-700">
          Resource Optimization & Log Efficiency
        </CardTitle>
        <CardDescription>
          Water savings modeling and logarithmic spray penalty intelligence
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">

        {/* RESOURCE SCORE */}

        <div className="text-center space-y-3">
          <div className="text-4xl font-bold text-green-700">
            {finalResourceScore.toFixed(1)}%
          </div>
          <div className="text-muted-foreground">
            Resource Optimization Score
          </div>
          <Progress value={finalResourceScore} />
        </div>

        {/* METRICS GRID */}

        <div className="grid md:grid-cols-3 gap-4">

          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle>Water Saved</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-bold text-green-700">
              {waterSaved.toFixed(1)} L
            </CardContent>
          </Card>

          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle>Water Reduction</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-bold text-green-700">
              {waterReductionPercent.toFixed(1)}%
            </CardContent>
          </Card>

          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle>Log Efficiency</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-bold text-green-700">
              {logEfficiencyIndex.toFixed(1)}%
            </CardContent>
          </Card>

        </div>

        {/* LOG CURVE CHART */}

        <div>
          <div className="font-semibold mb-2">
            Logarithmic Efficiency Curve
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={efficiencyCurve}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sprays" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="efficiency"
                stroke="#15803d"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </CardContent>
    </Card>
  )

})()}
            </div>
          </TabsContent>

          {/* TAB 4 */}
          <TabsContent value="disease">
            <div className="space-y-6">
              {/* ================= SECTION 4A – EPIDEMIOLOGY ENGINE ================= */}

{(() => {

  const detections = historyData?.detections || []

  /* ============================================================
     DISEASE FREQUENCY MAP
  ============================================================ */

  const diseaseMap: Record<string, any> = {}

  detections.forEach((d: any) => {
    const name =
      d.diseaseName || d.disease || "Unknown"

    if (!diseaseMap[name]) {
      diseaseMap[name] = {
        count: 0,
        high: 0,
        medium: 0,
        low: 0
      }
    }

    diseaseMap[name].count++

    if (d.severityLevel === "high")
      diseaseMap[name].high++
    else if (d.severityLevel === "medium")
      diseaseMap[name].medium++
    else if (d.severityLevel === "low")
      diseaseMap[name].low++
  })

  const totalDetections = detections.length || 1

  /* ============================================================
     DISEASE INTELLIGENCE MODEL
  ============================================================ */

  const diseaseAnalytics = Object.keys(diseaseMap).map((name) => {

    const data = diseaseMap[name]

    const weightedImpact =
      (data.high * 3 +
       data.medium * 2 +
       data.low * 1) /
      (data.count * 3)

    const dominanceIndex =
      (data.count / totalDetections) * 100

    const severityIntensity =
      weightedImpact * 100

    const compositeRisk =
      dominanceIndex * 0.6 +
      severityIntensity * 0.4

    return {
      name,
      count: data.count,
      high: data.high,
      medium: data.medium,
      low: data.low,
      dominanceIndex,
      severityIntensity,
      compositeRisk
    }

  })

  /* ============================================================
     SORT BY COMPOSITE RISK
  ============================================================ */

  diseaseAnalytics.sort(
    (a, b) =>
      b.compositeRisk -
      a.compositeRisk
  )

  /* ============================================================
     CHART DATA
  ============================================================ */

  const diseaseChartData =
    diseaseAnalytics.map((d) => ({
      name: d.name,
      risk: Number(d.compositeRisk.toFixed(1))
    }))

  /* ============================================================
     MOST DOMINANT DISEASE
  ============================================================ */

  const dominantDisease =
    diseaseAnalytics.length > 0
      ? diseaseAnalytics[0].name
      : "No Data"

  /* ============================================================
     GLOBAL DISEASE PRESSURE INDEX
  ============================================================ */

  const globalDiseasePressure =
    diseaseAnalytics.length === 0
      ? 0
      : diseaseAnalytics.reduce(
          (sum, d) =>
            sum + d.compositeRisk,
          0
        ) / diseaseAnalytics.length

  /* ============================================================
     RETURN UI
  ============================================================ */

  return (
    <Card className="border-green-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-green-700">
          Epidemiology Intelligence Engine
        </CardTitle>
        <CardDescription>
          Disease dominance, severity weighting and composite risk modeling
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">

        {/* GLOBAL PRESSURE */}

        <div className="text-center space-y-2">
          <div className="text-4xl font-bold text-green-700">
            {globalDiseasePressure.toFixed(1)}%
          </div>
          <div className="text-muted-foreground">
            Global Disease Pressure
          </div>
          <Progress value={globalDiseasePressure} />
        </div>

        {/* DOMINANT DISEASE */}

        <Card className="bg-green-50">
          <CardHeader>
            <CardTitle>
              Dominant Disease
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-bold text-green-700">
            {dominantDisease}
          </CardContent>
        </Card>

        {/* RISK CHART */}

        {diseaseChartData.length > 0 && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={diseaseChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="risk"
                fill="#15803d"
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* DISEASE TABLE */}

        <div className="space-y-3">

          {diseaseAnalytics.map((disease) => (
            <Card key={disease.name} className="bg-green-50">
              <CardContent className="p-4 grid md:grid-cols-5 gap-4 text-sm">

                <div>
                  <div className="font-semibold">
                    Disease
                  </div>
                  <div>{disease.name}</div>
                </div>

                <div>
                  <div className="font-semibold">
                    Cases
                  </div>
                  <div>{disease.count}</div>
                </div>

                <div>
                  <div className="font-semibold">
                    Dominance
                  </div>
                  <div>
                    {disease.dominanceIndex.toFixed(1)}%
                  </div>
                </div>

                <div>
                  <div className="font-semibold">
                    Severity Intensity
                  </div>
                  <div>
                    {disease.severityIntensity.toFixed(1)}%
                  </div>
                </div>

                <div>
                  <div className="font-semibold">
                    Composite Risk
                  </div>
                  <div>
                    {disease.compositeRisk.toFixed(1)}%
                  </div>
                </div>

              </CardContent>
            </Card>
          ))}

        </div>

      </CardContent>
    </Card>
  )

})()}
              {/* ================= SECTION 4B – SPREAD & OUTBREAK INTELLIGENCE ================= */}

{(() => {

  const detections = historyData?.detections || []

  if (!detections.length) return null

  /* ============================================================
     GROUP BY DATE
  ============================================================ */

  const dateMap: Record<string, number> = {}

  detections.forEach((d: any) => {
    if (!d.timestamp) return

    const date = new Date(d.timestamp)
      .toISOString()
      .split("T")[0]

    dateMap[date] = (dateMap[date] || 0) + 1
  })

  const sortedDates = Object.keys(dateMap).sort()

  const timeSeries = sortedDates.map((date) => ({
    date,
    cases: dateMap[date],
  }))

  /* ============================================================
     OUTBREAK ACCELERATION MODEL
  ============================================================ */

  let accelerationScore = 0

  for (let i = 1; i < sortedDates.length; i++) {
    const prev = dateMap[sortedDates[i - 1]]
    const curr = dateMap[sortedDates[i]]

    if (curr > prev) {
      accelerationScore += (curr - prev)
    }
  }

  const outbreakAccelerationIndex =
    Math.min(100, accelerationScore * 5)

  /* ============================================================
     SPREAD VELOCITY INDEX
  ============================================================ */

  const totalDays = sortedDates.length || 1
  const totalCases = detections.length

  const avgCasesPerDay =
    totalCases / totalDays

  const spreadVelocityIndex =
    Math.min(100, avgCasesPerDay * 10)

  /* ============================================================
     EARLY WARNING SCORE
  ============================================================ */

  const highCases = detections.filter(
    (d: any) => d.severityLevel === "high"
  ).length

  const highRatio =
    totalCases === 0
      ? 0
      : highCases / totalCases

  const earlyWarningScore =
    Math.min(
      100,
      highRatio * 60 +
      outbreakAccelerationIndex * 0.4
    )

  /* ============================================================
     GLOBAL OUTBREAK RISK
  ============================================================ */

  const outbreakRiskIndex =
    outbreakAccelerationIndex * 0.4 +
    spreadVelocityIndex * 0.3 +
    earlyWarningScore * 0.3

  /* ============================================================
     RETURN UI
  ============================================================ */

  return (
    <Card className="border-green-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-green-700">
          Outbreak & Spread Intelligence
        </CardTitle>
        <CardDescription>
          Temporal disease growth, velocity modeling and early warning detection
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">

        {/* OUTBREAK RISK SCORE */}

        <div className="text-center space-y-3">
          <div className="text-4xl font-bold text-green-700">
            {outbreakRiskIndex.toFixed(1)}%
          </div>
          <div className="text-muted-foreground">
            Outbreak Risk Index
          </div>
          <Progress value={outbreakRiskIndex} />
        </div>

        {/* METRICS GRID */}

        <div className="grid md:grid-cols-3 gap-4">

          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle>Acceleration</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-bold text-green-700">
              {outbreakAccelerationIndex.toFixed(1)}%
            </CardContent>
          </Card>

          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle>Spread Velocity</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-bold text-green-700">
              {spreadVelocityIndex.toFixed(1)}%
            </CardContent>
          </Card>

          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle>Early Warning</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-bold text-green-700">
              {earlyWarningScore.toFixed(1)}%
            </CardContent>
          </Card>

        </div>

        {/* CASE TREND CHART */}

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={timeSeries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="cases"
              stroke="#15803d"
              fill="#bbf7d0"
            />
          </AreaChart>
        </ResponsiveContainer>

      </CardContent>
    </Card>
  )

})()}
            </div>
          </TabsContent>

          {/* TAB 5 */}
          <TabsContent value="impact">
            <div className="space-y-6">
              {/* ================= SECTION 5A – AI IMPACT MODELING ================= */}

{(() => {

  const detections = historyData?.detections || []
  const sprays = historyData?.sprays || []

  let high = 0
  let medium = 0
  let low = 0

  detections.forEach((d: any) => {
    if (d.severityLevel === "high") high++
    else if (d.severityLevel === "medium") medium++
    else if (d.severityLevel === "low") low++
  })

  const total = high + medium + low || 1
  const totalSprays = sprays.length

  /* ============================================================
     MANUAL RISK MODEL (NO AI OPTIMIZATION)
  ============================================================ */

  const manualRisk =
    (high * 6 + medium * 4 + low * 2) /
    (total * 6)

  const aiRisk =
    (high * 6 + medium * 3 + low * 1) /
    (total * 6)

  const riskReductionPercent =
    (manualRisk - aiRisk) * 100

  /* ============================================================
     WATER SAVINGS MODEL
  ============================================================ */

  const waterPerSpray = 15

  const manualWater =
    total * waterPerSpray

  const aiWater =
    totalSprays * waterPerSpray

  const waterSaved =
    manualWater - aiWater

  const waterSavedPercent =
    manualWater === 0
      ? 0
      : (waterSaved / manualWater) * 100

  /* ============================================================
     YIELD PRESERVATION MODEL
  ============================================================ */

  const manualYieldLoss =
    manualRisk * 60

  const aiYieldLoss =
    aiRisk * 40

  const yieldImprovement =
    manualYieldLoss - aiYieldLoss

  /* ============================================================
     AI PERFORMANCE MULTIPLIER
  ============================================================ */

  const aiMultiplier =
    riskReductionPercent * 0.4 +
    waterSavedPercent * 0.3 +
    yieldImprovement * 0.3

  const aiImpactScore =
    Math.max(40, Math.min(100, aiMultiplier))

  /* ============================================================
     COMPARISON DATA FOR CHART
  ============================================================ */

  const comparisonData = [
    {
      name: "Risk %",
      Manual: +(manualRisk * 100).toFixed(1),
      AI: +(aiRisk * 100).toFixed(1),
    },
    {
      name: "Water L",
      Manual: +manualWater.toFixed(1),
      AI: +aiWater.toFixed(1),
    },
    {
      name: "Yield Loss %",
      Manual: +manualYieldLoss.toFixed(1),
      AI: +aiYieldLoss.toFixed(1),
    },
  ]

  /* ============================================================
     RETURN UI
  ============================================================ */

  return (
    <Card className="border-green-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-green-700">
          AI Impact Modeling Engine
        </CardTitle>
        <CardDescription>
          Comparative modeling of manual farming vs AI-driven intervention
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">

        {/* AI IMPACT SCORE */}

        <div className="text-center space-y-3">
          <div className="text-4xl font-bold text-green-700">
            {aiImpactScore.toFixed(1)}%
          </div>
          <div className="text-muted-foreground">
            AI Impact Score
          </div>
          <Progress value={aiImpactScore} />
        </div>

        {/* METRICS GRID */}

        <div className="grid md:grid-cols-3 gap-4">

          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle>Risk Reduction</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-bold text-green-700">
              {riskReductionPercent.toFixed(1)}%
            </CardContent>
          </Card>

          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle>Water Saved</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-bold text-green-700">
              {waterSaved.toFixed(1)} L
            </CardContent>
          </Card>

          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle>Yield Improvement</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-bold text-green-700">
              {yieldImprovement.toFixed(1)}%
            </CardContent>
          </Card>

        </div>

        {/* COMPARISON CHART */}

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Manual" fill="#ef4444" />
            <Bar dataKey="AI" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>

      </CardContent>
    </Card>
  )

})()}
              {/* ================= SECTION 5A – AI IMPACT MODELING ================= */}

{(() => {

  const detections = historyData?.detections || []
  const sprays = historyData?.sprays || []

  let high = 0
  let medium = 0
  let low = 0

  detections.forEach((d: any) => {
    if (d.severityLevel === "high") high++
    else if (d.severityLevel === "medium") medium++
    else if (d.severityLevel === "low") low++
  })

  const total = high + medium + low || 1
  const totalSprays = sprays.length

  /* ============================================================
     MANUAL RISK MODEL (NO AI OPTIMIZATION)
  ============================================================ */

  const manualRisk =
    (high * 6 + medium * 4 + low * 2) /
    (total * 6)

  const aiRisk =
    (high * 6 + medium * 3 + low * 1) /
    (total * 6)

  const riskReductionPercent =
    (manualRisk - aiRisk) * 100

  /* ============================================================
     WATER SAVINGS MODEL
  ============================================================ */

  const waterPerSpray = 15

  const manualWater =
    total * waterPerSpray

  const aiWater =
    totalSprays * waterPerSpray

  const waterSaved =
    manualWater - aiWater

  const waterSavedPercent =
    manualWater === 0
      ? 0
      : (waterSaved / manualWater) * 100

  /* ============================================================
     YIELD PRESERVATION MODEL
  ============================================================ */

  const manualYieldLoss =
    manualRisk * 60

  const aiYieldLoss =
    aiRisk * 40

  const yieldImprovement =
    manualYieldLoss - aiYieldLoss

  /* ============================================================
     AI PERFORMANCE MULTIPLIER
  ============================================================ */

  const aiMultiplier =
    riskReductionPercent * 0.4 +
    waterSavedPercent * 0.3 +
    yieldImprovement * 0.3

  const aiImpactScore =
    Math.max(40, Math.min(100, aiMultiplier))

  /* ============================================================
     COMPARISON DATA FOR CHART
  ============================================================ */

  const comparisonData = [
    {
      name: "Risk %",
      Manual: +(manualRisk * 100).toFixed(1),
      AI: +(aiRisk * 100).toFixed(1),
    },
    {
      name: "Water L",
      Manual: +manualWater.toFixed(1),
      AI: +aiWater.toFixed(1),
    },
    {
      name: "Yield Loss %",
      Manual: +manualYieldLoss.toFixed(1),
      AI: +aiYieldLoss.toFixed(1),
    },
  ]

  /* ============================================================
     RETURN UI
  ============================================================ */

  return (
    <Card className="border-green-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-green-700">
          AI Impact Modeling Engine
        </CardTitle>
        <CardDescription>
          Comparative modeling of manual farming vs AI-driven intervention
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">

        {/* AI IMPACT SCORE */}

        <div className="text-center space-y-3">
          <div className="text-4xl font-bold text-green-700">
            {aiImpactScore.toFixed(1)}%
          </div>
          <div className="text-muted-foreground">
            AI Impact Score
          </div>
          <Progress value={aiImpactScore} />
        </div>

        {/* METRICS GRID */}

        <div className="grid md:grid-cols-3 gap-4">

          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle>Risk Reduction</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-bold text-green-700">
              {riskReductionPercent.toFixed(1)}%
            </CardContent>
          </Card>

          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle>Water Saved</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-bold text-green-700">
              {waterSaved.toFixed(1)} L
            </CardContent>
          </Card>

          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle>Yield Improvement</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-bold text-green-700">
              {yieldImprovement.toFixed(1)}%
            </CardContent>
          </Card>

        </div>

        {/* COMPARISON CHART */}

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Manual" fill="#ef4444" />
            <Bar dataKey="AI" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>

      </CardContent>
    </Card>
  )

})()}
            </div>
          </TabsContent>

        </Tabs>

      </div>
    </div>
  )
}