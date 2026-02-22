"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Users,
  UserPlus,
  Settings,
  Shield,
  Mail,
  Phone,
  MapPin,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Bell,
  Lock,
  Crown,
  Wrench,
  User,
} from "lucide-react"
import { Trans } from "@/components/language-provider"

interface UserInterface {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "operator" | "viewer"
  status: "active" | "inactive" | "pending"
  lastLogin: string
  phone?: string
  location?: string
  avatar?: string
  permissions: string[]
  createdAt: string
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserInterface[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@farm.com",
      role: "admin",
      status: "active",
      lastLogin: "2 hours ago",
      phone: "+1 (555) 123-4567",
      location: "Main Farm Office",
      avatar: "/diverse-farmers-harvest.png",
      permissions: ["all"],
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.johnson@farm.com",
      role: "manager",
      status: "active",
      lastLogin: "1 day ago",
      phone: "+1 (555) 234-5678",
      location: "Field Operations",
      permissions: ["spraying", "analytics", "recommendations"],
      createdAt: "2024-02-01",
    },
    {
      id: "3",
      name: "Mike Wilson",
      email: "mike.wilson@farm.com",
      role: "operator",
      status: "active",
      lastLogin: "3 hours ago",
      phone: "+1 (555) 345-6789",
      location: "Zone A Operations",
      permissions: ["spraying", "map"],
      createdAt: "2024-02-15",
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.davis@farm.com",
      role: "viewer",
      status: "inactive",
      lastLogin: "1 week ago",
      permissions: ["dashboard", "analytics"],
      createdAt: "2024-03-01",
    },
  ])

  const [currentUser] = useState<UserInterface>(users[0]) // Mock current user as admin
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "operator" as const,
    phone: "",
    location: "",
  })

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: true,
      push: true,
      urgentOnly: false,
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
    },
    preferences: {
      theme: "light",
      language: "en",
      timezone: "UTC-5",
      dateFormat: "MM/DD/YYYY",
    },
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "manager":
        return "default"
      case "operator":
        return "secondary"
      case "viewer":
        return "outline"
      default:
        return "outline"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4" />
      case "manager":
        return <Shield className="h-4 w-4" />
      case "operator":
        return <Wrench className="h-4 w-4" />
      case "viewer":
        return <Eye className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600"
      case "inactive":
        return "text-gray-600"
      case "pending":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  const roleLabels: Record<string, { en: string; te: string }> = {
    admin: { en: "Admin", te: "ప్రశాసకుడు" },
    manager: { en: "Manager", te: "మేనేజర్" },
    operator: { en: "Operator", te: "ఆపరేటర్" },
    viewer: { en: "Viewer", te: "వీక్షకుడు" },
  }

  const statusLabels: Record<string, { en: string; te: string }> = {
    active: { en: "active", te: "చురుకైన" },
    inactive: { en: "inactive", te: "నిష్క్రియ" },
    pending: { en: "pending", te: "పై మరలింది" },
  }

  const handleAddUser = () => {
    const user: UserInterface = {
      id: Date.now().toString(),
      ...newUser,
      status: "pending",
      lastLogin: "Never",
      permissions: getDefaultPermissions(newUser.role),
      createdAt: new Date().toISOString().split("T")[0],
    }
    setUsers([...users, user])
    setNewUser({ name: "", email: "", role: "operator", phone: "", location: "" })
    setIsAddUserOpen(false)
  }

  const getDefaultPermissions = (role: string): string[] => {
    switch (role) {
      case "admin":
        return ["all"]
      case "manager":
        return ["dashboard", "map", "spraying", "analytics", "recommendations"]
      case "operator":
        return ["dashboard", "map", "spraying"]
      case "viewer":
        return ["dashboard", "analytics"]
      default:
        return ["dashboard"]
    }
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId))
  }

  const toggleUserStatus = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              <Trans en={"User Management"} te={"వినియోగదారు నిర్వహణ"} />
            </h1>
            <p className="text-muted-foreground">
              <Trans en={"Manage users, roles, and system settings"} te={"వినియోగదారుల్ని, పాత్రలు మరియు సిస్టమ్ సెట్టింగ్స్‌ను నిర్వహించండి"} />
            </p>
          </div>

          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                <Trans en={"Add User"} te={"వినియోగదారుని జోడించండి"} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  <Trans en={"Add New User"} te={"కొత్త వినియోగదారుడు జోడించండి"} />
                </DialogTitle>
                <DialogDescription>
                  <Trans en={"Create a new user account with appropriate permissions."} te={"సరైన అనుమతులతో కొత్త వినియోగదారు ఖాతాను సృష్టించండి."} />
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name"><Trans en={"Full Name"} te={"పూర్తి పేరు"} /></Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder={"Enter full name"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email"><Trans en={"Email"} te={"ఇమెయిల్"} /></Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder={"Enter email address"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role"><Trans en={"Role"} te={"పాత్ర"} /></Label>
                  <Select value={newUser.role} onValueChange={(value: any) => setNewUser({ ...newUser, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin"><Trans en={"Admin"} te={"ప్రశాసకుడు"} /></SelectItem>
                      <SelectItem value="manager"><Trans en={"Manager"} te={"మేనేజర్"} /></SelectItem>
                      <SelectItem value="operator"><Trans en={"Operator"} te={"ఆపరేటర్"} /></SelectItem>
                      <SelectItem value="viewer"><Trans en={"Viewer"} te={"వీక్షకుడు"} /></SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone"><Trans en={"Phone (Optional)"} te={"ఫోన్ (ఐచ్ఛిక)"} /></Label>
                  <Input
                    id="phone"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    placeholder={"Enter phone number"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location"><Trans en={"Location (Optional)"} te={"లొకేషన్ (ఐచ్ఛిక)"} /></Label>
                  <Input
                    id="location"
                    value={newUser.location}
                    onChange={(e) => setNewUser({ ...newUser, location: e.target.value })}
                    placeholder={"Enter work location"}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)} className="bg-transparent">
                  <Trans en={"Cancel"} te={"రద్దు చేయండి"} />
                </Button>
                <Button onClick={handleAddUser} disabled={!newUser.name || !newUser.email}>
                  <Trans en={"Add User"} te={"వినియోగదారుని జోడించండి"} />
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* User Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium"><Trans en={"Total Users"} te={"మొత్తం వినియోగదారులు"} /></CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground"><Trans en={"Registered accounts"} te={"నమోదు చేసిన ఖాతాలు"} /></p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium"><Trans en={"Active Users"} te={"సక్రియ వినియోగదారులు"} /></CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {users.filter((u) => u.status === "active").length}
              </div>
              <p className="text-xs text-muted-foreground"><Trans en={"Currently active"} te={"ప్రస్తుతం చురుకైన"} /></p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium"><Trans en={"Admins"} te={"ప్రశాసకులు"} /></CardTitle>
              <Crown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter((u) => u.role === "admin").length}</div>
              <p className="text-xs text-muted-foreground"><Trans en={"Administrator accounts"} te={"ప్రశాసక ఖాతాలు"} /></p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium"><Trans en={"Pending"} te={"వేచి ఉంది"} /></CardTitle>
              <UserPlus className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {users.filter((u) => u.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground"><Trans en={"Awaiting activation"} te={"చురుకుగా చేయబడడానికి వేచి ఉంది"} /></p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users"><Trans en={"Users"} te={"వినియోగదారులు"} /></TabsTrigger>
            <TabsTrigger value="roles"><Trans en={"Roles & Permissions"} te={"పాత్రలు & అనుమతులు"} /></TabsTrigger>
            <TabsTrigger value="settings"><Trans en={"Settings"} te={"సెట్టింగ్స్"} /></TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle><Trans en={"User Accounts"} te={"వినియోగదారు ఖాతాలు"} /></CardTitle>
                <CardDescription><Trans en={"Manage user accounts and their access levels"} te={"వినియోగదారుల ఖాతాలను మరియు అవి పొందే ప్రవేశ స్థాయిలను నిర్వహించండి"} /></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{user.name}</h4>
                            <Badge variant={getRoleColor(user.role)} className="flex items-center gap-1">
                              {getRoleIcon(user.role)}
                              <Trans en={roleLabels[user.role]?.en ?? user.role} te={roleLabels[user.role]?.te ?? user.role} />
                            </Badge>
                            <span className={`text-xs ${getStatusColor(user.status)}`}>● <Trans en={statusLabels[user.status]?.en ?? user.status} te={statusLabels[user.status]?.te ?? user.status} /></span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </span>
                            {user.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {user.phone}
                              </span>
                            )}
                            {user.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {user.location}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Last login: {user.lastLogin} • Created: {user.createdAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleUserStatus(user.id)}
                          className="bg-transparent"
                        >
                          {user.status === "active" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {user.id !== currentUser.id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-transparent text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roles & Permissions Tab */}
          <TabsContent value="roles" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      <Trans en={"Role Definitions"} te={"పాత్ర నిర్వచనాలు"} />
                    </CardTitle>
                    <CardDescription>
                      <Trans en={"User roles and their capabilities"} te={"వినియోగదారుల పాత్రలు మరియు వాటి సామర్థ్యాలు"} />
                    </CardDescription>
                  </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg border">
                      <Crown className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium"><Trans en={"Administrator"} te={"ప్రశాసకుడు"} /></h4>
                        <p className="text-sm text-muted-foreground">
                          <Trans en={"Full system access, user management, system configuration"} te={"సంపూర్ణ సిస్టమ్ యాక్సెస్, వినియోగదారుల నిర్వహణ, సిస్టమ్ కాన్ఫిగరేషన్"} />
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline" className="text-xs">
                            <Trans en={"All Permissions"} te={"అన్ని అనుమతులు"} />
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg border">
                      <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium"><Trans en={"Manager"} te={"మేనేజర్"} /></h4>
                        <p className="text-sm text-muted-foreground">
                          <Trans en={"Operational oversight, analytics access, spraying control"} te={"ఆపరేటింగ్ పర్యవేక్షణ, విశ్లేషణలకు ప్రాప్తి, స్ప్రేయింగ్ నియంత్రణ"} />
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline" className="text-xs"><Trans en={"Dashboard"} te={"డాష్‌బోర్డు"} /></Badge>
                          <Badge variant="outline" className="text-xs"><Trans en={"Analytics"} te={"విశ్లేషణలు"} /></Badge>
                          <Badge variant="outline" className="text-xs"><Trans en={"Spraying"} te={"స్ప్రేయింగ్"} /></Badge>
                          <Badge variant="outline" className="text-xs"><Trans en={"Recommendations"} te={"సూచనలు"} /></Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg border">
                      <Wrench className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium"><Trans en={"Operator"} te={"ఆపరేటర్"} /></h4>
                        <p className="text-sm text-muted-foreground"><Trans en={"Field operations, spraying control, map access"} te={"ఫీల్డ్ ఆపరేషన్లు, స్ప్రేయింగ్ నియంత్రణ, మ్యాప్ యాక్సెస్"} /></p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline" className="text-xs"><Trans en={"Dashboard"} te={"డాష్‌బోర్డు"} /></Badge>
                          <Badge variant="outline" className="text-xs"><Trans en={"Map"} te={"మ్యాప్"} /></Badge>
                          <Badge variant="outline" className="text-xs"><Trans en={"Spraying"} te={"స్ప్రేయింగ్"} /></Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg border">
                      <Eye className="h-5 w-5 text-gray-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium"><Trans en={"Viewer"} te={"వీక్షకుడు"} /></h4>
                        <p className="text-sm text-muted-foreground"><Trans en={"Read-only access to dashboard and reports"} te={"డాష్‌బోర్డు మరియు నివేదికలకు చదవగల మాత్రమే ప్రాప్తి"} /></p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline" className="text-xs"><Trans en={"Dashboard"} te={"డాష్‌బోర్డు"} /></Badge>
                          <Badge variant="outline" className="text-xs"><Trans en={"Analytics"} te={"విశ్లేషణలు"} /></Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle><Trans en={"Permission Matrix"} te={"అనుమతి మ్యాట్రిక్స్"} /></CardTitle>
                  <CardDescription><Trans en={"Detailed permissions by role"} te={"ప్రతి పాత్రకు వివరణాత్మక అనుమతులు"} /></CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Dashboard Access",
                      "Farm Map",
                      "Spraying Controls",
                      "Analytics & Reports",
                      "AI Recommendations",
                      "User Management",
                      "System Settings",
                      ].map((permission) => (
                        <div key={permission} className="flex items-center justify-between text-sm">
                          <span>
                            <Trans
                              en={permission}
                              te={
                                permission === "Dashboard Access"
                                  ? "డాష్‌బోర్డు యాక్సెస్"
                                  : permission === "Farm Map"
                                  ? "ఫార్మ్ మ్యాప్"
                                  : permission === "Spraying Controls"
                                  ? "స్ప్రేయింగ్ నియంత్రణలు"
                                  : permission === "Analytics & Reports"
                                  ? "విశ్లేషణలు మరియు నివేదికలు"
                                  : permission === "AI Recommendations"
                                  ? "AI సూచనలు"
                                  : permission === "System Settings"
                                  ? "సిస్టమ్ సెట్టింగ్స్"
                                  : permission
                              }
                            />
                          </span>
                        <div className="flex items-center gap-2">
                          <span className="text-red-600">●</span>
                          <span className="text-blue-600">●</span>
                          <span className="text-green-600">●</span>
                          <span className="text-gray-400">○</span>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                      <span><Trans en={"Legend:"} te={"వ్యాఖ్య:"} /></span>
                      <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <span className="text-red-600">●</span> <Trans en={"Admin"} te={"ప్రశాసకుడు"} />
                          </span>
                        <span className="flex items-center gap-1">
                          <span className="text-blue-600">●</span> <Trans en={"Manager"} te={"మేనేజర్"} />
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="text-green-600">●</span> <Trans en={"Operator"} te={"ఆపరేటర్"} />
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="text-gray-400">○</span> <Trans en={"Viewer"} te={"వీక్షకుడు"} />
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Notification Settings */}
              <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      <Trans en={"Notification Settings"} te={"అలర్ట్ సెట్టింగ్స్"} />
                    </CardTitle>
                    <CardDescription>
                      <Trans en={"Configure how you receive alerts and updates"} te={"మీరు అలర్ట్‌లు మరియు నవీకరణలు ఎలా పొందాలో కాన్ఫిగర్ చేయండి"} />
                    </CardDescription>
                  </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications"><Trans en={"Email Notifications"} te={"ఇమెయిల్ అలర్ట్స్"} /></Label>
                      <p className="text-sm text-muted-foreground"><Trans en={"Receive alerts via email"} te={"ఇమెయిల్ ద్వారా అలర్ట్లు పొందండి"} /></p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, email: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sms-notifications"><Trans en={"SMS Notifications"} te={"SMS అలర్ట్స్"} /></Label>
                      <p className="text-sm text-muted-foreground"><Trans en={"Receive alerts via text message"} te={"టెక్స్ట్ సందేశాల ద్వారా అలర్ట్లు పొందండి"} /></p>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={settings.notifications.sms}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, sms: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications"><Trans en={"Push Notifications"} te={"పుష్ అలర్ట్స్"} /></Label>
                      <p className="text-sm text-muted-foreground"><Trans en={"Browser and mobile push alerts"} te={"బ్రౌజర్ మరియు మొబైల్ పుష్ అలర్ట్లు"} /></p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={settings.notifications.push}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, push: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="urgent-only"><Trans en={"Urgent Only"} te={"కేవలం తక్షణ అలర్ట్లు"} /></Label>
                      <p className="text-sm text-muted-foreground"><Trans en={"Only receive critical alerts"} te={"మాత్రమే ముఖ్యమైన అలర్ట్లు అందుకోండి"} /></p>
                    </div>
                    <Switch
                      id="urgent-only"
                      checked={settings.notifications.urgentOnly}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, urgentOnly: checked },
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    <Trans en={"Security Settings"} te={"భద్రత సెట్టింగ్స్"} />
                  </CardTitle>
                  <CardDescription><Trans en={"Manage account security and access controls"} te={"ఖాతా భద్రత మరియు 접근 నియంత్రణలను నిర్వహించండి"} /></CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                    </div>
                    <Switch
                      id="two-factor"
                      checked={settings.security.twoFactor}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          security: { ...settings.security, twoFactor: checked },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="session-timeout"><Trans en={"Session Timeout (minutes)"} te={"సెషన్ సమాప్తి (నిమిషాలు)"} /></Label>
                    <Select
                      value={settings.security.sessionTimeout.toString()}
                      onValueChange={(value) =>
                        setSettings({
                          ...settings,
                          security: { ...settings.security, sessionTimeout: Number.parseInt(value) },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="480">8 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password-expiry"><Trans en={"Password Expiry (days)"} te={"పాస్వర్డ్ కాలనిరచన (రోజులు)"} /></Label>
                    <Select
                      value={settings.security.passwordExpiry.toString()}
                      onValueChange={(value) =>
                        setSettings({
                          ...settings,
                          security: { ...settings.security, passwordExpiry: Number.parseInt(value) },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    <Trans en={"Change Password"} te={"పాస్వర్డ్ మార్చండి"} />
                  </Button>
                </CardContent>
              </Card>

              {/* System Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    <Trans en={"System Preferences"} te={"సిస్టమ్ ఇష్టాలు"} />
                  </CardTitle>
                  <CardDescription><Trans en={"Customize your dashboard experience"} te={"మీ డాష్‌బోర్డును అనుకూలీకరించండి"} /></CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme"><Trans en={"Theme"} te={"థీమ్"} /></Label>
                    <Select
                      value={settings.preferences.theme}
                      onValueChange={(value) =>
                        setSettings({
                          ...settings,
                          preferences: { ...settings.preferences, theme: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light"><Trans en={"Light"} te={"లైట్"} /></SelectItem>
                        <SelectItem value="dark"><Trans en={"Dark"} te={"డార్క్"} /></SelectItem>
                        <SelectItem value="system"><Trans en={"System"} te={"సిస్టమ్"} /></SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language"><Trans en={"Language"} te={"భాష"} /></Label>
                    <Select
                      value={settings.preferences.language}
                      onValueChange={(value) =>
                        setSettings({
                          ...settings,
                          preferences: { ...settings.preferences, language: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en"><Trans en={"English"} te={"English"} /></SelectItem>
                        <SelectItem value="es"><Trans en={"Spanish"} te={"Spanish"} /></SelectItem>
                        <SelectItem value="fr"><Trans en={"French"} te={"French"} /></SelectItem>
                        <SelectItem value="de"><Trans en={"German"} te={"German"} /></SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone"><Trans en={"Timezone"} te={"టైమ్జోన్"} /></Label>
                    <Select
                      value={settings.preferences.timezone}
                      onValueChange={(value) =>
                        setSettings({
                          ...settings,
                          preferences: { ...settings.preferences, timezone: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                        <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                        <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="UTC+0">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date-format"><Trans en={"Date Format"} te={"తేదీ ఫార్మాట్"} /></Label>
                    <Select
                      value={settings.preferences.dateFormat}
                      onValueChange={(value) =>
                        setSettings({
                          ...settings,
                          preferences: { ...settings.preferences, dateFormat: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Settings */}
              <Card>
                  <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <Trans en={"Profile Settings"} te={"ప్రొఫైల్ సెట్టింగ్స్"} />
                  </CardTitle>
                  <CardDescription><Trans en={"Update your personal information"} te={"మీ వ్యక్తిగత సమాచారాన్ని నవీకరించండి"} /></CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-lg">
                        {currentUser.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" className="bg-transparent">
                      <Trans en={"Change Avatar"} te={"ఆవతార్ మార్చండి"} />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-name"><Trans en={"Full Name"} te={"పూర్తి పేరు"} /></Label>
                    <Input id="profile-name" defaultValue={currentUser.name} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-email"><Trans en={"Email"} te={"ఇమెయిల్"} /></Label>
                    <Input id="profile-email" type="email" defaultValue={currentUser.email} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-phone"><Trans en={"Phone"} te={"ఫోన్"} /></Label>
                    <Input id="profile-phone" defaultValue={currentUser.phone} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-location"><Trans en={"Location"} te={"లొకేషన్"} /></Label>
                    <Input id="profile-location" defaultValue={currentUser.location} />
                  </div>

                  <Button className="w-full"><Trans en={"Save Changes"} te={"మార్పులను సేవ్ చేయండి"} /></Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}