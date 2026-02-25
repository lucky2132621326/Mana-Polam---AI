"use client"

import { useState } from "react"
import { diseaseKnowledge } from "@/app/data/diseaseKnowledge"
import { pesticideDatabase } from "@/app/data/pesticideDatabase"
import { addDetectionLog } from "@/app/lib/mlLogStore"
import { useFarmStore } from "@/store/farmStore"
import { toast } from "sonner"

export default function DetectionPage() {
  const addDetection = useFarmStore((state) => state.addDetection)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [zone, setZone] = useState("A1")
  const [showDetails, setShowDetails] = useState(false)
  const [logAdded, setLogAdded] = useState(false)

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append("zoneId", zone)
    formData.append("file", file)

    setLoading(true)
    setShowDetails(false)
    setLogAdded(false)

    try {
      // ✅ CALL NEXT.JS BACKEND (NOT FLASK DIRECTLY)
      const response = await fetch("/api/hardwareDetect", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        const severityStr = data.detection.severityLevel.charAt(0).toUpperCase() + data.detection.severityLevel.slice(1)
        const recommended = pesticideDatabase.filter((p) => p.approvedFor.includes(data.detection.disease))[0]

        addDetection({
          plantType: data.detection.disease.split("___")[0].replace(/_/g, " "),
          diseaseName: data.detection.disease.split("___")[1]?.replace(/_/g, " ") || "Healthy",
          severity: severityStr as any,
          infectedZoneId: zone,
          pesticideName: recommended?.chemicalName || "Organic Neem Oil",
          pesticideCategory: (recommended?.type as any) || "Viral Control",
          dosagePerLiter: 2.5, // Defaulting as per common practice if not in DB
          coveragePerLiter: 100, // Square meters per liter (assumption)
          sprayInterval: recommended?.sprayInterval || "7-10 days",
          preHarvestDays: parseInt(recommended?.preHarvestInterval) || 14,
          createdAt: Date.now()
        })

        setResult({
          disease: data.detection.disease,
          confidence: data.detection.confidence,
          severityLevel: data.detection.severityLevel,
        })
        
        toast.success(`Analysis complete for Zone ${zone}`)
      }
    } catch (error) {
      console.error("Hardware detect error:", error)
    }

    setLoading(false)
  }

  const formattedDisease = result?.disease
    ? result.disease.replace(/___/g, " - ").replace(/_/g, " ")
    : null

  const knowledge =
    result?.disease && diseaseKnowledge[result.disease]
      ? diseaseKnowledge[result.disease]
      : null

  const severity =
    result?.severityLevel
      ? result.severityLevel.charAt(0).toUpperCase() +
        result.severityLevel.slice(1)
      : null

  const recommendedPesticides =
    result?.disease
      ? pesticideDatabase.filter((p) =>
          p.approvedFor.includes(result.disease)
        )
      : []

  if (result && severity && !logAdded) {
    addDetectionLog({
      zone,
      disease: result.disease,
      confidence: result.confidence,
      severity,
      timestamp: Date.now(),
    })
    setLogAdded(true)
  }

  const organicSuggestions = [
    "Neem Oil (3-5 ml per liter of water)",
    "Trichoderma-based biological fungicide",
    "Baking soda solution (5g per liter) for fungal control",
    "Encourage Integrated Pest Management (IPM)"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 p-10">
      <div className="max-w-6xl mx-auto space-y-10">

        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-800">
            🌿 AI Disease Detection
          </h1>
          <p className="text-green-700 mt-2">
            Intelligent crop health monitoring and treatment planning
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-green-200">
          <div className="flex flex-col md:flex-row gap-8 items-center">

            <div className="w-72 h-72 flex items-center justify-center border-2 border-green-200 rounded-xl bg-white">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="object-contain max-h-full"
                />
              ) : (
                <span className="text-green-600 text-sm">
                  Leaf Image Preview
                </span>
              )}
            </div>

            <div className="space-y-4 w-full">
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
              />

              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="border border-green-300 rounded-lg px-3 py-2 w-full"
              >
                {["A1","A2","A3","A4","A5","A6","B1","B2","B3","B4","B5","B6","C1","C2","C3","C4","C5","C6","D1","D2","D3","D4","D5","D6"].map(z => (
                  <option key={z} value={z}>Zone {z}</option>
                ))}
              </select>

              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg w-full"
              >
                {loading ? "Analyzing..." : "Analyze Leaf"}
              </button>
            </div>
          </div>
        </div>

        {result && (
          <div className="bg-white p-10 rounded-2xl shadow-xl border-l-8 border-green-600">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-green-800">
                Analysis Complete
              </h2>
              <p className="text-green-600 mt-2">
                AI-generated crop health insights
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10">

              <div className="flex justify-center">
                {preview && (
                  <img
                    src={preview}
                    alt="Uploaded"
                    className="w-80 h-80 object-contain rounded-xl border border-green-200"
                  />
                )}
              </div>

              <div className="space-y-5">

                <div className="text-center">
                  {severity === "High" || severity === "Moderate" ? (
                    <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold">
                      ⚠ Disease Detected
                    </span>
                  ) : (
                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                      ✓ Healthy Plant
                    </span>
                  )}
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p><strong>Plant:</strong> {formattedDisease?.split(" - ")[0]}</p>
                  <p><strong>Condition:</strong> {formattedDisease?.split(" - ")[1]}</p>
                  <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%</p>
                  <p><strong>Severity:</strong> {severity}</p>
                </div>

                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full bg-green-100 text-green-800 py-2 rounded-lg hover:bg-green-200"
                >
                  {showDetails ? "Hide Detailed Report" : "View Detailed Treatment Plan"}
                </button>

                {showDetails && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">
                        Recommended Chemical Treatment
                      </h3>

                      {recommendedPesticides.length > 0 ? (
                        recommendedPesticides.map((p, i) => (
                          <div key={i} className="bg-white border border-green-200 p-4 rounded-lg mt-3">
                            <p><strong>Name:</strong> {p.chemicalName}</p>
                            <p><strong>Type:</strong> {p.type}</p>
                            <p><strong>Dosage:</strong> {p.dosage}</p>
                            <p><strong>Spray Interval:</strong> {p.sprayInterval}</p>
                            <p><strong>Pre-Harvest:</strong> {p.preHarvestInterval}</p>
                            <p className="text-red-600 text-sm mt-2">⚠ {p.safetyNote}</p>
                          </div>
                        ))
                      ) : (
                        <p>No chemical treatment available.</p>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-green-800">
                        Organic Alternative Options
                      </h3>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {organicSuggestions.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}