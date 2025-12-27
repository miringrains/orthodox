'use client'

import { useNode } from '@craftjs/core'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Clock, Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ColorPicker } from '../controls/ColorPicker'
import { SettingsAccordion } from '../controls/SettingsAccordion'
import { useParishContext } from '../contexts/ParishContext'
import { createClient } from '@/lib/supabase/client'

interface ServiceSchedule {
  id: string
  service_type: string
  day_of_week: number | null
  time: string | null
  notes: string | null
  is_recurring: boolean
}

interface SchedulePreviewProps {
  title?: string
  showFullSchedule?: boolean
  maxItems?: number
  layout?: 'compact' | 'detailed'
  // Theme-aware colors (inherit from parent when empty)
  textColor?: string
  mutedTextColor?: string
  accentColor?: string
  cardBackground?: string
  cardBorder?: string
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function SchedulePreview({ 
  title, 
  showFullSchedule,
  maxItems = 5,
  layout = 'compact',
  textColor = '',
  mutedTextColor = '',
  accentColor = '',
  cardBackground = '',
  cardBorder = '',
}: SchedulePreviewProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  const { parishId, parishSlug, isEditorMode } = useParishContext()
  const [schedules, setSchedules] = useState<ServiceSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch schedules from database
  useEffect(() => {
    async function fetchSchedules() {
      if (!parishId) {
        setLoading(false)
        return
      }

      try {
        const supabase = createClient()
        const { data, error: fetchError } = await supabase
          .from('service_schedules')
          .select('*')
          .eq('parish_id', parishId)
          .order('day_of_week', { ascending: true })
          .limit(maxItems)

        if (fetchError) throw fetchError
        setSchedules(data || [])
      } catch (err) {
        console.error('Error fetching schedules:', err)
        setError('Failed to load schedule')
      } finally {
        setLoading(false)
      }
    }

    fetchSchedules()
  }, [parishId, maxItems])

  // Format time for display
  const formatTime = (time: string | null) => {
    if (!time) return ''
    try {
      return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })
    } catch {
      return time
    }
  }

  // Use inherit for colors when not specified
  const styles = {
    card: {
      backgroundColor: cardBackground || 'transparent',
      borderColor: cardBorder || 'rgba(255,255,255,0.1)',
      borderWidth: cardBorder || cardBackground ? '1px' : '0',
      borderStyle: 'solid' as const,
      borderRadius: '8px',
      padding: '24px',
    },
    title: {
      color: textColor || 'inherit',
    },
    muted: {
      color: mutedTextColor || 'inherit',
      opacity: mutedTextColor ? 1 : 0.7,
    },
    accent: {
      color: accentColor || 'inherit',
    },
  }

  // Schedule link href
  const scheduleHref = parishSlug ? `/p/${parishSlug}/schedule` : '/schedule'

  return (
    <div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      style={styles.card}
      className={isSelected ? 'ring-2 ring-primary' : ''}
    >
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5" style={styles.accent} />
        <h3 className="text-lg font-semibold" style={styles.title}>
          {title || 'Service Schedule'}
        </h3>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-4" style={styles.muted}>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading schedule...</span>
        </div>
      ) : error ? (
        <p className="text-sm text-red-500 mb-4">{error}</p>
      ) : schedules.length === 0 ? (
        <p className="text-sm mb-4" style={styles.muted}>
          {isEditorMode 
            ? 'No services scheduled. Add services in the admin panel.'
            : 'No service schedule available.'}
        </p>
      ) : layout === 'detailed' ? (
        <div className="space-y-3 mb-4">
          {schedules.map((schedule) => (
            <div 
              key={schedule.id} 
              className="flex items-start gap-3 py-2 border-b last:border-b-0"
              style={{ borderColor: cardBorder || 'rgba(255,255,255,0.1)' }}
            >
              <div className="flex-1">
                <p className="font-medium" style={styles.title}>
                  {schedule.service_type}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm" style={styles.muted}>
                    {schedule.day_of_week !== null 
                      ? DAYS_OF_WEEK[schedule.day_of_week] 
                      : 'Special Service'}
                  </span>
                  {schedule.time && (
                    <>
                      <span style={styles.muted}>•</span>
                      <span className="text-sm" style={styles.muted}>
                        {formatTime(schedule.time)}
                      </span>
                    </>
                  )}
                </div>
                {schedule.notes && (
                  <p className="text-xs mt-1" style={styles.muted}>
                    {schedule.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2 mb-4">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="flex items-center justify-between">
              <span className="text-sm font-medium" style={styles.title}>
                {schedule.service_type}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={styles.muted}>
                  {schedule.day_of_week !== null 
                    ? DAYS_OF_WEEK[schedule.day_of_week].slice(0, 3)
                    : '—'}
                </span>
                {schedule.time && (
                  <span className="text-xs font-medium" style={styles.accent}>
                    {formatTime(schedule.time)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showFullSchedule !== false && (
        <Link 
          href={scheduleHref}
          className="text-sm hover:underline font-medium"
          style={styles.accent}
        >
          View Full Schedule →
        </Link>
      )}
    </div>
  )
}

function SchedulePreviewSettings() {
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
            max={10}
          />
        </div>
        <div>
          <Label>Layout</Label>
          <div className="flex gap-2 mt-2">
            {['compact', 'detailed'].map((layout) => (
              <button
                key={layout}
                type="button"
                onClick={() => setProp((p: any) => (p.layout = layout))}
                className={`flex-1 px-3 py-2 text-xs rounded-md border transition-colors capitalize ${
                  (props.layout || 'compact') === layout
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white hover:bg-stone-50 border-stone-200'
                }`}
              >
                {layout}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-3">
          <input
            type="checkbox"
            id="showFullSchedule"
            checked={props.showFullSchedule !== false}
            onChange={(e) => setProp((props: any) => (props.showFullSchedule = e.target.checked))}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="showFullSchedule" className="text-sm">Show "View Full Schedule" link</Label>
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
          label="Accent Color"
          value={props.accentColor || ''}
          onChange={(value) => setProp((props: any) => (props.accentColor = value))}
          placeholder="Inherit"
        />
        <ColorPicker
          label="Card Background"
          value={props.cardBackground || ''}
          onChange={(value) => setProp((props: any) => (props.cardBackground = value))}
          placeholder="Transparent"
        />
        <ColorPicker
          label="Card Border"
          value={props.cardBorder || ''}
          onChange={(value) => setProp((props: any) => (props.cardBorder = value))}
          placeholder="None"
        />
      </SettingsAccordion>
    </div>
  )
}

SchedulePreview.craft = {
  displayName: 'Schedule Preview',
  props: {
    title: 'Service Schedule',
    showFullSchedule: true,
    maxItems: 5,
    layout: 'compact',
    textColor: '',
    mutedTextColor: '',
    accentColor: '',
    cardBackground: '',
    cardBorder: '',
  },
  related: {
    settings: SchedulePreviewSettings,
  },
}
