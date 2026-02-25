"use client"

import React from "react"
import { useFarmStore } from "@/store/farmStore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Sprout, 
  AlertTriangle, 
  FlaskConical, 
  Clock, 
  Activity, 
  Droplets, 
  Calendar,
  CheckCircle2,
  Info,
  History
} from "lucide-react"

interface ZoneDetailsProps {
  zoneId: string
  onClose?: () => void
}

export default function ZoneDetails({ zoneId, onClose }: ZoneDetailsProps) {
  const { detections, activities } = useFarmStore()

  // 1. Determine Infection Info
  const detection = detections.find(d => d.infectedZoneId === zoneId)
  const isInfected = !!detection
  
  // 2. Filter Spray History for this specific zone
  const zoneActivities = activities.filter(act => act.zones.includes(zoneId))
  const lastSpray = zoneActivities.length > 0 ? zoneActivities[0] : null
  const timesSprayed = zoneActivities.length

  // 3. Determine Status
  let status: "Healthy" | "Infected" | "Sprayed" = "Healthy"
  if (isInfected) status = "Infected"
  else if (lastSpray) status = "Sprayed"

  const getStatusConfig = () => {
    switch (status) {
      case "Infected": 
        return { 
          label: "Infected", 
          color: "bg-red-500", 
          icon: <AlertTriangle className="h-4 w-4" />,
          bgColor: detection?.severity === "High" ? "bg-red-50" : detection?.severity === "Moderate" ? "bg-orange-50" : "bg-yellow-50"
        }
      case "Sprayed": 
        return { 
          label: "Sprayed", 
          color: "bg-blue-500", 
          icon: <CheckCircle2 className="h-4 w-4" />,
          bgColor: "bg-blue-50"
        }
      default: 
        return { 
          label: "Healthy", 
          color: "bg-green-500", 
          icon: <Sprout className="h-4 w-4" />,
          bgColor: "bg-green-50"
        }
    }
  }

  const config = getStatusConfig()

  return (
    <Card className={`border-slate-200 shadow-lg animate-in slide-in-from-right-5 duration-300`}>
      <CardHeader className={`${config.bgColor} border-b border-slate-100 rounded-t-xl`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl ${config.color} flex items-center justify-center text-white shadow-sm`}>
              <span className="font-bold text-lg">{zoneId}</span>
            </div>
            <div>
              <CardTitle className="text-xl">Zone {zoneId} Details</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`${config.color} border-none text-white flex items-center gap-1`}>
                  {config.icon}
                  {config.label}
                </Badge>
                {isInfected && detection && (
                  <Badge variant="outline" className="border-slate-300 bg-white">
                    {detection.severity} Severity
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <Info className="h-5 w-5 rotate-45" />
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* 1. Basic Info Section */}
        <section>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Activity className="h-3 w-3" /> Basic Info
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-lg">
              <p className="text-[10px] text-slate-500 uppercase font-medium">Last Updated</p>
              <p className="text-sm font-semibold text-slate-900">
                {isInfected && detection ? new Date(detection.createdAt).toLocaleTimeString() : "N/A"}
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <p className="text-[10px] text-slate-500 uppercase font-medium">Monitoring</p>
              <p className="text-sm font-semibold text-slate-900 text-green-600">Active</p>
            </div>
          </div>
        </section>

        <Separator className="bg-slate-100" />

        {/* 2. Disease Info Section */}
        <section>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <AlertTriangle className={`h-3 w-3 ${isInfected ? 'text-red-500' : ''}`} /> Disease Info
          </h4>
          {isInfected && detection ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-y-3">
                <div>
                  <p className="text-[11px] text-slate-500">Plant Type</p>
                  <p className="text-sm font-bold text-slate-800">{detection.plantType}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500">Disease Name</p>
                  <p className="text-sm font-bold text-red-600">{detection.diseaseName}</p>
                </div>
              </div>
              
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5"><FlaskConical className="h-3.5 w-3.5" /> Pesticide</span>
                  <span className="font-bold text-slate-900">{detection.pesticideName}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Category</span>
                  <Badge variant="outline" className="text-[10px] font-bold border-slate-200">{detection.pesticideCategory}</Badge>
                </div>
                <div className="flex justify-between items-center text-xs text-blue-600 font-medium pt-2 border-t border-slate-200/60">
                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Optimal Interval</span>
                  <span>{detection.sprayInterval}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic flex items-center gap-2 py-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" /> Zone is currently healthy.
            </p>
          )}
        </section>

        <Separator className="bg-slate-100" />

        {/* 3. Spray History Section */}
        <section>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <History className="h-3 w-3" /> Spray History
          </h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border border-slate-100 rounded-lg text-center">
                <p className="text-[10px] text-slate-400 uppercase">Usage Count</p>
                <p className="text-lg font-black text-slate-800">{timesSprayed}</p>
              </div>
              <div className="p-3 border border-slate-100 rounded-lg text-center">
                <p className="text-[10px] text-slate-400 uppercase">Total Applied</p>
                <p className="text-lg font-black text-blue-600">
                  {zoneActivities.reduce((acc, curr) => acc + curr.totalLiters, 0).toFixed(1)}L
                </p>
              </div>
            </div>

            {lastSpray ? (
              <div className="bg-blue-50/30 border border-blue-100 p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                   <Calendar className="h-4 w-4 text-blue-500" />
                   <p className="text-[11px] font-bold text-blue-800 uppercase">Last Session</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-slate-700">{lastSpray.pesticideName}</p>
                  <p className="text-[10px] text-slate-500">{new Date(lastSpray.timestamp).toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Droplets className="h-3 w-3 text-blue-400" />
                    <span className="text-[11px] font-semibold text-blue-700">{lastSpray.totalLiters} Liters distributed</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 text-center py-2">No historical spray data for this zone.</p>
            )}
          </div>
        </section>
      </CardContent>
    </Card>
  )
}
