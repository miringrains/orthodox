'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface FontContextType {
  // Three simple font selections
  headingFont: string
  bodyFont: string
  buttonFont: string
  // Base sizing
  baseFontSize: string
  // Setters
  setHeadingFont: (font: string) => void
  setBodyFont: (font: string) => void
  setButtonFont: (font: string) => void
  setBaseFontSize: (size: string) => void
}

const FontContext = createContext<FontContextType | undefined>(undefined)

interface FontProviderProps {
  children: ReactNode
  initialFonts?: {
    headingFont?: string
    bodyFont?: string
    buttonFont?: string
    baseFontSize?: string
    // Legacy support
    fontFamily?: string
  }
}

export function FontProvider({ children, initialFonts }: FontProviderProps) {
  // Support legacy fontFamily by mapping to all three
  const legacyFont = initialFonts?.fontFamily || 'inherit'
  
  const [headingFont, setHeadingFont] = useState(initialFonts?.headingFont || legacyFont)
  const [bodyFont, setBodyFont] = useState(initialFonts?.bodyFont || legacyFont)
  const [buttonFont, setButtonFont] = useState(initialFonts?.buttonFont || legacyFont)
  const [baseFontSize, setBaseFontSize] = useState(initialFonts?.baseFontSize || '16px')

  return (
    <FontContext.Provider
      value={{
        headingFont,
        bodyFont,
        buttonFont,
        baseFontSize,
        setHeadingFont,
        setBodyFont,
        setButtonFont,
        setBaseFontSize,
      }}
    >
      {children}
    </FontContext.Provider>
  )
}

export function useFontContext() {
  const context = useContext(FontContext)
  // Return default values if context is not available (e.g., in settings panel preview)
  if (context === undefined) {
    return {
      headingFont: 'inherit',
      bodyFont: 'inherit',
      buttonFont: 'inherit',
      baseFontSize: '16px',
      setHeadingFont: () => {},
      setBodyFont: () => {},
      setButtonFont: () => {},
      setBaseFontSize: () => {},
    }
  }
  return context
}
