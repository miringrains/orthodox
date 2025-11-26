'use client'

import React from 'react'
import { Label } from '@/components/ui/label'

interface OpacityControlProps {
  label: string
  value: number // 0-100
  onChange: (value: number) => void
}

/**
 * Simple opacity slider - no redundant progress bar, just a clean slider.
 */
export function OpacityControl({ label, value, onChange }: OpacityControlProps) {
  return (
    <div>
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <div className="mt-2">
        <input
          type="range"
          min={0}
          max={100}
          value={value || 0}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span className="font-medium text-gray-700">{value || 0}%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  )
}
