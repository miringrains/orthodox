'use client'

import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PlanCardProps {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  isRecommended?: boolean
  isSelected?: boolean
  onSelect: () => void
}

export function PlanCard({
  name,
  price,
  period,
  description,
  features,
  isRecommended = false,
  isSelected = false,
  onSelect,
}: PlanCardProps) {
  return (
    <div
      className={`
        relative rounded-xl p-6 transition-all
        ${isSelected
          ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-xl'
          : isRecommended
            ? 'bg-white dark:bg-neutral-900 shadow-lg ring-2 ring-gold-500'
            : 'bg-white dark:bg-neutral-900 shadow-md hover:shadow-lg'
        }
      `}
    >
      {/* Recommended badge */}
      {isRecommended && !isSelected && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gold-500 text-neutral-900">
            Recommended
          </span>
        </div>
      )}

      {/* Plan header */}
      <div className="text-center mb-6">
        <h3 className={`text-lg font-semibold ${isSelected ? 'text-white dark:text-neutral-900' : 'text-neutral-900 dark:text-neutral-100'}`}>
          {name}
        </h3>
        <div className="mt-4">
          <span className={`text-4xl font-semibold ${isSelected ? 'text-white dark:text-neutral-900' : 'text-neutral-900 dark:text-neutral-100'}`}>
            {price}
          </span>
          {price !== 'Free' && (
            <span className={`text-sm ${isSelected ? 'text-white/70 dark:text-neutral-900/70' : 'text-neutral-500'}`}>
              /{period}
            </span>
          )}
        </div>
        <p className={`mt-2 text-sm ${isSelected ? 'text-white/80 dark:text-neutral-900/80' : 'text-neutral-500'}`}>
          {description}
        </p>
      </div>

      {/* Features list */}
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
              isSelected 
                ? 'bg-white/20 dark:bg-neutral-900/20' 
                : 'bg-green-50 dark:bg-green-500/10'
            }`}>
              <Check className={`h-3 w-3 ${isSelected ? 'text-white dark:text-neutral-900' : 'text-green-600 dark:text-green-400'}`} />
            </div>
            <span className={`text-sm ${isSelected ? 'text-white/90 dark:text-neutral-900/90' : 'text-neutral-600 dark:text-neutral-400'}`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* Select button */}
      <Button
        onClick={onSelect}
        variant={isSelected ? 'secondary' : 'default'}
        className={`w-full ${
          isSelected 
            ? 'bg-white text-neutral-900 hover:bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800' 
            : ''
        }`}
      >
        {isSelected ? 'Selected' : 'Select Plan'}
      </Button>
    </div>
  )
}
