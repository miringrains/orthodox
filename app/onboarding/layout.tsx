'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ProgressStepper } from '@/components/onboarding/ProgressStepper'

const steps = [
  { id: 'questions', label: 'About Your Parish', href: '/onboarding/questions' },
  { id: 'plan', label: 'Choose Plan', href: '/onboarding/plan' },
  { id: 'addons', label: 'Add-ons', href: '/onboarding/addons' },
  { id: 'complete', label: 'Complete', href: '/onboarding/complete' },
]

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Determine current step based on pathname
  const getCurrentStep = () => {
    if (pathname.includes('/questions')) return 0
    if (pathname.includes('/plan')) return 1
    if (pathname.includes('/addons')) return 2
    if (pathname.includes('/complete')) return 3
    return 0
  }

  const currentStep = getCurrentStep()

  return (
    <div className="min-h-screen bg-[#F6F5F2]">
      {/* Header with logo */}
      <header className="pt-8 pb-6 px-4">
        <div className="max-w-4xl mx-auto flex justify-center">
          <Image
            src="/projectorthv2.svg"
            alt="Project Orthodox"
            width={80}
            height={80}
            className="h-16 w-auto"
            priority
          />
        </div>
      </header>

      {/* Progress stepper */}
      <div className="px-4 pb-8">
        <ProgressStepper steps={steps} currentStep={currentStep} />
      </div>

      {/* Main content */}
      <main className="px-4 pb-12">
        <div className="max-w-2xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

