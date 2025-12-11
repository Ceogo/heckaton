"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useRequests } from "@/store/requests-provider"
import { categories } from "@/lib/categories"
import RequestCard from "./request-card"

interface RequestPanelProps {
  isOpen: boolean
  onToggle: () => void
}

export default function RequestPanel({ isOpen, onToggle }: RequestPanelProps) {
  const { requests } = useRequests()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.address.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = filterCategory === "all" || request.category === filterCategory
    const matchesStatus = filterStatus === "all" || request.status === filterStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <>
      {/* Desktop Panel */}
      <motion.div
        initial={{ x: -400 }}
        animate={{ x: isOpen ? 0 : -400 }}
        transition={{ type: "spring", damping: 25 }}
        className="hidden md:flex fixed left-0 top-0 bottom-0 w-[400px] z-[1000] bg-card dark:bg-[var(--surface)] border-r border-border dark:border-border/70 flex-col shadow-lg dark:shadow-2xl dark:shadow-black/40"
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Заявки</h2>
            <Button variant="ghost" size="icon" onClick={onToggle}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-muted-foreground/70" />
            <Input
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted dark:bg-[var(--surface-hover)] border-border dark:border-border/50 text-foreground dark:text-foreground/90"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="flex-1 bg-muted dark:bg-[var(--surface-hover)] border-border dark:border-border/50 text-foreground dark:text-foreground/90">
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent className="bg-card dark:bg-[var(--surface)] border-border dark:border-border/50">
                <SelectItem value="all">Все категории</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="flex-1 bg-muted dark:bg-[var(--surface-hover)] border-border dark:border-border/50 text-foreground dark:text-foreground/90">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent className="bg-card dark:bg-[var(--surface)] border-border dark:border-border/50">
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="new">Новая</SelectItem>
                <SelectItem value="in_progress">В работе</SelectItem>
                <SelectItem value="done">Выполнена</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground dark:text-muted-foreground/80">
            Найдено: <span className="font-semibold text-foreground dark:text-foreground/90">{sortedRequests.length}</span>
          </div>
        </div>

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-3 pb-4">
            {sortedRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <RequestCard request={request} />
              </motion.div>
            ))}
            {sortedRequests.length === 0 && (
              <div className="text-center py-8 text-muted-foreground dark:text-muted-foreground/80">Заявки не найдены</div>
            )}
          </div>
        </ScrollArea>
      </motion.div>

      {/* Mobile Bottom Sheet */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30 }}
            className="md:hidden fixed left-0 right-0 bottom-0 top-[30%] z-[1000] bg-card dark:bg-[var(--surface)] rounded-t-3xl border-t border-border dark:border-border/70 flex flex-col shadow-2xl dark:shadow-2xl dark:shadow-black/40"
          >
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-center">
                <div className="w-12 h-1 rounded-full bg-border dark:bg-border/50" />
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground dark:text-foreground/90">Заявки</h2>
                <Button variant="ghost" size="icon" onClick={onToggle} className="hover:bg-muted dark:hover:bg-[var(--surface-hover)]">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-muted-foreground/70" />
                <Input
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-muted dark:bg-[var(--surface-hover)] border-border/50 dark:border-border/30 text-foreground dark:text-foreground/90"

                />
              </div>

              <div className="flex gap-2">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="flex-1 bg-muted dark:bg-[var(--surface-hover)] border-border/50 dark:border-border/30 text-foreground dark:text-foreground/90">
                    <SelectValue placeholder="Категория" />
                  </SelectTrigger>
                  <SelectContent className="bg-card dark:bg-[var(--surface)] border-border dark:border-border/50">
                    <SelectItem value="all">Все</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="flex-1 bg-muted dark:bg-[var(--surface-hover)] border-border/50 dark:border-border/30 text-foreground dark:text-foreground/90">
                    <SelectValue placeholder="Статус" />
                  </SelectTrigger>
                  <SelectContent className="bg-card dark:bg-[var(--surface)] border-border dark:border-border/50">
                    <SelectItem value="all">Все</SelectItem>
                    <SelectItem value="new">Новая</SelectItem>
                    <SelectItem value="in_progress">В работе</SelectItem>
                    <SelectItem value="done">Выполнена</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ScrollArea className="flex-1 px-4">
              <div className="space-y-3 pb-4">
                {sortedRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <RequestCard request={request} />
                  </motion.div>
                ))}
                {sortedRequests.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground dark:text-muted-foreground/80">Заявки не найдены</div>
                )}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      {!isOpen && (
        <motion.div
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          className="fixed left-4 bottom-4 z-[1000] md:left-4 md:top-1/2 md:-translate-y-1/2 md:bottom-auto"
        >
          <Button
            size="icon"
            onClick={onToggle}
            className="bg-primary hover:bg-primary/90 dark:bg-primary/80 dark:hover:bg-primary rounded-full h-12 w-12 md:h-14 md:w-14 hover:scale-105 transition-all shadow-md dark:shadow-lg dark:shadow-black/30"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </>
  )
}
