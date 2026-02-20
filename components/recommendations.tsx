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
            <h1 className="text-3xl font-bold text-foreground">AI Recommendations</h1>
            <p className="text-muted-foreground">Intelligent suggestions for optimal farm management</p>
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
                Auto Recommendations
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
              <Label htmlFor="notifications" className="text-sm">
                Notifications
              </Label>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Recommendations</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeRecommendations.length}</div>
              <p className="text-xs text-muted-foreground">Pending actions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent Actions</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{urgentCount}</div>
              <p className="text-xs text-muted-foreground">Require immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Important Items</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{importantCount}</div>
              <p className="text-xs text-muted-foreground">Within 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Confidence</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">89%</div>
              <p className="text-xs text-muted-foreground">Average accuracy</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active">Active ({activeRecommendations.length})</TabsTrigger>
            <TabsTrigger value="urgent">Urgent ({urgentCount})</TabsTrigger>
            <TabsTrigger value="implemented">Implemented</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
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
                          <CardTitle className="text-lg">{rec.title}</CardTitle>
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
                        <CardDescription className="text-base">{rec.description}</CardDescription>
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
                        <span className="text-muted-foreground">AI Confidence</span>
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
                      AI Reasoning
                    </h4>
                    <p className="text-sm text-muted-foreground">{rec.reasoning}</p>
                  </div>

                  {/* Recommended Actions */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Recommended Actions</h4>
                    <ul className="space-y-1">
                      {rec.actions.map((action, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button onClick={() => handleImplement(rec.id)}>
                      <Check className="mr-2 h-4 w-4" />
                      Implement
                    </Button>
                    <Button variant="outline" className="bg-transparent">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule
                    </Button>
                    <Button variant="outline" className="bg-transparent">
                      More Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {activeRecommendations.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">All Caught Up!</h3>
                  <p className="text-muted-foreground">
                    No active recommendations at the moment. The AI is continuously monitoring your farm.
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
                            <CardTitle className="text-lg text-red-600">{rec.title}</CardTitle>
                            {rec.zone && (
                              <Badge variant="outline" className="text-xs">
                                <MapPin className="mr-1 h-3 w-3" />
                                {rec.zone}
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-base">{rec.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                      <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                        ⚠️ Urgent Action Required: {rec.timeframe}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Immediate Actions</h4>
                      <ul className="space-y-1">
                        {rec.actions.map((action, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <div className="h-1.5 w-1.5 rounded-full bg-red-600" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button className="bg-red-600 hover:bg-red-700" onClick={() => handleImplement(rec.id)}>
                        <Zap className="mr-2 h-4 w-4" />
                        Take Action Now
                      </Button>
                      <Button variant="outline" className="bg-transparent">
                        Get Help
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

            {activeRecommendations.filter((rec) => rec.type === "urgent").length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Urgent Actions</h3>
                  <p className="text-muted-foreground">
                    Great! No urgent recommendations requiring immediate attention.
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
                          <CardTitle className="text-lg">{rec.title}</CardTitle>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Implemented
                          </Badge>
                        </div>
                        <CardDescription>{rec.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}

            {recommendations.filter((rec) => rec.implemented).length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Implemented Actions Yet</h3>
                  <p className="text-muted-foreground">
                    Implemented recommendations will appear here for tracking and review.
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
                  AI Performance Insights
                </CardTitle>
                <CardDescription>How the AI system is helping optimize your farm</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-medium">Prediction Accuracy</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Disease Detection</span>
                        <span className="text-sm font-medium">94%</span>
                      </div>
                      <Progress value={94} className="h-2" />

                      <div className="flex items-center justify-between">
                        <span className="text-sm">Weather Predictions</span>
                        <span className="text-sm font-medium">87%</span>
                      </div>
                      <Progress value={87} className="h-2" />

                      <div className="flex items-center justify-between">
                        <span className="text-sm">Optimal Timing</span>
                        <span className="text-sm font-medium">91%</span>
                      </div>
                      <Progress value={91} className="h-2" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Impact Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Pesticide Reduction</span>
                        <span className="text-sm font-medium text-green-600">-23%</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm">Early Disease Detection</span>
                        <span className="text-sm font-medium text-green-600">+67%</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm">Yield Improvement</span>
                        <span className="text-sm font-medium text-green-600">+12%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Learning Insights</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h5 className="font-medium text-sm mb-2">Pattern Recognition</h5>
                      <p className="text-sm text-muted-foreground">
                        AI has identified that Zone A3 is 40% more susceptible to leaf blight during high humidity
                        periods.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h5 className="font-medium text-sm mb-2">Optimization Discovery</h5>
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
                <CardTitle>Seasonal Predictions</CardTitle>
                <CardDescription>AI forecasts for the upcoming season</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <ThermometerSun className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium">Temperature Trends</h5>
                      <p className="text-sm text-muted-foreground">
                        Expect 2-3°C above average temperatures in the next 30 days. Increased pest activity likely.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <Droplets className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium">Rainfall Forecast</h5>
                      <p className="text-sm text-muted-foreground">
                        Below-average rainfall predicted. Consider adjusting irrigation schedules and drought-resistant
                        practices.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <Wind className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium">Wind Patterns</h5>
                      <p className="text-sm text-muted-foreground">
                        Favorable wind conditions for spraying operations expected to continue. Optimal application
                        windows identified.
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
