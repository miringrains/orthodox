'use client'

import { useNode } from '@craftjs/core'
import { useState, useEffect } from 'react'
import { FileText, Download, Loader2, File, Image as ImageIcon, Music, Video } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ColorPicker } from '../controls/ColorPicker'
import { SettingsAccordion } from '../controls/SettingsAccordion'
import { useParishContext } from '../contexts/ParishContext'
import { createClient } from '@/lib/supabase/client'

interface MediaAsset {
  id: string
  file_name: string
  file_url: string
  file_type: string | null
  file_size: number | null
  created_at: string
}

interface FileDownloadProps {
  title?: string
  fileTypes?: string[] // e.g., ['application/pdf', 'image/*']
  maxItems?: number
  showFileSize?: boolean
  layout?: 'list' | 'grid'
  // Theme-aware colors
  textColor?: string
  mutedTextColor?: string
  accentColor?: string
  cardBackground?: string
  cardBorder?: string
}

// File type to icon mapping
const getFileIcon = (fileType: string | null) => {
  if (!fileType) return File
  if (fileType.startsWith('image/')) return ImageIcon
  if (fileType.startsWith('audio/')) return Music
  if (fileType.startsWith('video/')) return Video
  if (fileType.includes('pdf')) return FileText
  return File
}

// Format file size
const formatFileSize = (bytes: number | null) => {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileDownload({ 
  title,
  fileTypes = ['application/pdf'],
  maxItems = 5,
  showFileSize = true,
  layout = 'list',
  textColor = '',
  mutedTextColor = '',
  accentColor = '',
  cardBackground = '',
  cardBorder = '',
}: FileDownloadProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  const { parishId, isEditorMode } = useParishContext()
  const [files, setFiles] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch files from media_assets
  useEffect(() => {
    async function fetchFiles() {
      if (!parishId) {
        setLoading(false)
        return
      }

      try {
        const supabase = createClient()
        
        let query = supabase
          .from('media_assets')
          .select('*')
          .eq('parish_id', parishId)
          .order('created_at', { ascending: false })
          .limit(maxItems)

        // Filter by file types
        // Build OR conditions for file types
        const typeConditions: string[] = []
        fileTypes.forEach(type => {
          if (type.endsWith('/*')) {
            // Wildcard type like 'image/*'
            typeConditions.push(`file_type.like.${type.replace('/*', '/%')}`)
          } else {
            typeConditions.push(`file_type.eq.${type}`)
          }
        })
        
        // For now, just filter PDFs as the primary use case
        if (fileTypes.includes('application/pdf')) {
          query = query.eq('file_type', 'application/pdf')
        }

        const { data, error: fetchError } = await query

        if (fetchError) throw fetchError
        setFiles(data || [])
      } catch (err) {
        console.error('Error fetching files:', err)
        setError('Failed to load files')
      } finally {
        setLoading(false)
      }
    }

    fetchFiles()
  }, [parishId, maxItems, fileTypes])

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  const styles = {
    card: {
      backgroundColor: cardBackground || undefined,
      borderColor: cardBorder || undefined,
    },
    title: { color: textColor || 'inherit' },
    muted: { color: mutedTextColor || 'inherit', opacity: mutedTextColor ? 1 : 0.7 },
    accent: { color: accentColor || 'var(--gold-600)' },
  }

  return (
    <Card
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={`${isSelected ? 'ring-2 ring-primary' : ''}`}
      style={styles.card}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2" style={styles.title}>
          <FileText className="h-5 w-5" style={styles.accent} />
          {title || 'Downloads'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 py-4" style={styles.muted}>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading files...</span>
          </div>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : files.length === 0 ? (
          <div className="py-4 text-center" style={styles.muted}>
            <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              {isEditorMode 
                ? 'No files uploaded yet. Upload PDFs in the admin media manager.'
                : 'No files available for download.'}
            </p>
          </div>
        ) : layout === 'grid' ? (
          <div className="grid gap-3 grid-cols-2">
            {files.map((file) => {
              const Icon = getFileIcon(file.file_type)
              return (
                <a
                  key={file.id}
                  href={file.file_url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center p-4 rounded-lg border hover:bg-stone-50 transition-colors text-center group"
                  style={{ borderColor: cardBorder || 'var(--stone-200)' }}
                >
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-2 group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: 'var(--stone-100)' }}
                  >
                    <Icon className="h-6 w-6" style={styles.accent} />
                  </div>
                  <span 
                    className="text-sm font-medium line-clamp-2 mb-1" 
                    style={styles.title}
                  >
                    {file.file_name}
                  </span>
                  {showFileSize && file.file_size && (
                    <span className="text-xs" style={styles.muted}>
                      {formatFileSize(file.file_size)}
                    </span>
                  )}
                </a>
              )
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {files.map((file) => {
              const Icon = getFileIcon(file.file_type)
              return (
                <a
                  key={file.id}
                  href={file.file_url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-stone-50 transition-colors group"
                  style={{ borderColor: cardBorder || 'var(--stone-200)' }}
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: 'var(--stone-100)' }}
                  >
                    <Icon className="h-5 w-5" style={styles.accent} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span 
                      className="text-sm font-medium truncate block" 
                      style={styles.title}
                    >
                      {file.file_name}
                    </span>
                    <span className="text-xs" style={styles.muted}>
                      {formatDate(file.created_at)}
                      {showFileSize && file.file_size && (
                        <> · {formatFileSize(file.file_size)}</>
                      )}
                    </span>
                  </div>
                  <Download className="h-4 w-4 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" style={styles.accent} />
                </a>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function FileDownloadSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }))

  return (
    <div className="divide-y divide-gray-100">
      <SettingsAccordion title="Content" defaultOpen>
        <div>
          <Label>Title</Label>
          <Input
            value={props.title || ''}
            onChange={(e) => setProp((props: any) => (props.title = e.target.value))}
            className="mt-1"
            placeholder="Downloads"
          />
        </div>
        <div>
          <Label>Max Items</Label>
          <Input
            type="number"
            value={props.maxItems || 5}
            onChange={(e) => setProp((props: any) => (props.maxItems = parseInt(e.target.value) || 5))}
            className="mt-1"
            min={1}
            max={20}
          />
        </div>
        <div className="flex items-center space-x-2 mt-3">
          <input
            type="checkbox"
            id="showFileSize"
            checked={props.showFileSize !== false}
            onChange={(e) => setProp((props: any) => (props.showFileSize = e.target.checked))}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="showFileSize" className="text-sm">Show file size</Label>
        </div>
      </SettingsAccordion>

      <SettingsAccordion title="Layout">
        <div>
          <Label className="text-sm font-medium">Display Style</Label>
          <div className="flex gap-2 mt-2">
            {['list', 'grid'].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setProp((p: any) => (p.layout = l))}
                className={`flex-1 px-3 py-2 text-xs rounded-md border transition-colors capitalize ${
                  (props.layout || 'list') === l
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white hover:bg-stone-50 border-stone-200'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </SettingsAccordion>

      <SettingsAccordion title="Colors">
        <ColorPicker
          label="Text Color"
          value={props.textColor || ''}
          onChange={(value) => setProp((props: any) => (props.textColor = value))}
          placeholder="Inherit"
        />
        <ColorPicker
          label="Muted Text"
          value={props.mutedTextColor || ''}
          onChange={(value) => setProp((props: any) => (props.mutedTextColor = value))}
          placeholder="Inherit"
        />
        <ColorPicker
          label="Accent Color"
          value={props.accentColor || ''}
          onChange={(value) => setProp((props: any) => (props.accentColor = value))}
          placeholder="Gold"
        />
        <ColorPicker
          label="Card Background"
          value={props.cardBackground || ''}
          onChange={(value) => setProp((props: any) => (props.cardBackground = value))}
          placeholder="Default"
        />
        <ColorPicker
          label="Card Border"
          value={props.cardBorder || ''}
          onChange={(value) => setProp((props: any) => (props.cardBorder = value))}
          placeholder="Default"
        />
      </SettingsAccordion>
    </div>
  )
}

FileDownload.craft = {
  displayName: 'File Download',
  props: {
    title: 'Bulletins & Documents',
    fileTypes: ['application/pdf'],
    maxItems: 5,
    showFileSize: true,
    layout: 'list',
    textColor: '',
    mutedTextColor: '',
    accentColor: '',
    cardBackground: '',
    cardBorder: '',
  },
  related: {
    settings: FileDownloadSettings,
  },
}

