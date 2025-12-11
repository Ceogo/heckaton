"use client"

import { motion } from "framer-motion"

export default function Loader() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-background">
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-muted"
            style={{ borderTopColor: "var(--color-primary)" }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        </div>

        {/* Loading text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h2 className="text-xl font-semibold mb-1">Система заявок КСК</h2>
          <p className="text-sm text-muted-foreground">Загрузка данных...</p>
        </motion.div>
      </div>
    </div>
  )
}
