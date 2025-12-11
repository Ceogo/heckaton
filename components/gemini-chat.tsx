"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, MapPin, ImageIcon, Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area"
import { categories } from "@/lib/categories"
import { useRequests } from "@/store/requests-provider"
import { useUser } from "@/store/user-provider"
import { chatWithGemini } from "@/lib/gemini"
import MapSelector from "./map-selector"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface RequestData {
  title?: string
  description?: string
  category?: string
  address?: string
  coordinates?: [number, number]
}

interface GeminiChatProps {
  isOpen: boolean
  onClose: () => void
}

export default function GeminiChat({ isOpen, onClose }: GeminiChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showMapSelector, setShowMapSelector] = useState(false)
  const [requestData, setRequestData] = useState<RequestData>({})
  const scrollRef = useRef<HTMLDivElement>(null)
  const { addRequest } = useRequests()
  const { user } = useUser()

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        role: "assistant",
        content: "Здравствуйте! Я помогу вам подать заявку. Расскажите, пожалуйста, какая у вас проблема?",
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, messages.length])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const conversationHistory = [...messages, userMessage]
        .map((m) => `${m.role === "user" ? "Пользователь" : "Ассистент"}: ${m.content}`)
        .join("\n")

      const response = await chatWithGemini(conversationHistory, requestData)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      if (response.requestData) {
        setRequestData((prev) => ({ ...prev, ...response.requestData }))
      }

      if (response.isComplete && response.requestData) {
        // Check if coordinates exist (required for submission)
        if (requestData.coordinates) {
          setTimeout(() => {
            submitRequest(response.requestData!)
          }, 1500)
        } else {
          // If coordinates are missing, ask user to select location on map
          const locationMessage: Message = {
            id: (Date.now() + 2).toString(),
            role: "assistant",
            content: "Пожалуйста, укажите местоположение на карте, нажав на кнопку с маркером внизу. Это обязательно для подачи заявки.",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, locationMessage])
        }
      }
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Извините, произошла ошибка. Попробуйте ещё раз.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategorySelect = (categoryId: string) => {
    setRequestData((prev) => ({ ...prev, category: categoryId }))
    const category = categories.find((c) => c.id === categoryId)
    const message: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `Категория: ${category?.label}`,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, message])

    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Отлично! Теперь расскажите подробнее о проблеме и укажите адрес.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, response])
    }, 500)
  }

  const handleMapSelect = (coords: [number, number], address: string) => {
    const updatedData = { ...requestData, coordinates: coords, address }
    setRequestData(updatedData)
    setShowMapSelector(false)
    const message: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `Местоположение: ${address}`,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, message])

    // Check if all required data is present for submission
    if (
      updatedData.title &&
      updatedData.description &&
      updatedData.category &&
      updatedData.coordinates &&
      updatedData.address
    ) {
      setTimeout(() => {
        submitRequest(updatedData)
      }, 1500)
    }
  }

  const submitRequest = (data: RequestData) => {
    if (!data.title || !data.description || !data.category || !data.coordinates || !data.address) {
      console.error("[v0] Missing request data", data)
      return
    }

    addRequest({
      title: data.title,
      description: data.description,
      category: data.category,
      status: "new",
      coordinates: data.coordinates,
      address: data.address,
      author: "Жилец",
      iin: user?.iin || "000000000000",
      city: user?.city || "Алматы",
    })

    const successMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: "Заявка успешно отправлена! Вы можете увидеть её на карте. Спасибо!",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, successMessage])

    setTimeout(() => {
      handleClose()
    }, 2000)
  }

  const handleClose = () => {
    setMessages([])
    setRequestData({})
    onClose()
  }

  const showCategoryButtons =
    !requestData.category && messages.length > 1 && messages[messages.length - 1].role === "assistant"

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="w-full max-w-2xl h-[80vh] bg-card dark:bg-[var(--surface)] rounded-lg border border-border dark:border-border/70 flex flex-col overflow-hidden shadow-lg dark:shadow-2xl dark:shadow-black/40"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border dark:border-border/50">
                <h2 className="text-xl font-semibold text-foreground">Подать заявку</h2>
                <Button variant="ghost" size="icon" onClick={handleClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4 bg-card dark:bg-[var(--overlay)]" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "bg-muted dark:bg-[var(--surface)] text-foreground dark:text-foreground/90 border border-border dark:border-border/50 shadow-sm dark:shadow-md dark:shadow-black/20"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                    </motion.div>
                  ))}

                  {showCategoryButtons && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-2 gap-2"
                    >
                      {categories.slice(0, 6).map((category) => (
                        <Button
                          key={category.id}
                          variant="outline"
                          onClick={() => handleCategorySelect(category.id)}
                          className="justify-start h-auto py-3 border-border dark:border-border/50 hover:bg-muted dark:hover:bg-[var(--surface-hover)] text-foreground dark:text-foreground/90"
                        >
                          <span className="mr-2 text-lg">{category.icon}</span>
                          <span className="text-sm">{category.label}</span>
                        </Button>
                      ))}
                    </motion.div>
                  )}

                  {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                      <div className="bg-muted dark:bg-[var(--surface)] border border-border dark:border-border/50 p-3 rounded-lg shadow-sm dark:shadow-md dark:shadow-black/20">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-border dark:border-border/50 bg-card dark:bg-[var(--surface)] space-y-2">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowMapSelector(true)}
                    className="shrink-0 border-border dark:border-border/50 hover:bg-muted dark:hover:bg-[var(--surface-hover)]"
                    disabled={isLoading}
                  >
                    <MapPin className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="shrink-0 border-border dark:border-border/50 hover:bg-muted dark:hover:bg-[var(--surface-hover)]" disabled={true}>
                    <ImageIcon className="h-5 w-5" />
                  </Button>
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                    placeholder="Введите сообщение..."
                    disabled={isLoading}
                    className="bg-muted dark:bg-[var(--surface-hover)] border-border dark:border-border/50 text-foreground dark:text-foreground/90"
                  />
                  <Button onClick={handleSend} disabled={!input.trim() || isLoading} className="shrink-0 bg-primary hover:bg-primary/90 dark:bg-primary/80 dark:hover:bg-primary">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <MapSelector isOpen={showMapSelector} onClose={() => setShowMapSelector(false)} onSelect={handleMapSelect} />
    </>
  )
}
