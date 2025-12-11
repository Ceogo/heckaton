"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { mockRequests } from "@/lib/mock-requests"
import { useUser } from "./user-provider"

export interface Request {
  id: string
  title: string
  description: string
  category: string
  status: "new" | "in_progress" | "done"
  coordinates: [number, number]
  createdAt: string
  address: string
  author: string
  iin: string
  city: string
  // optional KSK report fields
  report?: string
  reportPhotos?: string[]
}

interface RequestsContextType {
  requests: Request[]
  addRequest: (request: Omit<Request, "id" | "createdAt">) => void
  updateRequest: (id: string, updates: Partial<Request>) => void
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined)

export function RequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<Request[]>([])
  const { user } = useUser()

  useEffect(() => {
    const stored = localStorage.getItem("requests")
    if (stored) {
      const allRequests = JSON.parse(stored)
      if (user) {
        const cityRequests = allRequests.filter((r: Request) => r.city === user.city)
        setRequests(cityRequests)
      } else {
        setRequests([])
      }
    } else {
      // Initialize storage with mock requests keeping their original `city` values.
      const initialRequests = mockRequests.map((r) => ({ ...r, iin: r.iin || "000000000000" }))
      localStorage.setItem("requests", JSON.stringify(initialRequests))
      if (user) {
        const cityRequests = initialRequests.filter((r: Request) => r.city === user.city)
        setRequests(cityRequests)
      } else {
        setRequests([])
      }
    }
  }, [user])

  const addRequest = (request: Omit<Request, "id" | "createdAt">) => {
    const newRequest: Request = {
      ...request,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    const allStored = localStorage.getItem("requests")
    const allRequests = allStored ? JSON.parse(allStored) : []
    const updated = [...allRequests, newRequest]
    localStorage.setItem("requests", JSON.stringify(updated))

    if (user && newRequest.city === user.city) {
      setRequests([...requests, newRequest])
    }
  }

  const updateRequest = (id: string, updates: Partial<Request>) => {
    const allStored = localStorage.getItem("requests")
    const allRequests = allStored ? JSON.parse(allStored) : []
    const updatedAll = allRequests.map((req: Request) => (req.id === id ? { ...req, ...updates } : req))
    localStorage.setItem("requests", JSON.stringify(updatedAll))

    const updated = requests.map((req) => (req.id === id ? { ...req, ...updates } : req))
    setRequests(updated)
  }

  return <RequestsContext.Provider value={{ requests, addRequest, updateRequest }}>{children}</RequestsContext.Provider>
}

export function useRequests() {
  const context = useContext(RequestsContext)
  if (!context) {
    throw new Error("useRequests must be used within RequestsProvider")
  }
  return context
}
