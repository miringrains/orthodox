'use client'

import React, { createContext, useContext, ReactNode } from 'react'

interface ParishContextType {
  parishId: string | null
  parishSlug: string | null
  parishName: string | null
  // Indicates if we're in preview/render mode vs editor mode
  isEditorMode: boolean
}

const ParishContext = createContext<ParishContextType | undefined>(undefined)

interface ParishProviderProps {
  children: ReactNode
  parishId: string | null
  parishSlug: string | null
  parishName?: string | null
  isEditorMode?: boolean
}

export function ParishProvider({ 
  children, 
  parishId, 
  parishSlug, 
  parishName = null,
  isEditorMode = true 
}: ParishProviderProps) {
  return (
    <ParishContext.Provider
      value={{
        parishId,
        parishSlug,
        parishName,
        isEditorMode,
      }}
    >
      {children}
    </ParishContext.Provider>
  )
}

export function useParishContext() {
  const context = useContext(ParishContext)
  // Return default values if context is not available
  if (context === undefined) {
    return {
      parishId: null,
      parishSlug: null,
      parishName: null,
      isEditorMode: true,
    }
  }
  return context
}

