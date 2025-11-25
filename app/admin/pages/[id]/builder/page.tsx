'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CraftEditor } from '@/components/craft/Editor'
import { createClient } from '@/lib/supabase/client'
import { Loader2, AlertCircle } from 'lucide-react'

export default function BuilderPage() {
  const params = useParams()
  const router = useRouter()
  const pageId = params.id as string
  const supabase = createClient()
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>('')

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

        // Load builder_schema if it exists
        // Craft.js stores content as JSON, we can load it directly
        const builderData = page?.builder_schema as any
        
        // If no content exists and builder is enabled, load default template
        if (!builderData && page?.builder_enabled) {
          const { getDefaultPageTemplate } = await import('@/lib/page-templates')
          setContent(getDefaultPageTemplate())
        } else {
          setContent(builderData || null)
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

  const handleSave = async (json: any) => {
    const { error } = await supabase
      .from('pages')
      .update({
        builder_schema: json,
        builder_enabled: true,
      })
      .eq('id', pageId)

    if (error) {
      console.error('Error saving page:', error)
      throw error
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

  if (errorMessage) {
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
    <div className="fixed inset-0 z-50">
      <CraftEditor
        content={content}
        onSave={handleSave}
        pageId={pageId}
      />
    </div>
  )
}
