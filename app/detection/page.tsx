"use client";

import { useState } from "react";

export default function DetectionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    console.log("Button clicked");
    console.log("Selected file:", file);
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">🌿 Disease Detection</h1>

<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    console.log("onChange fired");
    console.log("files object:", e.target.files);

    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      console.log("Selected file:", selected);
      setFile(selected);
    } else {
      console.log("No file detected");
    }
  }}
/>
      {file && (
  <p className="text-sm text-green-600">
    Selected: {file.name}
  </p>
)}

      <button
        onClick={handleUpload}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Analyzing..." : "Analyze Leaf"}
      </button>

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h2 className="font-semibold">Prediction Result</h2>
          <p>Class Index: {result.classIndex}</p>
          <p>
            Confidence: {(result.confidence * 100).toFixed(2)}%
          </p>

          <h3 className="mt-3 font-medium">Top 3 Predictions:</h3>
          <ul>
            {result.top3 && result.top3.length > 0 && (
  <>
    <h3 className="mt-3 font-medium">Top 3 Predictions:</h3>
    <ul>
      {result.top3.map((item: any, index: number) => (
        <li key={index}>
          Class {item.classIndex} — {(item.probability * 100).toFixed(2)}%
        </li>
      ))}
    </ul>
  </>
)}
          </ul>
        </div>
      )}
    </div>
  );
}