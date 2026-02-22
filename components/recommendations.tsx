"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Brain,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Droplets,
  MapPin,
  Calendar,
  ThermometerSun,
  Wind,
  Target,
  Zap,
  X,
  Check,
} from "lucide-react"
import { Trans } from "@/components/language-provider"

interface Recommendation {
  id: string
  type: "urgent" | "important" | "suggestion" | "optimization"
  category: "spraying" | "prevention" | "maintenance" | "optimization"
  title: string
  description: string
  zone?: string
  priority: "high" | "medium" | "low"
  confidence: number
  estimatedImpact: string
  timeframe: string
  reasoning: string
  actions: string[]
  dismissed?: boolean
  implemented?: boolean
}

export default function Recommendations() {
  const [autoRecommendations, setAutoRecommendations] = useState(true)
  const [notifications, setNotifications] = useState(true)

  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: "rec-1",
      type: "urgent",
      category: "spraying",
      title: "Immediate Spraying Required - Zone A3",
      description: "Leaf blight detected with rapid spread potential. Weather conditions favor disease progression.",
      zone: "A3",
      priority: "high",
      confidence: 94,
      estimatedImpact: "Prevent 15-20% yield loss",
      timeframe: "Next 2 hours",
      reasoning:
        "High humidity (78%) and temperature (26°C) create optimal conditions for leaf blight spread. Early intervention critical.",
      actions: ["Apply fungicide spray", "Increase monitoring frequency", "Check adjacent zones"],
    },
    {
      id: "rec-2",
      type: "important",
      category: "prevention",
      title: "Preventive Treatment - Row B",
      description: "Weather forecast indicates conditions favorable for aphid infestation in 48-72 hours.",
      priority: "medium",
      confidence: 87,
      estimatedImpact: "Prevent potential infestation",
      timeframe: "Within 24 hours",
      reasoning:
        "Temperature rising to 28°C with moderate humidity. Historical data shows 85% probability of aphid activity under these conditions.",
      actions: [
        "Schedule preventive insecticide application",
        "Deploy monitoring traps",
        "Prepare treatment equipment",
      ],
    },
    {
      id: "rec-3",
      type: "optimization",
      category: "optimization",
      title: "Optimize Spraying Schedule",
      description:
        "Adjust spraying times to early morning (5-7 AM) for better pesticide effectiveness and reduced waste.",
      priority: "medium",
      confidence: 91,
      estimatedImpact: "20-25% pesticide savings",
      timeframe: "Implement gradually",
      reasoning:
        "Wind speed analysis shows optimal conditions during early morning hours. Reduced evaporation and better coverage achieved.",
      actions: ["Update spraying schedules", "Adjust equipment timers", "Train operators on new timing"],
    },
    {
      id: "rec-4",
      type: "suggestion",
      category: "maintenance",
      title: "Sensor Calibration Due",
      description: "Soil moisture sensors in zones C2 and D4 showing drift from expected values.",
      priority: "low",
      confidence: 78,
      estimatedImpact: "Improved data accuracy",
      timeframe: "Next maintenance window",
      reasoning:
        "Sensor readings deviate 8-12% from neighboring sensors. Regular calibration maintains system accuracy.",
      actions: ["Schedule sensor calibration", "Verify readings manually", "Update calibration records"],
    },
    {
      id: "rec-5",
      type: "important",
      category: "spraying",
      title: "Reduce Dosage - Zone D1",
      description:
        "Current pesticide concentration is 30% higher than needed based on plant health and disease pressure.",
      zone: "D1",
      priority: "medium",
      confidence: 89,
      estimatedImpact: "Reduce chemical usage by 30%",
      timeframe: "Next spraying session",
      reasoning:
        "Zone shows excellent health (95% score) with minimal disease pressure. Lower dosage maintains effectiveness while reducing costs.",
      actions: ["Adjust dosage settings", "Monitor effectiveness", "Document results"],
    },
    {
      id: "rec-6",
      type: "urgent",
      category: "prevention",
      title: "Moisture Management Alert",
      description: "Excessive soil moisture in zone B5 creating conditions for root rot development.",
      zone: "B5",
      priority: "high",
      confidence: 92,
      estimatedImpact: "Prevent root rot outbreak",
      timeframe: "Immediate action",
      reasoning:
        "Soil moisture at 85% for 48+ hours. Root rot typically develops within 72 hours under these conditions.",
      actions: ["Improve drainage", "Reduce irrigation", "Apply preventive fungicide"],
    },
  ])

  // Telugu translations for dynamic recommendation content
  const teTranslations: Record<string, string> = {
    "Immediate Spraying Required - Zone A3": "తక్షణ స్ప్రేయింగ్ అవసరం - జోన్ A3",
    "Leaf blight detected with rapid spread potential. Weather conditions favor disease progression.": "పత్రాల బ్లైట్ వేగంగా పसरే అవకాశంతో గుర్తించబడింది. వాతావరణ పరిస్థితులు రోగ విస్తరణకు అనుకూలంగా ఉన్నాయి.",
    "Preventive Treatment - Row B": "నిరోధక చికిత్స - రో బి",
    "Weather forecast indicates conditions favorable for aphid infestation in 48-72 hours.": "వాతావరణ అంచనాలు 48-72 గంటలలో ఎఫిడ్ దాడికి అనుకూలమైన పరిస్థితులను సూచిస్తాయి.",
    "Optimize Spraying Schedule": "స్ప్రేయింగ్ షెడ్యూల్‌ను ఆప్టిమైజ్ చేయండి",
    "Adjust spraying times to early morning (5-7 AM) for better pesticide effectiveness and reduced waste.": "ఉత్తమ రసాయన పనితీరుకు మరియు వ్యర్థం తగ్గించడానికి స్ప్రేయింగ్ సమయాలను ఆరవేలా (5-7 AM) మార్చండి.",
    "Sensor Calibration Due": "సెన్సార్ కాలిబ్రేషన్ అవసరం",
    "Soil moisture sensors in zones C2 and D4 showing drift from expected values.": "జోన్లు C2 మరియు D4 లో బాటి మాయిశ్చర్ సెన్సార్లు ఆశించిన విలువల నుండి వంగుతున్నాయి.",

    // Actions
    "Apply fungicide spray": "ఫంగిసైడ్ స్ప్రే చేయండి",
    "Increase monitoring frequency": "మిక్కిలి పర్యవేక్షణ తరచుదనం పెంచండి",
    "Check adjacent zones": "కక్కి ఉన్న జోన్లను తనిఖీ చేయండి",
    "Schedule preventive insecticide application": "నిరోధక ఇన్సెక్టిసైడ్ అప్లికేషన్ షెడ్యూల్ చేయండి",
    "Deploy monitoring traps": "పర్యవేక్షణ ఫందాల్ని అమలు చేయండి",
    "Prepare treatment equipment": "చికిత్స పరికరాలను సిద్ధం చేయండి",
    "Update spraying schedules": "స్ప్రేయింగ్ షెడ్యూల్‌లను నవీకరించండి",
    "Adjust equipment timers": "పరికరాల టైమర్లను సర్దుబాటు చేయండి",
    "Train operators on new timing": "కొత్త సమయాలపై ఆపరేటర్లకు శిక్షణ ఇవ్వండి",
    "Schedule sensor calibration": "సెన్సార్ కాలిబ్రేషన్ షెడ్యూల్ చేయండి",
    "Verify readings manually": "రిడింగ్స్‌ను మాన్యువల్‌గా ధృవీకరించండి",
    "Update calibration records": "కాలిబ్రేషన్ రికార్డులను నవీకరించండి",

    // Small phrases
    "AI Reasoning": "AI వివరణ",
    "Recommended Actions": "సిఫార‌స్డ్ చర్యలు",
    "Immediate Actions": "తక్షణ చర్యలు",
    "Take Action Now": "ఇప్పుడే చర్య తీసుకోండి",
    "Get Help": "సాయంకోరుకోండి",
    "No Implemented Actions Yet": "ఇప్పటి వరకు అమలు చేయబడిన చర్యలు లేవు",
    "All Caught Up!": "అందరూ పక్కాగా ఉన్నాయి!",
    "No active recommendations at the moment. The AI is continuously monitoring your farm.": "ప్రస్తుతం క్రియాశీల సూచనలు లేవు. AI మీ వ్యర్థాన్ని నిరంతరం పర్యవేక్షిస్తోంది.",
    "No Urgent Actions": "తక్షణ చర్యలు లేవు",
    "Great! No urgent recommendations requiring immediate attention.": "మంచిది! తక్షణ శ్రద్ధ అవసరమైన తక్షణ సూచనలు లేవు.",
  }

  const t = (en: string) => teTranslations[en] ?? en

  const getTypeColor = (type: string) => {
    switch (type) {
      case "urgent":
        return "text-red-600 bg-red-50 dark:bg-red-950"
      case "important":
        return "text-orange-600 bg-orange-50 dark:bg-orange-950"
      case "optimization":
        return "text-blue-600 bg-blue-50 dark:bg-blue-950"
      case "suggestion":
        return "text-green-600 bg-green-50 dark:bg-green-950"
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-950"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return <AlertTriangle className="h-4 w-4" />
      case "important":
        return <Clock className="h-4 w-4" />
      case "optimization":
        return <TrendingUp className="h-4 w-4" />
      case "suggestion":
        return <Lightbulb className="h-4 w-4" />
      default:
        return <Brain className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const handleDismiss = (id: string) => {
    setRecommendations((prev) => prev.map((rec) => (rec.id === id ? { ...rec, dismissed: true } : rec)))
  }

  const handleImplement = (id: string) => {
    setRecommendations((prev) => prev.map((rec) => (rec.id === id ? { ...rec, implemented: true } : rec)))
  }

  const activeRecommendations = recommendations.filter((rec) => !rec.dismissed && !rec.implemented)
  const urgentCount = activeRecommendations.filter((rec) => rec.type === "urgent").length
  const importantCount = activeRecommendations.filter((rec) => rec.type === "important").length

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground"><Trans en={"AI Recommendations"} te={"AI సూచనలు"} /></h1>
            <p className="text-muted-foreground"><Trans en={"Intelligent suggestions for optimal farm management"} te={"ఆప్టిమల్ ఫార్మ్ నిర్వహణ కోసం తెలివైన సూచనలు"} /></p>
          </div>

          {/* Settings */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="auto-recommendations"
                checked={autoRecommendations}
                onCheckedChange={setAutoRecommendations}
              />
              <Label htmlFor="auto-recommendations" className="text-sm">
                <Trans en={"Auto Recommendations"} te={"స్వయంచాలక సూచనలు"} />
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
              <Label htmlFor="notifications" className="text-sm">
                <Trans en={"Notifications"} te={"నోటిఫికేషన్లు"} />
              </Label>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium"><Trans en={"Active Recommendations"} te={"సక్రియ సూచనలు"} /></CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeRecommendations.length}</div>
              <p className="text-xs text-muted-foreground"><Trans en={"Pending actions"} te={"పెండింగ్ చర్యలు"} /></p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium"><Trans en={"Urgent Actions"} te={"తక్షణ చర్యలు"} /></CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{urgentCount}</div>
              <p className="text-xs text-muted-foreground"><Trans en={"Require immediate attention"} te={"తక్షణ శ్రద్ధ అవసరం"} /></p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium"><Trans en={"Important Items"} te={"ముఖ్య అంశాలు"} /></CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{importantCount}</div>
              <p className="text-xs text-muted-foreground"><Trans en={"Within 24 hours"} te={"24 గంటలలో"} /></p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium"><Trans en={"AI Confidence"} te={"AI నమ్మకం"} /></CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">89%</div>
              <p className="text-xs text-muted-foreground"><Trans en={"Average accuracy"} te={"సగటు ఖచ్చితత్వం"} /></p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active"><Trans en={"Active"} te={"సక్రియ"} /> ({activeRecommendations.length})</TabsTrigger>
            <TabsTrigger value="urgent"><Trans en={"Urgent"} te={"తక్షణ"} /> ({urgentCount})</TabsTrigger>
            <TabsTrigger value="implemented"><Trans en={"Implemented"} te={"అమలులో"} /></TabsTrigger>
            <TabsTrigger value="insights"><Trans en={"AI Insights"} te={"AI అవగాహనలు"} /></TabsTrigger>
          </TabsList>

          {/* Active Recommendations */}
          <TabsContent value="active" className="space-y-4">
            {activeRecommendations.map((rec) => (
              <Card key={rec.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(rec.type)}`}>{getTypeIcon(rec.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg"><Trans en={rec.title} te={t(rec.title)} /></CardTitle>
                          <Badge variant={getPriorityColor(rec.priority)} className="capitalize">
                            {rec.priority}
                          </Badge>
                          {rec.zone && (
                            <Badge variant="outline" className="text-xs">
                              <MapPin className="mr-1 h-3 w-3" />
                              {rec.zone}
                            </Badge>
                          )}
                        </div>
                          <CardDescription className="text-base"><Trans en={rec.description} te={t(rec.description)} /></CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDismiss(rec.id)}
                        className="bg-transparent"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Confidence and Impact */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground"><Trans en={"AI Confidence"} te={"AI నమ్మకం"} /></span>
                        <span className="font-medium">{rec.confidence}%</span>
                      </div>
                      <Progress value={rec.confidence} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Estimated Impact</p>
                      <p className="text-sm font-medium">{rec.estimatedImpact}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Timeframe</p>
                      <p className="text-sm font-medium">{rec.timeframe}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Reasoning */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      <Trans en={"AI Reasoning"} te={t("AI Reasoning")} />
                    </h4>
                    <p className="text-sm text-muted-foreground"><Trans en={rec.reasoning} te={t(rec.reasoning)} /></p>
                  </div>

                  {/* Recommended Actions */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium"><Trans en={"Recommended Actions"} te={t("Recommended Actions")} /></h4>
                    <ul className="space-y-1">
                      {rec.actions.map((action, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          <Trans en={action} te={t(action)} />
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button onClick={() => handleImplement(rec.id)}>
                      <Check className="mr-2 h-4 w-4" />
                      <Trans en={"Implement"} te={"అమలు చేయండి"} />
                    </Button>
                    <Button variant="outline" className="bg-transparent">
                      <Calendar className="mr-2 h-4 w-4" />
                      <Trans en={"Schedule"} te={"టైమ్ షెడ్యూల్"} />
                    </Button>
                    <Button variant="outline" className="bg-transparent">
                      <Trans en={"More Details"} te={"మరింత వివరాలు"} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {activeRecommendations.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2"><Trans en={"All Caught Up!"} te={t("All Caught Up!")} /></h3>
                  <p className="text-muted-foreground">
                    <Trans en={"No active recommendations at the moment. The AI is continuously monitoring your farm."} te={t("No active recommendations at the moment. The AI is continuously monitoring your farm.")} />
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Urgent Recommendations */}
          <TabsContent value="urgent" className="space-y-4">
            {activeRecommendations
              .filter((rec) => rec.type === "urgent")
              .map((rec) => (
                <Card key={rec.id} className="border-red-200 dark:border-red-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950 text-red-600">
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-lg text-red-600"><Trans en={rec.title} te={t(rec.title)} /></CardTitle>
                            {rec.zone && (
                              <Badge variant="outline" className="text-xs">
                                <MapPin className="mr-1 h-3 w-3" />
                                {rec.zone}
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-base"><Trans en={rec.description} te={t(rec.description)} /></CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                      <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                        ⚠️ <Trans en={"Urgent Action Required:"} te={"తక్షణ చర్య అవసరం:"} /> <Trans en={rec.timeframe} te={t(rec.timeframe)} />
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium"><Trans en={"Immediate Actions"} te={t("Immediate Actions")} /></h4>
                      <ul className="space-y-1">
                        {rec.actions.map((action, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <div className="h-1.5 w-1.5 rounded-full bg-red-600" />
                            <Trans en={action} te={t(action)} />
                          </li>
                        ))}
                      </ul>
                    </div>

                      <div className="flex items-center gap-2">
                      <Button className="bg-red-600 hover:bg-red-700" onClick={() => handleImplement(rec.id)}>
                        <Zap className="mr-2 h-4 w-4" />
                        <Trans en={"Take Action Now"} te={t("Take Action Now")} />
                      </Button>
                      <Button variant="outline" className="bg-transparent">
                        <Trans en={"Get Help"} te={t("Get Help")} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

            {activeRecommendations.filter((rec) => rec.type === "urgent").length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2"><Trans en={"No Urgent Actions"} te={t("No Urgent Actions")} /></h3>
                  <p className="text-muted-foreground">
                    <Trans en={"Great! No urgent recommendations requiring immediate attention."} te={t("Great! No urgent recommendations requiring immediate attention.")} />
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Implemented Recommendations */}
          <TabsContent value="implemented" className="space-y-4">
            {recommendations
              .filter((rec) => rec.implemented)
              .map((rec) => (
                <Card key={rec.id} className="opacity-75">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg"><Trans en={rec.title} te={t(rec.title)} /></CardTitle>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <Trans en={"Implemented"} te={"అమలులో"} />
                          </Badge>
                        </div>
                        <CardDescription><Trans en={rec.description} te={t(rec.description)} /></CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}

            {recommendations.filter((rec) => rec.implemented).length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2"><Trans en={"No Implemented Actions Yet"} te={"ఇప్పటికే అమలు చేయబడిన చర్యలు వేచివున్నాయి"} /></h3>
                  <p className="text-muted-foreground">
                    <Trans en={"Implemented recommendations will appear here for tracking and review."} te={"అమలైన సూచనలు ట్రాకింగ్ మరియు సమీక్ష కోసం ఇక్కడ కనిపిస్తాయి."} />
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* AI Insights */}
          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <Trans en={"AI Performance Insights"} te={"AI పనితీరు అవగాహనలు"} />
                </CardTitle>
                <CardDescription><Trans en={"How the AI system is helping optimize your farm"} te={"AI సిస్టమ్ మీ వ్యవసాయాన్ని ఆప్టిమైజ్ చేయడంలో ఎలా సహాయపడుతుంది"} /></CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-medium"><Trans en={"Prediction Accuracy"} te={"పెరుగుదల ఖచ్చితత్వం"} /></h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm"><Trans en={"Disease Detection"} te={"రోగ నిర్ధారణ"} /></span>
                        <span className="text-sm font-medium">94%</span>
                      </div>
                      <Progress value={94} className="h-2" />

                      <div className="flex items-center justify-between">
                        <span className="text-sm"><Trans en={"Weather Predictions"} te={"వాతావరణ తర్ఫీదులు"} /></span>
                        <span className="text-sm font-medium">87%</span>
                      </div>
                      <Progress value={87} className="h-2" />

                      <div className="flex items-center justify-between">
                        <span className="text-sm"><Trans en={"Optimal Timing"} te={"సువర్ణ సమయం"} /></span>
                        <span className="text-sm font-medium">91%</span>
                      </div>
                      <Progress value={91} className="h-2" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium"><Trans en={"Impact Metrics"} te={"ప్రభావ సూచికలు"} /></h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm"><Trans en={"Pesticide Reduction"} te={"పెస్టిసైడ్ తగ్గింపు"} /></span>
                        <span className="text-sm font-medium text-green-600">-23%</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm"><Trans en={"Early Disease Detection"} te={"ముందస్తు రోగ గుర్తింపు"} /></span>
                        <span className="text-sm font-medium text-green-600">+67%</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm"><Trans en={"Yield Improvement"} te={"ఉత్పత్తి మెరుగుదల"} /></span>
                        <span className="text-sm font-medium text-green-600">+12%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium"><Trans en={"Learning Insights"} te={"లెర్నింగ్ అవగాహనలు"} /></h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h5 className="font-medium text-sm mb-2"><Trans en={"Pattern Recognition"} te={"ప్యాటర్న్ గుర్తింపు"} /></h5>
                      <p className="text-sm text-muted-foreground">
                        AI has identified that Zone A3 is 40% more susceptible to leaf blight during high humidity
                        periods.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h5 className="font-medium text-sm mb-2"><Trans en={"Optimization Discovery"} te={"ఆప్టిమైజేషన్ కనుగొనడం"} /></h5>
                      <p className="text-sm text-muted-foreground">
                        Morning spraying (5-7 AM) shows 25% better pesticide effectiveness compared to afternoon
                        applications.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle><Trans en={"Seasonal Predictions"} te={"ఋతువుల ఊహాలు"} /></CardTitle>
                <CardDescription><Trans en={"AI forecasts for the upcoming season"} te={" రాబోయే సీజన్ కోసం AI అంచనాలు"} /></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <ThermometerSun className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium"><Trans en={"Temperature Trends"} te={"ఉష్ణోగ్రత ధోరణులు"} /></h5>
                      <p className="text-sm text-muted-foreground">
                        <Trans en={"Expect 2-3°C above average temperatures in the next 30 days. Increased pest activity likely."} te={"తదుపరి 30 రోజుల్లో సగటునకు 2-3°C ఎక్కువ ఉష్ణోగ్రతలు எதிர்பారవచ్చు. పెస్టు కార్యకలాపం పెరగడం సాధ్యం."} />
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <Droplets className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium"><Trans en={"Rainfall Forecast"} te={"వర్ష సూచిక"} /></h5>
                      <p className="text-sm text-muted-foreground">
                        <Trans en={"Below-average rainfall predicted. Consider adjusting irrigation schedules and drought-resistant practices."} te={"సగటు కంటే తక్కువ వర్షం ఆశించబడింది. సించన షెడ్యూల్‌లు మరియు ఎండ నిరోధక పద్ధతులను సరిచేసుకోండి."} />
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <Wind className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium"><Trans en={"Wind Patterns"} te={"గాలి ధోరణులు"} /></h5>
                      <p className="text-sm text-muted-foreground">
                        <Trans en={"Favorable wind conditions for spraying operations expected to continue. Optimal application windows identified."} te={"స్ప్రేయింగ్ ఆపరేషన్లు కోసం అనుకూల గాలి పరిస్థితులు కొనసాగుతాయని ఊహించబడుతున్నాయి. ఉత్తమ అప్లికేషన్ సమయాలు గుర్తించబడ్డాయి."} />
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
