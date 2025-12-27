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

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-9 h-9 rounded-full flex items-center justify-center
                    text-sm font-medium transition-all
                    ${isCompleted 
                      ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900' 
                      : isCurrent 
                        ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 ring-4 ring-neutral-900/10 dark:ring-neutral-100/20' 
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span 
                  className={`
                    mt-2 text-xs font-medium whitespace-nowrap
                    ${isCurrent 
                      ? 'text-neutral-900 dark:text-neutral-100' 
                      : isCompleted 
                        ? 'text-neutral-600 dark:text-neutral-400' 
                        : 'text-neutral-400 dark:text-neutral-500'
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
                    flex-1 h-px mx-4 mt-[-1.5rem]
                    ${isCompleted ? 'bg-neutral-900 dark:bg-neutral-100' : 'bg-neutral-200 dark:bg-neutral-700'}
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
