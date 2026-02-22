"use client"

import { useState } from "react"
import { diseaseKnowledge } from "@/app/data/diseaseKnowledge"
import { pesticideDatabase } from "@/app/data/pesticideDatabase"
import { getSafePesticideRecommendation } from "@/app/lib/pesticideEngine"


export default function DetectionPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const knowledge =
    result?.disease ? diseaseKnowledge[result.disease] : undefined;

  const normalize = (str: string) =>
    str
      .toLowerCase()
      .replace(/\s+/g, "_")   // convert spaces to underscores
      .replace(/_+/g, "_")    // collapse multiple underscores
      .trim()


const recommendation = result?.disease
  ? getSafePesticideRecommendation(result.disease, result.confidence)
  : null

const recommendedPesticides = recommendation?.pesticides || []
const warningMessage = recommendation?.warning

  console.log("Detected disease:", result?.disease);
  console.log("Approved list:", pesticideDatabase.map(p => p.approvedFor));
  console.log("Matched pesticides:", recommendedPesticides);

  const severity =
    knowledge && result
      ? result.confidence >= knowledge.severityThresholds.moderate
        ? "high"
        : result.confidence >= knowledge.severityThresholds.low
          ? "moderate"
          : "low"
      : null;

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

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">🌿 AI Disease Detection</h1>
          <p className="text-muted-foreground">
            Upload a leaf image to analyze potential plant diseases.
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
                  Image Preview
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
                {loading ? "Analyzing..." : "Analyze Leaf"}
              </button>
            </div>
          </div>
        </div>

        {/* Result Card */}
        {result && (
          <div className="mt-6 bg-gray-100 p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-3">
              Prediction Result
            </h2>

            <p className="text-lg">
              <span className="font-medium">Detected Disease:</span>{" "}
              {result.disease?.replace(/___/g, " - ").replace(/_/g, " ")}
            </p>

            <p className="mt-2">
              <span className="font-medium">Confidence:</span>{" "}
              {(result.confidence * 100).toFixed(2)}%
            </p>

            <h3 className="mt-4 font-medium">
              Top 3 Predictions:
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

        {/* Pesticide Panel */}
        {recommendedPesticides.length > 0 && (
          <div className="mt-6 p-6 rounded-xl border bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              Government Approved Pesticide Options
            </h2>

            {recommendedPesticides.map((pesticide, index) => (
              <div
                key={index}
                className="mb-4 p-4 rounded-lg bg-gray-50 border"
              >
                <h3 className="font-medium text-lg">
                  {pesticide.chemicalName}
                </h3>

                <p><strong>Type:</strong> {pesticide.type}</p>
                <p><strong>Dosage:</strong> {pesticide.dosage}</p>
                <p><strong>Application:</strong> {pesticide.applicationMethod}</p>
                <p><strong>Spray Interval:</strong> {pesticide.sprayInterval}</p>
                <p><strong>Pre-Harvest Interval:</strong> {pesticide.preHarvestInterval}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  ⚠ {pesticide.safetyNote}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}