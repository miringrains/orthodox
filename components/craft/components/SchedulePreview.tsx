'use client'

import { useNode } from '@craftjs/core'
import Link from 'next/link'
import { Calendar } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ColorPicker } from '../controls/ColorPicker'
import { SettingsAccordion } from '../controls/SettingsAccordion'

interface SchedulePreviewProps {
  title?: string
  showFullSchedule?: boolean
  // Theme-aware colors (inherit from parent when empty)
  textColor?: string
  mutedTextColor?: string
  accentColor?: string
  cardBackground?: string
  cardBorder?: string
}

export function SchedulePreview({ 
  title, 
  showFullSchedule,
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
      <p className="text-sm mb-4" style={styles.muted}>
        Service schedule will be displayed here
      </p>
      {showFullSchedule !== false && (
        <Link 
          href="/schedule" 
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
