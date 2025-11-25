'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FontSelector } from './controls/FontSelector'
import { useFontContext } from './contexts/FontContext'

export function GlobalSettings() {
  const { fontFamily, baseFontSize, baseFontWeight, setFontFamily, setBaseFontSize, setBaseFontWeight } = useFontContext()

  return (
    <div className="p-4 border-b bg-gray-50">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Global Font Settings</h3>
      <div className="space-y-4">
        <FontSelector
          label="Font Family"
          value={fontFamily}
          onChange={setFontFamily}
        />

        <div>
          <Label>Base Font Size</Label>
          <Input
            type="text"
            value={baseFontSize}
            onChange={(e) => setBaseFontSize(e.target.value)}
            placeholder="16px"
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">e.g., 16px, 1rem, 1em</p>
        </div>

        <div>
          <Label>Base Font Weight</Label>
          <Select
            value={baseFontWeight}
            onValueChange={setBaseFontWeight}
          >
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="300">Light</SelectItem>
              <SelectItem value="400">Regular</SelectItem>
              <SelectItem value="500">Medium</SelectItem>
              <SelectItem value="600">Semi Bold</SelectItem>
              <SelectItem value="700">Bold</SelectItem>
              <SelectItem value="800">Extra Bold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

