import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface DetectionResult {
  plantType: string
  diseaseName: string
  severity: "Low" | "Moderate" | "High"
  infectedZoneId: string
  pesticideName: string
  pesticideCategory: "Fungicide" | "Bactericide" | "Nematicide" | "Viral Control"
  dosagePerLiter: number
  coveragePerLiter: number
  sprayInterval: string
  preHarvestDays: number
  createdAt: number
}

export interface SprayActivity {
  id: string
  zones: string[]
  pesticideName: string
  totalLiters: number
  timestamp: number
  status: "Completed"
}

interface FarmState {
  detections: DetectionResult[]
  activities: SprayActivity[]
  addDetection: (detection: DetectionResult) => void
  addActivity: (activity: SprayActivity) => void
  clearDetections: () => void
  clearActivities: () => void
}

export const useFarmStore = create<FarmState>()(
  persist(
    (set) => ({
      detections: [],
      activities: [],
      addDetection: (detection) => set((state) => ({ 
        detections: [
          detection, 
          ...state.detections.filter(d => d.infectedZoneId !== detection.infectedZoneId)
        ] 
      })),
      addActivity: (activity) => set((state) => ({ 
        activities: [activity, ...state.activities] 
      })),
      clearDetections: () => set({ detections: [] }),
      clearActivities: () => set({ activities: [] }),
    }),
    {
      name: 'smart-farm-storage',
    }
  )
)
