'use client'

import { useNode } from '@craftjs/core'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ColorPicker } from '../controls/ColorPicker'
import { SettingsAccordion } from '../controls/SettingsAccordion'

interface NewsListProps {
  title?: string
  limit?: number
  columns?: number
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

  // Use lg breakpoint (1024px) for column layout - single column below that
  const columnClasses = {
    1: '',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-2 xl:grid-cols-4',
  }

  return (
    <div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={isSelected ? 'ring-2 ring-primary rounded' : ''}
    >
      {title && (
        <h2 className="text-2xl font-bold mb-6" style={styles.title}>
          {title}
        </h2>
      )}
      <div className={`grid grid-cols-1 gap-4 ${columnClasses[columns as keyof typeof columnClasses] || 'lg:grid-cols-3'}`}>
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} style={styles.card}>
            <h3 className="text-lg font-semibold mb-3" style={styles.cardTitle}>
              Announcement {i + 1}
            </h3>
            <p className="text-sm" style={styles.muted}>
              Announcement content will be displayed here
            </p>
          </div>
        ))}
      </div>
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
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-white hover:bg-gray-50 border-gray-200'
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
    textColor: '',
    mutedTextColor: '',
    cardBackground: '',
    cardBorder: '',
  },
  related: {
    settings: NewsListSettings,
  },
}
