'use client'

import React, { useState, useEffect } from 'react'
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

interface CraftEditorProps {
  content?: any
  onSave: (content: any) => Promise<void>
  pageId: string
}

function EditorContent({ onSave, initialContent, pageId }: { onSave: (content: any) => Promise<void>, initialContent?: any, pageId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [previewing, setPreviewing] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [showTemplatePicker, setShowTemplatePicker] = useState(false)
  const [hasCheckedEmpty, setHasCheckedEmpty] = useState(false)
  const { query, actions } = useEditor((state) => ({
    enabled: state.options.enabled,
  }))
  const { fontFamily, baseFontSize, baseFontWeight, setFontFamily, setBaseFontSize, setBaseFontWeight } = useFontContext()

  // Check if editor is empty and show template picker
  useEffect(() => {
    if (hasCheckedEmpty) return
    
    // Check if there's no initial content
    if (!initialContent) {
      setShowTemplatePicker(true)
      setHasCheckedEmpty(true)
      return
    }

    try {
      const parsed = typeof initialContent === 'string' ? JSON.parse(initialContent) : initialContent
      // Check if content only has ROOT with empty nodes
      const { globalFonts: _, ...craftContent } = parsed
      const isEmpty = !craftContent || 
        Object.keys(craftContent).length === 0 ||
        (craftContent.ROOT && (!craftContent.ROOT.nodes || craftContent.ROOT.nodes.length === 0))
      
      if (isEmpty) {
        setShowTemplatePicker(true)
      }
    } catch {
      setShowTemplatePicker(true)
    }
    setHasCheckedEmpty(true)
  }, [initialContent, hasCheckedEmpty])

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl+D to duplicate
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault()
        const [selected] = query.getEvent('selected').last() || []
        if (selected) {
          try {
            // Serialize entire editor and extract node tree
            const serialized = query.serialize()
            const content = typeof serialized === 'string' ? JSON.parse(serialized) : serialized
            
            // Extract the node tree starting from selected
            const extractNodeTree = (nodeId: string, tree: any): any => {
              if (!tree || !tree[nodeId]) return null
              
              const node = tree[nodeId]
              const result: any = {
                type: node.type,
                props: { ...node.props },
                nodes: {},
                custom: { ...node.custom },
              }
              
              if (node.nodes && Array.isArray(node.nodes)) {
                node.nodes.forEach((childId: string) => {
                  const childTree = extractNodeTree(childId, tree)
                  if (childTree) {
                    result.nodes[childId] = childTree
                  }
                })
              }
              
              return result
            }
            
            const nodeTree = extractNodeTree(selected, content)
            if (nodeTree) {
              const newNodeId = `node_${Date.now()}`
              const newTree: any = { [newNodeId]: nodeTree }
              
              // Find parent by searching through the tree
              let parentId = 'ROOT'
              const findParent = (tree: any, targetId: string, currentParent: string = 'ROOT'): string | null => {
                if (!tree || typeof tree !== 'object') return null
                
                for (const [id, node] of Object.entries(tree)) {
                  if (id === targetId) return currentParent
                  if (node && typeof node === 'object' && (node as any).nodes) {
                    const found = findParent((node as any).nodes, targetId, id)
                    if (found) return found
                  }
                }
                return null
              }
              
              const foundParent = findParent(content, selected)
              if (foundParent) parentId = foundParent
              
              actions.addNodeTree(newTree, parentId)
            }
          } catch (error) {
            console.error('Error duplicating:', error)
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [query, actions])

  // Load content when available - only once on mount
  useEffect(() => {
    if (initialContent && actions) {
      try {
        // Parse initial content to extract global fonts
        const parsedContent = typeof initialContent === 'string' ? JSON.parse(initialContent) : initialContent
        if (parsedContent?.globalFonts) {
          // Update font context with saved fonts
          if (parsedContent.globalFonts.fontFamily) setFontFamily(parsedContent.globalFonts.fontFamily)
          if (parsedContent.globalFonts.baseFontSize) setBaseFontSize(parsedContent.globalFonts.baseFontSize)
          if (parsedContent.globalFonts.baseFontWeight) setBaseFontWeight(parsedContent.globalFonts.baseFontWeight)
        }
        
        // Only load if we don't already have content
        const currentContent = query.serialize()
        const contentObj = typeof currentContent === 'string' ? JSON.parse(currentContent) : currentContent
        const isEmpty = !contentObj || 
          Object.keys(contentObj).length === 0 || 
          (contentObj.ROOT && Object.keys(contentObj.ROOT.nodes || {}).length === 0)
        
        if (isEmpty && initialContent) {
          // Deserialize without globalFonts (they're handled separately)
          const contentToDeserialize = typeof initialContent === 'string' ? JSON.parse(initialContent) : initialContent
          const { globalFonts: _, ...craftContent } = contentToDeserialize
          actions.deserialize(JSON.stringify(craftContent))
        }
      } catch (error) {
        console.error('Error loading content:', error)
        // If content is invalid, start fresh - don't prevent editor from working
      }
    }
  }, [actions, query, setFontFamily, setBaseFontSize, setBaseFontWeight, initialContent])

  const handleSave = async () => {
    setSaving(true)
    setSaveStatus('idle')
    try {
      const serialized = query.serialize()
      // Include global font settings in saved content
      const contentWithFonts = {
        ...(typeof serialized === 'string' ? JSON.parse(serialized) : serialized),
        globalFonts: {
          fontFamily,
          baseFontSize,
          baseFontWeight,
        },
      }
      await onSave(JSON.stringify(contentWithFonts))
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 2000)
      return true
    } catch (error) {
      console.error('Error saving:', error)
      setSaveStatus('error')
      return false
    } finally {
      setSaving(false)
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
      console.log('Applying template:', template.id)
      
      // Apply template fonts
      setFontFamily(template.globalFonts.fontFamily)
      setBaseFontSize(template.globalFonts.baseFontSize)
      setBaseFontWeight(template.globalFonts.baseFontWeight)

      // Parse template content
      const templateContent = JSON.parse(template.craftSchema)
      console.log('Template content:', templateContent)
      
      // Clear current content first by resetting to empty state
      // Then deserialize the template
      const serialized = JSON.stringify(templateContent)
      console.log('Serialized for deserialize:', serialized.substring(0, 200) + '...')
      
      actions.deserialize(serialized)
      
      console.log('Template applied successfully')
      setShowTemplatePicker(false)
    } catch (error) {
      console.error('Error applying template:', error)
      alert('Failed to apply template. Check console for details.')
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
              }}
            >
              <Frame>
                <div
                  style={{
                    fontFamily: fontFamily !== 'inherit' ? fontFamily : undefined,
                    fontSize: baseFontSize,
                    fontWeight: baseFontWeight,
                    minHeight: '600px',
                    width: '100%',
                  }}
                >
                  <Element
                    is="div"
                    canvas
                    className="min-h-[600px] w-full"
                  >
                    {/* Start building by dragging components here */}
                  </Element>
                </div>
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
  // Extract global font settings from content if available
  let globalFonts = {}
  try {
    globalFonts = typeof content === 'string' 
      ? (JSON.parse(content)?.globalFonts || {})
      : (content?.globalFonts || {})
  } catch {
    // Invalid content, use default fonts
  }
  
  return (
    <FontProvider initialFonts={globalFonts}>
      <Editor 
        resolver={craftComponents}
        onRender={({ render }) => {
          // Ensure related settings are populated on nodes
          return render
        }}
      >
        <EditorContent onSave={onSave} initialContent={content} pageId={pageId} />
      </Editor>
    </FontProvider>
  )
}
