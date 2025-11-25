'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Puck, Render } from '@measured/puck'
import { config } from '@/components/puck/registry'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export default function BuilderPage() {
  const params = useParams()
  const router = useRouter()
  const pageId = params.id as string
  const supabase = createClient()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    async function loadPage() {
      try {
        const { data: page, error } = await supabase
          .from('pages')
          .select('*')
          .eq('id', pageId)
          .single()

        if (error) {
          console.error('Error loading page:', error)
          setErrorMessage('Failed to load page. Please refresh the page.')
          setLoading(false)
          return
        }

        if (page?.builder_schema) {
          setData(page.builder_schema)
        } else {
          setData({ content: [], root: {} })
        }
        setLoading(false)
      } catch (error) {
        console.error('Error loading page:', error)
        setErrorMessage('Failed to load page. Please refresh the page.')
        setLoading(false)
      }
    }
    loadPage()
  }, [pageId, supabase])

  // Track changes to detect unsaved modifications
  useEffect(() => {
    if (data !== null) {
      setHasUnsavedChanges(true)
    }
  }, [data])

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  const handleSave = async () => {
    if (!data) {
      setErrorMessage('No data to save')
      setSaveStatus('error')
      return
    }

    setSaving(true)
    setSaveStatus('idle')
    setErrorMessage('')

    try {
      // Update both builder_schema and builder_enabled flag
      const { error } = await supabase
        .from('pages')
        .update({
          builder_schema: data,
          builder_enabled: true, // Ensure builder is enabled when saving schema
        })
        .eq('id', pageId)

      if (error) {
        throw error
      }

      setSaveStatus('success')
      setHasUnsavedChanges(false)

      // Clear success message after 2 seconds
      setTimeout(() => {
        setSaveStatus('idle')
      }, 2000)

      // Optionally redirect after successful save
      // router.push('/admin/pages')
      // router.refresh()
    } catch (error: any) {
      console.error('Error saving page:', error)
      setSaveStatus('error')
      setErrorMessage(
        error?.message || 'Failed to save page. Please check your connection and try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading page builder...</span>
        </div>
      </div>
    )
  }

  if (errorMessage && !data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <span>{errorMessage}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b bg-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Page Builder</h1>
          {saveStatus === 'success' && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm">Saved successfully!</span>
            </div>
          )}
          {saveStatus === 'error' && errorMessage && (
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{errorMessage}</span>
            </div>
          )}
          {hasUnsavedChanges && saveStatus === 'idle' && (
            <span className="text-xs text-muted-foreground">Unsaved changes</span>
          )}
        </div>
        <Button onClick={handleSave} disabled={saving || !data}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save
            </>
          )}
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        {data && <Puck config={config} data={data} onPublish={setData} />}
      </div>
    </div>
  )
}

