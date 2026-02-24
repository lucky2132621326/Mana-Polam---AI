"use client"

import { useEffect, useState } from "react"

export default function HistoryPage() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch("/api/history")
      .then(res => res.json())
      .then(setData)
  }, [])

  if (!data) return <div className="p-10">Loading history...</div>

  const { detections, sprays, summary } = data

  return (
    <div className="min-h-screen bg-[#f7fbf4] p-10">
      <h1 className="text-3xl font-bold mb-8 text-[#1e3a23]">
        Detection & Spray Timeline
      </h1>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        <Stat label="Total" value={summary.totalDetections} />
        <Stat label="Active" value={summary.active} />
        <Stat label="Treated" value={summary.treated} />
        <Stat label="Resolved" value={summary.resolved} />
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {detections
          .sort(
            (a: any, b: any) =>
              new Date(b.timestamp).getTime() -
              new Date(a.timestamp).getTime()
          )
          .map((d: any) => {
            const spray = sprays.find(
              (s: any) => s.id === d.linkedSprayId
            )

            const delayHours =
              spray && d.timestamp
                ? (
                    (new Date(spray.timestamp).getTime() -
                      new Date(d.timestamp).getTime()) /
                    3600000
                  ).toFixed(2)
                : null

            return (
              <div
                key={d.id}
                className="bg-white p-6 rounded-xl shadow border border-[#d4e9c8]"
              >
                <div className="flex justify-between mb-2">
                  <h2 className="font-semibold text-lg text-[#1e3a23]">
                    {formatDisease(d.disease)}
                  </h2>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      d.status === "active"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {d.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600">
                  Zone: {d.zoneId}
                </p>

                <p className="text-sm text-gray-600">
                  Confidence: {(d.confidence * 100).toFixed(1)}%
                </p>

                <p className="text-sm text-gray-600">
                  Severity: {d.severityLevel}
                </p>

                <p className="text-sm text-gray-400 mt-2">
                  Detected: {new Date(d.timestamp).toLocaleString()}
                </p>

                {spray && (
                  <>
                    <p className="text-sm text-green-600 mt-2">
                      Sprayed: {new Date(spray.timestamp).toLocaleString()}
                    </p>

                    <p className="text-sm text-blue-600">
                      Response Delay: {delayHours} hrs
                    </p>
                  </>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}

function Stat({ label, value }: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow text-center border border-[#d4e9c8]">
      <div className="text-2xl font-bold text-[#1e3a23]">
        {value}
      </div>
      <div className="text-sm text-gray-600">
        {label}
      </div>
    </div>
  )
}

function formatDisease(name: string) {
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase())
}