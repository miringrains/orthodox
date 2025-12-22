'use client'

import { useNode } from '@craftjs/core'
import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ColorPicker } from '../controls/ColorPicker'
import { SettingsAccordion } from '../controls/SettingsAccordion'
import { 
  OrnamentDividerStyle, 
  ORNAMENT_DIVIDER_STYLES, 
  getDividerSvg 
} from '@/lib/svg-decorations'

interface DividerProps {
  thickness?: number
  color?: string
  style?: 'solid' | 'dashed' | 'dotted'
  margin?: { top: number; right: number; bottom: number; left: number }
  width?: string // e.g., '60px', '100%', '50%'
  align?: 'left' | 'center' | 'right'
  variant?: 'single' | 'double' | 'triple' | 'ornate'
  gap?: number // Gap between lines for double/triple
  // SVG ornament dividers
  dividerType?: 'line' | 'ornament'
  ornamentStyle?: OrnamentDividerStyle
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
  dividerType = 'line',
  ornamentStyle = 'diamond',
}: DividerProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  // Only use vertical margins - horizontal centering is handled by Tailwind classes
  const verticalMarginStyle = {
    marginTop: `${margin?.top ?? 0}px`,
    marginBottom: `${margin?.bottom ?? 0}px`,
  }

  const alignClasses = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  }

  // SVG Ornament Divider - uses CSS mask for dynamic coloring
  if (dividerType === 'ornament') {
    const svgUrl = getDividerSvg(ornamentStyle, color)
    
    return (
      <div
        ref={(ref) => {
          if (ref) {
            connect(drag(ref))
          }
        }}
        className={`
          ${isSelected ? 'ring-2 ring-primary rounded p-1' : ''}
        `}
        style={verticalMarginStyle}
      >
        <div
          className={`${alignClasses[align]}`}
          style={{
            width,
            height: '24px',
            backgroundColor: color,
            maskImage: `url("${svgUrl}")`,
            WebkitMaskImage: `url("${svgUrl}")`,
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
          }}
        />
      </div>
    )
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
          ...verticalMarginStyle,
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
        style={{ width, ...verticalMarginStyle }}
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
        style={{ width, ...verticalMarginStyle }}
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
        style={{ width, ...verticalMarginStyle }}
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

  const dividerType = props.dividerType || 'line'

  const variantOptions = [
    { label: 'Single', value: 'single' },
    { label: 'Double', value: 'double' },
    { label: 'Triple', value: 'triple' },
    { label: 'Ornate', value: 'ornate' },
  ]

  return (
    <div className="divide-y divide-gray-100">
      <SettingsAccordion title="Type" defaultOpen>
        <div>
          <Label className="text-sm font-medium">Divider Type</Label>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => setProp((p: any) => (p.dividerType = 'line'))}
              className={`flex-1 px-3 py-2 text-xs rounded-md border transition-colors ${
                dividerType === 'line'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-white hover:bg-gray-50 border-gray-200'
              }`}
            >
              Line
            </button>
            <button
              type="button"
              onClick={() => setProp((p: any) => (p.dividerType = 'ornament'))}
              className={`flex-1 px-3 py-2 text-xs rounded-md border transition-colors ${
                dividerType === 'ornament'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-white hover:bg-gray-50 border-gray-200'
              }`}
            >
              Ornament
            </button>
          </div>
        </div>

        {dividerType === 'ornament' && (
          <div>
            <Label className="text-sm font-medium">Ornament Style</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {ORNAMENT_DIVIDER_STYLES.map((style) => (
                <button
                  key={style.value}
                  type="button"
                  onClick={() => setProp((p: any) => (p.ornamentStyle = style.value))}
                  className={`px-3 py-2 text-xs rounded-md border transition-colors text-left ${
                    (props.ornamentStyle || 'diamond') === style.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-white hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {dividerType === 'line' && (
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
          </div>
        )}

        <ColorPicker
          label="Color"
          value={props.color || '#e5e7eb'}
          onChange={(value) => setProp((props: any) => (props.color = value))}
        />
      </SettingsAccordion>

      <SettingsAccordion title="Layout">
        <div>
          <Label>Width</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {['60px', '120px', '200px', '50%', '80%', '100%'].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setProp((p: any) => (p.width = w))}
                className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                  (props.width || '100%') === w
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-white hover:bg-gray-50 border-gray-200'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
          <Input
            type="text"
            value={props.width || '100%'}
            onChange={(e) => setProp((props: any) => (props.width = e.target.value))}
            placeholder="e.g., 60px, 50%, 100%"
            className="mt-2"
          />
        </div>

        <div>
          <Label>Alignment</Label>
          <div className="flex gap-2 mt-2">
            {[
              { label: 'Left', value: 'left' },
              { label: 'Center', value: 'center' },
              { label: 'Right', value: 'right' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setProp((p: any) => (p.align = option.value))}
                className={`flex-1 px-3 py-1.5 text-xs rounded-md border transition-colors ${
                  (props.align || 'center') === option.value
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
          <Label>Vertical Spacing</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {[8, 16, 24, 32, 48].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setProp((p: any) => (p.margin = { ...p.margin, top: m, bottom: m }))}
                className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                  (props.margin?.top ?? 20) === m
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-white hover:bg-gray-50 border-gray-200'
                }`}
              >
                {m}px
              </button>
            ))}
          </div>
        </div>
      </SettingsAccordion>

      {dividerType === 'line' && (
        <SettingsAccordion title="Line Style">
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
        </SettingsAccordion>
      )}
    </div>
  )
}

Divider.craft = {
  displayName: 'Divider',
  props: {
    thickness: 1,
    color: '#C9A962',
    style: 'solid',
    margin: { top: 20, right: 0, bottom: 20, left: 0 },
    width: '100%',
    align: 'center',
    variant: 'single',
    gap: 4,
    dividerType: 'line',
    ornamentStyle: 'diamond',
  },
  related: {
    settings: DividerSettings,
  },
}

