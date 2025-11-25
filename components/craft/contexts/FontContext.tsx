'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface FontContextType {
  fontFamily: string
  baseFontSize: string
  baseFontWeight: string
  setFontFamily: (font: string) => void
  setBaseFontSize: (size: string) => void
  setBaseFontWeight: (weight: string) => void
}

const FontContext = createContext<FontContextType | undefined>(undefined)

export function FontProvider({ children, initialFonts }: { children: ReactNode, initialFonts?: { fontFamily?: string, baseFontSize?: string, baseFontWeight?: string } }) {
  const [fontFamily, setFontFamily] = useState(initialFonts?.fontFamily || 'inherit')
  const [baseFontSize, setBaseFontSize] = useState(initialFonts?.baseFontSize || '16px')
  const [baseFontWeight, setBaseFontWeight] = useState(initialFonts?.baseFontWeight || 'normal')

  return (
    <FontContext.Provider
      value={{
        fontFamily,
        baseFontSize,
        baseFontWeight,
        setFontFamily,
        setBaseFontSize,
        setBaseFontWeight,
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
      fontFamily: 'inherit',
      baseFontSize: '16px',
      baseFontWeight: 'normal',
      setFontFamily: () => {},
      setBaseFontSize: () => {},
      setBaseFontWeight: () => {},
    }
  }
  return context
}

