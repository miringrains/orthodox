'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface SettingsAccordionProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}

/**
 * Collapsible accordion section for organizing settings.
 * Simple, clean design that matches the editor aesthetic.
 */
export function SettingsAccordion({ 
  title, 
  defaultOpen = false, 
  children 
}: SettingsAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 px-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">{title}</span>
        <ChevronDown 
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  )
}

