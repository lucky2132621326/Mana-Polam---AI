"use client"

import { useState } from "react"

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
          <div className="mt-6 bg-white shadow-md border rounded-xl p-6 space-y-4">

            <h2 className="text-lg font-semibold text-gray-800">
              Prediction Result
            </h2>

            <div className="text-sm">
              <strong>Detected Class:</strong> {result.className || result.classIndex}
            </div>

            <div className="text-sm">
              <strong>Confidence:</strong>{" "}
              {(result.confidence * 100).toFixed(2)}%
            </div>

            {/* 🔥 Add This Button Right Here */}
            <div className="pt-4">
              <button
                onClick={() =>
                  window.location.href = `/clinical?disease=${result.className || result.classIndex}`
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                View Clinical & Scientific Details
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}