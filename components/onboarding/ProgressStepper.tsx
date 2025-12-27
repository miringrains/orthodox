'use client'

import { Check } from 'lucide-react'

interface Step {
  id: string
  label: string
  href: string
}

interface ProgressStepperProps {
  steps: Step[]
  currentStep: number
}

export function ProgressStepper({ steps, currentStep }: ProgressStepperProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isUpcoming = index > currentStep

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    text-sm font-semibold transition-all
                    ${isCompleted 
                      ? 'bg-[#1F4D3A] text-white' 
                      : isCurrent 
                        ? 'bg-[#C9A227] text-[#1A1405]' 
                        : 'bg-[#EEECE6] text-[#6A6761]'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span 
                  className={`
                    mt-2 text-xs font-medium whitespace-nowrap
                    ${isCurrent 
                      ? 'text-[#0B0B0B]' 
                      : isCompleted 
                        ? 'text-[#1F4D3A]' 
                        : 'text-[#6A6761]'
                    }
                  `}
                >
                  {step.label}
                </span>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div 
                  className={`
                    flex-1 h-0.5 mx-4 mt-[-1.5rem]
                    ${isCompleted ? 'bg-[#1F4D3A]' : 'bg-[#D1CEC8]'}
                  `}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

