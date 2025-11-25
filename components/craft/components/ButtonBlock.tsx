'use client'

import { useNode } from '@craftjs/core'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ColorPicker } from '../controls/ColorPicker'
import { SpacingControl } from '../controls/SpacingControl'
import { BorderControl } from '../controls/BorderControl'
import { ShadowControl } from '../controls/ShadowControl'

interface ButtonBlockProps {
  text?: string
  url?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg'
  fullWidth?: boolean
  backgroundColor?: string
  textColor?: string
  padding?: { top: number; right: number; bottom: number; left: number }
  margin?: { top: number; right: number; bottom: number; left: number }
  borderRadius?: number
  borderWidth?: number
  borderColor?: string
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none'
  boxShadow?: string
}

export function ButtonBlock({ 
  text, 
  url, 
  variant, 
  size, 
  fullWidth,
  backgroundColor,
  textColor,
  padding = { top: 0, right: 0, bottom: 0, left: 0 },
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  borderRadius = 6,
  borderWidth = 0,
  borderColor = '#000000',
  borderStyle = 'solid',
  boxShadow,
}: ButtonBlockProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  const paddingStyle = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`
  const marginStyle = `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`
  const borderStyleStr = borderWidth > 0 ? `${borderWidth}px ${borderStyle} ${borderColor}` : 'none'

  const buttonStyle: React.CSSProperties = {
    backgroundColor: backgroundColor || undefined,
    color: textColor || undefined,
    padding: paddingStyle,
    margin: marginStyle,
    borderRadius: `${borderRadius}px`,
    border: borderStyleStr,
    boxShadow: boxShadow || undefined,
  }

  const button = (
    <Button 
      variant={variant || 'default'} 
      size={size || 'default'} 
      className={fullWidth ? 'w-full' : ''}
      style={buttonStyle}
    >
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
      className={`py-4 ${isSelected ? 'ring-2 ring-primary rounded' : ''}`}
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
        <Select
          value={props.variant || 'default'}
          onValueChange={(value) => setProp((props: any) => (props.variant = value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
            <SelectItem value="secondary">Secondary</SelectItem>
            <SelectItem value="ghost">Ghost</SelectItem>
            <SelectItem value="destructive">Destructive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Size</Label>
        <Select
          value={props.size || 'default'}
          onValueChange={(value) => setProp((props: any) => (props.size = value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Small</SelectItem>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ColorPicker
        label="Background Color"
        value={props.backgroundColor || ''}
        onChange={(value) => setProp((props: any) => (props.backgroundColor = value))}
        placeholder="Use variant default"
      />

      <ColorPicker
        label="Text Color"
        value={props.textColor || ''}
        onChange={(value) => setProp((props: any) => (props.textColor = value))}
        placeholder="Use variant default"
      />

      <SpacingControl
        label="Padding"
        value={props.padding || { top: 0, right: 0, bottom: 0, left: 0 }}
        onChange={(value) => setProp((props: any) => (props.padding = value))}
      />

      <SpacingControl
        label="Margin"
        value={props.margin || { top: 0, right: 0, bottom: 0, left: 0 }}
        onChange={(value) => setProp((props: any) => (props.margin = value))}
      />

      <BorderControl
        borderRadius={props.borderRadius || 6}
        borderWidth={props.borderWidth || 0}
        borderColor={props.borderColor || '#000000'}
        borderStyle={props.borderStyle || 'solid'}
        onBorderRadiusChange={(value) => setProp((props: any) => (props.borderRadius = value))}
        onBorderWidthChange={(value) => setProp((props: any) => (props.borderWidth = value))}
        onBorderColorChange={(value) => setProp((props: any) => (props.borderColor = value))}
        onBorderStyleChange={(value) => setProp((props: any) => (props.borderStyle = value))}
      />

      <ShadowControl
        value={props.boxShadow || 'none'}
        onChange={(value) => setProp((props: any) => (props.boxShadow = value))}
      />
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
    backgroundColor: '',
    textColor: '',
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    borderRadius: 6,
    borderWidth: 0,
    borderColor: '#000000',
    borderStyle: 'solid',
    boxShadow: 'none',
  },
  related: {
    settings: ButtonBlockSettings,
  },
}
