'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ShadowControlProps {
  value: string
  onChange: (value: string) => void
}

const presetShadows = [
  { value: 'none', label: 'None' },
  { value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', label: 'Small' },
  { value: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', label: 'Medium' },
  { value: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', label: 'Large' },
  { value: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', label: 'XL' },
  { value: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', label: '2XL' },
]

export function ShadowControl({ value, onChange }: ShadowControlProps) {
  const selectedPreset = presetShadows.find(p => p.value === value)?.label || 'Custom'

  return (
    <div>
      <Label>Box Shadow</Label>
      <Select value={selectedPreset} onValueChange={(label) => {
        const preset = presetShadows.find(p => p.label === label)
        if (preset) {
          onChange(preset.value)
        }
      }}>
        <SelectTrigger className="mt-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {presetShadows.map((preset) => (
            <SelectItem key={preset.value} value={preset.label}>
              {preset.label}
            </SelectItem>
          ))}
          <SelectItem value="Custom">Custom</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="text"
        value={value || 'none'}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0px 0px 0px 0px rgba(0,0,0,0)"
        className="mt-2"
      />
    </div>
  )
}


