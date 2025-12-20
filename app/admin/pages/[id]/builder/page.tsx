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
      console.log('=== BUILDER PAGE LOADING ===')
      console.log('Page ID:', pageId)
      
      try {
        const { data: page, error } = await supabase
          .from('pages')
          .select('*')
          .eq('id', pageId)
          .single()

        console.log('Supabase response - error:', error)
        console.log('Supabase response - page:', page)
        console.log('builder_schema type:', typeof page?.builder_schema)
        console.log('builder_schema:', page?.builder_schema)

        if (error) {
          console.error('Error loading page:', error)
          setErrorMessage('Failed to load page. Please refresh the page.')
          setLoading(false)
          return
        }

        // Load builder_schema if it exists
        // Craft.js stores content as JSON, we can load it directly
        const builderData = page?.builder_schema as any
        
        console.log('builderData to pass to editor:', builderData)
        
        // If no content exists and builder is enabled, load default template
        if (!builderData && page?.builder_enabled) {
          const { getDefaultPageTemplate } = await import('@/lib/page-templates')
          const defaultTemplate = getDefaultPageTemplate()
          console.log('Using default template:', defaultTemplate)
          setContent(defaultTemplate)
        } else {
          console.log('Using saved builderData')
          setContent(builderData || null)
        }
        setLoading(false)
        console.log('=== END BUILDER PAGE LOADING ===')
      } catch (error) {
        console.error('Error loading page:', error)
        setErrorMessage('Failed to load page. Please refresh the page.')
        setLoading(false)
      }
    }
    loadPage()
  }, [pageId, supabase])

  const handleSave = async (json: any) => {
    console.log('=== SAVING PAGE ===')
    console.log('Page ID:', pageId)
    console.log('JSON to save type:', typeof json)
    console.log('JSON to save keys:', json ? Object.keys(json) : 'null')
    console.log('JSON has ROOT:', json?.ROOT ? 'yes' : 'no')
    console.log('ROOT nodes count:', json?.ROOT?.nodes?.length)
    
    const { error, data } = await supabase
      .from('pages')
      .update({
        builder_schema: json,
        builder_enabled: true,
      })
      .eq('id', pageId)
      .select()

    console.log('Save response - error:', error)
    console.log('Save response - data:', data)
    console.log('=== END SAVING PAGE ===')

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
