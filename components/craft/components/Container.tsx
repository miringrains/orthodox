'use client'

import { useNode, Element } from '@craftjs/core'
import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { OpacityControl } from '../controls/OpacityControl'
import { ColorPicker } from '../controls/ColorPicker'

interface ContainerProps {
  backgroundColor?: string
  backgroundColorOpacity?: number
  textColor?: string
  textColorOpacity?: number
  padding?: { top: number; right: number; bottom: number; left: number }
  margin?: { top: number; right: number; bottom: number; left: number }
  maxWidth?: string
  alignment?: 'left' | 'center' | 'right' | 'full'
  borderRadius?: number
  borderWidth?: number
  borderColor?: string
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none'
  boxShadow?: string
}

export function Container({ 
  backgroundColor,
  backgroundColorOpacity = 100,
  textColor,
  textColorOpacity = 100,
  padding = { top: 0, right: 0, bottom: 0, left: 0 },
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  maxWidth = '100%',
  alignment = 'full',
  borderRadius = 0,
  borderWidth = 0,
  borderColor = '#000000',
  borderStyle = 'solid',
  boxShadow,
}: ContainerProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  const paddingStyle = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`
  const marginStyle = `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`
  const borderStyleStr = borderWidth > 0 ? `${borderWidth}px ${borderStyle} ${borderColor}` : 'none'

  const alignmentClasses = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
    full: 'w-full',
  }

  // Convert hex to rgba with opacity
  const getBgColorWithOpacity = () => {
    if (!backgroundColor) return 'transparent'
    if (backgroundColor.startsWith('#')) {
      const hex = backgroundColor.slice(1)
      const r = parseInt(hex.slice(0, 2), 16)
      const g = parseInt(hex.slice(2, 4), 16)
      const b = parseInt(hex.slice(4, 6), 16)
      return `rgba(${r}, ${g}, ${b}, ${backgroundColorOpacity / 100})`
    }
    // If it's already rgba/rgb, try to parse it
    if (backgroundColor.startsWith('rgba')) {
      return backgroundColor.replace(/,\s*[\d.]+\)$/, `, ${backgroundColorOpacity / 100})`)
    }
    return backgroundColor
  }

  // Convert hex to rgba with opacity for text color
  const getTextColorWithOpacity = () => {
    if (!textColor) return undefined
    if (textColor.startsWith('#')) {
      const hex = textColor.slice(1)
      const r = parseInt(hex.slice(0, 2), 16)
      const g = parseInt(hex.slice(2, 4), 16)
      const b = parseInt(hex.slice(4, 6), 16)
      return `rgba(${r}, ${g}, ${b}, ${textColorOpacity / 100})`
    }
    if (textColor.startsWith('rgba')) {
      return textColor.replace(/,\s*[\d.]+\)$/, `, ${textColorOpacity / 100})`)
    }
    return textColor
  }

  return (
    <div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={`
        ${alignmentClasses[alignment]}
        ${isSelected ? 'ring-2 ring-primary' : ''}
        min-h-[100px]
      `}
      style={{
        backgroundColor: getBgColorWithOpacity(),
        color: getTextColorWithOpacity(),
        padding: paddingStyle,
        margin: marginStyle,
        maxWidth: maxWidth,
        borderRadius: `${borderRadius}px`,
        border: borderStyleStr,
        boxShadow: boxShadow || 'none',
      }}
    >
      <Element is="div" canvas id="container-content">
        {/* Drop components here */}
      </Element>
    </div>
  )
}

function ContainerSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }))

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label>Background Color</Label>
        <div className="flex gap-2 mt-2">
          <Input
            type="color"
            value={props.backgroundColor || '#ffffff'}
            onChange={(e) => setProp((props: any) => (props.backgroundColor = e.target.value))}
            className="h-10 w-20"
          />
          <Input
            type="text"
            value={props.backgroundColor || '#ffffff'}
            onChange={(e) => setProp((props: any) => (props.backgroundColor = e.target.value))}
            placeholder="#ffffff"
          />
        </div>
      </div>

      <div>
        <Label>Max Width</Label>
        <Select
          value={props.maxWidth || '100%'}
          onValueChange={(value) => setProp((props: any) => (props.maxWidth = value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="100%">Full Width</SelectItem>
            <SelectItem value="1280px">Large (1280px)</SelectItem>
            <SelectItem value="1024px">Medium (1024px)</SelectItem>
            <SelectItem value="768px">Small (768px)</SelectItem>
            <SelectItem value="640px">Extra Small (640px)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Alignment</Label>
        <Select
          value={props.alignment || 'full'}
          onValueChange={(value) => setProp((props: any) => (props.alignment = value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full">Full Width</SelectItem>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Padding</Label>
        <div className="grid grid-cols-4 gap-2 mt-2">
          <div>
            <Label className="text-xs">Top</Label>
            <Input
              type="number"
              value={props.padding?.top || 0}
              onChange={(e) => setProp((props: any) => ({
                ...props,
                padding: { ...props.padding, top: parseInt(e.target.value) || 0 }
              }))}
            />
          </div>
          <div>
            <Label className="text-xs">Right</Label>
            <Input
              type="number"
              value={props.padding?.right || 0}
              onChange={(e) => setProp((props: any) => ({
                ...props,
                padding: { ...props.padding, right: parseInt(e.target.value) || 0 }
              }))}
            />
          </div>
          <div>
            <Label className="text-xs">Bottom</Label>
            <Input
              type="number"
              value={props.padding?.bottom || 0}
              onChange={(e) => setProp((props: any) => ({
                ...props,
                padding: { ...props.padding, bottom: parseInt(e.target.value) || 0 }
              }))}
            />
          </div>
          <div>
            <Label className="text-xs">Left</Label>
            <Input
              type="number"
              value={props.padding?.left || 0}
              onChange={(e) => setProp((props: any) => ({
                ...props,
                padding: { ...props.padding, left: parseInt(e.target.value) || 0 }
              }))}
            />
          </div>
        </div>
      </div>

      <div>
        <Label>Margin</Label>
        <div className="grid grid-cols-4 gap-2 mt-2">
          <div>
            <Label className="text-xs">Top</Label>
            <Input
              type="number"
              value={props.margin?.top || 0}
              onChange={(e) => setProp((props: any) => ({
                ...props,
                margin: { ...props.margin, top: parseInt(e.target.value) || 0 }
              }))}
            />
          </div>
          <div>
            <Label className="text-xs">Right</Label>
            <Input
              type="number"
              value={props.margin?.right || 0}
              onChange={(e) => setProp((props: any) => ({
                ...props,
                margin: { ...props.margin, right: parseInt(e.target.value) || 0 }
              }))}
            />
          </div>
          <div>
            <Label className="text-xs">Bottom</Label>
            <Input
              type="number"
              value={props.margin?.bottom || 0}
              onChange={(e) => setProp((props: any) => ({
                ...props,
                margin: { ...props.margin, bottom: parseInt(e.target.value) || 0 }
              }))}
            />
          </div>
          <div>
            <Label className="text-xs">Left</Label>
            <Input
              type="number"
              value={props.margin?.left || 0}
              onChange={(e) => setProp((props: any) => ({
                ...props,
                margin: { ...props.margin, left: parseInt(e.target.value) || 0 }
              }))}
            />
          </div>
        </div>
      </div>

      <div>
        <Label>Border Radius</Label>
        <Input
          type="number"
          value={props.borderRadius || 0}
          onChange={(e) => setProp((props: any) => (props.borderRadius = parseInt(e.target.value) || 0))}
        />
      </div>

      <div>
        <Label>Border Width</Label>
        <Input
          type="number"
          value={props.borderWidth || 0}
          onChange={(e) => setProp((props: any) => (props.borderWidth = parseInt(e.target.value) || 0))}
        />
      </div>

      {props.borderWidth > 0 && (
        <>
          <div>
            <Label>Border Color</Label>
            <div className="flex gap-2 mt-2">
              <Input
                type="color"
                value={props.borderColor || '#000000'}
                onChange={(e) => setProp((props: any) => (props.borderColor = e.target.value))}
                className="h-10 w-20"
              />
              <Input
                type="text"
                value={props.borderColor || '#000000'}
                onChange={(e) => setProp((props: any) => (props.borderColor = e.target.value))}
              />
            </div>
          </div>
          <div>
            <Label>Border Style</Label>
            <Select
              value={props.borderStyle || 'solid'}
              onValueChange={(value) => setProp((props: any) => (props.borderStyle = value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="dashed">Dashed</SelectItem>
                <SelectItem value="dotted">Dotted</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  )
}

Container.craft = {
  displayName: 'Container',
  props: {
    backgroundColor: '#ffffff',
    backgroundColorOpacity: 100,
    textColor: '',
    textColorOpacity: 100,
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    maxWidth: '100%',
    alignment: 'full',
    borderRadius: 0,
    borderWidth: 0,
    borderColor: '#000000',
    borderStyle: 'solid',
    boxShadow: '',
  },
  related: {
    settings: ContainerSettings,
  },
}

