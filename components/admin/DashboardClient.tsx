'use client'

import { useState } from 'react'
import { OnboardingWizard } from './OnboardingWizard'

interface DashboardClientProps {
  parishId: string
  parishName: string
  showWelcomeModal: boolean
}

export function DashboardClient({ parishId, parishName, showWelcomeModal }: DashboardClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(showWelcomeModal)

  return (
    <OnboardingWizard
      parishId={parishId}
      parishName={parishName}
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    />
  )
}
