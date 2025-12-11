"use client"

import { MapProvider } from "@/components/providers/map-provider"
import { RequestsProvider } from "@/store/requests-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { UserProvider } from "@/store/user-provider"
import MainLayout from "@/components/main-layout"
import OnboardingFlow from "@/components/onboarding-flow"

export default function Home() {
  return (
    <ThemeProvider>
      <UserProvider>
        <RequestsProvider>
          <MapProvider>
            <OnboardingFlow>
              <MainLayout />
            </OnboardingFlow>
          </MapProvider>
        </RequestsProvider>
      </UserProvider>
    </ThemeProvider>
  )
}
