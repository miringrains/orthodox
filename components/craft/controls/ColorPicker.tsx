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

export function ColorPicker({ label, value, onChange, placeholder = '#000000' }: ColorPickerProps) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-2 mt-2">
        <Input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-20 cursor-pointer"
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

