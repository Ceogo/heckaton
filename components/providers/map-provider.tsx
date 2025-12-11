"use client"

import type React from "react"

import { createContext, useContext } from "react"

const MapContext = createContext({})

export function MapProvider({ children }: { children: React.ReactNode }) {
  return <MapContext.Provider value={{}}>{children}</MapContext.Provider>
}

export function useMap() {
  return useContext(MapContext)
}
