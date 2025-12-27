'use client'

import { useNode } from '@craftjs/core'
import { useState, useEffect, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Loader2, Star, Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ColorPicker } from '../controls/ColorPicker'
import { SettingsAccordion } from '../controls/SettingsAccordion'
import { useParishContext } from '../contexts/ParishContext'
import { createClient } from '@/lib/supabase/client'

interface CalendarEvent {
  id: string
  title: string
  start_at: string
  is_feast: boolean
  feast_name: string | null
  event_type: string
}

interface ServiceSchedule {
  id: string
  service_type: string
  day_of_week: number | null
  time: string | null
}

interface LiturgicalCalendarProps {
  title?: string
  showServices?: boolean
  showFeasts?: boolean
  // Theme-aware colors
  textColor?: string
  mutedTextColor?: string
  accentColor?: string
  feastColor?: string
  todayColor?: string
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export function LiturgicalCalendar({ 
  title,
  showServices = true,
  showFeasts = true,
  textColor = '',
  mutedTextColor = '',
  accentColor = '',
  feastColor = '',
  todayColor = '',
}: LiturgicalCalendarProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  const { parishId, isEditorMode } = useParishContext()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [schedules, setSchedules] = useState<ServiceSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

  // Calculate month range
  const monthStart = useMemo(() => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    return date
  }, [currentDate])

