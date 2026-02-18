"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { LayoutDashboard, Users, Settings, LogOut, Menu, X, BarChart3, FileText, Bell, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/AuthProvider"

interface SidebarProps {
  userRole: "admin" | "head" | "reviewer" | "coordinator" | "participant"
}

export function Sidebar({ userRole }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const menuItems = {
    "admin": [
      { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
    ],
    "coordinator": [
      { icon: LayoutDashboard, label: "Dashboard", href: "/coordinator/dashboard" },
      { icon: FileText, label: "Submissions", href: "/coordinator/submissions" },
      { icon: Bell, label: "Announcements", href: "/coordinator/announcements" },
      { icon: Users, label: "Teams", href: "/coordinator/teams" },
      { icon: Settings, label: "Settings", href: "/coordinator/settings" },
    ],
    "head": [
      { icon: LayoutDashboard, label: "Dashboard", href: "/head/dashboard" },
      { icon: Users, label: "Evaluators", href: "/head/evaluators" },
      { icon: Settings, label: "Criteria", href: "/head/set-criteria" },
    ],
    "reviewer": [
      { icon: LayoutDashboard, label: "Dashboard", href: "/reviewer/dashboard" },
      { icon: FileText, label: "Reviews", href: "/reviewer/reviews" },
    ],
    "participant": [
      { icon: LayoutDashboard, label: "Dashboard", href: "/participant/dashboard" },
      { icon: FileText, label: "My Project", href: "/participant/project" },
      { icon: Users, label: "Team", href: "/participant/team" },
    ],
  }

  const {logout,isLoading} = useAuth();

  const handleLogout = async () => {
    logout();
  };

  const items = menuItems[userRole]
  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-primary text-primary-foreground"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <motion.aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 border-r border-blue-600 z-40 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        initial={{ x: -256 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo */}
        <div className="p-6 border-b border-blue-600">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-serif font-bold">H</span>
            </div>
            <span className="font-serif font-bold text-lg text-white">HackHub</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-blue-100 hover:bg-blue-800 hover:text-white"
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-blue-600">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 justify-center bg-blue-800 text-white border-blue-600 hover:bg-blue-700 hover:text-white"
            onClick={() => {
              handleLogout()
            }}
            disabled={isLoading}
          >
            <LogOut size={18} />
            {isLoading ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </motion.aside>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
