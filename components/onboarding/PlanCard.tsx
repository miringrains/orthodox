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
        relative rounded-xl border-2 p-6 transition-all
        ${isSelected
          ? 'border-[#C9A227] bg-[#F4EBD3]/50 shadow-lg'
          : isRecommended
            ? 'border-[#C9A227]/50 bg-white shadow-md'
            : 'border-[#D1CEC8] bg-white hover:border-[#C9A227]/30'
        }
      `}
    >
      {/* Recommended badge */}
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#C9A227] text-[#1A1405]">
            Recommended
          </span>
        </div>
      )}

      {/* Plan header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-[#0B0B0B]">{name}</h3>
        <div className="mt-3">
          <span className="text-3xl font-bold text-[#0B0B0B]">{price}</span>
          {price !== 'Free' && (
            <span className="text-[#6A6761]">/{period}</span>
          )}
        </div>
        <p className="mt-2 text-sm text-[#6A6761]">{description}</p>
      </div>

      {/* Features list */}
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className="h-5 w-5 text-[#1F4D3A] flex-shrink-0 mt-0.5" />
            <span className="text-sm text-[#3A3A3A]">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Select button */}
      <Button
        onClick={onSelect}
        variant={isSelected ? 'gold' : 'outline'}
        className="w-full"
      >
        {isSelected ? 'Selected' : 'Select Plan'}
      </Button>
    </div>
  )
}

