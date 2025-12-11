"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import RequestPanel from "./request-panel"
import GeminiChat from "./gemini-chat"
import ThemeToggle from "./theme-toggle"
import StatsOverlay from "./stats-overlay"
import CitizenInfo from "./citizen-info"
import Loader from "./loader"
import { Button } from "./ui/button"
import { Plus, LogOut } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useUser } from "@/store/user-provider"

const Map = dynamic(() => import("./map"), {
  ssr: false,
  loading: () => <Loader />,
})

export default function MainLayout() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const { user, setUser, isDispatcher } = useUser()

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const handleLogout = () => {
    setUser(null)
    window.location.reload()
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="h-screen w-full overflow-hidden relative">
      {/* Map */}
      <div className="absolute inset-0">
        <Map />
      </div>

      {/* Stats Overlay */}
      <StatsOverlay />

      {/* Theme Toggle & Logout */}
      <div className="absolute top-4 right-4 z-[1000] flex gap-2">
        <ThemeToggle />
        <Button variant="outline" size="icon" onClick={handleLogout} title="Выйти">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      {/* Citizen Info (for dispatcher) */}
      {isDispatcher && <CitizenInfo />}

      {/* Request Panel */}
      <RequestPanel isOpen={isPanelOpen} onToggle={() => setIsPanelOpen(!isPanelOpen)} />

      {/* Submit Request Button */}
      <AnimatePresence>
        {!isChatOpen && !isDispatcher && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed bottom-6 right-6 z-[1000] md:bottom-8 md:right-8"
          >
            <Button
              size="lg"
              onClick={() => setIsChatOpen(true)}
              className="rounded-full h-14 px-6 text-base font-medium"
            >
              <Plus className="mr-2 h-5 w-5" />
              Подать заявку
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gemini Chat */}
      {!isDispatcher && <GeminiChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />}
    </div>
  )
}
