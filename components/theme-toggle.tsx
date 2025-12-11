"use client"

import { useTheme } from "./providers/theme-provider"
import { Button } from "./ui/button"
import { Moon, Sun } from "lucide-react"
import { motion } from "framer-motion"

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} className="rounded-full h-10 w-10 bg-transparent">
      <motion.div initial={false} animate={{ rotate: theme === "dark" ? 0 : 180 }} transition={{ duration: 0.3 }}>
        {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </motion.div>
    </Button>
  )
}
