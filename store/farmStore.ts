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

export interface ImplementationRecord {
  id: string
  title: string
  description: string
  timestamp: string
  zone?: string
  impact: string
}

interface FarmState {
  detections: DetectionResult[]
  activities: SprayActivity[]
  implementedRecords: ImplementationRecord[]
  addDetection: (detection: DetectionResult) => void
  removeDetection: (zoneId: string) => void
  addActivity: (activity: SprayActivity) => void
  addImplementationRecord: (record: ImplementationRecord) => void
  clearDetections: () => void
  clearActivities: () => void
  clearImplementationRecords: () => void
}

export const useFarmStore = create<FarmState>()(
  persist(
    (set) => ({
      detections: [],
      activities: [],
      implementedRecords: [],
      addDetection: (detection) => set((state) => ({ 
        detections: [
          detection, 
          ...state.detections.filter(d => d.infectedZoneId !== detection.infectedZoneId)
        ] 
      })),
      removeDetection: (zoneId) => set((state) => ({
        detections: state.detections.filter(d => d.infectedZoneId !== zoneId)
      })),
      addActivity: (activity) => set((state) => ({ 
        activities: [activity, ...state.activities] 
      })),
      addImplementationRecord: (record) => set((state) => {
        // Prevent duplicate implementation for the same ID/Zone
        const exists = state.implementedRecords.some(r => r.id === record.id);
        if (exists) return state;
        return { implementedRecords: [record, ...state.implementedRecords] };
      }),
      clearDetections: () => set({ detections: [] }),
      clearActivities: () => set({ activities: [] }),
      clearImplementationRecords: () => set({ implementedRecords: [] }),
    }),
    {
      name: 'smart-farm-storage',
    }
  )
)
