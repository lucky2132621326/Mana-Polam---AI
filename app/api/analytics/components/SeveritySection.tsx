export default function SeveritySection({ analytics }: any) {

  const { severityBreakdown, totalDetections } = analytics

  const calculatePercent = (value: number) =>
    totalDetections === 0
      ? 0
      : (value / totalDetections) * 100

  const levels = [
    { name: "Critical", value: severityBreakdown.high, color: "bg-red-500" },
    { name: "Warning", value: severityBreakdown.medium, color: "bg-yellow-500" },
    { name: "Stable", value: severityBreakdown.low, color: "bg-green-500" },
  ]

  return (
    <div className="border rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-bold">Severity Distribution</h2>

      {levels.map((level, i) => (
        <div key={i}>
          <div className="flex justify-between text-sm">
            <span>{level.name}</span>
            <span>
              {level.value} cases ({calculatePercent(level.value).toFixed(1)}%)
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded h-3 mt-1">
            <div
              className={`${level.color} h-3 rounded`}
              style={{
                width: `${calculatePercent(level.value)}%`
              }}
            />
          </div>
        </div>
      ))}

      <div className="text-xs text-muted-foreground mt-4">
        Severity % = (severity count / total detections) × 100
      </div>
    </div>
  )
}