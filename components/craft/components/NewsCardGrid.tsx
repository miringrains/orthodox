'use client'

import React, { useEffect, useState } from 'react'
import { useNode } from '@craftjs/core'
import { useParishContext } from '../contexts/ParishContext'
import { createClient } from '@/lib/supabase/client'

interface NewsItem {
  id: string
  title: string
  excerpt: string
  date: string
  category?: string
  imageUrl?: string
}

interface NewsCardGridProps {
  title: string
  subtitle?: string
  layout: 'featured-left' | 'equal'
  backgroundColor: string
  cardBackgroundColor: string
  textColor: string
  accentColor: string
  borderColor: string
  limit: number
  paddingVertical: number
  paddingHorizontal: number
  useLiveData: boolean
  staticItems: NewsItem[]
}

const defaultItems: NewsItem[] = [
  {
    id: '1',
    title: 'Feast of the Nativity Schedule',
    excerpt: 'Join us for the celebration of the Nativity of our Lord. Special services will be held throughout the festal period.',
    date: 'December 15, 2025',
    category: 'Feast',
  },
  {
    id: '2',
    title: 'Parish Council Elections',
    excerpt: 'Nominations are now open for the annual parish council elections. Please consider serving our community.',
    date: 'December 10, 2025',
    category: 'Parish Life',
  },
  {
    id: '3',
    title: 'Youth Group Winter Retreat',
    excerpt: 'Registration is now open for our annual winter retreat for teens ages 13-18.',
    date: 'December 5, 2025',
    category: 'Youth',
  },
]

