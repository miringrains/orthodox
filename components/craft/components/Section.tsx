'use client'

import { useNode, Element } from '@craftjs/core'
import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { OpacityControl } from '../controls/OpacityControl'
import { ColorPicker } from '../controls/ColorPicker'

interface SectionProps {
  backgroundColor?: string
  backgroundColorOpacity?: number
  backgroundImage?: string
  backgroundImageOpacity?: number
  textColor?: string
  textColorOpacity?: number
  padding?: { top: number; right: number; bottom: number; left: number }
  margin?: { top: number; right: number; bottom: number; left: number }
  containerWidth?: string
  borderRadius?: number
}

export function Section({
  backgroundColor,
  backgroundColorOpacity = 100,
  backgroundImage,
  backgroundImageOpacity = 100,
  textColor,
  textColorOpacity = 100,
  padding = { top: 40, right: 0, bottom: 40, left: 0 },
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  containerWidth = '1280px',
  borderRadius = 0,
}: SectionProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  const paddingStyle = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`
  const marginStyle = `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`

  return (
    <section
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={`
        relative
        ${isSelected ? 'ring-2 ring-primary' : ''}
      `}
      style={{
        padding: paddingStyle,
        margin: marginStyle,
        borderRadius: `${borderRadius}px`,
      }}
    >
      {/* Background Image Layer */}
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            opacity: backgroundImageOpacity / 100,
          }}
        />
      )}
      {/* Background Color Overlay Layer */}
      {backgroundColor && (
        <div
          className="absolute inset-0"
          style={{ 
            backgroundColor: backgroundColor,
            opacity: backgroundColorOpacity / 100,
          }}
        />
      )}
      <div 
        className="container mx-auto px-4" 
        style={{ 
          maxWidth: containerWidth,
          color: textColor ? (() => {
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
            if (textColor.startsWith('rgb')) {
              return textColor.replace('rgb', 'rgba').replace(')', `, ${textColorOpacity / 100})`)
            }
            return textColor
          })() : undefined,
        }}
      >
        <Element is="div" canvas id="section-content">
          {/* Drop components here */}
        </Element>
      </div>
    </section>
  )
}

function SectionSettings() {
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
        {props.backgroundColor && (
          <OpacityControl
            label="Background Color Opacity"
            value={props.backgroundColorOpacity || 100}
            onChange={(value) => setProp((props: any) => (props.backgroundColorOpacity = value))}
          />
        )}
      </div>

      <div>
        <Label>Background Image URL</Label>
        <Input
          value={props.backgroundImage || ''}
          onChange={(e) => setProp((props: any) => (props.backgroundImage = e.target.value))}
          placeholder="https://example.com/image.jpg"
        />
        {props.backgroundImage && (
          <OpacityControl
            label="Background Image Opacity"
            value={props.backgroundImageOpacity || 100}
            onChange={(value) => setProp((props: any) => (props.backgroundImageOpacity = value))}
          />
        )}
      </div>

      <div>
        <ColorPicker
          label="Text Color"
          value={props.textColor || ''}
          onChange={(value) => setProp((props: any) => (props.textColor = value))}
          placeholder="Inherit"
        />
        {props.textColor && (
          <OpacityControl
            label="Text Color Opacity"
            value={props.textColorOpacity || 100}
            onChange={(value) => setProp((props: any) => (props.textColorOpacity = value))}
          />
        )}
      </div>

      <div>
        <Label>Container Width</Label>
        <Select
          value={props.containerWidth || '1280px'}
          onValueChange={(value) => setProp((props: any) => (props.containerWidth = value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="100%">Full Width</SelectItem>
            <SelectItem value="1536px">2XL (1536px)</SelectItem>
            <SelectItem value="1280px">XL (1280px)</SelectItem>
            <SelectItem value="1024px">Large (1024px)</SelectItem>
            <SelectItem value="768px">Medium (768px)</SelectItem>
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
              value={props.padding?.top || 40}
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
              value={props.padding?.bottom || 40}
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
    </div>
  )
}

Section.craft = {
  displayName: 'Section',
  props: {
    backgroundColor: '#ffffff',
    backgroundColorOpacity: 100,
    backgroundImage: '',
    backgroundImageOpacity: 100,
    textColor: '',
    textColorOpacity: 100,
    padding: { top: 40, right: 0, bottom: 40, left: 0 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    containerWidth: '1280px',
    borderRadius: 0,
  },
  related: {
    settings: SectionSettings,
  },
}

