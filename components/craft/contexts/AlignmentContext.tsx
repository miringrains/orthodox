'use client'

import React, { createContext, useContext, ReactNode } from 'react'

interface AlignmentContextType {
  align: 'left' | 'center' | 'right'
}

const AlignmentContext = createContext<AlignmentContextType | undefined>(undefined)

export function AlignmentProvider({ 
  children, 
  align 
}: { 
  children: ReactNode
  align: 'left' | 'center' | 'right'
}) {
  return (
    <AlignmentContext.Provider value={{ align }}>
      {children}
    </AlignmentContext.Provider>
  )
}

export function useAlignmentContext() {
  const context = useContext(AlignmentContext)
  if (context === undefined) {
    return { align: 'center' as const }
  }
  return context
}

