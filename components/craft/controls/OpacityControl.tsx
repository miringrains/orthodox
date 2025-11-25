'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface OpacityControlProps {
  label: string
  value: number // 0-100
  onChange: (value: number) => void
}

export function OpacityControl({ label, value, onChange }: OpacityControlProps) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex items-center gap-3 mt-2">
        <Input
          type="range"
          min="0"
          max="100"
          value={value || 0}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className="flex-1"
        />
        <Input
          type="number"
          min="0"
          max="100"
          value={value || 0}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className="w-20"
        />
        <span className="text-sm text-muted-foreground w-8">%</span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${value || 0}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground">{value || 0}%</span>
      </div>
    </div>
  )
}

