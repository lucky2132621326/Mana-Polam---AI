export interface Pesticide {
  chemicalName: string
  type: "Fungicide" | "Bactericide" | "Insecticide" | "Organic"
  approvedFor: string[]
  modeOfAction: string
  resistanceGroup?: string
  dosage: string
  applicationMethod: string
  sprayInterval: string
  preHarvestInterval: string
  safetyNote: string
}

/* 
  PROFESSIONAL AGRONOMIC DATABASE
  Based on common agricultural extension recommendations
  Structured for ML disease matching
*/

export const pesticideDatabase: Pesticide[] = [

  /* ===========================
     🍎 APPLE DISEASES
  =========================== */

  {
    chemicalName: "Captan 50% WP",
    type: "Fungicide",
    approvedFor: ["Apple___Apple_scab"],
    modeOfAction: "Protective contact fungicide",
    resistanceGroup: "FRAC M4",
    dosage: "2 g per liter",
    applicationMethod: "Foliar spray",
    sprayInterval: "7–10 days",
    preHarvestInterval: "7 days",
    safetyNote: "Apply before infection period; avoid during bloom."
  },

  {
    chemicalName: "Thiophanate-Methyl 70% WP",
    type: "Fungicide",
    approvedFor: ["Apple___Black_rot"],
    modeOfAction: "Systemic benzimidazole fungicide",
    resistanceGroup: "FRAC 1",
    dosage: "1 g per liter",
    applicationMethod: "Foliar spray",
    sprayInterval: "10–14 days",
    preHarvestInterval: "14 days",
    safetyNote: "Rotate with non-FRAC 1 fungicides."
  },

  {
    chemicalName: "Myclobutanil 10% WP",
    type: "Fungicide",
    approvedFor: ["Apple___Cedar_apple_rust"],
    modeOfAction: "Systemic DMI fungicide",
    resistanceGroup: "FRAC 3",
    dosage: "0.5 g per liter",
    applicationMethod: "Foliar spray",
    sprayInterval: "14 days",
    preHarvestInterval: "14 days",
    safetyNote: "Do not exceed 3 applications per season."
  },

  /* ===========================
     🌽 CORN (MAIZE)
  =========================== */

  {
    chemicalName: "Propiconazole 25% EC",
    type: "Fungicide",
    approvedFor: [
      "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
      "Corn_(maize)___Northern_Leaf_Blight",
      "Corn_(maize)___Common_rust"
    ],
    modeOfAction: "Systemic triazole fungicide",
    resistanceGroup: "FRAC 3",
    dosage: "1 ml per liter",
    applicationMethod: "Foliar spray at VT stage",
    sprayInterval: "10–14 days",
    preHarvestInterval: "14 days",
    safetyNote: "Avoid repeated solo applications."
  },

  {
    chemicalName: "Azoxystrobin 23% SC",
    type: "Fungicide",
    approvedFor: [
      "Corn_(maize)___Northern_Leaf_Blight",
      "Corn_(maize)___Common_rust"
    ],
    modeOfAction: "QoI fungicide",
    resistanceGroup: "FRAC 11",
    dosage: "1 ml per liter",
    applicationMethod: "Foliar spray",
    sprayInterval: "10 days",
    preHarvestInterval: "14 days",
    safetyNote: "Limit to 2 sequential sprays."
  },

  /* ===========================
     🍇 GRAPE
  =========================== */

  {
    chemicalName: "Mancozeb 75% WP",
    type: "Fungicide",
    approvedFor: [
      "Grape___Black_rot",
      "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)"
    ],
    modeOfAction: "Contact multi-site fungicide",
    resistanceGroup: "FRAC M3",
    dosage: "2.5 g per liter",
    applicationMethod: "Foliar spray",
    sprayInterval: "7–10 days",
    preHarvestInterval: "7 days",
    safetyNote: "Do not mix with alkaline pesticides."
  },

  {
    chemicalName: "Azoxystrobin",
    type: "Fungicide",
    approvedFor: ["Grape___Esca_(Black_Measles)"],
    modeOfAction: "Systemic QoI fungicide",
    resistanceGroup: "FRAC 11",
    dosage: "1 ml per liter",
    applicationMethod: "Foliar spray",
    sprayInterval: "10–14 days",
    preHarvestInterval: "14 days",
    safetyNote: "Rotate resistance groups."
  },

  /* ===========================
     🍅 TOMATO
  =========================== */

  {
    chemicalName: "Metalaxyl + Mancozeb",
    type: "Fungicide",
    approvedFor: [
      "Tomato___Late_blight",
      "Tomato___Early_blight"
    ],
    modeOfAction: "Systemic + contact combination",
    resistanceGroup: "FRAC 4 + M3",
    dosage: "2 g per liter",
    applicationMethod: "Foliar spray",
    sprayInterval: "7–10 days",
    preHarvestInterval: "7 days",
    safetyNote: "Avoid overuse to prevent resistance."
  },

  {
    chemicalName: "Chlorothalonil 75% WP",
    type: "Fungicide",
    approvedFor: [
      "Tomato___Septoria_leaf_spot",
      "Tomato___Leaf_Mold"
    ],
    modeOfAction: "Protective contact fungicide",
    resistanceGroup: "FRAC M5",
    dosage: "2 g per liter",
    applicationMethod: "Foliar spray",
    sprayInterval: "7 days",
    preHarvestInterval: "7 days",
    safetyNote: "Apply preventively."
  },

  {
    chemicalName: "Imidacloprid 17.8% SL",
    type: "Insecticide",
    approvedFor: [
      "Tomato___Tomato_Yellow_Leaf_Curl_Virus"
    ],
    modeOfAction: "Systemic neonicotinoid (controls whitefly vector)",
    resistanceGroup: "IRAC 4A",
    dosage: "0.3 ml per liter",
    applicationMethod: "Foliar spray",
    sprayInterval: "14 days",
    preHarvestInterval: "3 days",
    safetyNote: "Apply early to control vector population."
  },

  /* ===========================
     🍓 STRAWBERRY
  =========================== */

  {
    chemicalName: "Copper Oxychloride",
    type: "Bactericide",
    approvedFor: ["Strawberry___Leaf_scorch"],
    modeOfAction: "Multi-site copper contact",
    resistanceGroup: "FRAC M1",
    dosage: "2 g per liter",
    applicationMethod: "Foliar spray",
    sprayInterval: "10 days",
    preHarvestInterval: "3 days",
    safetyNote: "Avoid excessive copper accumulation."
  },

  /* ===========================
     🌿 ORGANIC OPTIONS (CROSS-CROP)
  =========================== */

  {
    chemicalName: "Neem Oil (Azadirachtin)",
    type: "Organic",
    approvedFor: [
      "Apple___Apple_scab",
      "Tomato___Early_blight",
      "Grape___Black_rot"
    ],
    modeOfAction: "Botanical contact protectant",
    dosage: "3 ml per liter",
    applicationMethod: "Foliar spray",
    sprayInterval: "7 days",
    preHarvestInterval: "0 days",
    safetyNote: "Apply during cooler hours."
  },

  {
    chemicalName: "Bacillus subtilis Biofungicide",
    type: "Organic",
    approvedFor: [
      "Tomato___Late_blight",
      "Apple___Apple_scab",
      "Grape___Black_rot"
    ],
    modeOfAction: "Biological antagonist",
    dosage: "2 g per liter",
    applicationMethod: "Foliar spray",
    sprayInterval: "7 days",
    preHarvestInterval: "0 days",
    safetyNote: "Safe for integrated pest management."
  }

]