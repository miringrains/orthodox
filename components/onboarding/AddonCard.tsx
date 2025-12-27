'use client'

import { Check, LucideIcon } from 'lucide-react'

interface AddonCardProps {
  icon: LucideIcon
  name: string
  description: string
  price: string
  isSelected: boolean
  onToggle: () => void
}

export function AddonCard({
  icon: Icon,
  name,
  description,
  price,
  isSelected,
  onToggle,
}: AddonCardProps) {
  return (
    <button
      onClick={onToggle}
      className={`
        relative w-full text-left p-5 rounded-xl border-2 transition-all
        ${isSelected
          ? 'border-[#C9A227] bg-[#F4EBD3]/50'
          : 'border-[#D1CEC8] bg-white hover:border-[#C9A227]/30'
        }
      `}
    >
      {/* Selection indicator */}
      <div
        className={`
          absolute top-4 right-4 w-6 h-6 rounded-full border-2 
          flex items-center justify-center transition-all
          ${isSelected
            ? 'border-[#C9A227] bg-[#C9A227]'
            : 'border-[#D1CEC8] bg-white'
          }
        `}
      >
        {isSelected && <Check className="h-4 w-4 text-white" />}
      </div>

      {/* Icon */}
      <div className={`
        w-10 h-10 rounded-lg flex items-center justify-center mb-3
        ${isSelected ? 'bg-[#C9A227]/20' : 'bg-[#EEECE6]'}
      `}>
        <Icon className={`h-5 w-5 ${isSelected ? 'text-[#C9A227]' : 'text-[#6A6761]'}`} />
      </div>

      {/* Content */}
      <h3 className="font-semibold text-[#0B0B0B] pr-8">{name}</h3>
      <p className="text-sm text-[#6A6761] mt-1">{description}</p>
      
      {/* Price */}
      <div className="mt-3">
        <span className="text-sm font-medium text-[#C9A227]">{price}</span>
      </div>
    </button>
  )
}

