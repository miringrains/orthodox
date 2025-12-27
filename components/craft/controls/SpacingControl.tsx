'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface SpacingControlProps {
  label: string
  value: { top: number; right: number; bottom: number; left: number }
  onChange: (value: { top: number; right: number; bottom: number; left: number }) => void
}

export function SpacingControl({ label, value, onChange }: SpacingControlProps) {
  const updateValue = (side: 'top' | 'right' | 'bottom' | 'left', newValue: number) => {
    onChange({
      ...value,
      [side]: newValue,
    })
  }

  return (
    <div>
      <Label>{label}</Label>
      <div className="grid grid-cols-4 gap-2 mt-2">
        <div>
          <Label className="text-xs">Top</Label>
          <Input
            type="number"
            value={value.top || 0}
            onChange={(e) => updateValue('top', parseInt(e.target.value) || 0)}
          />
        </div>
        <div>
          <Label className="text-xs">Right</Label>
          <Input
            type="number"
            value={value.right || 0}
            onChange={(e) => updateValue('right', parseInt(e.target.value) || 0)}
          />
        </div>
        <div>
          <Label className="text-xs">Bottom</Label>
          <Input
            type="number"
            value={value.bottom || 0}
            onChange={(e) => updateValue('bottom', parseInt(e.target.value) || 0)}
          />
        </div>
        <div>
          <Label className="text-xs">Left</Label>
          <Input
            type="number"
            value={value.left || 0}
            onChange={(e) => updateValue('left', parseInt(e.target.value) || 0)}
          />
        </div>
      </div>
    </div>
  )
}


