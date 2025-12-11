"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check } from "lucide-react"
import { Button } from "./ui/button"
import dynamic from "next/dynamic"

const MiniMap = dynamic(() => import("./mini-map"), {
  ssr: false,
})

interface MapSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (coords: [number, number], address: string) => void
}

export default function MapSelector({ isOpen, onClose, onSelect }: MapSelectorProps) {
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null)

  const handleConfirm = () => {
    if (selectedCoords) {
      onSelect(selectedCoords, `${selectedCoords[0].toFixed(5)}, ${selectedCoords[1].toFixed(5)}`)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-3xl h-[70vh] glass-strong rounded-2xl shadow-2xl neon-glow-primary flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <h3 className="text-lg font-semibold">Укажите место на карте</h3>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 relative">
              <MiniMap onSelect={setSelectedCoords} />
            </div>

            <div className="p-4 border-t border-border/50 flex gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Отмена
              </Button>
              <Button onClick={handleConfirm} disabled={!selectedCoords} className="flex-1 neon-glow-primary">
                <Check className="mr-2 h-5 w-5" />
                Подтвердить
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
