'use client'

import { Editor, Frame } from '@craftjs/core'
import { FontProvider } from './contexts/FontContext'
import { craftComponents } from './components'

interface CraftRendererProps {
  content?: any
}

export function CraftRenderer({ content }: CraftRendererProps) {
  if (!content) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-muted-foreground">
          <p>No content available for this page.</p>
        </div>
      </div>
    )
  }

  try {
    // Extract global font settings from content if available
    const globalFonts = content?.globalFonts || {}
    
    return (
      <FontProvider initialFonts={globalFonts}>
        <Editor enabled={false} resolver={craftComponents}>
          <Frame data={content} />
        </Editor>
      </FontProvider>
    )
  } catch (error) {
    console.error('Error rendering Craft.js content:', error)
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-destructive">
          <p>An error occurred while rendering this page. Please try again later.</p>
        </div>
      </div>
    )
  }
}

