'use client'

import React, { useState, useRef } from 'react'
import { Editor, Frame, Element, useEditor } from '@craftjs/core'
import { Button } from '@/components/ui/button'
import { Save, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Toolbox } from './Toolbox'
import { SettingsPanel } from './SettingsPanel'
import { craftComponents } from './components'

interface CraftEditorProps {
  content?: any
  onSave: (content: any) => Promise<void>
  pageId: string
}

function EditorContent({ onSave }: { onSave: (content: any) => Promise<void> }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const { query } = useEditor((state) => ({
    enabled: state.options.enabled,
  }))

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

  return (
    <div className="flex h-screen">
      {/* Left Sidebar - Toolbox */}
      <div className="w-64 border-r bg-card overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Components</h2>
        </div>
        <Toolbox />
      </div>

      {/* Center - Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="border-b bg-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/admin/pages')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold">Page Builder</h1>
          </div>
          <div className="flex items-center gap-2">
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
            <Button onClick={handleSave} disabled={saving}>
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
          <div className="flex-1 overflow-auto bg-gray-50 p-8">
            <Frame>
              <Element is="div" canvas>
                {/* Start building by dragging components here */}
              </Element>
            </Frame>
          </div>
      </div>

      {/* Right Sidebar - Settings */}
      <div className="w-80 border-l bg-card overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Settings</h2>
        </div>
        <SettingsPanel />
      </div>
    </div>
  )
}

export function CraftEditor({ content, onSave, pageId }: CraftEditorProps) {
  return (
    <Editor resolver={craftComponents}>
      <Frame data={content}>
        <EditorContent onSave={onSave} />
      </Frame>
    </Editor>
  )
}
