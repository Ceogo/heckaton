"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Calendar, Tag } from "lucide-react"
import type { Request } from "@/store/requests-provider"
import { getCategoryInfo } from "@/lib/categories"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import { Button } from "./ui/button"
import RequestModal from "./request-modal"

interface RequestCardProps {
  request: Request
}

export default function RequestCard({ request }: RequestCardProps) {
  const categoryInfo = getCategoryInfo(request.category)
  const [isOpen, setIsOpen] = useState(false)

  const statusStyles = {
    new: "bg-blue-500 text-white",
    in_progress: "bg-yellow-500 text-white",
    done: "bg-green-500 text-white",
  }

  const statusLabels = {
    new: "Новая",
    in_progress: "В работе",
    done: "Выполнена",
  }

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="bg-card dark:bg-[var(--surface)] rounded-lg p-4 border border-border dark:border-border/70 cursor-pointer hover:border-primary hover:dark:border-primary transition-all duration-200 shadow-sm dark:shadow-lg dark:shadow-black/20"
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 flex-1 text-foreground">{request.title}</h3>
          <span className="text-xl shrink-0">{categoryInfo.icon}</span>
        </div>

        <p className="text-xs text-muted-foreground dark:text-muted-foreground/80 mb-3 line-clamp-2 leading-relaxed">{request.description}</p>

        <div className="flex items-center gap-2 mb-2">
          <MapPin className="h-3 w-3 text-muted-foreground dark:text-muted-foreground/70 shrink-0" />
          <span className="text-xs text-foreground dark:text-foreground/90 line-clamp-1">{request.address}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground dark:text-muted-foreground/70" />
            <span className="text-xs text-muted-foreground dark:text-muted-foreground/80">
              {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true, locale: ru })}
            </span>
          </div>

          <span className={`px-2 py-1 rounded-full text-xs ${statusStyles[request.status]} font-medium shrink-0`}>
            {statusLabels[request.status]}
          </span>
        </div>

        <div className="mt-2 pt-2 border-t border-border dark:border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Tag className="h-3 w-3 text-muted-foreground dark:text-muted-foreground/70" />
              <span className="text-xs text-muted-foreground dark:text-muted-foreground/80">{categoryInfo.label}</span>
            </div>
            <Button size="sm" onClick={() => setIsOpen(true)} className="text-sm">
              Просмотреть
            </Button>
          </div>
        </div>
      </motion.div>

      <RequestModal isOpen={isOpen} onClose={() => setIsOpen(false)} request={request} />
    </>
  )
}
