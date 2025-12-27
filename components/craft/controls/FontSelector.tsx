'use client'

import React, { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AVAILABLE_FONTS, getFontsByCategory, generateFontUrl, type FontDefinition } from '@/lib/fonts'

interface FontSelectorProps {
  label: string
  value: string
  onChange: (value: string) => void
  description?: string
}

// Track loaded fonts to avoid duplicate loading
const loadedFonts = new Set<string>()

function loadFont(font: FontDefinition) {
  if (loadedFonts.has(font.family)) return
  
  const url = generateFontUrl(font.family)
  if (!url) return
  
  // Check if already loaded in DOM
  const existingLink = document.querySelector(`link[href="${url}"]`)
  if (existingLink) {
    loadedFonts.add(font.family)
    return
  }
  
  // Create and append link element
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = url
  document.head.appendChild(link)
  loadedFonts.add(font.family)
}

export function FontSelector({ label, value, onChange, description }: FontSelectorProps) {
  const [previewFonts, setPreviewFonts] = useState<Set<string>>(new Set())
  const fontsByCategory = getFontsByCategory()

  const handleFontChange = (newValue: string) => {
    console.log('FontSelector: changing font from', value, 'to', newValue)
    onChange(newValue)
  }

  // Load the currently selected font
  useEffect(() => {
    if (value && value !== 'inherit') {
      const font = AVAILABLE_FONTS.find(f => f.family === value)
      if (font) {
        loadFont(font)
      }
    }
  }, [value])

  // Load font on hover for preview
  const handleFontHover = (fontFamily: string) => {
    const font = AVAILABLE_FONTS.find(f => f.family === fontFamily)
    if (font && !previewFonts.has(fontFamily)) {
      loadFont(font)
      setPreviewFonts(prev => new Set(prev).add(fontFamily))
    }
  }

  return (
    <div>
      <Label className="text-[13px] font-medium text-stone-700 tracking-wide">{label}</Label>
      <Select value={value || 'inherit'} onValueChange={handleFontChange}>
        <SelectTrigger className="mt-1.5 bg-white border-stone-300 text-stone-900">
          <SelectValue>
            {value === 'inherit' ? 'System Default' : 
              AVAILABLE_FONTS.find(f => f.family === value)?.name || value}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[400px]">
          <SelectItem value="inherit">
            <span className="font-medium">System Default</span>
          </SelectItem>
          
          <SelectGroup>
            <SelectLabel className="text-[11px] text-stone-400 uppercase tracking-widest">
              Serif (Traditional)
            </SelectLabel>
            {fontsByCategory.serif.map((font) => (
              <SelectItem 
                key={font.family} 
                value={font.family}
                onMouseEnter={() => handleFontHover(font.family)}
              >
                <span style={{ fontFamily: font.family }}>{font.name}</span>
              </SelectItem>
            ))}
          </SelectGroup>

          <SelectGroup>
            <SelectLabel className="text-[11px] text-stone-400 uppercase tracking-widest">
              Sans-Serif (Modern)
            </SelectLabel>
            {fontsByCategory['sans-serif'].map((font) => (
              <SelectItem 
                key={font.family} 
                value={font.family}
                onMouseEnter={() => handleFontHover(font.family)}
              >
                <span style={{ fontFamily: font.family }}>{font.name}</span>
              </SelectItem>
            ))}
          </SelectGroup>

          <SelectGroup>
            <SelectLabel className="text-[11px] text-stone-400 uppercase tracking-widest">
              Display (Headlines)
            </SelectLabel>
            {fontsByCategory.display.map((font) => (
              <SelectItem 
                key={font.family} 
                value={font.family}
                onMouseEnter={() => handleFontHover(font.family)}
              >
                <span style={{ fontFamily: font.family }}>{font.name}</span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {description && (
        <p className="text-[11px] text-stone-400 mt-1.5 tracking-wide">{description}</p>
      )}
    </div>
  )
}
