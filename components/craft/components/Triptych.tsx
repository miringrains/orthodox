'use client'

import { useNode, Element } from '@craftjs/core'
import React from 'react'
import { Label } from '@/components/ui/label'
import { SettingsAccordion } from '../controls/SettingsAccordion'
import { ColorPicker } from '../controls/ColorPicker'
import { ColumnCanvas } from './shared/ColumnCanvas'

/**
 * Triptych Component
 * 
 * A three-panel layout inspired by Orthodox iconostasis and triptych icons.
 * The center panel is emphasized (wider) with flanking side panels.
 * 
 * This layout evokes:
 * - Icon triptychs (three-paneled icons that fold)
 * - Iconostasis structure (royal doors flanked by icon panels)
 * - Altar layout (central focus with symmetrical sides)
 */

interface TriptychProps {
  centerWidth?: number // percentage 40-60
  gap?: number
  padding?: number
  backgroundColor?: string
  panelBackgroundColor?: string
  panelBorderColor?: string
  showPanelBorders?: boolean
}

export function Triptych({
  centerWidth = 50,
  gap = 24,
  padding = 40,
  backgroundColor = '',
  panelBackgroundColor = '',
  panelBorderColor = '#d4af37',
  showPanelBorders = false,
}: TriptychProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  const sideWidth = (100 - centerWidth) / 2

  const panelStyle: React.CSSProperties = {
    backgroundColor: panelBackgroundColor || undefined,
    border: showPanelBorders ? `1px solid ${panelBorderColor}` : undefined,
  }

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
        backgroundColor: backgroundColor || undefined,
        padding: `${padding}px`,
      }}
    >
      <div 
        className="grid max-w-6xl mx-auto"
        style={{
          gridTemplateColumns: `${sideWidth}fr ${centerWidth}fr ${sideWidth}fr`,
          gap: `${gap}px`,
        }}
      >
        {/* Left Panel */}
        <div style={panelStyle} className="rounded-lg overflow-hidden">
          <Element is={ColumnCanvas} id="left-panel" canvas>
            {/* Left panel content */}
          </Element>
        </div>

        {/* Center Panel (Emphasized) */}
        <div style={panelStyle} className="rounded-lg overflow-hidden">
          <Element is={ColumnCanvas} id="center-panel" canvas>
            {/* Center panel content */}
          </Element>
        </div>

        {/* Right Panel */}
        <div style={panelStyle} className="rounded-lg overflow-hidden">
          <Element is={ColumnCanvas} id="right-panel" canvas>
            {/* Right panel content */}
          </Element>
        </div>
      </div>
    </div>
  )
}

function TriptychSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }))

  return (
    <div className="divide-y divide-gray-100">
      <SettingsAccordion title="Layout" defaultOpen>
        <div>
          <Label className="text-sm font-medium">Center Panel Width</Label>
          <div className="mt-2">
            <input
              type="range"
              min={40}
              max={60}
              value={props.centerWidth || 50}
              onChange={(e) => setProp((p: any) => (p.centerWidth = parseInt(e.target.value)))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Equal</span>
              <span className="font-medium text-gray-700">{props.centerWidth || 50}%</span>
              <span>Emphasized</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Higher values emphasize the center panel
          </p>
        </div>

        <div>
          <Label className="text-sm font-medium">Gap Between Panels</Label>
          <div className="mt-2">
            <input
              type="range"
              min={0}
              max={60}
              value={props.gap || 24}
              onChange={(e) => setProp((p: any) => (p.gap = parseInt(e.target.value)))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0px</span>
              <span className="font-medium text-gray-700">{props.gap || 24}px</span>
              <span>60px</span>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Section Padding</Label>
          <div className="mt-2">
            <input
              type="range"
              min={0}
              max={100}
              value={props.padding || 40}
              onChange={(e) => setProp((p: any) => (p.padding = parseInt(e.target.value)))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0px</span>
              <span className="font-medium text-gray-700">{props.padding || 40}px</span>
              <span>100px</span>
            </div>
          </div>
        </div>
      </SettingsAccordion>

      <SettingsAccordion title="Appearance">
        <ColorPicker
          label="Section Background"
          value={props.backgroundColor || ''}
          onChange={(value) => setProp((p: any) => (p.backgroundColor = value))}
          placeholder="transparent"
        />

        <ColorPicker
          label="Panel Background"
          value={props.panelBackgroundColor || ''}
          onChange={(value) => setProp((p: any) => (p.panelBackgroundColor = value))}
          placeholder="transparent"
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showPanelBorders"
            checked={props.showPanelBorders || false}
            onChange={(e) => setProp((p: any) => (p.showPanelBorders = e.target.checked))}
            className="rounded"
          />
          <Label htmlFor="showPanelBorders" className="text-sm">Show Panel Borders</Label>
        </div>

        {props.showPanelBorders && (
          <ColorPicker
            label="Border Color"
            value={props.panelBorderColor || '#d4af37'}
            onChange={(value) => setProp((p: any) => (p.panelBorderColor = value))}
          />
        )}
      </SettingsAccordion>
    </div>
  )
}

Triptych.craft = {
  displayName: 'Triptych',
  props: {
    centerWidth: 50,
    gap: 24,
    padding: 40,
    backgroundColor: '',
    panelBackgroundColor: '',
    panelBorderColor: '#d4af37',
    showPanelBorders: false,
  },
  related: {
    settings: TriptychSettings,
  },
}


