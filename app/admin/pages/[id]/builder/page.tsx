'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Puck, Render } from '@measured/puck'
import { config } from '@/components/puck/registry'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'

export default function BuilderPage() {
  const params = useParams()
  const router = useRouter()
  const pageId = params.id as string
  const supabase = createClient()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPage() {
      const { data: page } = await supabase
        .from('pages')
        .select('*')
        .eq('id', pageId)
        .single()

      if (page?.builder_schema) {
        setData(page.builder_schema)
      } else {
        setData({ content: [], root: {} })
      }
      setLoading(false)
    }
    loadPage()
  }, [pageId, supabase])

  const handleSave = async () => {
    await supabase
      .from('pages')
      .update({ builder_schema: data })
      .eq('id', pageId)

    router.push('/admin/pages')
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b bg-card p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Page Builder</h1>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        <Puck config={config} data={data} onPublish={setData} />
      </div>
    </div>
  )
}

