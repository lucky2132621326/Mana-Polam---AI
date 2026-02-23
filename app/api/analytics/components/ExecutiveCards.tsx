export default function ExecutiveCards({ analytics }: any) {

  const {
    totalDetections,
    totalSprays,
    severityBreakdown,
    avgConfidence,
    spreadIndex,
    aiMetrics
  } = analytics

  const highRatio =
    totalDetections === 0
      ? 0
      : (severityBreakdown.high / totalDetections) * 100

  const autoSprayRate =
    totalDetections === 0
      ? 0
      : (totalSprays / totalDetections) * 100

  const manualModel = totalDetections * 1.3
  const waterSaved = (manualModel - totalSprays) * 2
  const yieldGain = (1 - spreadIndex) * 20

  const cards = [
    { title: "Detections", value: totalDetections },
    { title: "Sprays", value: totalSprays },
    { title: "High Severity %", value: highRatio.toFixed(1) + "%" },
    { title: "Auto Spray Rate", value: autoSprayRate.toFixed(1) + "%" },
    { title: "Avg ML Confidence", value: avgConfidence.toFixed(1) + "%" },
    { title: "Spread Index", value: spreadIndex.toFixed(2) },
    { title: "Water Saved", value: waterSaved.toFixed(1) + " L" },
    { title: "Yield Gain", value: "+" + yieldGain.toFixed(1) + "%" },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div key={i} className="border rounded-xl p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">{card.title}</p>
          <h2 className="text-2xl font-bold mt-2">{card.value}</h2>
        </div>
      ))}
    </div>
  )
}