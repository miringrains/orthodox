'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Editor, Frame, Element, useEditor } from '@craftjs/core'
import { Button } from '@/components/ui/button'
import { Save, ArrowLeft, CheckCircle2, AlertCircle, Monitor, Tablet, Smartphone, ExternalLink, Layout } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Toolbox } from './Toolbox'
import { SettingsPanel } from './SettingsPanel'
import { GlobalSettings } from './GlobalSettings'
import { FontProvider, useFontContext } from './contexts/FontContext'
import { craftComponents } from './components'
import { TemplatePicker } from './TemplatePicker'
import type { PageTemplate } from '@/lib/templates'
import { AVAILABLE_FONTS, generateFontUrl } from '@/lib/fonts'

/**
 * Load a font from Google Fonts
 */
function loadGoogleFont(fontFamily: string) {
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

interface CraftEditorProps {
  content?: any
  onSave: (content: any) => Promise<void>
  pageId: string
}

/**
 * Parse and normalize content from database
 * Handles: null, object, string, double-encoded string
 */
function parseContent(content: any): { craftContent: any; globalFonts: any } | null {
  if (!content) return null
  
  try {
    let parsed = content
    
    // Parse if string
    if (typeof parsed === 'string') {
      parsed = JSON.parse(parsed)
    }
    
    // Handle double-encoded JSON (legacy bug)
    if (typeof parsed === 'string') {
      parsed = JSON.parse(parsed)
    }
    
    // Extract globalFonts and craft content
    const { globalFonts, ...craftContent } = parsed
    
    // Verify we have actual content
    if (!craftContent.ROOT?.nodes?.length) {
      return null
    }
    
    return { craftContent, globalFonts: globalFonts || {} }
  } catch (error) {
    console.error('Error parsing content:', error)
    return null
  }
}

function EditorContent({ 
  onSave, 
  pageId,
  initialCraftData,
}: { 
  onSave: (content: any) => Promise<void>
  pageId: string
  initialCraftData: string | null
}) {
  const router = useRouter()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [previewing, setPreviewing] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [showTemplatePicker, setShowTemplatePicker] = useState(!initialCraftData)
  
  const { query, actions } = useEditor((state) => ({
    enabled: state.options.enabled,
  }))
  const { 
    headingFont, 
    bodyFont, 
    buttonFont, 
    baseFontSize,
    setHeadingFont,
    setBodyFont,
    setButtonFont,
    setBaseFontSize,
  } = useFontContext()

  // Load fonts from Google Fonts when they change
  useEffect(() => {
    loadGoogleFont(headingFont)
    loadGoogleFont(bodyFont)
    loadGoogleFont(buttonFont)
  }, [headingFont, bodyFont, buttonFont])

  // Debug: log what Frame received
  useEffect(() => {
    console.log('=== EditorContent MOUNTED ===')
    console.log('initialCraftData exists:', !!initialCraftData)
    console.log('initialCraftData (first 200 chars):', initialCraftData?.substring(0, 200))
    
    // Check current editor state after mount
    setTimeout(() => {
      try {
        const currentState = query.serialize()
        console.log('Editor state after mount:', currentState.substring(0, 300))
      } catch (e) {
        console.log('Error getting editor state:', e)
      }
    }, 500)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl+S to save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [query, headingFont, bodyFont, buttonFont, baseFontSize])

  const handleSave = async () => {
    console.log('=== EDITOR handleSave CALLED ===')
    setSaving(true)
    setSaveStatus('idle')
    try {
      const serialized = query.serialize()
      console.log('query.serialize() type:', typeof serialized)
      console.log('query.serialize() (first 300 chars):', typeof serialized === 'string' ? serialized.substring(0, 300) : JSON.stringify(serialized).substring(0, 300))
      
      // Include global font settings in saved content
      // Pass as object, not string - Supabase jsonb column handles it
      const parsed = typeof serialized === 'string' ? JSON.parse(serialized) : serialized
      console.log('Parsed keys:', Object.keys(parsed))
      console.log('Parsed ROOT exists:', !!parsed.ROOT)
      console.log('Parsed ROOT nodes:', parsed.ROOT?.nodes)
      
      const contentWithFonts = {
        ...parsed,
        globalFonts: {
          headingFont,
          bodyFont,
          buttonFont,
          baseFontSize,
        },
      }
      console.log('contentWithFonts keys:', Object.keys(contentWithFonts))
      
      await onSave(contentWithFonts)
      console.log('onSave completed successfully')
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 2000)
      return true
    } catch (error) {
      console.error('Error saving:', error)
      setSaveStatus('error')
      return false
    } finally {
      setSaving(false)
      console.log('=== END EDITOR handleSave ===')
    }
  }

  const handlePreview = async () => {
    setPreviewing(true)
    try {
      // Save first
      const saved = await handleSave()
      if (!saved) {
        setPreviewing(false)
        return
      }

      // Fetch page details to get parish slug
      const { data: page } = await supabase
        .from('pages')
        .select('parishes(slug)')
        .eq('id', pageId)
        .single()

      const parishSlug = (page?.parishes as any)?.slug
      if (parishSlug) {
        window.open(`/p/${parishSlug}`, '_blank')
      } else {
        console.error('Could not find parish slug for preview')
      }
    } catch (error) {
      console.error('Error previewing:', error)
    } finally {
      setPreviewing(false)
    }
  }

  const handleTemplateSelect = async (template: PageTemplate | null) => {
    if (!template) {
      // User chose "Start from scratch"
      setShowTemplatePicker(false)
      return
    }

    try {
      // Apply template fonts
      setFontFamily(template.globalFonts.fontFamily)
      setBaseFontSize(template.globalFonts.baseFontSize)
      setBaseFontWeight(template.globalFonts.baseFontWeight)

      // The craftSchema is already in Craft.js serialized format
      // Just deserialize it directly - this replaces ALL content
      actions.deserialize(template.craftSchema)
      
      setShowTemplatePicker(false)
    } catch (error) {
      console.error('Error applying template:', error)
      alert('Failed to apply template. Please try again.')
    }
  }

  const viewportWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Template Picker Modal */}
      <TemplatePicker
        open={showTemplatePicker}
        onClose={() => setShowTemplatePicker(false)}
        onSelectTemplate={handleTemplateSelect}
      />

      {/* Left Sidebar - Toolbox */}
      <div className="w-72 border-r bg-white shadow-sm overflow-y-auto">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-gray-600">Components</h2>
        </div>
        <GlobalSettings />
        <Toolbox />
      </div>

      {/* Center - Canvas */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Top Bar */}
        <div className="border-b bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/admin/pages')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-lg font-semibold">Page Builder</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Template Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTemplatePicker(true)}
              title="Choose a template"
            >
              <Layout className="h-4 w-4 mr-2" />
              Templates
            </Button>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('desktop')}
                className="h-8 px-3"
                title="Desktop View"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('tablet')}
                className="h-8 px-3"
                title="Tablet View"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('mobile')}
                className="h-8 px-3"
                title="Mobile View"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
            {saveStatus === 'success' && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm">Saved!</span>
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">Save failed</span>
              </div>
            )}
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => {
                const serialized = query.serialize()
                console.log('=== CRAFT.JS SERIALIZED STATE ===')
                console.log(JSON.stringify(JSON.parse(serialized), null, 2))
                console.log('=================================')
                navigator.clipboard?.writeText(serialized)
                alert('Serialized state logged to console and copied to clipboard!')
              }}
            >
              Debug
            </Button>
            <Button onClick={handleSave} disabled={saving || previewing} className="bg-primary hover:bg-primary/90">
              {saving ? 'Saving...' : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
            <Button 
              onClick={handlePreview} 
              disabled={saving || previewing}
              variant="outline"
              title="Save and preview in new tab"
            >
              {previewing ? 'Opening...' : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto p-8 bg-gray-100">
          <div className="flex justify-center">
            <div
              className="bg-white shadow-2xl rounded-lg overflow-hidden transition-all"
              style={{
                width: viewportWidths[viewMode],
                maxWidth: '100%',
                minHeight: '600px',
                // Apply global fonts to the entire canvas area
                fontFamily: fontFamily !== 'inherit' ? fontFamily : undefined,
                fontSize: baseFontSize,
                fontWeight: baseFontWeight,
              }}
            >
              {/* 
                Per Craft.js docs: Always provide children as the default structure.
                The `json` prop overrides children when present.
              */}
              <Frame json={initialCraftData ?? undefined}>
                <Element
                  is="div"
                  canvas
                  className="min-h-[600px] w-full"
                >
                  {/* Default empty canvas - overridden by json when present */}
                </Element>
              </Frame>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Settings */}
      <div className="w-80 border-l bg-white shadow-sm overflow-y-auto">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-gray-600">Settings</h2>
        </div>
        <SettingsPanel />
      </div>
    </div>
  )
}

