"use client"

import { MapContainer, TileLayer, useMapEvents } from "react-leaflet"
import { useTheme } from "./providers/theme-provider"
import { useUser } from "@/store/user-provider"
import "leaflet/dist/leaflet.css"

interface MiniMapProps {
  onSelect: (coords: [number, number]) => void
}

function MapClickHandler({ onSelect }: MiniMapProps) {
  useMapEvents({
    click: (e) => {
      onSelect([e.latlng.lat, e.latlng.lng])
    },
  })
  return null
}

export default function MiniMap({ onSelect }: MiniMapProps) {
  const { theme } = useTheme()
  const { user } = useUser()
  const center: [number, number] = user?.cityCoords || [43.238293, 76.889709]

  const tileUrl =
    theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

  return (
    <MapContainer center={center} zoom={12} className="h-full w-full" zoomControl={true}>
      <TileLayer url={tileUrl} attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
      <MapClickHandler onSelect={onSelect} />
    </MapContainer>
  )
}
