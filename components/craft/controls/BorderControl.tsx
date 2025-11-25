'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ColorPicker } from './ColorPicker'

interface BorderControlProps {
  borderRadius?: number
  borderWidth?: number
  borderColor?: string
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none'
  onBorderRadiusChange: (value: number) => void
  onBorderWidthChange: (value: number) => void
  onBorderColorChange: (value: string) => void
  onBorderStyleChange: (value: 'solid' | 'dashed' | 'dotted' | 'none') => void
}

export function BorderControl({
  borderRadius = 0,
  borderWidth = 0,
  borderColor = '#000000',
  borderStyle = 'solid',
  onBorderRadiusChange,
  onBorderWidthChange,
  onBorderColorChange,
  onBorderStyleChange,
}: BorderControlProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Border Radius</Label>
        <Input
          type="number"
          value={borderRadius}
          onChange={(e) => onBorderRadiusChange(parseInt(e.target.value) || 0)}
          className="mt-2"
        />
      </div>

      <div>
        <Label>Border Width</Label>
        <Input
          type="number"
          value={borderWidth}
          onChange={(e) => onBorderWidthChange(parseInt(e.target.value) || 0)}
          className="mt-2"
        />
      </div>

      {borderWidth > 0 && (
        <>
          <ColorPicker
            label="Border Color"
            value={borderColor}
            onChange={onBorderColorChange}
          />
          <div>
            <Label>Border Style</Label>
            <Select value={borderStyle} onValueChange={(value: any) => onBorderStyleChange(value)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="dashed">Dashed</SelectItem>
                <SelectItem value="dotted">Dotted</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  )
}

