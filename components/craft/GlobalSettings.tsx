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
    <div className="p-4 border-b border-stone-200 bg-stone-50">
      <h3 className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest mb-4">
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
          <Label className="text-[13px] font-medium text-stone-700 tracking-wide">Base Font Size</Label>
          <Input
            type="text"
            value={baseFontSize}
            onChange={(e) => setBaseFontSize(e.target.value)}
            placeholder="16px"
            className="mt-1.5 bg-white border-stone-300 text-stone-900"
          />
          <p className="text-[11px] text-stone-400 mt-1.5 tracking-wide">e.g., 16px, 17px, 18px</p>
        </div>
      </div>
    </div>
  )
}
