'use client'

import { useNode } from '@craftjs/core'
import Link from 'next/link'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { SettingsAccordion } from '../controls/SettingsAccordion'
import { ColorPicker } from '../controls/ColorPicker'

interface CTAItem {
  text: string
  url: string
}

interface CallToActionBarProps {
  items?: CTAItem[]
  backgroundColor?: string
  textColor?: string
  dividerColor?: string
  padding?: number
  fontSize?: 'md' | 'lg' | 'xl' | '2xl'
  letterSpacing?: string
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold'
}

export function CallToActionBar({ 
  items = [
    { text: 'Visit', url: '/about' },
    { text: 'Donate', url: '/giving' },
    { text: 'Learn', url: '/schedule' },
  ],
  backgroundColor = '#0A1628',
  textColor = '#C9A227',
  dividerColor = '#C9A227',
  padding = 40,
  fontSize = 'xl',
  letterSpacing = '0.15em',
  fontWeight = 'bold',
}: CallToActionBarProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  const fontSizeClasses = {
    md: 'text-lg md:text-xl',
    lg: 'text-xl md:text-2xl',
    xl: 'text-2xl md:text-3xl',
    '2xl': 'text-3xl md:text-4xl',
  }

  const fontWeightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }

  return (
    <div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={`w-full ${isSelected ? 'ring-2 ring-primary' : ''}`}
      style={{
        backgroundColor,
        padding: `${padding}px 20px`,
      }}
    >
      <div className="flex items-center justify-center flex-wrap gap-4 md:gap-8">
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            <Link
              href={item.url}
              className={`
                ${fontSizeClasses[fontSize]}
                ${fontWeightClasses[fontWeight]}
                hover:opacity-80 transition-opacity
                uppercase
              `}
              style={{
                color: textColor,
                letterSpacing,
                fontFamily: 'serif',
              }}
            >
              {item.text}
            </Link>
            {index < items.length - 1 && (
              <span
                className="mx-4 md:mx-8 text-2xl md:text-3xl font-light"
                style={{ color: dividerColor }}
              >
                |
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function CallToActionBarSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }))

  const items = props.items || [
    { text: 'Visit', url: '/about' },
    { text: 'Donate', url: '/giving' },
    { text: 'Learn', url: '/schedule' },
  ]

  const addItem = () => {
    setProp((p: any) => {
      p.items = [...(p.items || items), { text: 'Link', url: '#' }]
    })
  }

  const removeItem = (index: number) => {
    setProp((p: any) => {
      p.items = (p.items || items).filter((_: CTAItem, i: number) => i !== index)
    })
  }

  const updateItem = (index: number, field: keyof CTAItem, value: string) => {
    setProp((p: any) => {
      const newItems = [...(p.items || items)]
      newItems[index] = { ...newItems[index], [field]: value }
      p.items = newItems
    })
  }

  const sizeOptions = [
    { label: 'MD', value: 'md' },
    { label: 'LG', value: 'lg' },
    { label: 'XL', value: 'xl' },
    { label: '2XL', value: '2xl' },
  ]

  return (
    <div className="divide-y divide-gray-100">
      <SettingsAccordion title="Links" defaultOpen>
        <div className="space-y-3">
          {items.map((item: CTAItem, index: number) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-1 space-y-1">
                <Input
                  value={item.text}
                  onChange={(e) => updateItem(index, 'text', e.target.value)}
                  placeholder="Link text"
                  className="text-sm"
                />
                <Input
                  value={item.url}
                  onChange={(e) => updateItem(index, 'url', e.target.value)}
                  placeholder="/page"
                  className="text-xs"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500"
                onClick={() => removeItem(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={addItem}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Link
          </Button>
        </div>
      </SettingsAccordion>

      <SettingsAccordion title="Style" defaultOpen>
        <div>
          <Label className="text-sm font-medium">Size</Label>
          <div className="flex gap-2 mt-2">
            {sizeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setProp((p: any) => (p.fontSize = option.value))}
                className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition-colors ${
                  (props.fontSize || 'xl') === option.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-white hover:bg-gray-50 border-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Padding</Label>
          <div className="mt-2">
            <input
              type="range"
              min={20}
              max={80}
              value={props.padding ?? 40}
              onChange={(e) => setProp((p: any) => (p.padding = parseInt(e.target.value)))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>20px</span>
              <span className="font-medium text-gray-700">{props.padding ?? 40}px</span>
              <span>80px</span>
            </div>
          </div>
        </div>
      </SettingsAccordion>

      <SettingsAccordion title="Colors">
        <ColorPicker
          label="Background"
          value={props.backgroundColor || '#0A1628'}
          onChange={(value) => setProp((p: any) => (p.backgroundColor = value))}
        />
        <ColorPicker
          label="Text Color"
          value={props.textColor || '#C9A227'}
          onChange={(value) => setProp((p: any) => (p.textColor = value))}
        />
        <ColorPicker
          label="Divider Color"
          value={props.dividerColor || '#C9A227'}
          onChange={(value) => setProp((p: any) => (p.dividerColor = value))}
        />
      </SettingsAccordion>
    </div>
  )
}

CallToActionBar.craft = {
  displayName: 'CTA Bar',
  props: {
    items: [
      { text: 'Visit', url: '/about' },
      { text: 'Donate', url: '/giving' },
      { text: 'Learn', url: '/schedule' },
    ],
    backgroundColor: '#0A1628',
    textColor: '#C9A227',
    dividerColor: '#C9A227',
    padding: 40,
    fontSize: 'xl',
    letterSpacing: '0.15em',
    fontWeight: 'bold',
  },
  related: {
    settings: CallToActionBarSettings,
  },
}

