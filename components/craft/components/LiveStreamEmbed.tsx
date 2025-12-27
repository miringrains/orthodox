'use client'

import { useNode } from '@craftjs/core'
import { Video, Youtube, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ColorPicker } from '../controls/ColorPicker'
import { SettingsAccordion } from '../controls/SettingsAccordion'

interface LiveStreamEmbedProps {
  title?: string
  platform?: 'youtube' | 'facebook' | 'vimeo' | 'custom'
  videoUrl?: string
  autoplay?: boolean
  showTitle?: boolean
  height?: number
  placeholderText?: string
  // Theme-aware colors
  textColor?: string
  mutedTextColor?: string
  accentColor?: string
  cardBackground?: string
  cardBorder?: string
}

export function LiveStreamEmbed({ 
  title,
  platform = 'youtube',
  videoUrl = '',
  autoplay = false,
  showTitle = true,
  height = 400,
  placeholderText = 'No live stream available at this time.',
  textColor = '',
  mutedTextColor = '',
  accentColor = '',
  cardBackground = '',
  cardBorder = '',
}: LiveStreamEmbedProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  // Parse video URL to get embed URL
  const getEmbedUrl = () => {
    if (!videoUrl) return null

    try {
      const url = new URL(videoUrl)
      
      // YouTube
      if (platform === 'youtube' || url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) {
        let videoId = ''
        
        if (url.hostname === 'youtu.be') {
          videoId = url.pathname.slice(1)
        } else if (url.pathname.includes('/live/')) {
          videoId = url.pathname.split('/live/')[1]
        } else if (url.pathname.includes('/watch')) {
          videoId = url.searchParams.get('v') || ''
        } else if (url.pathname.includes('/embed/')) {
          videoId = url.pathname.split('/embed/')[1]
        }
        
        if (videoId) {
          const params = new URLSearchParams()
          if (autoplay) params.set('autoplay', '1')
          params.set('rel', '0')
          return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
        }
      }
      
      // Facebook
      if (platform === 'facebook' || url.hostname.includes('facebook.com')) {
        return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(videoUrl)}&show_text=false&autoplay=${autoplay ? 'true' : 'false'}`
      }
      
      // Vimeo
      if (platform === 'vimeo' || url.hostname.includes('vimeo.com')) {
        const vimeoId = url.pathname.replace('/', '')
        if (vimeoId) {
          return `https://player.vimeo.com/video/${vimeoId}?autoplay=${autoplay ? '1' : '0'}`
        }
      }
      
      // Custom/direct embed URL
      if (platform === 'custom') {
        return videoUrl
      }
    } catch {
      // If URL parsing fails, try to use as-is for custom embeds
      if (platform === 'custom') {
        return videoUrl
      }
    }
    
    return null
  }

  const embedUrl = getEmbedUrl()

  const styles = {
    card: {
      backgroundColor: cardBackground || undefined,
      borderColor: cardBorder || undefined,
    },
    title: { color: textColor || 'inherit' },
    muted: { color: mutedTextColor || 'inherit', opacity: mutedTextColor ? 1 : 0.7 },
    accent: { color: accentColor || 'var(--gold-600)' },
  }

  const PlatformIcon = platform === 'youtube' ? Youtube : Video

  return (
    <Card
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={`overflow-hidden ${isSelected ? 'ring-2 ring-primary' : ''}`}
      style={styles.card}
    >
      {showTitle && title && (
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2" style={styles.title}>
            <PlatformIcon className="h-5 w-5" style={styles.accent} />
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={showTitle && title ? 'pt-2' : 'p-0'}>
        {!videoUrl ? (
          <div 
            className="flex flex-col items-center justify-center bg-stone-900 text-center px-4"
            style={{ height: `${height}px` }}
          >
            <Video className="h-16 w-16 mb-4 text-stone-600" />
            <p className="text-stone-400">{placeholderText}</p>
          </div>
        ) : !embedUrl ? (
          <div 
            className="flex flex-col items-center justify-center bg-stone-900 text-center px-4"
            style={{ height: `${height}px` }}
          >
            <Video className="h-16 w-16 mb-4 text-stone-600" />
            <p className="text-stone-400 mb-4">Unable to embed this video</p>
            <Button variant="outline" size="sm" asChild>
              <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Watch on {platform}
              </a>
            </Button>
          </div>
        ) : (
          <div 
            className="w-full bg-black"
            style={{ height: `${height}px` }}
          >
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function LiveStreamEmbedSettings() {
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
            placeholder="Live Stream"
          />
        </div>
        <div>
          <Label>Platform</Label>
          <div className="flex gap-2 mt-2">
            {[
              { value: 'youtube', label: 'YouTube' },
              { value: 'facebook', label: 'Facebook' },
              { value: 'vimeo', label: 'Vimeo' },
              { value: 'custom', label: 'Custom' },
            ].map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setProp((props: any) => (props.platform = p.value))}
                className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition-colors ${
                  (props.platform || 'youtube') === p.value
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white hover:bg-stone-50 border-stone-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label>Video URL</Label>
          <Input
            value={props.videoUrl || ''}
            onChange={(e) => setProp((props: any) => (props.videoUrl = e.target.value))}
            className="mt-1"
            placeholder="https://youtube.com/watch?v=..."
          />
          <p className="text-xs text-muted-foreground mt-1">
            Paste the URL of your live stream or video
          </p>
        </div>
        <div>
          <Label>Placeholder Text</Label>
          <Input
            value={props.placeholderText || ''}
            onChange={(e) => setProp((props: any) => (props.placeholderText = e.target.value))}
            className="mt-1"
            placeholder="No live stream available..."
          />
          <p className="text-xs text-muted-foreground mt-1">
            Shown when no video URL is set
          </p>
        </div>
      </SettingsAccordion>

      <SettingsAccordion title="Options">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showTitle"
            checked={props.showTitle !== false}
            onChange={(e) => setProp((props: any) => (props.showTitle = e.target.checked))}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="showTitle" className="text-sm">Show title</Label>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <input
            type="checkbox"
            id="autoplay"
            checked={props.autoplay || false}
            onChange={(e) => setProp((props: any) => (props.autoplay = e.target.checked))}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="autoplay" className="text-sm">Autoplay (muted)</Label>
        </div>
        <div className="mt-3">
          <Label>Height (px)</Label>
          <Input
            type="number"
            value={props.height || 400}
            onChange={(e) => setProp((props: any) => (props.height = parseInt(e.target.value) || 400))}
            className="mt-1"
            min={200}
            max={800}
          />
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

LiveStreamEmbed.craft = {
  displayName: 'Live Stream',
  props: {
    title: 'Live Stream',
    platform: 'youtube',
    videoUrl: '',
    autoplay: false,
    showTitle: true,
    height: 400,
    placeholderText: 'No live stream available at this time.',
    textColor: '',
    mutedTextColor: '',
    accentColor: '',
    cardBackground: '',
    cardBorder: '',
  },
  related: {
    settings: LiveStreamEmbedSettings,
  },
}

