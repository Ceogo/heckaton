export const categories = [
  { id: "emergency", label: "Аварийная", icon: "🚨", color: "text-red-500" },
  { id: "cleaning", label: "Уборка", icon: "🧹", color: "text-blue-500" },
  { id: "lighting", label: "Освещение", icon: "💡", color: "text-yellow-500" },
  { id: "lift", label: "Лифт", icon: "🛗", color: "text-purple-500" },
  { id: "heating", label: "Отопление", icon: "🔥", color: "text-orange-500" },
  { id: "repair", label: "Ремонт", icon: "🔧", color: "text-green-500" },
  { id: "parking", label: "Парковка", icon: "🚗", color: "text-cyan-500" },
  { id: "playground", label: "Детская площадка", icon: "🎪", color: "text-pink-500" },
  { id: "noise", label: "Шум", icon: "🔊", color: "text-indigo-500" },
  { id: "other", label: "Другое", icon: "📋", color: "text-gray-500" },
]

export function getCategoryInfo(categoryId: string) {
  return categories.find((c) => c.id === categoryId) || categories[categories.length - 1]
}
