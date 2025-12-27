'use client'

import { useNode } from '@craftjs/core'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Megaphone, Loader2, Pin } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ColorPicker } from '../controls/ColorPicker'
import { SettingsAccordion } from '../controls/SettingsAccordion'
import { useParishContext } from '../contexts/ParishContext'
import { createClient } from '@/lib/supabase/client'

interface Announcement {
  id: string
  title: string
  content: string
  category: string | null
  is_pinned: boolean | null
  created_at: string | null
  published_at: string | null
}

interface NewsListProps {
  title?: string
  limit?: number
  columns?: number
  showPinnedFirst?: boolean
  // Theme-aware colors
  textColor?: string
  mutedTextColor?: string
  cardBackground?: string
  cardBorder?: string
}

export function NewsList({ 
  title, 
  limit = 3,
  columns = 3,
  showPinnedFirst = true,
  textColor = '',
  mutedTextColor = '',
  cardBackground = '',
  cardBorder = '',
}: NewsListProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  const { parishId, parishSlug, isEditorMode } = useParishContext()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use ResizeObserver to detect container width for responsive layout
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

  // Fetch announcements from database
  useEffect(() => {
    async function fetchAnnouncements() {
      if (!parishId) {
        setLoading(false)
        return
      }

      try {
        const supabase = createClient()
        let query = supabase
          .from('announcements')
          .select('*')
          .eq('parish_id', parishId)

        // Order by pinned first, then by date
        if (showPinnedFirst) {
          query = query.order('is_pinned', { ascending: false })
        }
        query = query.order('created_at', { ascending: false })
        query = query.limit(limit)

        const { data, error: fetchError } = await query

        if (fetchError) throw fetchError
        setAnnouncements(data || [])
      } catch (err) {
        console.error('Error fetching announcements:', err)
        setError('Failed to load announcements')
      } finally {
        setLoading(false)
      }
    }

    fetchAnnouncements()
  }, [parishId, limit, showPinnedFirst])

  // Determine actual columns based on container width
  const getActualColumns = () => {
    if (containerWidth < 640) return 1
    if (containerWidth < 900) return Math.min(columns, 2)
    return columns
  }
  const actualColumns = getActualColumns()

  // Format date for display
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

  // Truncate content for preview
  const truncateContent = (content: string, maxLength: number = 120) => {
    if (content.length <= maxLength) return content
    return content.slice(0, maxLength).trim() + '...'
  }

  const styles = {
    title: {
      color: textColor || 'inherit',
    },
    card: {
      backgroundColor: cardBackground || 'rgba(255,255,255,0.03)',
      borderColor: cardBorder || 'rgba(255,255,255,0.1)',
      borderWidth: '1px',
      borderStyle: 'solid' as const,
      borderRadius: '8px',
      padding: '20px',
    },
    cardTitle: {
      color: textColor || 'inherit',
    },
    muted: {
      color: mutedTextColor || 'inherit',
      opacity: mutedTextColor ? 1 : 0.7,
    },
  }

  // Announcements link href
  const announcementsHref = parishSlug ? `/p/${parishSlug}/announcements` : '/announcements'

  return (
    <div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
          // @ts-ignore - store ref for ResizeObserver
          containerRef.current = ref
        }
      }}
      className={isSelected ? 'ring-2 ring-primary rounded' : ''}
    >
      {title && (
        <div className="flex items-center gap-2 mb-6">
          <Megaphone className="h-5 w-5" style={styles.muted} />
          <h2 className="text-2xl font-bold" style={styles.title}>
            {title}
          </h2>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-8" style={styles.muted}>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading announcements...</span>
        </div>
      ) : error ? (
        <p className="text-red-500 py-4">{error}</p>
      ) : announcements.length === 0 ? (
        <p className="py-4" style={styles.muted}>
          {isEditorMode 
            ? 'No announcements yet. Add announcements in the admin panel.'
            : 'No announcements available.'}
        </p>
      ) : (
        <div 
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${actualColumns}, minmax(0, 1fr))` }}
        >
          {announcements.map((announcement) => (
            <div key={announcement.id} style={styles.card}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-lg font-semibold" style={styles.cardTitle}>
                  {announcement.title}
                </h3>
                {announcement.is_pinned && (
                  <Pin className="h-4 w-4 flex-shrink-0 text-amber-500" />
                )}
              </div>
              <p className="text-xs mb-3" style={styles.muted}>
                {formatDate(announcement.created_at)}
                {announcement.category && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-white/10 text-xs">
                    {announcement.category}
                  </span>
                )}
              </p>
              <p className="text-sm" style={styles.muted}>
                {truncateContent(announcement.content)}
              </p>
              <Link 
                href={`${announcementsHref}/${announcement.id}`}
                className="text-sm font-medium hover:underline mt-3 inline-block"
                style={styles.cardTitle}
              >
                Read more →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function NewsListSettings() {
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
            id="showPinnedFirst"
            checked={props.showPinnedFirst !== false}
            onChange={(e) => setProp((props: any) => (props.showPinnedFirst = e.target.checked))}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="showPinnedFirst" className="text-sm">Show pinned announcements first</Label>
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
          placeholder="Semi-transparent"
        />
        <ColorPicker
          label="Card Border"
          value={props.cardBorder || ''}
          onChange={(value) => setProp((props: any) => (props.cardBorder = value))}
          placeholder="Subtle white"
        />
      </SettingsAccordion>
    </div>
  )
}

NewsList.craft = {
  displayName: 'News List',
  props: {
    title: 'Recent Announcements',
    limit: 3,
    columns: 3,
    showPinnedFirst: true,
    textColor: '',
    mutedTextColor: '',
    cardBackground: '',
    cardBorder: '',
  },
  related: {
    settings: NewsListSettings,
  },
}
