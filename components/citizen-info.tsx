"use client"

import { useState } from "react"
import { Card } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Search, User, MapPin, Phone, Mail, FileText } from "lucide-react"
import { getCitizenData, type CitizenData } from "@/lib/citizen-data"
import { motion, AnimatePresence } from "framer-motion"

export default function CitizenInfo() {
  const [searchIIN, setSearchIIN] = useState("")
  const [citizenData, setCitizenData] = useState<CitizenData | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = () => {
    if (searchIIN.length !== 12) return

    setIsSearching(true)
    // Simulate search delay
    setTimeout(() => {
      const data = getCitizenData(searchIIN)
      setCitizenData(data)
      setIsSearching(false)
    }, 300)
  }

  return (
    <div className="absolute top-20 right-4 z-[1000] w-80">
      <Card className="p-4 border bg-background">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Информация о гражданине</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="search-iin">ИИН для поиска</Label>
            <div className="flex gap-2">
              <Input
                id="search-iin"
                type="text"
                placeholder="000000000000"
                value={searchIIN}
                onChange={(e) => setSearchIIN(e.target.value.replace(/\D/g, "").slice(0, 12))}
                maxLength={12}
                className="flex-1"
              />
              <Button onClick={handleSearch} size="icon" disabled={searchIIN.length !== 12 || isSearching}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {citizenData && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3 pt-2 border-t"
              >
                <div className="space-y-1">
                  <div className="flex items-start gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{citizenData.fullName}</p>
                      <p className="text-xs text-muted-foreground">ИИН: {citizenData.iin}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">{citizenData.address}</p>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-muted-foreground">{citizenData.phone}</p>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-muted-foreground break-all">{citizenData.email}</p>
                </div>

                <div className="flex items-center gap-2 text-sm pt-2 border-t">
                  <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                  <p>
                    <span className="font-medium">{citizenData.requestsCount}</span>{" "}
                    <span className="text-muted-foreground">поданных заявок</span>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  )
}
