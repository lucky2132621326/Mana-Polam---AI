import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function DiseaseSection({ analytics }: any) {

  const data = Object.entries(analytics.diseaseFrequency).map(
    ([name, value]) => ({
      name,
      value
    })
  )

  data.sort((a: any, b: any) => b.value - a.value)

  return (
    <div className="border rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">Disease Frequency</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={200} />
          <Tooltip />
          <Bar dataKey="value" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}