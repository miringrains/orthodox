'use client'

import { useNode } from '@craftjs/core'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface ButtonBlockProps {
  text?: string
  url?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg'
  fullWidth?: boolean
}

export function ButtonBlock({ text, url, variant, size, fullWidth }: ButtonBlockProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  const button = (
    <Button variant={variant || 'default'} size={size || 'default'} className={fullWidth ? 'w-full' : ''}>
      {text || 'Click me'}
    </Button>
  )

  return (
    <div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={`py-4 ${isSelected ? 'ring-2 ring-primary' : ''}`}
    >
      {url && url !== '#' ? (
        <Link href={url}>{button}</Link>
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

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label>Button Text</Label>
        <Input
          value={props.text || ''}
          onChange={(e) => setProp((props: any) => (props.text = e.target.value))}
        />
      </div>
      <div>
        <Label>URL</Label>
        <Input
          value={props.url || ''}
          onChange={(e) => setProp((props: any) => (props.url = e.target.value))}
        />
      </div>
      <div>
        <Label>Variant</Label>
        <select
          value={props.variant || 'default'}
          onChange={(e) => setProp((props: any) => (props.variant = e.target.value))}
          className="w-full p-2 border rounded"
        >
          <option value="default">Default</option>
          <option value="outline">Outline</option>
          <option value="secondary">Secondary</option>
          <option value="ghost">Ghost</option>
          <option value="destructive">Destructive</option>
        </select>
      </div>
    </div>
  )
}

ButtonBlock.craft = {
  displayName: 'Button Block',
  props: {
    text: 'Click me',
    url: '#',
    variant: 'default',
    size: 'default',
    fullWidth: false,
  },
  related: {
    settings: ButtonBlockSettings,
  },
}
