'use client'

import React, { useState, useEffect } from 'react'
import { Editor, Frame, Element, useEditor } from '@craftjs/core'
import { Button } from '@/components/ui/button'
import { Save, ArrowLeft, CheckCircle2, AlertCircle, Monitor, Tablet, Smartphone } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Toolbox } from './Toolbox'
import { SettingsPanel } from './SettingsPanel'
import { craftComponents } from './components'

interface CraftEditorProps {
  content?: any
  onSave: (content: any) => Promise<void>
  pageId: string
}

function EditorContent({ onSave, initialContent }: { onSave: (content: any) => Promise<void>, initialContent?: any }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const { query, actions } = useEditor((state) => ({
    enabled: state.options.enabled,
  }))

  // Load content when available - only once on mount
  useEffect(() => {
    if (initialContent && actions) {
      try {
        // Only load if we don't already have content
        const currentContent = query.serialize()
        const contentObj = typeof currentContent === 'string' ? JSON.parse(currentContent) : currentContent
        const isEmpty = !contentObj || 
          Object.keys(contentObj).length === 0 || 
          (contentObj.ROOT && Object.keys(contentObj.ROOT.nodes || {}).length === 0)
        
        if (isEmpty && initialContent) {
          actions.deserialize(initialContent)
        }
      } catch (error) {
        console.error('Error loading content:', error)
        // If content is invalid, start fresh - don't prevent editor from working
      }
    }
  }, []) // Only run once on mount

  const handleSave = async () => {
    setSaving(true)
    setSaveStatus('idle')
    try {
      const json = query.serialize()
      await onSave(json)
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      console.error('Error saving:', error)
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const viewportWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar - Toolbox */}
      <div className="w-72 border-r bg-white shadow-sm overflow-y-auto">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-gray-600">Components</h2>
        </div>
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
            <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90">
              {saving ? 'Saving...' : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
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
                <Element
                  is="div"
                  canvas
                  className="min-h-[600px] w-full"
                >
                  {/* Start building by dragging components here */}
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
  return (
    <Editor resolver={craftComponents}>
      <EditorContent onSave={onSave} initialContent={content} />
    </Editor>
  )
}
