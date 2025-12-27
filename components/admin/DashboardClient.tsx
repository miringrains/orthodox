'use client'

import { useState } from 'react'
import { WelcomeModal } from './WelcomeModal'

interface DashboardClientProps {
  parishId: string
  parishName: string
  showWelcomeModal: boolean
}

export function DashboardClient({ parishId, parishName, showWelcomeModal }: DashboardClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(showWelcomeModal)

  return (
    <WelcomeModal
      parishId={parishId}
      parishName={parishName}
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    />
  )
}

