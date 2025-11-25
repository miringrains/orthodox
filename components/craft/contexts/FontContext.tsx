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
  if (context === undefined) {
    throw new Error('useFontContext must be used within a FontProvider')
  }
  return context
}

