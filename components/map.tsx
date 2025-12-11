"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import MarkerClusterGroup from "react-leaflet-cluster"
import { useRequests } from "@/store/requests-provider"
import { useUser } from "@/store/user-provider"
import { getCategoryInfo } from "@/lib/categories"
import { useTheme } from "./providers/theme-provider"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect } from "react"

function MapThemeController() {
  const map = useMap()
  const { theme } = useTheme()

  useEffect(() => {
    const layer = L.tileLayer(
      theme === "dark"
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      },
    )
    layer.addTo(map)
    return () => {
      map.removeLayer(layer)
    }
  }, [theme, map])

  return null
}

function createCustomIcon(category: string, status: string) {
  const categoryInfo = getCategoryInfo(category)
  const statusColors = {
    new: "#3b82f6",
    in_progress: "#eab308",
    done: "#22c55e",
  }
  const color = statusColors[status as keyof typeof statusColors] || statusColors.new

  const svgIcon = `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" strokeWidth="2"/>
      <text x="16" y="20" fontSize="14" textAnchor="middle" fill="white">${categoryInfo.icon}</text>
    </svg>
  `

  return L.divIcon({
    html: svgIcon,
    className: "custom-marker-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  })
}

function MapCenterUpdater() {
  const map = useMap()
  const { user } = useUser()

  useEffect(() => {
    if (user?.cityCoords) {
      map.setView(user.cityCoords, 12)
    }
  }, [user?.cityCoords, map])

  return null
}

export default function Map() {
  const { requests } = useRequests()
  const { user } = useUser()
  const center: [number, number] = user?.cityCoords || [43.238293, 76.889709]

  return (
    <MapContainer center={center} zoom={12} className="h-full w-full" zoomControl={true}>
      <MapThemeController />
      <MapCenterUpdater />
      <TileLayer url="" attribution="" />
      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={60}
        iconCreateFunction={(cluster) => {
          const count = cluster.getChildCount()
          return L.divIcon({
            html: `<div class="cluster-icon bg-primary border-2 border-white rounded-full w-10 h-10 flex items-center justify-center">
                <span class="text-sm font-bold text-white">${count}</span>
              </div>`,
            className: "custom-cluster-icon",
            iconSize: [40, 40],
          })
        }}
      >
        {requests.map((request) => (
          <Marker
            key={request.id}
            position={request.coordinates}
            icon={createCustomIcon(request.category, request.status)}
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-[200px]">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm leading-tight">{request.title}</h3>
                  <span
                    className={`shrink-0 px-2 py-1 rounded-full text-xs text-white ${
                      request.status === "new"
                        ? "bg-blue-500"
                        : request.status === "in_progress"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                  >
                    {request.status === "new" ? "Новая" : request.status === "in_progress" ? "В работе" : "Выполнена"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{request.description}</p>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Адрес:</span>
                    <span className="font-medium">{request.address}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Категория:</span>
                    <span className="font-medium">{getCategoryInfo(request.category).label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Дата:</span>
                    <span className="font-medium">{new Date(request.createdAt).toLocaleDateString("ru-RU")}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  )
}
