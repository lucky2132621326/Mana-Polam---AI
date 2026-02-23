export default function ImpactCenter({ analytics }: any) {

  const {
    totalDetections,
    totalSprays,
    spreadIndex,
  } = analytics

  const manualSprayModel = totalDetections * 1.3
  const waterSaved = (manualSprayModel - totalSprays) * 2
  const yieldGain = (1 - spreadIndex) * 20

  return (
    <div className="border rounded-xl p-6 space-y-4">

      <h2 className="text-xl font-bold">AI Impact Center</h2>

      <div className="grid md:grid-cols-3 gap-4">

        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold">Manual Model</h3>
          <p className="text-sm mt-2">
            Manual spraying assumed at 1.3× detection rate.
          </p>
          <p className="font-bold mt-2">
            {manualSprayModel.toFixed(1)} sessions
          </p>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold">Water Saved</h3>
          <p className="text-sm mt-2">
            2L per spray session saved.
          </p>
          <p className="font-bold mt-2">
            {waterSaved.toFixed(1)} Liters
          </p>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold">Yield Gain</h3>
          <p className="text-sm mt-2">
            Modeled inverse to spread index.
          </p>
          <p className="font-bold mt-2">
            +{yieldGain.toFixed(1)}%
          </p>
        </div>

      </div>

      <div className="text-xs text-muted-foreground mt-4">
        Yield Gain = (1 - spreadIndex) × 20
      </div>

    </div>
  )
}