export const NewsCardGrid = ({
  title = 'Parish News',
  subtitle = 'Stay connected with our community',
  layout = 'featured-left',
  backgroundColor = '#0F0A08',
  cardBackgroundColor = '#1A1410',
  textColor = '#E8E0D4',
  accentColor = '#C9A227',
  borderColor = '#3D2E1E',
  limit = 3,
  paddingVertical = 64,
  paddingHorizontal = 32,
  useLiveData = false,
  staticItems = defaultItems,
}: NewsCardGridProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((state) => ({
    selected: state.events.selected,
  }))

  const { parishId, parishSlug } = useParishContext()
  const [liveItems, setLiveItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!useLiveData || !parishId) return

    const fetchNews = async () => {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('parish_id', parishId)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (data && !error) {
        const items: NewsItem[] = (data as any[]).map((item) => ({
          id: item.id,
          title: item.title,
          excerpt: item.content.substring(0, 150) + (item.content.length > 150 ? '...' : ''),
          date: item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '',
          category: item.category || undefined,
        }))
        setLiveItems(items)
      }
      setLoading(false)
    }

    fetchNews()
  }, [useLiveData, parishId, limit])

  const items = useLiveData && liveItems.length > 0 ? liveItems : staticItems.slice(0, limit)
  const featuredItem = items[0]
  const otherItems = items.slice(1)

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    return dateStr
  }

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)) }}
      className="w-full"
      style={{
        backgroundColor,
        paddingTop: `${paddingVertical}px`,
        paddingBottom: `${paddingVertical}px`,
        paddingLeft: `${paddingHorizontal}px`,
        paddingRight: `${paddingHorizontal}px`,
        outline: selected ? '2px solid #C9A227' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto">
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

        {loading ? (
          <div className="text-center py-8" style={{ color: textColor }}>Loading news...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-8" style={{ color: textColor, opacity: 0.6 }}>No news available</div>
        ) : layout === 'featured-left' && featuredItem ? (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Featured Card */}
            <div
              className="rounded-lg p-6 md:row-span-2 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: cardBackgroundColor,
                border: `1px solid ${borderColor}`,
              }}
            >
              {featuredItem.category && (
                <span
                  className="inline-block text-xs uppercase tracking-wider mb-3 px-3 py-1 rounded-full self-start"
                  style={{ backgroundColor: accentColor, color: backgroundColor }}
                >
                  {featuredItem.category}
                </span>
              )}
              <div className="flex-1">
                <h3 className="text-2xl font-serif mb-4" style={{ color: textColor }}>
                  {featuredItem.title}
                </h3>
                <p className="mb-4 leading-relaxed" style={{ color: textColor, opacity: 0.8 }}>
                  {featuredItem.excerpt}
                </p>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: `1px solid ${borderColor}` }}>
                <span className="text-sm" style={{ color: textColor, opacity: 0.6 }}>
                  {formatDate(featuredItem.date)}
                </span>
                <a
                  href={parishSlug ? `/p/${parishSlug}/announcements` : '#'}
                  className="text-sm font-medium hover:underline"
                  style={{ color: accentColor }}
                >
                  Read More →
                </a>
              </div>
            </div>

            {/* Other Cards */}
            {otherItems.map((item) => (
              <div
                key={item.id}
                className="rounded-lg p-5 transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: cardBackgroundColor,
                  border: `1px solid ${borderColor}`,
                }}
              >
                {item.category && (
                  <span
                    className="inline-block text-xs uppercase tracking-wider mb-2 px-2 py-0.5 rounded"
                    style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                  >
                    {item.category}
                  </span>
                )}
                <h3 className="text-lg font-semibold mb-2" style={{ color: textColor }}>
                  {item.title}
                </h3>
                <p className="text-sm mb-3" style={{ color: textColor, opacity: 0.7 }}>
                  {item.excerpt.substring(0, 100)}...
                </p>
                <span className="text-xs" style={{ color: textColor, opacity: 0.5 }}>
                  {formatDate(item.date)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          /* Equal Grid */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-lg p-5 transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: cardBackgroundColor,
                  border: `1px solid ${borderColor}`,
                }}
              >
                {item.category && (
                  <span
                    className="inline-block text-xs uppercase tracking-wider mb-2 px-2 py-0.5 rounded"
                    style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                  >
                    {item.category}
                  </span>
                )}
                <h3 className="text-lg font-semibold mb-2" style={{ color: textColor }}>
                  {item.title}
                </h3>
                <p className="text-sm mb-3" style={{ color: textColor, opacity: 0.7 }}>
                  {item.excerpt}
                </p>
                <span className="text-xs" style={{ color: textColor, opacity: 0.5 }}>
                  {formatDate(item.date)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const NewsCardGridSettings = () => {
  const {
    actions: { setProp },
    title,
    subtitle,
    layout,
    backgroundColor,
    cardBackgroundColor,
    textColor,
    accentColor,
    borderColor,
    limit,
    useLiveData,
  } = useNode((node) => ({
    title: node.data.props.title,
    subtitle: node.data.props.subtitle,
    layout: node.data.props.layout,
    backgroundColor: node.data.props.backgroundColor,
    cardBackgroundColor: node.data.props.cardBackgroundColor,
    textColor: node.data.props.textColor,
    accentColor: node.data.props.accentColor,
    borderColor: node.data.props.borderColor,
    limit: node.data.props.limit,
    useLiveData: node.data.props.useLiveData,
  }))

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setProp((props: NewsCardGridProps) => (props.title = e.target.value))}
          className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">Subtitle</label>
        <input
          type="text"
          value={subtitle || ''}
          onChange={(e) => setProp((props: NewsCardGridProps) => (props.subtitle = e.target.value))}
          className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">Layout</label>
        <select
          value={layout}
          onChange={(e) => setProp((props: NewsCardGridProps) => (props.layout = e.target.value as 'featured-left' | 'equal'))}
          className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
        >
          <option value="featured-left">Featured Left</option>
          <option value="equal">Equal Grid</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">Number of Items</label>
        <input
          type="number"
          min={1}
          max={6}
          value={limit}
          onChange={(e) => setProp((props: NewsCardGridProps) => (props.limit = Number(e.target.value)))}
          className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-stone-700">
          <input
            type="checkbox"
            checked={useLiveData}
            onChange={(e) => setProp((props: NewsCardGridProps) => (props.useLiveData = e.target.checked))}
            className="rounded border-stone-300"
          />
          Use Live Data from Database
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">Background</label>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setProp((props: NewsCardGridProps) => (props.backgroundColor = e.target.value))}
            className="w-full h-10 cursor-pointer rounded border border-stone-300"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">Card BG</label>
          <input
            type="color"
            value={cardBackgroundColor}
            onChange={(e) => setProp((props: NewsCardGridProps) => (props.cardBackgroundColor = e.target.value))}
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
            onChange={(e) => setProp((props: NewsCardGridProps) => (props.textColor = e.target.value))}
            className="w-full h-10 cursor-pointer rounded border border-stone-300"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">Accent</label>
          <input
            type="color"
            value={accentColor}
            onChange={(e) => setProp((props: NewsCardGridProps) => (props.accentColor = e.target.value))}
            className="w-full h-10 cursor-pointer rounded border border-stone-300"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">Border</label>
          <input
            type="color"
            value={borderColor}
            onChange={(e) => setProp((props: NewsCardGridProps) => (props.borderColor = e.target.value))}
            className="w-full h-10 cursor-pointer rounded border border-stone-300"
          />
        </div>
      </div>
    </div>
  )
}

NewsCardGrid.craft = {
  displayName: 'News Card Grid',
  props: {
    title: 'Parish News',
    subtitle: 'Stay connected with our community',
    layout: 'featured-left',
    backgroundColor: '#0F0A08',
    cardBackgroundColor: '#1A1410',
    textColor: '#E8E0D4',
    accentColor: '#C9A227',
    borderColor: '#3D2E1E',
    limit: 3,
    paddingVertical: 64,
    paddingHorizontal: 32,
    useLiveData: false,
    staticItems: defaultItems,
  },
  related: {
    settings: NewsCardGridSettings,
  },
  rules: {
    canDrag: () => true,
  },
}

export default NewsCardGrid

