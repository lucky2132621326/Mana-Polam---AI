"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Home,
    SprayCan,
    Map,
    Microscope,
    BarChart3,
    Brain,
    Users,
    Info,
    History,
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
        { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
        { name: "AI Recommendations", href: "/dashboard/recommendations", icon: Brain },
        { name: "Activity History", href: "/dashboard/history", icon: History },
        { name: "User Management", href: "/dashboard/users", icon: Users },
        { name: "About", href: "/dashboard/about", icon: Info },
    ]

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-[#f4fbf6] via-[#eef9f2] to-[#e6f6ec]">

            {/* ===== SIDEBAR ===== */}
            <aside className="fixed left-0 top-0 h-screen w-20 hover:w-72 bg-white shadow-2xl border-r border-green-100 p-4 transition-all duration-500 ease-in-out z-50 group flex flex-col items-center hover:items-start overflow-hidden">

                <div className="mb-10 mt-4 flex items-center justify-center w-full group-hover:justify-start px-2">
                    <h1 className="text-2xl font-bold text-green-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Mana Polam
                    </h1>
                    <div className="absolute font-bold text-2xl text-green-700 group-hover:hidden">
                        MP
                    </div>
                </div>

                <nav className="space-y-4 w-full">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${isActive
                                        ? "bg-green-600 text-white shadow-lg"
                                        : "text-green-800 hover:bg-green-50"
                                    }`}
                            >
                                <div className="min-w-[1.25rem] flex items-center justify-center">
                                    <Icon size={22} />
                                </div>
                                <span className="text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
                                    {item.name}
                                </span>
                            </Link>
                        )
                    })}
                </nav>
            </aside>

            {/* ===== MAIN CONTENT ===== */}
            <main className="flex-1 ml-20 p-10 overflow-y-auto min-h-screen">
                <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 min-h-full border border-green-50">
                    {children}
                </div>
            </main>

        </div>
    )
}