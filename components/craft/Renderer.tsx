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
    // Parse content if it's a string (handles double-encoded legacy data)
    let parsedContent = content
    if (typeof content === 'string') {
      try {
        parsedContent = JSON.parse(content)
        // Handle double-encoded JSON (legacy bug fix)
        if (typeof parsedContent === 'string') {
          parsedContent = JSON.parse(parsedContent)
        }
      } catch (e) {
        console.error('Failed to parse content:', e)
        return (
          <div className="container mx-auto px-4 py-12">
            <div className="text-center text-destructive">
              <p>Invalid page content format.</p>
            </div>
          </div>
        )
      }
    }

    // Extract global font settings (stored at top level)
    const globalFonts = parsedContent?.globalFonts || {}
    
    // Build clean Craft.js content by excluding globalFonts
    // Craft.js expects only node entries (ROOT, nodeId, etc.)
    const craftContent: Record<string, any> = {}
    for (const [key, value] of Object.entries(parsedContent)) {
      if (key !== 'globalFonts') {
        craftContent[key] = value
      }
    }
    
    // If there's no ROOT node, return empty
    if (!craftContent.ROOT) {
      return (
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-muted-foreground">
            <p>This page has no content yet.</p>
          </div>
        </div>
      )
    }
    
    return (
      <FontProvider initialFonts={globalFonts}>
        <div
          style={{
            fontFamily: globalFonts.fontFamily && globalFonts.fontFamily !== 'inherit' ? globalFonts.fontFamily : undefined,
            fontSize: globalFonts.baseFontSize || '16px',
            fontWeight: globalFonts.baseFontWeight || 'normal',
          }}
        >
          <Editor enabled={false} resolver={craftComponents}>
            <Frame data={JSON.stringify(craftContent)} />
          </Editor>
        </div>
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
