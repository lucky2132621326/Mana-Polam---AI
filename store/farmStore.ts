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
  detection: DetectionResult | null
  activities: SprayActivity[]
  setDetection: (detection: DetectionResult | null) => void
  addActivity: (activity: SprayActivity) => void
  clearDetection: () => void
  clearActivities: () => void
}

export const useFarmStore = create<FarmState>()(
  persist(
    (set) => ({
      detection: null,
      activities: [],
      setDetection: (detection) => set({ detection }),
      addActivity: (activity) => set((state) => ({ 
        activities: [activity, ...state.activities] 
      })),
      clearDetection: () => set({ detection: null }),
      clearActivities: () => set({ activities: [] }),
    }),
    {
      name: 'smart-farm-storage',
    }
  )
)
