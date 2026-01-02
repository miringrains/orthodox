'use client'

import React, { useEffect, useState } from 'react'
import { useNode } from '@craftjs/core'
import { useParishContext } from '../contexts/ParishContext'
import { createClient } from '@/lib/supabase/client'

interface ScheduleItem {
  day: string
  time: string
  ampm: string
  title: string
  description?: string
}

interface ScheduleListProps {
  title: string
  subtitle?: string
  backgroundColor: string
  cardBackgroundColor: string
  textColor: string
  accentColor: string
  borderColor: string
  showCorners: boolean
  cornerStyle: 1 | 2 | 3 | 4
  cornerSize: number
  invertCorners: boolean
  paddingVertical: number
  paddingHorizontal: number
  useLiveData: boolean
  staticItems: ScheduleItem[]
}

const defaultItems: ScheduleItem[] = [
  { day: 'Saturday', time: '5:00', ampm: 'PM', title: 'Great Vespers', description: 'Evening prayer service' },
  { day: 'Sunday', time: '9:00', ampm: 'AM', title: 'Matins', description: 'Morning prayer' },
  { day: 'Sunday', time: '10:00', ampm: 'AM', title: 'Divine Liturgy', description: 'Main worship service' },
  { day: 'Wednesday', time: '6:30', ampm: 'PM', title: 'Akathist Service', description: 'Hymns to the Theotokos' },
]

