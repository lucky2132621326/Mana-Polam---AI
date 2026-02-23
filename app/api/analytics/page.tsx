"use client"

import { useEffect, useState } from "react"
import ExecutiveCards from "./components/ExecutiveCards"
import SeveritySection from "./components/SeveritySection"
import DiseaseSection from "./components/DiseaseSection"
import SpraySection from "./components/SpraySection"
import ImpactCenter from "./components/ImpactCenter"

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      const res = await fetch("/api/analytics")
      const data = await res.json()
      setAnalytics(data)
    }

    fetchAnalytics()
    const interval = setInterval(fetchAnalytics, 10000)
    return () => clearInterval(interval)
  }, [])

  if (!analytics) return <div className="p-6">Loading analytics...</div>

  return (
    <div className="p-6 space-y-8">

      <ExecutiveCards analytics={analytics} />

      <SeveritySection analytics={analytics} />

      <DiseaseSection analytics={analytics} />

      <SpraySection analytics={analytics} />

      <ImpactCenter analytics={analytics} />

    </div>
  )
}