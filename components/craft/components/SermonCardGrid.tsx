'use client'

import { useNode } from '@craftjs/core'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Headphones, Video, FileText, Loader2, Play, Pause } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ColorPicker } from '../controls/ColorPicker'
import { SettingsAccordion } from '../controls/SettingsAccordion'
import { useParishContext } from '../contexts/ParishContext'
import { createClient } from '@/lib/supabase/client'

interface Sermon {
  id: string
  title: string
  description: string | null
  audio_url: string | null
  video_url: string | null
  text_content: string | null
  date_preached: string | null
  view_count: number
}

interface SermonCardGridProps {
  title?: string
  limit?: number
  columns?: number
  showAudioPlayer?: boolean
  // Theme-aware colors
  textColor?: string
  mutedTextColor?: string
  cardBackground?: string
  cardBorder?: string
}

export function SermonCardGrid({ 
  title, 
  limit = 3,
  columns = 3,
  showAudioPlayer = true,
  textColor = '',
  mutedTextColor = '',
  cardBackground = '',
  cardBorder = '',
}: SermonCardGridProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  const { parishId, parishSlug, isEditorMode } = useParishContext()
  const [sermons, setSermons] = useState<Sermon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Container width for responsive columns
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(1200)

  useEffect(() => {
    if (!containerRef.current) return
    
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width)
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Fetch sermons from database
  useEffect(() => {
    async function fetchSermons() {
      if (!parishId) {
        setLoading(false)
        return
      }

      try {
        const supabase = createClient()
        const { data, error: fetchError } = await supabase
          .from('sermons')
          .select('*')
          .eq('parish_id', parishId)
          .order('date_preached', { ascending: false })
          .limit(limit)

        if (fetchError) throw fetchError
        setSermons(data || [])
      } catch (err) {
        console.error('Error fetching sermons:', err)
        setError('Failed to load sermons')
      } finally {
        setLoading(false)
      }
    }

    fetchSermons()
  }, [parishId, limit])

  // Audio playback
  const handlePlayPause = (sermon: Sermon) => {
    if (!sermon.audio_url) return

    if (playingId === sermon.id) {
      audioRef.current?.pause()
      setPlayingId(null)
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      audioRef.current = new Audio(sermon.audio_url)
      audioRef.current.play()
      audioRef.current.onended = () => setPlayingId(null)
      setPlayingId(sermon.id)
    }
  }

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  // Responsive columns
  const getActualColumns = () => {
    if (containerWidth < 640) return 1
    if (containerWidth < 900) return Math.min(columns, 2)
    return columns
  }
  const actualColumns = getActualColumns()

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return ''
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
    title: { color: textColor || 'inherit' },
    card: {
      backgroundColor: cardBackground || undefined,
      borderColor: cardBorder || undefined,
    },
    muted: {
      color: mutedTextColor || 'inherit',
      opacity: mutedTextColor ? 1 : 0.7,
    },
  }

  // Sermons link href
  const sermonsHref = parishSlug ? `/p/${parishSlug}/sermons` : '/sermons'

  return (
    <div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
          // @ts-ignore - store ref for ResizeObserver
          containerRef.current = ref
        }
      }}
      className={isSelected ? 'ring-2 ring-primary' : ''}
    >
      {title && (
        <div className="flex items-center gap-2 mb-6">
          <Headphones className="h-5 w-5" style={styles.muted} />
          <h2 className="text-2xl font-bold" style={styles.title}>
            {title}
          </h2>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-8" style={styles.muted}>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading sermons...</span>
        </div>
      ) : error ? (
        <p className="text-red-500 py-4">{error}</p>
      ) : sermons.length === 0 ? (
        <p className="py-4" style={styles.muted}>
          {isEditorMode 
            ? 'No sermons yet. Add sermons in the admin panel.'
            : 'No sermons available.'}
        </p>
      ) : (
        <div 
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${actualColumns}, minmax(0, 1fr))` }}
        >
          {sermons.map((sermon) => (
            <Card key={sermon.id} style={styles.card}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg" style={styles.title}>
                    {sermon.title}
                  </CardTitle>
                  <div className="flex gap-1 flex-shrink-0">
                    {sermon.audio_url && (
                      <Headphones className="h-4 w-4 text-blue-500" title="Audio available" />
                    )}
                    {sermon.video_url && (
                      <Video className="h-4 w-4 text-red-500" title="Video available" />
                    )}
                    {sermon.text_content && (
                      <FileText className="h-4 w-4 text-green-500" title="Transcript available" />
                    )}
                  </div>
                </div>
                {sermon.date_preached && (
                  <p className="text-xs" style={styles.muted}>
                    {formatDate(sermon.date_preached)}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {sermon.description && (
                  <p className="text-sm mb-3 line-clamp-2" style={styles.muted}>
                    {sermon.description}
                  </p>
                )}
                
                <div className="flex items-center gap-2">
                  {showAudioPlayer && sermon.audio_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePlayPause(sermon)}
                      className="gap-1"
                    >
                      {playingId === sermon.id ? (
                        <>
                          <Pause className="h-3 w-3" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3" />
                          Listen
                        </>
                      )}
                    </Button>
                  )}
                  
                  {sermon.video_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a href={sermon.video_url} target="_blank" rel="noopener noreferrer">
                        <Video className="h-3 w-3 mr-1" />
                        Watch
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {sermons.length > 0 && (
        <div className="mt-6 text-center">
          <Link 
            href={sermonsHref}
            className="text-sm font-medium hover:underline"
            style={styles.title}
          >
            View All Sermons →
          </Link>
        </div>
      )}
    </div>
  )
}

function SermonCardGridSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }))

  const columnOptions = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
  ]

  return (
    <div className="divide-y divide-gray-100">
      <SettingsAccordion title="Content" defaultOpen>
        <div>
          <Label>Title</Label>
          <Input
            value={props.title || ''}
            onChange={(e) => setProp((props: any) => (props.title = e.target.value))}
            className="mt-1"
            placeholder="Leave empty to hide"
          />
        </div>
        <div>
          <Label>Number of Items</Label>
          <Input
            type="number"
            value={props.limit || 3}
            onChange={(e) => setProp((props: any) => (props.limit = parseInt(e.target.value) || 3))}
            className="mt-1"
            min={1}
            max={12}
          />
        </div>
        <div className="flex items-center space-x-2 mt-3">
          <input
            type="checkbox"
            id="showAudioPlayer"
            checked={props.showAudioPlayer !== false}
            onChange={(e) => setProp((props: any) => (props.showAudioPlayer = e.target.checked))}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="showAudioPlayer" className="text-sm">Show audio player controls</Label>
        </div>
      </SettingsAccordion>

      <SettingsAccordion title="Layout">
        <div>
          <Label className="text-sm font-medium">Columns</Label>
          <div className="flex gap-2 mt-2">
            {columnOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setProp((p: any) => (p.columns = option.value))}
                className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition-colors ${
                  (props.columns || 3) === option.value
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white hover:bg-stone-50 border-stone-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </SettingsAccordion>

      <SettingsAccordion title="Colors">
        <p className="text-xs text-muted-foreground mb-3">
          Leave empty to inherit from parent section
        </p>
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
          placeholder="Inherit (70% opacity)"
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

SermonCardGrid.craft = {
  displayName: 'Sermon Card Grid',
  props: {
    title: 'Recent Sermons',
    limit: 3,
    columns: 3,
    showAudioPlayer: true,
    textColor: '',
    mutedTextColor: '',
    cardBackground: '',
    cardBorder: '',
  },
  related: {
    settings: SermonCardGridSettings,
  },
}
