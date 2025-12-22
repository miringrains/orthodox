'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface LayoutContextType {
  navbarHeight: number
  navbarMode: 'static' | 'overlay'
  setNavbarHeight: (height: number) => void
  setNavbarMode: (mode: 'static' | 'overlay') => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [navbarHeight, setNavbarHeight] = useState(0)
  const [navbarMode, setNavbarMode] = useState<'static' | 'overlay'>('static')

  return (
    <LayoutContext.Provider
      value={{
        navbarHeight,
        navbarMode,
        setNavbarHeight,
        setNavbarMode,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayoutContext() {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    return {
      navbarHeight: 0,
      navbarMode: 'static' as const,
      setNavbarHeight: () => {},
      setNavbarMode: () => {},
    }
  }
  return context
}

