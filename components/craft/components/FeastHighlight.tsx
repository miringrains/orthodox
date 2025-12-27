'use client'

import { useNode } from '@craftjs/core'
import { useState, useEffect } from 'react'
import { Calendar, Star, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ColorPicker } from '../controls/ColorPicker'
import { SettingsAccordion } from '../controls/SettingsAccordion'
import { useParishContext } from '../contexts/ParishContext'
import { createClient } from '@/lib/supabase/client'

interface FeastEvent {
  id: string
  title: string
  description: string | null
  start_at: string
  feast_name: string | null
  is_feast: boolean
}

interface FeastHighlightProps {
  mode?: 'auto' | 'manual'
  // Manual mode props
  feastName?: string
  date?: string
  description?: string
  // Theme-aware colors
  textColor?: string
  mutedTextColor?: string
  accentColor?: string
  cardBackground?: string
  cardBorder?: string
}

export function FeastHighlight({ 
  mode = 'auto',
  feastName, 
  date, 
  description,
  textColor = '',
  mutedTextColor = '',
  accentColor = '',
  cardBackground = '',
  cardBorder = '',
}: FeastHighlightProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  const { parishId, isEditorMode } = useParishContext()
  const [upcomingFeast, setUpcomingFeast] = useState<FeastEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch upcoming feast from database
  useEffect(() => {
    async function fetchUpcomingFeast() {
      if (!parishId || mode === 'manual') {
        setLoading(false)
        return
      }

      try {
        const supabase = createClient()
        const now = new Date().toISOString()
        
        const { data, error: fetchError } = await supabase
          .from('events')
          .select('*')
          .eq('parish_id', parishId)
          .eq('is_feast', true)
          .gte('start_at', now)
          .order('start_at', { ascending: true })
          .limit(1)
          .single()

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError
        }
        
        setUpcomingFeast(data || null)
      } catch (err) {
        console.error('Error fetching feast:', err)
        setError('Failed to load feast')
      } finally {
        setLoading(false)
      }
    }

    fetchUpcomingFeast()
  }, [parishId, mode])

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  // Get days until feast
  const getDaysUntil = (dateString: string) => {
    try {
      const feastDate = new Date(dateString)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      feastDate.setHours(0, 0, 0, 0)
      const diffTime = feastDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (diffDays === 0) return 'Today'
      if (diffDays === 1) return 'Tomorrow'
      return `In ${diffDays} days`
    } catch {
      return ''
    }
  }

  const styles = {
    card: {
      backgroundColor: cardBackground || 'var(--gold-50)',
      borderColor: cardBorder || 'var(--gold-200)',
    },
    title: { color: textColor || 'inherit' },
    muted: {
      color: mutedTextColor || 'inherit',
      opacity: mutedTextColor ? 1 : 0.7,
    },
    accent: { color: accentColor || 'var(--gold-600)' },
  }

  // Determine what to display
  const displayFeast = mode === 'manual' 
    ? { 
        name: feastName || 'Great Feast', 
        date: date || new Date().toLocaleDateString(), 
        description: description || 'Join us in celebration' 
      }
    : upcomingFeast 
      ? {
          name: upcomingFeast.feast_name || upcomingFeast.title,
          date: formatDate(upcomingFeast.start_at),
          description: upcomingFeast.description || 'Join us in celebration',
          daysUntil: getDaysUntil(upcomingFeast.start_at),
        }
      : null

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
          <Star className="h-5 w-5 fill-current" style={styles.accent} />
          {loading ? 'Loading...' : displayFeast?.name || 'Upcoming Feast'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 py-2" style={styles.muted}>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading feast information...</span>
          </div>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : !displayFeast ? (
          <p className="text-sm" style={styles.muted}>
            {isEditorMode 
              ? 'No upcoming feasts. Add feast events in the admin panel, or switch to manual mode.'
              : 'No upcoming feasts scheduled.'}
          </p>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4" style={styles.accent} />
              <p className="text-sm font-medium" style={styles.title}>
                {displayFeast.date}
              </p>
              {displayFeast.daysUntil && (
                <span 
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ 
                    backgroundColor: accentColor || 'var(--gold-100)',
                    color: 'var(--gold-800)',
                  }}
                >
                  {displayFeast.daysUntil}
                </span>
              )}
            </div>
            <p style={styles.muted}>{displayFeast.description}</p>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function FeastHighlightSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }))

  return (
    <div className="divide-y divide-gray-100">
      <SettingsAccordion title="Content" defaultOpen>
        <div>
          <Label>Mode</Label>
          <div className="flex gap-2 mt-2">
            {['auto', 'manual'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setProp((p: any) => (p.mode = m))}
                className={`flex-1 px-3 py-2 text-xs rounded-md border transition-colors capitalize ${
                  (props.mode || 'auto') === m
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white hover:bg-stone-50 border-stone-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Auto: Shows next upcoming feast event from calendar. Manual: Enter feast details below.
          </p>
        </div>
        
        {props.mode === 'manual' && (
          <>
            <div>
              <Label>Feast Name</Label>
              <Input
                value={props.feastName || ''}
                onChange={(e) => setProp((props: any) => (props.feastName = e.target.value))}
                className="mt-1"
                placeholder="Nativity of Our Lord"
              />
            </div>
            <div>
              <Label>Date</Label>
              <Input
                value={props.date || ''}
                onChange={(e) => setProp((props: any) => (props.date = e.target.value))}
                className="mt-1"
                placeholder="December 25, 2024"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={props.description || ''}
                onChange={(e) => setProp((props: any) => (props.description = e.target.value))}
                className="mt-1"
                placeholder="Join us in celebration"
                rows={2}
              />
            </div>
          </>
        )}
      </SettingsAccordion>

      <SettingsAccordion title="Colors">
        <p className="text-xs text-muted-foreground mb-3">
          Leave empty to use gold theme defaults
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
          placeholder="Gold tint"
        />
        <ColorPicker
          label="Card Border"
          value={props.cardBorder || ''}
          onChange={(value) => setProp((props: any) => (props.cardBorder = value))}
          placeholder="Gold"
        />
      </SettingsAccordion>
    </div>
  )
}

FeastHighlight.craft = {
  displayName: 'Feast Highlight',
  props: {
    mode: 'auto',
    feastName: 'Great Feast',
    date: new Date().toLocaleDateString(),
    description: 'Join us in celebration',
    textColor: '',
    mutedTextColor: '',
    accentColor: '',
    cardBackground: '',
    cardBorder: '',
  },
  related: {
    settings: FeastHighlightSettings,
  },
}
