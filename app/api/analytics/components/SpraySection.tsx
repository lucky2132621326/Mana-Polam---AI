import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function SpraySection({ analytics }: any) {

  const zoneData = Object.entries(analytics.zoneBreakdown).map(
    ([zone, data]: any) => ({
      zone,
      sprays: data.sprays,
      efficiency: Math.max(60, 100 - data.sprays * 5)
    })
  )

  return (
    <div className="border rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">
        Spraying Efficiency by Zone
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={zoneData}>
          <XAxis dataKey="zone" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="efficiency" fill="#16a34a" />
        </BarChart>
      </ResponsiveContainer>

      <div className="text-xs text-muted-foreground mt-3">
        Efficiency = 100 - (sprays × 5%) | Minimum floor = 60%
      </div>
    </div>
  )
}