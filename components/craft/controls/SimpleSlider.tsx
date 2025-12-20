'use client'

import React from 'react'
import { Label } from '@/components/ui/label'

interface SimpleSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  unit?: string
}

/**
 * A clean, simple slider control with just slider + value display.
 * No redundant progress bars or complex UI.
 */
export function SimpleSlider({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 100,
  unit = 'px'
}: SimpleSliderProps) {
  return (
    <div>
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <div className="mt-2">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{min}{unit}</span>
          <span className="font-medium text-gray-700">{value}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    </div>
  )
}

interface SpacingSliderProps {
  label: string
  value: { top: number; right: number; bottom: number; left: number }
  onChange: (value: { top: number; right: number; bottom: number; left: number }) => void
  max?: number
}

/**
 * A simple unified spacing slider that sets all 4 sides at once.
 * For most use cases, users want uniform padding/margin.
 */
export function SpacingSlider({ 
  label, 
  value, 
  onChange,
  max = 80
}: SpacingSliderProps) {
  // Use the top value as the "unified" value for display
  const unifiedValue = value?.top || 0

  const handleChange = (newValue: number) => {
    onChange({ top: newValue, right: newValue, bottom: newValue, left: newValue })
  }

  return (
    <SimpleSlider
      label={label}
      value={unifiedValue}
      onChange={handleChange}
      min={0}
      max={max}
      unit="px"
    />
  )
}

interface OpacitySliderProps {
  label: string
  value: number
  onChange: (value: number) => void
}

/**
 * A simple opacity slider (0-100%).
 */
export function OpacitySlider({ 
  label, 
  value, 
  onChange
}: OpacitySliderProps) {
  return (
    <div>
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <div className="mt-2">
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span className="font-medium text-gray-700">{value}%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  )
}





