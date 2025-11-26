'use client'

import { useNode } from '@craftjs/core'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { SettingsAccordion } from '../controls/SettingsAccordion'

interface ButtonBlockProps {
  text?: string
  url?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  fullWidth?: boolean
  align?: 'left' | 'center' | 'right'
}

export function ButtonBlock({ 
  text = 'Click me', 
  url = '#', 
  variant = 'default', 
  size = 'default', 
  fullWidth = false,
  align = 'left',
}: ButtonBlockProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }

  const button = (
    <Button 
      variant={variant} 
      size={size} 
      className={fullWidth ? 'w-full' : ''}
    >
      {text}
    </Button>
  )

  return (
    <div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={`flex ${alignClasses[align]} ${isSelected ? 'ring-2 ring-primary rounded p-1' : ''}`}
    >
      {url && url !== '#' ? (
        <Link href={url} className={fullWidth ? 'w-full' : ''}>
          {button}
        </Link>
      ) : (
        button
      )}
    </div>
  )
}

function ButtonBlockSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }))

  const variantOptions = [
    { label: 'Primary', value: 'default' },
    { label: 'Outline', value: 'outline' },
    { label: 'Secondary', value: 'secondary' },
    { label: 'Ghost', value: 'ghost' },
  ]

  const sizeOptions = [
    { label: 'SM', value: 'sm' },
    { label: 'MD', value: 'default' },
    { label: 'LG', value: 'lg' },
  ]

  const alignOptions = [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
  ]

  return (
    <div className="divide-y divide-gray-100">
      <SettingsAccordion title="Content" defaultOpen>
        <div>
          <Label className="text-sm font-medium">Button Text</Label>
          <Input
            value={props.text || ''}
            onChange={(e) => setProp((p: any) => (p.text = e.target.value))}
            className="mt-1"
            placeholder="Click me"
          />
        </div>
        <div>
          <Label className="text-sm font-medium">Link URL</Label>
          <Input
            value={props.url || ''}
            onChange={(e) => setProp((p: any) => (p.url = e.target.value))}
            className="mt-1"
            placeholder="/page or https://..."
          />
        </div>
      </SettingsAccordion>

      <SettingsAccordion title="Style" defaultOpen>
        <div>
          <Label className="text-sm font-medium">Variant</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {variantOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setProp((p: any) => (p.variant = option.value))}
                className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                  (props.variant || 'default') === option.value
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
          <Label className="text-sm font-medium">Size</Label>
          <div className="flex gap-2 mt-2">
            {sizeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setProp((p: any) => (p.size = option.value))}
                className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition-colors ${
                  (props.size || 'default') === option.value
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
          <Label className="text-sm font-medium">Alignment</Label>
          <div className="flex gap-2 mt-2">
            {alignOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setProp((p: any) => (p.align = option.value))}
                className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition-colors ${
                  (props.align || 'left') === option.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-white hover:bg-gray-50 border-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="fullWidth"
            checked={props.fullWidth === true}
            onChange={(e) => setProp((p: any) => (p.fullWidth = e.target.checked))}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="fullWidth" className="text-sm">Full Width</Label>
        </div>
      </SettingsAccordion>
    </div>
  )
}

ButtonBlock.craft = {
  displayName: 'Button',
  props: {
    text: 'Click me',
    url: '#',
    variant: 'default',
    size: 'default',
    fullWidth: false,
    align: 'left',
  },
  related: {
    settings: ButtonBlockSettings,
  },
}
