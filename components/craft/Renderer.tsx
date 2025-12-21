'use client'

import { useEffect } from 'react'
import { Editor, Frame } from '@craftjs/core'
import { FontProvider } from './contexts/FontContext'
import { craftComponents } from './components'
import { AVAILABLE_FONTS, generateFontUrl } from '@/lib/fonts'

interface CraftRendererProps {
  content?: any
}

/**
 * Helper to load a single font
 */
function loadFont(fontFamily: string) {
  if (!fontFamily || fontFamily === 'inherit') return
  
  const font = AVAILABLE_FONTS.find(f => f.family === fontFamily)
  if (!font) return
  
  const url = generateFontUrl(fontFamily)
  if (!url) return
  
  // Check if already loaded
  const existingLink = document.querySelector(`link[href="${url}"]`)
  if (existingLink) return
  
  // Create and append link element
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = url
  document.head.appendChild(link)
}

/**
 * Component to dynamically load Google Fonts on the public page
 */
function FontLoader({ fonts }: { fonts: { headingFont?: string; bodyFont?: string; buttonFont?: string } }) {
  useEffect(() => {
    if (fonts.headingFont) loadFont(fonts.headingFont)
    if (fonts.bodyFont) loadFont(fonts.bodyFont)
    if (fonts.buttonFont) loadFont(fonts.buttonFont)
  }, [fonts.headingFont, fonts.bodyFont, fonts.buttonFont])
  
  return null
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
        {/* Load all fonts from Google Fonts */}
        <FontLoader fonts={globalFonts} />
        
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
