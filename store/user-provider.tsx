"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getCitizenData, type CitizenData } from "@/lib/citizen-data"

export interface User {
  iin: string
  city: string
  cityCoords: [number, number]
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  citizenData: CitizenData | null
  isDispatcher: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [citizenData, setCitizenData] = useState<CitizenData | null>(null)

  const isDispatcher = user?.iin === "000000000001"

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      const parsedUser = JSON.parse(stored)
      setUser(parsedUser)

      if (parsedUser.iin === "000000000001") {
        // For dispatcher, we don't load citizen data yet
        setCitizenData(null)
      }
    }
  }, [])

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))

      if (user.iin !== "000000000001") {
        const data = getCitizenData(user.iin)
        setCitizenData(data)
      }
    } else {
      localStorage.removeItem("user")
      setCitizenData(null)
    }
  }, [user])

  return <UserContext.Provider value={{ user, setUser, citizenData, isDispatcher }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within UserProvider")
  }
  return context
}
