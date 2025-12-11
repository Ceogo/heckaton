"use client"

import type React from "react"

import { motion } from "framer-motion"
import { AlertCircle, Clock, CheckCircle, TrendingUp } from "lucide-react"
import { useRequests } from "@/store/requests-provider"

export default function StatsOverlay() {
  const { requests } = useRequests()

  const stats = {
    new: requests.filter((r) => r.status === "new").length,
    inProgress: requests.filter((r) => r.status === "in_progress").length,
    done: requests.filter((r) => r.status === "done").length,
    total: requests.length,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[1000] hidden lg:block"
    >
      <div className="bg-card dark:bg-[var(--surface)] rounded-lg p-3 border border-border dark:border-border/70 shadow-sm dark:shadow-lg dark:shadow-black/30 backdrop-blur-sm dark:backdrop-blur-sm">
        <div className="flex items-center gap-6">
          <StatItem icon={<TrendingUp className="h-4 w-4" />} label="Всего" value={stats.total} color="text-primary" />
          <div className="w-px h-8 bg-border dark:bg-border/50" />
          <StatItem icon={<AlertCircle className="h-4 w-4" />} label="Новые" value={stats.new} color="text-blue-500" />
          <div className="w-px h-8 bg-border dark:bg-border/50" />
          <StatItem
            icon={<Clock className="h-4 w-4" />}
            label="В работе"
            value={stats.inProgress}
            color="text-yellow-500"
          />
          <div className="w-px h-8 bg-border dark:bg-border/50" />
          <StatItem
            icon={<CheckCircle className="h-4 w-4" />}
            label="Выполнены"
            value={stats.done}
            color="text-green-500"
          />
        </div>
      </div>
    </motion.div>
  )
}

function StatItem({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: number
  color: string
}) {
  return (
    <div className="flex items-center gap-2">
      <div className={`${color}`}>{icon}</div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className={`text-lg font-bold ${color}`}>{value}</div>
      </div>
    </div>
  )
}