export const ScheduleList = ({
  title = 'Weekly Services',
  subtitle = 'Join us in prayer',
  backgroundColor = '#1A1410',
  cardBackgroundColor = '#2A1F18',
  textColor = '#E8E0D4',
  accentColor = '#C9A227',
  borderColor = '#3D2E1E',
  showCorners = true,
  cornerStyle = 1,
  cornerSize = 50,
  invertCorners = true,
  paddingVertical = 64,
  paddingHorizontal = 32,
  useLiveData = false,
  staticItems = defaultItems,
}: ScheduleListProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((state) => ({
    selected: state.events.selected,
  }))

  const { parishId } = useParishContext()
  const [liveItems, setLiveItems] = useState<ScheduleItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!useLiveData || !parishId) return

    const fetchSchedules = async () => {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('service_schedules')
        .select('*')
        .eq('parish_id', parishId)
        .order('day_of_week', { ascending: true })

      if (data && !error) {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const items: ScheduleItem[] = data.map((schedule: { day_of_week: number; start_time: string; title: string; description: string | null }) => {
          const time = schedule.start_time.split(':')
          const hour = parseInt(time[0])
          const minute = time[1]
          const ampm = hour >= 12 ? 'PM' : 'AM'
          const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour

          return {
            day: dayNames[schedule.day_of_week] || 'Sunday',
            time: `${displayHour}:${minute}`,
            ampm,
            title: schedule.title,
            description: schedule.description || undefined,
          }
        })
        setLiveItems(items)
      }
      setLoading(false)
    }

    fetchSchedules()
  }, [useLiveData, parishId])

  const items = useLiveData && liveItems.length > 0 ? liveItems : staticItems
  const cornerSrc = `/corner-${cornerStyle}.svg`
  const cornerFilter = invertCorners ? 'invert(1) brightness(0.8) sepia(1) saturate(0.5)' : 'none'

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      className="relative w-full"
      style={{
        backgroundColor,
        paddingTop: `${paddingVertical}px`,
        paddingBottom: `${paddingVertical}px`,
        paddingLeft: `${paddingHorizontal}px`,
        paddingRight: `${paddingHorizontal}px`,
        outline: selected ? '2px solid #C9A227' : 'none',
      }}
    >
      {/* Corner Ornaments */}
      {showCorners && (
        <>
          <img src={cornerSrc} alt="" className="absolute pointer-events-none select-none" style={{ top: '16px', left: '16px', width: `${cornerSize}px`, height: `${cornerSize}px`, opacity: 0.3, filter: cornerFilter }} />
          <img src={cornerSrc} alt="" className="absolute pointer-events-none select-none" style={{ top: '16px', right: '16px', width: `${cornerSize}px`, height: `${cornerSize}px`, opacity: 0.3, filter: cornerFilter, transform: 'scaleX(-1)' }} />
          <img src={cornerSrc} alt="" className="absolute pointer-events-none select-none" style={{ bottom: '16px', left: '16px', width: `${cornerSize}px`, height: `${cornerSize}px`, opacity: 0.3, filter: cornerFilter, transform: 'scaleY(-1)' }} />
          <img src={cornerSrc} alt="" className="absolute pointer-events-none select-none" style={{ bottom: '16px', right: '16px', width: `${cornerSize}px`, height: `${cornerSize}px`, opacity: 0.3, filter: cornerFilter, transform: 'scale(-1, -1)' }} />
        </>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif mb-2" style={{ color: textColor }}>
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm uppercase tracking-widest" style={{ color: accentColor }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Schedule Grid */}
        {loading ? (
          <div className="text-center py-8" style={{ color: textColor }}>Loading schedules...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((item, index) => (
              <div
                key={index}
                className="rounded-lg p-5 transition-all duration-300 hover:translate-x-1"
                style={{
                  backgroundColor: cardBackgroundColor,
                  border: `1px solid ${borderColor}`,
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Time */}
                  <div className="text-center flex-shrink-0" style={{ minWidth: '70px' }}>
                    <div className="text-2xl font-bold font-serif" style={{ color: accentColor }}>
                      {item.time}
                    </div>
                    <div className="text-xs uppercase tracking-wider" style={{ color: textColor, opacity: 0.6 }}>
                      {item.ampm}
                    </div>
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1">
                    <div className="text-xs uppercase tracking-wider mb-1" style={{ color: accentColor }}>
                      {item.day}
                    </div>
                    <h3 className="text-lg font-semibold mb-1" style={{ color: textColor }}>
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm" style={{ color: textColor, opacity: 0.7 }}>
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const ScheduleListSettings = () => {
  const {
    actions: { setProp },
    title,
    subtitle,
    backgroundColor,
    cardBackgroundColor,
    textColor,
    accentColor,
    borderColor,
    showCorners,
    cornerStyle,
    useLiveData,
  } = useNode((node) => ({
    title: node.data.props.title,
    subtitle: node.data.props.subtitle,
    backgroundColor: node.data.props.backgroundColor,
    cardBackgroundColor: node.data.props.cardBackgroundColor,
    textColor: node.data.props.textColor,
    accentColor: node.data.props.accentColor,
    borderColor: node.data.props.borderColor,
    showCorners: node.data.props.showCorners,
    cornerStyle: node.data.props.cornerStyle,
    useLiveData: node.data.props.useLiveData,
  }))

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setProp((props: ScheduleListProps) => (props.title = e.target.value))}
          className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">Subtitle</label>
        <input
          type="text"
          value={subtitle || ''}
          onChange={(e) => setProp((props: ScheduleListProps) => (props.subtitle = e.target.value))}
          className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-stone-700">
          <input
            type="checkbox"
            checked={useLiveData}
            onChange={(e) => setProp((props: ScheduleListProps) => (props.useLiveData = e.target.checked))}
            className="rounded border-stone-300"
          />
          Use Live Data from Database
        </label>
        <p className="text-xs text-stone-500 mt-1">
          When enabled, fetches schedules from the parish database
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">Background</label>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setProp((props: ScheduleListProps) => (props.backgroundColor = e.target.value))}
            className="w-full h-10 cursor-pointer rounded border border-stone-300"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">Card BG</label>
          <input
            type="color"
            value={cardBackgroundColor}
            onChange={(e) => setProp((props: ScheduleListProps) => (props.cardBackgroundColor = e.target.value))}
            className="w-full h-10 cursor-pointer rounded border border-stone-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">Text</label>
          <input
            type="color"
            value={textColor}
            onChange={(e) => setProp((props: ScheduleListProps) => (props.textColor = e.target.value))}
            className="w-full h-10 cursor-pointer rounded border border-stone-300"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">Accent</label>
          <input
            type="color"
            value={accentColor}
            onChange={(e) => setProp((props: ScheduleListProps) => (props.accentColor = e.target.value))}
            className="w-full h-10 cursor-pointer rounded border border-stone-300"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">Border</label>
          <input
            type="color"
            value={borderColor}
            onChange={(e) => setProp((props: ScheduleListProps) => (props.borderColor = e.target.value))}
            className="w-full h-10 cursor-pointer rounded border border-stone-300"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-stone-700">
          <input
            type="checkbox"
            checked={showCorners}
            onChange={(e) => setProp((props: ScheduleListProps) => (props.showCorners = e.target.checked))}
            className="rounded border-stone-300"
          />
          Show Corner Ornaments
        </label>
      </div>

      {showCorners && (
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">Corner Style</label>
          <select
            value={cornerStyle}
            onChange={(e) => setProp((props: ScheduleListProps) => (props.cornerStyle = Number(e.target.value) as 1 | 2 | 3 | 4))}
            className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
          >
            <option value={1}>Style 1</option>
            <option value={2}>Style 2</option>
            <option value={3}>Style 3</option>
            <option value={4}>Style 4</option>
          </select>
        </div>
      )}
    </div>
  )
}

ScheduleList.craft = {
  displayName: 'Schedule List',
  props: {
    title: 'Weekly Services',
    subtitle: 'Join us in prayer',
    backgroundColor: '#1A1410',
    cardBackgroundColor: '#2A1F18',
    textColor: '#E8E0D4',
    accentColor: '#C9A227',
    borderColor: '#3D2E1E',
    showCorners: true,
    cornerStyle: 1,
    cornerSize: 50,
    invertCorners: true,
    paddingVertical: 64,
    paddingHorizontal: 32,
    useLiveData: false,
    staticItems: defaultItems,
  },
  related: {
    settings: ScheduleListSettings,
  },
  rules: {
    canDrag: () => true,
  },
}

export default ScheduleList

