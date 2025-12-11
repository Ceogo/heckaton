"use client"

import { useState, useEffect, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card } from "./ui/card"
import { MapPin, User } from "lucide-react"
import { useUser } from "@/store/user-provider"

const CITIES = [
  { name: "Алматы", coords: [43.238293, 76.889709] as [number, number] },
  { name: "Астана", coords: [51.169392, 71.449074] as [number, number] },
  { name: "Павлодар", coords: [52.287054, 76.967155] as [number, number] },
]

interface OnboardingFlowProps {
  children: ReactNode
}

export default function OnboardingFlow({ children }: OnboardingFlowProps) {
  const { user, setUser } = useUser()
  const [step, setStep] = useState<"city" | "iin" | "complete">("city")
  const [selectedCity, setSelectedCity] = useState("")
  const [iin, setIin] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (user) {
      setStep("complete")
    }
  }, [user])

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName)
  }

  const handleContinueFromCity = () => {
    if (!selectedCity) {
      setError("Выберите город")
      return
    }
    setError("")
    setStep("iin")
  }

  const handleIINSubmit = () => {
    if (iin.length !== 12 || !/^\d+$/.test(iin)) {
      setError("ИИН должен состоять из 12 цифр")
      return
    }

    setError("")
    const cityData = CITIES.find((c) => c.name === selectedCity)
    setUser({
      iin,
      city: selectedCity,
      cityCoords: cityData?.coords || CITIES[0].coords,
    })
    setStep("complete")
  }

  if (step === "complete") {
    return <>{children}</>
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
      <AnimatePresence mode="wait">
        {step === "city" && (
          <motion.div
            key="city"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md px-4"
          >
            <Card className="p-8 border">
              <div className="flex flex-col items-center gap-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-semibold">Выберите город</h1>
                  <p className="text-muted-foreground">Система подачи заявок для КСК</p>
                </div>

                <div className="w-full space-y-3">
                  {CITIES.map((city) => (
                    <Button
                      key={city.name}
                      variant={selectedCity === city.name ? "default" : "outline"}
                      className="w-full h-14 text-lg"
                      onClick={() => handleCitySelect(city.name)}
                    >
                      {city.name}
                    </Button>
                  ))}
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button onClick={handleContinueFromCity} className="w-full" size="lg">
                  Продолжить
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {step === "iin" && (
          <motion.div
            key="iin"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md px-4"
          >
            <Card className="p-8 border">
              <div className="flex flex-col items-center gap-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-semibold">Введите ИИН</h1>
                  <p className="text-muted-foreground">Для идентификации при подаче заявок</p>
                </div>

                <div className="w-full space-y-2">
                  <Label htmlFor="iin">ИИН (12 цифр)</Label>
                  <Input
                    id="iin"
                    type="text"
                    placeholder="000000000000"
                    value={iin}
                    onChange={(e) => setIin(e.target.value.replace(/\D/g, "").slice(0, 12))}
                    maxLength={12}
                    className="text-center text-lg tracking-wider h-14"
                  />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <div className="w-full flex gap-3">
                  <Button variant="outline" onClick={() => setStep("city")} className="flex-1">
                    Назад
                  </Button>
                  <Button onClick={handleIINSubmit} className="flex-1">
                    Войти
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
