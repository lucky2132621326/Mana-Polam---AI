"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Home,
    SprayCan,
    Map,
    Microscope,
    Brain,
    Users,
    Info,
} from "lucide-react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    const navItems = [
        { name: "Home", href: "/dashboard", icon: Home },
        { name: "Auto Spray", href: "/dashboard/autospray", icon: SprayCan },
        { name: "View Farm Map", href: "/dashboard/map", icon: Map },
        { name: "Disease Detection", href: "/dashboard/detection", icon: Microscope },
        { name: "AI Recommendations", href: "/dashboard/recommendations", icon: Brain },
        { name: "User Management", href: "/dashboard/users", icon: Users },
        { name: "About", href: "/dashboard/about", icon: Info },
    ]

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-[#f4fbf6] via-[#eef9f2] to-[#e6f6ec]">

            {/* ===== SIDEBAR ===== */}
            <aside className="w-72 bg-white shadow-xl border-r border-green-100 p-6">

                <h1 className="text-2xl font-bold text-green-700 mb-10">
                    Mana Polam
                </h1>

                <nav className="space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                        ? "bg-green-600 text-white shadow-md"
                                        : "text-green-800 hover:bg-green-50"
                                    }`}
                            >
                                <Icon size={18} />
                                <span className="text-sm font-medium">
                                    {item.name}
                                </span>
                            </Link>
                        )
                    })}
                </nav>
            </aside>

            {/* ===== MAIN CONTENT ===== */}
            <main className="flex-1 p-10 overflow-y-auto">
                <div className="bg-white rounded-3xl shadow-xl p-8 min-h-[calc(100vh-5rem)]">          {children}
                </div>
            </main>

        </div>
    )
}