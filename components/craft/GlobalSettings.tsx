'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { FontSelector } from './controls/FontSelector'
import { useFontContext } from './contexts/FontContext'

export function GlobalSettings() {
  const { 
    headingFont, 
    bodyFont, 
    buttonFont, 
    baseFontSize,
    setHeadingFont, 
    setBodyFont, 
    setButtonFont,
    setBaseFontSize,
  } = useFontContext()

  return (
    <div className="p-4 border-b bg-gray-50">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Site-Wide Fonts
      </h3>
      <div className="space-y-4">
        <FontSelector
          label="Headings"
          value={headingFont}
          onChange={setHeadingFont}
          description="Titles, section headings, navbar"
        />

        <FontSelector
          label="Paragraphs"
          value={bodyFont}
          onChange={setBodyFont}
          description="Body text, descriptions"
        />

        <FontSelector
          label="Buttons"
          value={buttonFont}
          onChange={setButtonFont}
          description="Button labels, CTAs"
        />

        <div>
          <Label className="text-sm font-medium">Base Font Size</Label>
          <Input
            type="text"
            value={baseFontSize}
            onChange={(e) => setBaseFontSize(e.target.value)}
            placeholder="16px"
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">e.g., 16px, 17px, 18px</p>
        </div>
      </div>
    </div>
  )
}
