"use client"

import { useFarmStore } from "@/store/farmStore"

export default function DashboardHome() {
  const { detections } = useFarmStore()
  return (
    <div className="space-y-10">

      <div>
        <h1 className="text-3xl font-bold text-[#1e3a23]">
          Dashboard Overview
        </h1>
        <p className="text-[#5a7a60] mt-2">
          Welcome to Mana Polam Control Center.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-green-50 p-6 rounded-2xl border border-green-100 shadow-sm">
          <h3 className="text-sm text-[#5a7a60]">Active Detections</h3>
          <p className="text-2xl font-bold text-[#1e3a23] mt-2">{detections.length}</p>
        </div>

        <div className="bg-green-50 p-6 rounded-2xl border border-green-100 shadow-sm">
          <h3 className="text-sm text-[#5a7a60]">Monitored Zones</h3>
          <p className="text-2xl font-bold text-[#1e3a23] mt-2">24</p>
        </div>

        <div className="bg-green-50 p-6 rounded-2xl border border-green-100 shadow-sm">
          <h3 className="text-sm text-[#5a7a60]">Spray Efficiency</h3>
          <p className="text-2xl font-bold text-[#1e3a23] mt-2">92%</p>
        </div>

      </div>

    </div>
  )
}