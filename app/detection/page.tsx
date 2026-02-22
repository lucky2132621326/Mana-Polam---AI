"use client"

import { useState } from "react"
import { Trans } from "@/components/language-provider"

export default function DetectionPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    setLoading(true)

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error:", error)
    }

    setLoading(false)
  }

  const severity =
    result?.confidence > 0.75
      ? "High"
      : result?.confidence > 0.45
        ? "Moderate"
        : "Low"

  const severityColor =
    severity === "High"
      ? "bg-red-100 text-red-700"
      : severity === "Moderate"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-green-100 text-green-700"

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">🌿 <Trans en={"AI Disease Detection"} te={"AI రోగ గుర్తింపు"} /></h1>
          <p className="text-muted-foreground">
            <Trans en={"Upload a leaf image to analyze potential plant diseases."} te={"సంభావ్య పంట వ్యాధులను విశ్లేషించడానికి ఆకుల చిత్రాన్ని అప్‌లోడ్ చేయండి."} />
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white p-6 rounded-2xl shadow-md border space-y-6">

          <div className="flex flex-col md:flex-row gap-6 items-center">

            {/* Image Preview */}
            <div className="w-64 h-64 flex items-center justify-center border rounded-xl bg-muted/30">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="object-contain max-h-full"
                />
              ) : (
                <span className="text-muted-foreground text-sm">
                  <Trans en={"Image Preview"} te={"చిత్రం ప్రివ్యూ"} />
                </span>
              )}
            </div>

            {/* Controls */}
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const selected = e.target.files?.[0]
                  if (selected) {
                    setFile(selected)
                    setPreview(URL.createObjectURL(selected))
                  }
                }}
                className="block text-sm"
              />

              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
              >
                {loading ? <Trans en={"Analyzing..."} te={"విశ్లేషిస్తోంది..."} /> : <Trans en={"Analyze Leaf"} te={"ఆకును విశ్లేషించండి"} />}
              </button>
            </div>
          </div>
        </div>

        {/* Result Card */}
        {result && (
  <div className="mt-6 bg-gray-100 p-6 rounded-xl shadow-sm">
    <h2 className="text-xl font-semibold mb-3">
      <Trans en={"Prediction Result"} te={"గణనా ఫలితం"} />
    </h2>

    <p className="text-lg">
      <span className="font-medium"><Trans en={"Detected Disease:"} te={"గుర్తించిన వ్యాధి:"} /></span>{" "}
      {result.disease?.replace(/___/g, " - ").replace(/_/g, " ")}
    </p>

    <p className="mt-2">
      <span className="font-medium"><Trans en={"Confidence:"} te={"నమ్మకం:"} /></span>{" "}
      {(result.confidence * 100).toFixed(2)}%
    </p>

    <h3 className="mt-4 font-medium">
      <Trans en={"Top 3 Predictions:"} te={"Top 3 అంచనాలు:"} />
    </h3>

    <ul className="mt-2 space-y-1">
      {result.top3?.map((item: any, index: number) => (
        <li key={index}>
          {item.disease
            .replace(/___/g, " - ")
            .replace(/_/g, " ")} —{" "}
          {(item.probability * 100).toFixed(2)}%
        </li>
      ))}
    </ul>
  </div>
)}
      </div>
    </div>
  )
}