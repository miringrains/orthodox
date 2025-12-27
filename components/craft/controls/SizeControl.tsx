'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface SizeControlProps {
  label: string
  value: string
  onChange: (value: string) => void
  options?: string[]
}

const defaultSizeOptions = [
  'auto',
  '100%',
  '50%',
  '25%',
  '75%',
  '1280px',
  '1024px',
  '768px',
  '640px',
  '100vw',
  '50vw',
]

export function SizeControl({ label, value, onChange, options = defaultSizeOptions }: SizeControlProps) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-2 mt-2">
        <Select value={value || 'auto'} onValueChange={onChange}>
          <SelectTrigger className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Custom"
          className="flex-1"
        />
      </div>
    </div>
  )
}


