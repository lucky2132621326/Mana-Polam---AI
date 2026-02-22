"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sprout,
  Play,
  Pause,
  Square,
  Settings,
  Clock,
  Droplets,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Timer,
  Zap,
  BarChart3,
  MapPin,
} from "lucide-react"
import { Trans } from "@/components/language-provider"

interface SprayingSession {
  id: string
  zone: string
  status: "active" | "scheduled" | "completed" | "paused"
  startTime: string
  duration: number
  dosage: number
  pesticideType: string
  progress: number
}

export default function SprayingControls() {
  const [autoMode, setAutoMode] = useState(true)
  const [globalDosage, setGlobalDosage] = useState([75])
  const [selectedZones, setSelectedZones] = useState<string[]>([])
  const [pesticideLevel, setPesticideLevel] = useState(68)

  // Mock data for active spraying sessions
  const [sprayingSessions, setSprayingSessions] = useState<SprayingSession[]>([
    {
      id: "session-1",
      zone: "A3",
      status: "active",
      startTime: "14:30",
      duration: 15,
      dosage: 80,
      pesticideType: "Fungicide",
      progress: 65,
    },
    {
      id: "session-2",
      zone: "B5",
      status: "scheduled",
      startTime: "15:00",
      duration: 12,
      dosage: 70,
      pesticideType: "Insecticide",
      progress: 0,
    },
  ])

  const zones = [
    "A1",
    "A2",
    "A3",
    "A4",
    "A5",
    "A6",
    "B1",
    "B2",
    "B3",
    "B4",
    "B5",
    "B6",
    "C1",
    "C2",
    "C3",
    "C4",
    "C5",
    "C6",
    "D1",
    "D2",
    "D3",
    "D4",
    "D5",
    "D6",
  ]
  const pesticideTypes = ["Fungicide", "Insecticide", "Herbicide", "Bactericide", "Nematicide"]

  const handleZoneToggle = (zone: string) => {
    setSelectedZones((prev) => (prev.includes(zone) ? prev.filter((z) => z !== zone) : [...prev, zone]))
  }

  const handleStartSpraying = () => {
    if (selectedZones.length === 0) return

    const newSessions = selectedZones.map((zone) => ({
      id: `session-${Date.now()}-${zone}`,
      zone,
      status: "active" as const,
      startTime: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
      duration: 15,
      dosage: globalDosage[0],
      pesticideType: "Fungicide",
      progress: 0,
    }))

    setSprayingSessions((prev) => [...prev, ...newSessions])
    setSelectedZones([])
  }

  const handlePauseSession = (sessionId: string) => {
    setSprayingSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId ? { ...session, status: session.status === "active" ? "paused" : "active" } : session,
      ),
    )
  }

  const handleStopSession = (sessionId: string) => {
    setSprayingSessions((prev) =>
      prev.map((session) => (session.id === sessionId ? { ...session, status: "completed", progress: 100 } : session)),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600"
      case "paused":
        return "text-yellow-600"
      case "scheduled":
        return "text-blue-600"
      case "completed":
        return "text-gray-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play className="h-4 w-4 text-green-600" />
      case "paused":
        return <Pause className="h-4 w-4 text-yellow-600" />
      case "scheduled":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-gray-600" />
      default:
        return null
    }
  }

  const pesticideLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case "fungicide":
        return "ఫంగిసైడ్"
      case "insecticide":
        return "ఇన్‌సెక్టిసైడ్"
      case "herbicide":
        return "హెర్బిసైడ్"
      case "bactericide":
        return "బాక్టిరిసైడ్"
      case "nematicide":
        return "నెమాటిసైడ్"
      default:
        return type
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground"><Trans en={"Spraying Controls"} te={"స్ప్రాయింగ్ నియంత్రణలు"} /></h1>
            <p className="text-muted-foreground"><Trans en={"Manage pesticide spraying operations and schedules"} te={"పెస్టిసైడ్ స్ప్రేయింగ్ ఆపరేషన్లు మరియు షెడ్యూల్‌లను నిర్వహించండి"} /></p>
          </div>

          {/* System Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-muted-foreground"><Trans en={"System Online"} te={"సిస్టమ్ ఆన్‌లైన్"} /></span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-600" />
              <span className="text-sm"><Trans en={"Pesticide:"} te={"పెస్టిసైడ్:"} /> {pesticideLevel}%</span>
            </div>
          </div>
        </div>

        {/* Mode Toggle */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium"><Trans en={"Operation Mode"} te={"ఆపరేషన్ మోడ్"} /></h3>
                  <p className="text-sm text-muted-foreground">
                    {autoMode ? (
                      <Trans
                        en={"AI automatically manages spraying based on sensor data"}
                        te={"AI సెన్సార్ డేటాకు ఆధారంగా స్వయంచాలకంగా స్ప్రేయింగ్ నిర్వహిస్తుంది"}
                      />
                    ) : (
                      <Trans en={"Manual control of all spraying operations"} te={"అన్ని స్ప్రేయింగ్ ఆపరేషన్లకు మాన్యువల్ నియంత్రణ"} />
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="auto-mode" className="text-sm">
                  <Trans en={"Manual"} te={"మాన్యువల్"} />
                </Label>
                <Switch id="auto-mode" checked={autoMode} onCheckedChange={setAutoMode} />
                <Label htmlFor="auto-mode" className="text-sm">
                  <Trans en={"Auto"} te={"ఆటో"} />
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="manual" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manual"><Trans en={"Manual Control"} te={"మెన్యువల్ నియంత్రణ"} /></TabsTrigger>
            <TabsTrigger value="schedule"><Trans en={"Schedule"} te={"షెడ్యూల్"} /></TabsTrigger>
            <TabsTrigger value="active"><Trans en={"Active Sessions"} te={"క్రియాశీల సెషన్లు"} /></TabsTrigger>
          </TabsList>

          {/* Manual Control Tab */}
          <TabsContent value="manual" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Zone Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <Trans en={"Zone Selection"} te={"జోన్ ఎంపిక"} />
                  </CardTitle>
                  <CardDescription><Trans en={"Select zones for manual spraying"} te={"మాన్యువల్ స్ప్రేయింగ్ కోసం జోన్లు ఎంచుకోండి"} /></CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-6 gap-2">
                    {zones.map((zone) => (
                      <Button
                        key={zone}
                        variant={selectedZones.includes(zone) ? "default" : "outline"}
                        size="sm"
                        className="h-10"
                        onClick={() => handleZoneToggle(zone)}
                      >
                        {zone}
                      </Button>
                    ))}
                  </div>

                    <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground"><Trans en={`Selected: ${selectedZones.length} zones`} te={`ఎంచుకున్నవి: ${selectedZones.length} జోన్లు`} /></span>
                    <Button variant="outline" size="sm" onClick={() => setSelectedZones([])} className="bg-transparent">
                      <Trans en={"Clear All"} te={"అన్నింటిని క్లియర్ చేయండి"} />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Spray Settings */}
              <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    <Trans en={"Spray Settings"} te={"స్ప్రే సెట్టింగ్స్"} />
                  </CardTitle>
                  <CardDescription><Trans en={"Configure dosage and pesticide type"} te={"డోసేజ్ మరియు పెస్టిసైడ్ రకం కాన్ఫిగర్ చేయండి"} /></CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Dosage Slider */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label><Trans en={"Dosage Level"} te={"డోసేజ్ స్థాయి"} /></Label>
                      <span className="text-sm font-medium">{globalDosage[0]}%</span>
                    </div>
                    <Slider
                      value={globalDosage}
                      onValueChange={setGlobalDosage}
                      max={100}
                      min={10}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span><Trans en={"Light (10%)"} te={"తక్కువ (10%)"} /></span>
                      <span><Trans en={"Heavy (100%)"} te={"భారీ (100%)"} /></span>
                    </div>
                  </div>

                  {/* Pesticide Type */}
                  <div className="space-y-2">
                    <Label><Trans en={"Pesticide Type"} te={"పెస్టిసైడ్ రకం"} /></Label>
                    <Select defaultValue="fungicide">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {pesticideTypes.map((type) => (
                          <SelectItem key={type.toLowerCase()} value={type.toLowerCase()}>
                            <Trans en={type} te={pesticideLabel(type)} />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Duration */}
                  <div className="space-y-2">
                    <Label><Trans en={"Duration (minutes)"} te={"కాలవ్యవధి (నిమిషాలు)"} /></Label>
                    <Input type="number" defaultValue="15" min="5" max="60" />
                  </div>

                  {/* Start Button */}
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleStartSpraying}
                    disabled={selectedZones.length === 0 || autoMode}
                  >
                    <Sprout className="mr-2 h-5 w-5" />
                    <Trans en={`Start Spraying (${selectedZones.length} zones)`} te={`స్ప్రేయింగ్ ప్రారంభించండి (${selectedZones.length} జోన్లు)`} />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <Trans en={"Spraying Schedule"} te={"స్ప్రే షెడ్యూల్"} />
                </CardTitle>
                <CardDescription><Trans en={"Set up automated spraying schedules"} te={"స్వయంచాలక స్ప్రేయింగ్ షెడ్యూల్‌లు సజ్జం చేయండి"} /></CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Zone</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={<Trans en={"Select zone"} te={"జోన్ ఎంచుకోండి"} />} />
                        </SelectTrigger>
                        <SelectContent>
                          {zones.map((zone) => (
                            <SelectItem key={zone} value={zone}>
                              {zone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label><Trans en={"Time"} te={"సమయం"} /></Label>
                      <Input type="time" defaultValue="06:00" />
                    </div>

                    <div className="space-y-2">
                      <Label><Trans en={"Frequency"} te={"పునరావృతి"} /></Label>
                      <Select defaultValue="daily">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily"><Trans en={"Daily"} te={"రోజువారీ"} /></SelectItem>
                          <SelectItem value="weekly"><Trans en={"Weekly"} te={"వారానిక"} /></SelectItem>
                          <SelectItem value="biweekly"><Trans en={"Bi-weekly"} te={"రెండు వారాలలో ఒకసారి"} /></SelectItem>
                          <SelectItem value="monthly"><Trans en={"Monthly"} te={"నెలలో ఒకసారి"} /></SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Pesticide Type</Label>
                      <Select defaultValue="fungicide">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {pesticideTypes.map((type) => (
                            <SelectItem key={type.toLowerCase()} value={type.toLowerCase()}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Dosage (%)</Label>
                      <Input type="number" defaultValue="75" min="10" max="100" />
                    </div>

                    <div className="space-y-2">
                      <Label>Duration (minutes)</Label>
                      <Input type="number" defaultValue="15" min="5" max="60" />
                    </div>
                  </div>
                </div>

                <Button className="w-full">
                  <Timer className="mr-2 h-4 w-4" />
                  Add to Schedule
                </Button>
              </CardContent>
            </Card>

            {/* Scheduled Sessions */}
            <Card>
              <CardHeader>
                <CardTitle><Trans en={"Upcoming Schedules"} te={"రాబోయే షెడ్యూల్‌లు"} /></CardTitle>
                <CardDescription><Trans en={"Manage your scheduled spraying sessions"} te={"మీ షెడ్యూల్ చేసిన సెషన్లను నిర్వహించండి"} /></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sprayingSessions
                    .filter((s) => s.status === "scheduled")
                    .map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="font-medium"><Trans en={`Zone ${session.zone}`} te={`జోన్ ${session.zone}`} /></p>
                            <p className="text-sm text-muted-foreground">
                              {session.startTime} • <Trans en={session.pesticideType} te={pesticideLabel(session.pesticideType)} /> • {session.dosage}%
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <Trans en={"Edit"} te={"సవరణ"} />
                          </Button>
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <Trans en={"Cancel"} te={"రద్దు చేయి"} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  {sprayingSessions.filter((s) => s.status === "scheduled").length === 0 && (
                    <p className="text-center text-muted-foreground py-8"><Trans en={"No scheduled sessions"} te={"షెడ్యూల్ సెషన్లు లేవు"} /></p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Active Sessions Tab */}
          <TabsContent value="active" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <Trans en={"Active Spraying Sessions"} te={"సక్రియ స్ప్రేయింగ్ సెషన్లు"} />
                </CardTitle>
                <CardDescription><Trans en={"Monitor and control ongoing spraying operations"} te={"చలించే స్ప్రేయింగ్ ఆపరేషన్లను పర్యవేక్షించండి మరియు నియంత్రించండి"} /></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sprayingSessions
                    .filter((s) => s.status === "active" || s.status === "paused")
                    .map((session) => (
                      <div key={session.id} className="p-4 rounded-lg border space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(session.status)}
                            <div>
                              <h4 className="font-medium"><Trans en={`Zone ${session.zone}`} te={`జోన్ ${session.zone}`} /></h4>
                              <p className="text-sm text-muted-foreground">
                                <Trans en={`Started:`} te={`ప్రారంభం:`} /> {session.startTime} • <Trans en={session.pesticideType} te={pesticideLabel(session.pesticideType)} /> • {session.dosage}%
                              </p>
                            </div>
                          </div>
                          <Badge variant={session.status === "active" ? "default" : "secondary"} className="capitalize">
                            {session.status === "active" ? <Trans en={"Active"} te={"సక్రియ"} /> : <Trans en={"Paused"} te={"విరామం"} />}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span><Trans en={"Progress"} te={"ప్రగతి"} /></span>
                            <span>{session.progress}%</span>
                          </div>
                          <Progress value={session.progress} className="h-2" />
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span><Trans en={`Duration: ${session.duration} min`} te={`కాలవ్యవధి: ${session.duration} నిమిషాలు`} /></span>
                            <span>
                              <Trans
                                en={`Est. completion: ${Math.round(((100 - session.progress) / 100) * session.duration)} min`}
                                te={`అంచనా పూర్తి: ${Math.round(((100 - session.progress) / 100) * session.duration)} నిమిషాలు`}
                              />
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePauseSession(session.id)}
                            className="bg-transparent"
                          >
                            {session.status === "active" ? (
                              <>
                                <Pause className="mr-2 h-4 w-4" />
                                <Trans en={"Pause"} te={"విరామం"} />
                              </>
                            ) : (
                              <>
                                <Play className="mr-2 h-4 w-4" />
                                <Trans en={"Resume"} te={"పునరంభించు"} />
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStopSession(session.id)}
                            className="bg-transparent"
                          >
                            <Square className="mr-2 h-4 w-4" />
                            <Trans en={"Stop"} te={"ఆపు"} />
                          </Button>
                        </div>
                      </div>
                    ))}

                  {sprayingSessions.filter((s) => s.status === "active" || s.status === "paused").length === 0 && (
                    <div className="text-center py-8">
                      <Sprout className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground"><Trans en={"No active spraying sessions"} te={"సక్రియ స్ప్రేయింగ్ సెషన్లు లేవు"} /></p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pesticide Level Alert */}
            {pesticideLevel < 20 && (
              <Card className="border-destructive">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <div>
                      <h4 className="font-medium text-destructive"><Trans en={"Low Pesticide Level"} te={"పెస్టిసైడ్ స్థాయి తక్కువ"} /></h4>
                      <p className="text-sm text-muted-foreground">
                        <Trans en={`Current level: ${pesticideLevel}%. Refill recommended before starting new sessions.`} te={`ప్రస్తుత స్థాయి: ${pesticideLevel}%. కొత్త సెషన్లు ప్రారంభించడానికి ముందు పునఃపూరణ సిఫార్సు చేయబడింది.`} />
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
