'use client'

import { useNode } from '@craftjs/core'
import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ColorPicker } from '../controls/ColorPicker'

interface DividerProps {
  thickness?: number
  color?: string
  style?: 'solid' | 'dashed' | 'dotted'
  margin?: { top: number; right: number; bottom: number; left: number }
  width?: string // e.g., '60px', '100%', '50%'
  align?: 'left' | 'center' | 'right'
  variant?: 'single' | 'double' | 'triple' | 'ornate'
  gap?: number // Gap between lines for double/triple
}

export function Divider({
  thickness = 1,
  color = '#e5e7eb',
  style = 'solid',
  margin = { top: 20, right: 0, bottom: 20, left: 0 },
  width = '100%',
  align = 'center',
  variant = 'single',
  gap = 4,
}: DividerProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  const marginStyle = `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`

  const alignClasses = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  }

  // Single line divider
  if (variant === 'single') {
    return (
      <div
        ref={(ref) => {
          if (ref) {
            connect(drag(ref))
          }
        }}
        className={`
          ${alignClasses[align]}
          ${isSelected ? 'ring-2 ring-primary rounded' : ''}
        `}
        style={{
          width,
          margin: marginStyle,
          borderTop: `${thickness}px ${style} ${color}`,
        }}
      />
    )
  }

  // Double line divider
  if (variant === 'double') {
    return (
      <div
        ref={(ref) => {
          if (ref) {
            connect(drag(ref))
          }
        }}
        className={`
          ${alignClasses[align]}
          ${isSelected ? 'ring-2 ring-primary rounded p-1' : ''}
        `}
        style={{ width, margin: marginStyle }}
      >
        <div style={{ borderTop: `${thickness}px ${style} ${color}` }} />
        <div style={{ height: `${gap}px` }} />
        <div style={{ borderTop: `${thickness}px ${style} ${color}` }} />
      </div>
    )
  }

  // Triple line divider
  if (variant === 'triple') {
    return (
      <div
        ref={(ref) => {
          if (ref) {
            connect(drag(ref))
          }
        }}
        className={`
          ${alignClasses[align]}
          ${isSelected ? 'ring-2 ring-primary rounded p-1' : ''}
        `}
        style={{ width, margin: marginStyle }}
      >
        <div style={{ borderTop: `${thickness}px ${style} ${color}` }} />
        <div style={{ height: `${gap}px` }} />
        <div style={{ borderTop: `${Math.max(1, thickness - 1)}px ${style} ${color}` }} />
        <div style={{ height: `${gap}px` }} />
        <div style={{ borderTop: `${thickness}px ${style} ${color}` }} />
      </div>
    )
  }

  // Ornate divider (thick center with thin outer lines)
  if (variant === 'ornate') {
    return (
      <div
        ref={(ref) => {
          if (ref) {
            connect(drag(ref))
          }
        }}
        className={`
          ${alignClasses[align]}
          ${isSelected ? 'ring-2 ring-primary rounded p-1' : ''}
        `}
        style={{ width, margin: marginStyle }}
      >
        <div style={{ borderTop: `1px ${style} ${color}`, opacity: 0.5 }} />
        <div style={{ height: `${gap}px` }} />
        <div style={{ borderTop: `${Math.max(2, thickness)}px ${style} ${color}` }} />
        <div style={{ height: `${gap}px` }} />
        <div style={{ borderTop: `1px ${style} ${color}`, opacity: 0.5 }} />
      </div>
    )
  }

  return null
}

function DividerSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }))

  const variantOptions = [
    { label: 'Single', value: 'single' },
    { label: 'Double', value: 'double' },
    { label: 'Triple', value: 'triple' },
    { label: 'Ornate', value: 'ornate' },
  ]

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label className="text-sm font-medium">Pattern</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {variantOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setProp((p: any) => (p.variant = option.value))}
              className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                (props.variant || 'single') === option.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-white hover:bg-gray-50 border-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1">Double/Triple create elegant multi-line dividers</p>
      </div>

      <div>
        <Label>Width</Label>
        <Input
          type="text"
          value={props.width || '100%'}
          onChange={(e) => setProp((props: any) => (props.width = e.target.value))}
          placeholder="e.g., 60px, 50%, 100%"
        />
      </div>

      <div>
        <Label>Alignment</Label>
        <Select
          value={props.align || 'center'}
          onValueChange={(value) => setProp((props: any) => (props.align = value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Thickness (px)</Label>
        <Input
          type="number"
          value={props.thickness || 1}
          onChange={(e) => setProp((props: any) => (props.thickness = parseInt(e.target.value) || 1))}
        />
      </div>

      {(props.variant === 'double' || props.variant === 'triple' || props.variant === 'ornate') && (
        <div>
          <Label>Line Gap (px)</Label>
          <Input
            type="number"
            value={props.gap || 4}
            onChange={(e) => setProp((props: any) => (props.gap = parseInt(e.target.value) || 4))}
          />
        </div>
      )}

      <ColorPicker
        label="Color"
        value={props.color || '#e5e7eb'}
        onChange={(value) => setProp((props: any) => (props.color = value))}
      />

      <div>
        <Label>Style</Label>
        <Select
          value={props.style || 'solid'}
          onValueChange={(value) => setProp((props: any) => (props.style = value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Solid</SelectItem>
            <SelectItem value="dashed">Dashed</SelectItem>
            <SelectItem value="dotted">Dotted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Margin</Label>
        <div className="grid grid-cols-4 gap-2 mt-2">
          <div>
            <Label className="text-xs">Top</Label>
            <Input
              type="number"
              value={props.margin?.top ?? 20}
              onChange={(e) => setProp((props: any) => (props.margin = { ...props.margin, top: parseInt(e.target.value) || 0 }))}
            />
          </div>
          <div>
            <Label className="text-xs">Right</Label>
            <Input
              type="number"
              value={props.margin?.right ?? 0}
              onChange={(e) => setProp((props: any) => (props.margin = { ...props.margin, right: parseInt(e.target.value) || 0 }))}
            />
          </div>
          <div>
            <Label className="text-xs">Bottom</Label>
            <Input
              type="number"
              value={props.margin?.bottom ?? 20}
              onChange={(e) => setProp((props: any) => (props.margin = { ...props.margin, bottom: parseInt(e.target.value) || 0 }))}
            />
          </div>
          <div>
            <Label className="text-xs">Left</Label>
            <Input
              type="number"
              value={props.margin?.left ?? 0}
              onChange={(e) => setProp((props: any) => (props.margin = { ...props.margin, left: parseInt(e.target.value) || 0 }))}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

Divider.craft = {
  displayName: 'Divider',
  props: {
    thickness: 1,
    color: '#e5e7eb',
    style: 'solid',
    margin: { top: 20, right: 0, bottom: 20, left: 0 },
    width: '100%',
    align: 'center',
    variant: 'single',
    gap: 4,
  },
  related: {
    settings: DividerSettings,
  },
}

