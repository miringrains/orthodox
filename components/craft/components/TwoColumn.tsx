'use client'

import { useNode, Element } from '@craftjs/core'
import React from 'react'
import { Label } from '@/components/ui/label'
import { SettingsAccordion } from '../controls/SettingsAccordion'
import { ColorPicker } from '../controls/ColorPicker'
import { ColumnCanvas } from './shared/ColumnCanvas'

interface TwoColumnProps {
  leftWidth?: number
  rightWidth?: number
  gap?: number
  backgroundColor?: string
  padding?: number
}

export function TwoColumn({
  leftWidth = 50,
  rightWidth = 50,
  gap = 20,
  backgroundColor = '',
  padding = 0,
}: TwoColumnProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  return (
    <div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={`w-full ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
      style={{
        backgroundColor: backgroundColor || undefined,
        padding: padding ? `${padding}px` : undefined,
      }}
    >
      <div
        className="grid w-full"
        style={{
          gridTemplateColumns: `${leftWidth}fr ${rightWidth}fr`,
          gap: `${gap}px`,
        }}
      >
        <Element is={ColumnCanvas} canvas id="left-column" />
        <Element is={ColumnCanvas} canvas id="right-column" />
      </div>
    </div>
  )
}

function TwoColumnSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }))

  // Preset column ratios
  const columnPresets = [
    { label: '50/50', left: 50, right: 50 },
    { label: '33/67', left: 33, right: 67 },
    { label: '67/33', left: 67, right: 33 },
    { label: '25/75', left: 25, right: 75 },
    { label: '75/25', left: 75, right: 25 },
  ]

  return (
    <div className="divide-y divide-gray-100">
      <SettingsAccordion title="Layout" defaultOpen>
        {/* Column Ratio Presets */}
        <div>
          <Label className="text-sm font-medium">Column Ratio</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {columnPresets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setProp((p: any) => {
                    p.leftWidth = preset.left
                    p.rightWidth = preset.right
                  })
                }}
                className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                  props.leftWidth === preset.left && props.rightWidth === preset.right
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-white hover:bg-gray-50 border-gray-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gap Slider */}
        <div>
          <Label className="text-sm font-medium">Gap</Label>
          <div className="mt-2">
            <input
              type="range"
              min="0"
              max="60"
              value={props.gap || 20}
              onChange={(e) => setProp((p: any) => (p.gap = parseInt(e.target.value)))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0px</span>
              <span className="font-medium text-gray-700">{props.gap || 20}px</span>
              <span>60px</span>
            </div>
          </div>
        </div>

        {/* Padding Slider */}
        <div>
          <Label className="text-sm font-medium">Padding</Label>
          <div className="mt-2">
            <input
              type="range"
              min="0"
              max="60"
              value={props.padding || 0}
              onChange={(e) => setProp((p: any) => (p.padding = parseInt(e.target.value)))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0px</span>
              <span className="font-medium text-gray-700">{props.padding || 0}px</span>
              <span>60px</span>
            </div>
          </div>
        </div>
      </SettingsAccordion>

      <SettingsAccordion title="Appearance">
        <ColorPicker
          label="Background"
          value={props.backgroundColor || ''}
          onChange={(value) => setProp((p: any) => (p.backgroundColor = value))}
          placeholder="transparent"
        />
      </SettingsAccordion>
    </div>
  )
}

TwoColumn.craft = {
  displayName: 'Two Column',
  props: {
    leftWidth: 50,
    rightWidth: 50,
    gap: 20,
    backgroundColor: '',
    padding: 0,
  },
  related: {
    settings: TwoColumnSettings,
  },
}
