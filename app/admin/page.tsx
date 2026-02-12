"use client"

import { motion } from "framer-motion"
import { Users, Trophy, FileText, TrendingUp } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatCard } from "@/components/stat-card"
import { useAuth } from "@/app/AuthProvider"


export default function AdminPage() {
  const { user } = useAuth()
  const userId = user ? user.id : ''
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar userRole="admin" />
      <main className="flex-1 md:ml-64 overflow-auto">
        <div className="p-4 md:p-8">
          <DashboardHeader
            title={`Super Admin Dashboard`}
            description="Manage your hackathon platform and monitor all activities"
          />
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <StatCard
                title="Total Users"
                value="1,234"
                icon={Users}
                trend={{ value: 12, isPositive: true }}
                color="primary"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard
                title="Active Events"
                value="8"
                icon={Trophy}
                trend={{ value: 2, isPositive: true }}
                color="secondary"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard
                title="Total Submissions"
                value="456"
                icon={FileText}
                trend={{ value: 5, isPositive: true }}
                color="accent"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard
                title="Platform Growth"
                value="23%"
                icon={TrendingUp}
                trend={{ value: 8, isPositive: true }}
                color="primary"
              />
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
