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
        relative w-full text-left p-5 rounded-xl transition-all
        ${isSelected
          ? 'bg-neutral-900 dark:bg-neutral-100 shadow-lg'
          : 'bg-white dark:bg-neutral-900 shadow-md hover:shadow-lg'
        }
      `}
    >
      {/* Selection indicator */}
      <div
        className={`
          absolute top-4 right-4 w-5 h-5 rounded-full 
          flex items-center justify-center transition-all
          ${isSelected
            ? 'bg-white dark:bg-neutral-900'
            : 'border-2 border-neutral-200 dark:border-neutral-700'
          }
        `}
      >
        {isSelected && <Check className="h-3 w-3 text-neutral-900 dark:text-neutral-100" />}
      </div>

      {/* Icon */}
      <div className={`
        w-10 h-10 rounded-lg flex items-center justify-center mb-4
        ${isSelected 
          ? 'bg-white/10 dark:bg-neutral-900/10' 
          : 'bg-neutral-100 dark:bg-neutral-800'
        }
      `}>
        <Icon className={`h-5 w-5 ${
          isSelected 
            ? 'text-white dark:text-neutral-900' 
            : 'text-neutral-600 dark:text-neutral-400'
        }`} />
      </div>

      {/* Content */}
      <h3 className={`font-semibold pr-8 ${
        isSelected 
          ? 'text-white dark:text-neutral-900' 
          : 'text-neutral-900 dark:text-neutral-100'
      }`}>
        {name}
      </h3>
      <p className={`text-sm mt-1 ${
        isSelected 
          ? 'text-white/70 dark:text-neutral-900/70' 
          : 'text-neutral-500'
      }`}>
        {description}
      </p>
      
      {/* Price */}
      <div className="mt-3">
        <span className={`text-sm font-medium ${
          isSelected 
            ? 'text-gold-300 dark:text-gold-600' 
            : 'text-gold-600 dark:text-gold-400'
        }`}>
          {price}
        </span>
      </div>
    </button>
  )
}