export function CraftEditor({ content, onSave, pageId }: CraftEditorProps) {
  // Debug: log what we receive
  console.log('=== CraftEditor MOUNT ===')
  console.log('Raw content type:', typeof content)
  console.log('Raw content:', content)
  
  // Parse content once, before rendering
  const parsed = useMemo(() => {
    const result = parseContent(content)
    console.log('Parsed result:', result)
    return result
  }, [content])
  
  // Extract values for providers
  const globalFonts = parsed?.globalFonts || {}
  
  // Serialize craft content for Frame's data prop (must be a string)
  const initialCraftData = useMemo(() => {
    if (!parsed?.craftContent) {
      console.log('No craft content to serialize')
      return null
    }
    const serialized = JSON.stringify(parsed.craftContent)
    console.log('Serialized craft data (first 200 chars):', serialized.substring(0, 200))
    return serialized
  }, [parsed])
  
  console.log('initialCraftData exists:', !!initialCraftData)
  console.log('=== END CraftEditor MOUNT ===')
  
  return (
    <FontProvider initialFonts={globalFonts}>
      <Editor resolver={craftComponents}>
        <EditorContent 
          onSave={onSave} 
          pageId={pageId} 
          initialCraftData={initialCraftData}
        />
      </Editor>
    </FontProvider>
  )
}
