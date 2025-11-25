'use client'

import { useNode, Element } from '@craftjs/core'
import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ColorPicker } from '../controls/ColorPicker'
import { OpacityControl } from '../controls/OpacityControl'

interface ThreeColumnProps {
  gap?: number
  backgroundColor?: string
  textColor?: string
  textColorOpacity?: number
  padding?: { top: number; right: number; bottom: number; left: number }
}

export function ThreeColumn({
  gap = 20,
  backgroundColor,
  textColor,
  textColorOpacity = 100,
  padding = { top: 0, right: 0, bottom: 0, left: 0 },
}: ThreeColumnProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  const paddingStyle = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`

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
        backgroundColor: backgroundColor || 'transparent',
        padding: paddingStyle,
      }}
    >
      <div
        className="grid grid-cols-3 w-full"
        style={{
          gap: `${gap}px`,
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
        <Element is="div" canvas id="column-1">
          {/* Drop components in column 1 */}
        </Element>
        <Element is="div" canvas id="column-2">
          {/* Drop components in column 2 */}
        </Element>
        <Element is="div" canvas id="column-3">
          {/* Drop components in column 3 */}
        </Element>
      </div>
    </div>
  )
}

function ThreeColumnSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }))

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label>Gap Between Columns</Label>
        <Input
          type="number"
          value={props.gap || 20}
          onChange={(e) => setProp((props: any) => (props.gap = parseInt(e.target.value) || 20))}
        />
      </div>

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
    </div>
  )
}

ThreeColumn.craft = {
  displayName: 'Three Column',
  props: {
    gap: 20,
    backgroundColor: '#ffffff',
    textColor: '',
    textColorOpacity: 100,
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
  },
  related: {
    settings: ThreeColumnSettings,
  },
}

