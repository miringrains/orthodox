'use client'

import { useNode, Element } from '@craftjs/core'
import React from 'react'
import { Label } from '@/components/ui/label'
import { SettingsAccordion } from '../controls/SettingsAccordion'
import { ColorPicker } from '../controls/ColorPicker'
import { ColumnCanvas } from './shared/ColumnCanvas'

interface ThreeColumnProps {
  gap?: number
  backgroundColor?: string
  padding?: number
}

export function ThreeColumn({
  gap = 20,
  backgroundColor = '',
  padding = 0,
}: ThreeColumnProps) {
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
        className="grid grid-cols-3 w-full"
        style={{ gap: `${gap}px` }}
      >
        <Element is={ColumnCanvas} canvas id="column-1" />
        <Element is={ColumnCanvas} canvas id="column-2" />
        <Element is={ColumnCanvas} canvas id="column-3" />
      </div>
    </div>
  )
}

function ThreeColumnSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }))

  return (
    <div className="divide-y divide-gray-100">
      <SettingsAccordion title="Layout" defaultOpen>
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

ThreeColumn.craft = {
  displayName: 'Three Column',
  props: {
    gap: 20,
    backgroundColor: '',
    padding: 0,
  },
  related: {
    settings: ThreeColumnSettings,
  },
}
