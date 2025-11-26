'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface ColorPickerProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

/**
 * Simple color picker - color input + hex text field.
 * Clean and functional without unnecessary complexity.
 */
export function ColorPicker({ label, value, onChange, placeholder = '#000000' }: ColorPickerProps) {
  return (
    <div>
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <div className="flex gap-2 mt-2">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 rounded border border-gray-200 cursor-pointer bg-white"
        />
        <Input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
      </div>
    </div>
  )
}