  const monthEnd = useMemo(() => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    return date
  }, [currentDate])

  // Fetch events and schedules
  useEffect(() => {
    async function fetchData() {
      if (!parishId) {
        setLoading(false)
        return
      }

      try {
        const supabase = createClient()
        
        // Fetch events for the month
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString()
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59).toISOString()
        
        const [eventsRes, schedulesRes] = await Promise.all([
          supabase
            .from('events')
            .select('id, title, start_at, is_feast, feast_name, event_type')
            .eq('parish_id', parishId)
            .gte('start_at', startOfMonth)
            .lte('start_at', endOfMonth)
            .order('start_at', { ascending: true }),
          supabase
            .from('service_schedules')
            .select('id, service_type, day_of_week, time')
            .eq('parish_id', parishId)
        ])

        if (eventsRes.error) throw eventsRes.error
        if (schedulesRes.error) throw schedulesRes.error

        setEvents(eventsRes.data || [])
        setSchedules(schedulesRes.data || [])
      } catch (err) {
        console.error('Error fetching calendar data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [parishId, currentDate])

  // Navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    setSelectedDay(null)
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    setSelectedDay(null)
  }

  // Get days in month with padding
  const calendarDays = useMemo(() => {
    const days: (Date | null)[] = []
    
    // Add padding for days before month starts
    const startDayOfWeek = monthStart.getDay()
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of month
    for (let day = 1; day <= monthEnd.getDate(); day++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))
    }
    
    return days
  }, [monthStart, monthEnd, currentDate])

  // Get events for a specific day
  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start_at)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  // Get recurring services for a day of week
  const getServicesForDayOfWeek = (dayOfWeek: number) => {
    return schedules.filter(s => s.day_of_week === dayOfWeek)
  }

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  // Format time
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

  const styles = {
    title: { color: textColor || 'inherit' },
    muted: { color: mutedTextColor || 'inherit', opacity: mutedTextColor ? 1 : 0.6 },
    accent: { color: accentColor || 'var(--gold-600)' },
    feast: { backgroundColor: feastColor || 'var(--gold-100)', color: 'var(--gold-800)' },
    today: { backgroundColor: todayColor || 'var(--stone-900)', color: 'white' },
  }

  return (
    <div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={`${isSelected ? 'ring-2 ring-primary rounded' : ''}`}
    >
      {title && (
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="h-5 w-5" style={styles.accent} />
          <h2 className="text-2xl font-bold" style={styles.title}>
            {title}
          </h2>
        </div>
      )}

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={goToPreviousMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold" style={styles.title}>
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <Button variant="ghost" size="sm" onClick={goToNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12" style={styles.muted}>
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--stone-200)' }}>
          {/* Day headers */}
          <div className="grid grid-cols-7 bg-stone-100">
            {DAYS.map(day => (
              <div 
                key={day} 
                className="py-2 text-center text-xs font-semibold"
                style={styles.muted}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="min-h-[80px] bg-stone-50 border-t border-l" style={{ borderColor: 'var(--stone-200)' }} />
              }

              const dayEvents = getEventsForDay(date)
              const dayServices = showServices ? getServicesForDayOfWeek(date.getDay()) : []
              const feasts = dayEvents.filter(e => e.is_feast)
              const hasContent = dayEvents.length > 0 || dayServices.length > 0
              const isSelected = selectedDay?.toDateString() === date.toDateString()

              return (
                <div
                  key={date.toISOString()}
                  className={`min-h-[80px] p-1 border-t border-l cursor-pointer transition-colors hover:bg-stone-50 ${
                    isSelected ? 'bg-stone-100' : ''
                  }`}
                  style={{ borderColor: 'var(--stone-200)' }}
                  onClick={() => setSelectedDay(isSelected ? null : date)}
                >
                  {/* Day number */}
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full ${
                        isToday(date) ? 'text-white' : ''
                      }`}
                      style={isToday(date) ? styles.today : styles.title}
                    >
                      {date.getDate()}
                    </span>
                    {feasts.length > 0 && showFeasts && (
                      <Star className="h-3 w-3 fill-current" style={{ color: 'var(--gold-500)' }} />
                    )}
                  </div>

                  {/* Events/services preview */}
                  <div className="space-y-0.5">
                    {showFeasts && feasts.slice(0, 2).map(feast => (
                      <div
                        key={feast.id}
                        className="text-[10px] px-1 py-0.5 rounded truncate"
                        style={styles.feast}
                      >
                        {feast.feast_name || feast.title}
                      </div>
                    ))}
                    {showServices && !feasts.length && dayServices.slice(0, 2).map(service => (
                      <div
                        key={service.id}
                        className="text-[10px] truncate"
                        style={styles.muted}
                      >
                        {service.time && formatTime(service.time)} {service.service_type}
                      </div>
                    ))}
                    {hasContent && (dayEvents.length + dayServices.length > 2) && (
                      <div className="text-[10px]" style={styles.muted}>
                        +{dayEvents.length + dayServices.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Selected day detail */}
      {selectedDay && (
        <div className="mt-4 p-4 border rounded-lg" style={{ borderColor: 'var(--stone-200)' }}>
          <h4 className="font-semibold mb-3" style={styles.title}>
            {selectedDay.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h4>
          
          {/* Feasts */}
          {showFeasts && getEventsForDay(selectedDay).filter(e => e.is_feast).map(feast => (
            <div key={feast.id} className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 fill-current" style={{ color: 'var(--gold-500)' }} />
              <span className="font-medium" style={styles.title}>
                {feast.feast_name || feast.title}
              </span>
            </div>
          ))}
          
          {/* Events */}
          {getEventsForDay(selectedDay).filter(e => !e.is_feast).map(event => (
            <div key={event.id} className="mb-2 text-sm" style={styles.title}>
              • {event.title}
            </div>
          ))}
          
          {/* Services */}
          {showServices && getServicesForDayOfWeek(selectedDay.getDay()).map(service => (
            <div key={service.id} className="mb-1 text-sm" style={styles.muted}>
              {service.time && formatTime(service.time)} — {service.service_type}
            </div>
          ))}

          {getEventsForDay(selectedDay).length === 0 && 
           getServicesForDayOfWeek(selectedDay.getDay()).length === 0 && (
            <p className="text-sm" style={styles.muted}>No events scheduled</p>
          )}
        </div>
      )}
    </div>
  )
}

function LiturgicalCalendarSettings() {
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
            placeholder="Leave empty to hide"
          />
        </div>
        <div className="flex items-center space-x-2 mt-3">
          <input
            type="checkbox"
            id="showServices"
            checked={props.showServices !== false}
            onChange={(e) => setProp((props: any) => (props.showServices = e.target.checked))}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="showServices" className="text-sm">Show recurring services</Label>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <input
            type="checkbox"
            id="showFeasts"
            checked={props.showFeasts !== false}
            onChange={(e) => setProp((props: any) => (props.showFeasts = e.target.checked))}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="showFeasts" className="text-sm">Highlight feast days</Label>
        </div>
      </SettingsAccordion>

      <SettingsAccordion title="Colors">
        <p className="text-xs text-muted-foreground mb-3">
          Leave empty to use defaults
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
          label="Feast Day Background"
          value={props.feastColor || ''}
          onChange={(value) => setProp((props: any) => (props.feastColor = value))}
          placeholder="Gold tint"
        />
        <ColorPicker
          label="Today Highlight"
          value={props.todayColor || ''}
          onChange={(value) => setProp((props: any) => (props.todayColor = value))}
          placeholder="Dark"
        />
      </SettingsAccordion>
    </div>
  )
}

LiturgicalCalendar.craft = {
  displayName: 'Liturgical Calendar',
  props: {
    title: 'Parish Calendar',
    showServices: true,
    showFeasts: true,
    textColor: '',
    mutedTextColor: '',
    accentColor: '',
    feastColor: '',
    todayColor: '',
  },
  related: {
    settings: LiturgicalCalendarSettings,
  },
}

