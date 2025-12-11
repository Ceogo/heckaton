"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Camera } from "lucide-react"
import { Button } from "./ui/button"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import type { Request } from "@/store/requests-provider"

interface RequestModalProps {
  isOpen: boolean
  onClose: () => void
  request: Request | null
}

export default function RequestModal({ isOpen, onClose, request }: RequestModalProps) {
  const [files, setFiles] = useState<File[]>([])

  if (!request) return null

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const arr = Array.from(e.target.files).slice(0, 5)
    setFiles((prev) => [...prev, ...arr])
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-background/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-3xl bg-card dark:bg-[var(--surface)] rounded-lg border border-border dark:border-border/70 shadow-lg dark:shadow-2xl p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{request.title}</h3>
                <div className="text-xs text-muted-foreground dark:text-muted-foreground/80">{formatDistanceToNow(new Date(request.createdAt), { addSuffix: true, locale: ru })}</div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  request.status === "new" ? "bg-blue-500 text-white" : request.status === "in_progress" ? "bg-yellow-500 text-white" : "bg-green-500 text-white"
                }`}>
                  {request.status === "new" ? "Новая" : request.status === "in_progress" ? "В работе" : "Выполнена"}
                </span>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold text-foreground">Описание</h4>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground/80 mt-2">{request.description}</p>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold text-foreground">Адрес</h4>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground/80 mt-2">{request.address}</p>
            </div>

            {request.status === "done" && (
              <div className="mt-6 border-t pt-4">
                <h4 className="text-sm font-semibold text-foreground">Отчет от КСК</h4>

                {/* Highlighted report card */}
                <div className="mt-3 rounded-md p-4 bg-primary text-primary-foreground shadow-md">
                  <p className="text-sm">{request.report || "Отчет ещё не добавлен."}</p>
                  {request.reportPhotos && request.reportPhotos.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {request.reportPhotos.map((src, idx) => (
                        <img key={idx} src={src} alt={`report-${idx}`} className="h-28 w-full object-cover rounded-md border border-primary/30" />
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <label className="inline-flex items-center gap-2 cursor-pointer bg-muted dark:bg-[var(--surface-hover)] px-3 py-2 rounded-md border border-border dark:border-border/50">
                    <Camera className="h-4 w-4" />
                    <span className="text-sm text-foreground">Добавить фото</span>
                    <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
                  </label>

                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {files.map((f, i) => (
                      <div key={i} className="relative">
                        <img src={URL.createObjectURL(f)} className="h-24 w-full object-cover rounded-md border border-border dark:border-border/50" />
                        <button onClick={() => removeFile(i)} className="absolute top-1 right-1 bg-background/80 rounded-full p-1">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-2">
              <Button variant="outline" onClick={onClose} className="bg-transparent">
                Закрыть
              </Button>
              <Button onClick={onClose} className="bg-primary dark:bg-primary/80">
                Ок
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
