'use client'

import { useNode, Element } from '@craftjs/core'
import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { SettingsAccordion } from '../controls/SettingsAccordion'
import { ColorPicker } from '../controls/ColorPicker'
import { OpacityControl } from '../controls/OpacityControl'
import { DropZoneContent } from './shared/DropZone'

interface ContainerProps {
  backgroundColor?: string
  backgroundOpacity?: number
  textColor?: string
  padding?: number
  maxWidth?: string
  borderRadius?: number
}

/**
 * Helper to convert hex to rgba with opacity
 */
function hexToRgba(hex: string, opacity: number): string {
  if (!hex || hex === 'transparent') return 'transparent'
  const cleanHex = hex.replace('#', '')
  const r = parseInt(cleanHex.slice(0, 2), 16)
  const g = parseInt(cleanHex.slice(2, 4), 16)
  const b = parseInt(cleanHex.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`
}

export function Container({
  backgroundColor = '',
  backgroundOpacity = 100,
  textColor = '',
  padding = 24,
  maxWidth = 'none',
  borderRadius = 0,
}: ContainerProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  const bgColor = backgroundColor ? hexToRgba(backgroundColor, backgroundOpacity) : 'transparent'

  return (
    <div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={`
        w-full
        ${isSelected ? 'ring-2 ring-primary' : ''}
      `}
      style={{
        backgroundColor: bgColor,
        color: textColor || undefined,
        padding: `${padding}px`,
        maxWidth: maxWidth !== 'none' ? maxWidth : undefined,
        margin: maxWidth !== 'none' ? '0 auto' : undefined,
        borderRadius: borderRadius ? `${borderRadius}px` : undefined,
      }}
    >
      <Element 
        is={DropZoneContent} 
        canvas 
        id="container-content"
        placeholder="Drop components here"
        minHeight={60}
      />
    </div>
  )
}

function ContainerSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }))

  const maxWidthOptions = [
    { label: 'Full', value: 'none' },
    { label: 'SM', value: '640px' },
    { label: 'MD', value: '768px' },
    { label: 'LG', value: '1024px' },
    { label: 'XL', value: '1280px' },
  ]

  return (
    <div className="divide-y divide-gray-100">
      {/* Layout Section */}
      <SettingsAccordion title="Layout" defaultOpen>
        <div>
          <Label className="text-sm font-medium">Max Width</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {maxWidthOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setProp((p: any) => (p.maxWidth = option.value))}
                className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                  (props.maxWidth || 'none') === option.value
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
              min={0}
              max={80}
              value={props.padding ?? 24}
              onChange={(e) => setProp((p: any) => (p.padding = parseInt(e.target.value)))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0px</span>
              <span className="font-medium text-gray-700">{props.padding ?? 24}px</span>
              <span>80px</span>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Border Radius</Label>
          <div className="mt-2">
            <input
              type="range"
              min={0}
              max={32}
              value={props.borderRadius ?? 0}
              onChange={(e) => setProp((p: any) => (p.borderRadius = parseInt(e.target.value)))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span className="font-medium text-gray-700">{props.borderRadius ?? 0}px</span>
              <span>32</span>
            </div>
          </div>
        </div>
      </SettingsAccordion>

      {/* Appearance Section */}
      <SettingsAccordion title="Appearance">
        <ColorPicker
          label="Background Color"
          value={props.backgroundColor || ''}
          onChange={(value) => setProp((p: any) => (p.backgroundColor = value))}
          placeholder="transparent"
        />

        {props.backgroundColor && (
          <OpacityControl
            label="Background Opacity"
            value={props.backgroundOpacity ?? 100}
            onChange={(value) => setProp((p: any) => (p.backgroundOpacity = value))}
          />
        )}

        <ColorPicker
          label="Text Color"
          value={props.textColor || ''}
          onChange={(value) => setProp((p: any) => (p.textColor = value))}
          placeholder="inherit"
        />
      </SettingsAccordion>
    </div>
  )
}

Container.craft = {
  displayName: 'Container',
  props: {
    backgroundColor: '',
    backgroundOpacity: 100,
    textColor: '',
    padding: 24,
    maxWidth: 'none',
    borderRadius: 0,
  },
  related: {
    settings: ContainerSettings,
  },
}
