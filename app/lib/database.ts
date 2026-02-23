import fs from "fs"
import path from "path"

const dbPath = path.join(process.cwd(), "app/data/db.json")

export function readDB() {
  try {
    const raw = fs.readFileSync(dbPath, "utf-8")
    return JSON.parse(raw)
  } catch (error) {
    const initialData = {
      detections: [],
      sprays: [],
      zoneHistory: []
    }
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2))
    return initialData
  }
}

export function writeDB(data: any) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
}