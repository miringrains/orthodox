'use client'

import { useNode, useEditor } from '@craftjs/core'
import React from 'react'
import { Label } from '@/components/ui/label'
import { SettingsAccordion } from '../../controls/SettingsAccordion'
import { ColorPicker } from '../../controls/ColorPicker'

interface ColumnCanvasProps {
  children?: React.ReactNode
  backgroundColor?: string
  padding?: number
  verticalAlign?: 'start' | 'center' | 'end'
}

/**
 * A canvas element that can receive dropped components.
 * Shows a placeholder when empty and editor is enabled.
 * Has a clickable padding area around content for easier selection.
 */
export function ColumnCanvas({ 
  children,
  backgroundColor = '',
  padding = 0,
  verticalAlign = 'start',
}: ColumnCanvasProps) {
  const { connectors: { connect }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }))
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }))
  
  const hasChildren = React.Children.count(children) > 0

  const alignClass = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
  }[verticalAlign]
  
  return (
    <div
      ref={(ref) => {
        if (ref) connect(ref)
      }}
      className={`
        min-h-[80px] flex flex-col ${alignClass}
        ${!hasChildren && enabled ? 'border-2 border-dashed border-gray-300 rounded-lg items-center justify-center' : ''}
        ${isSelected && enabled ? 'ring-2 ring-primary ring-offset-1 rounded' : ''}
        ${enabled && hasChildren ? 'hover:ring-1 hover:ring-gray-300 rounded transition-all' : ''}
      `}
      style={{
        backgroundColor: backgroundColor || undefined,
        padding: padding ? `${padding}px` : undefined,
      }}
    >
      {!hasChildren && enabled ? (
        <span className="text-sm text-gray-400 select-none pointer-events-none">Drop here</span>
      ) : (
        children
      )}
    </div>
  )
}

function ColumnCanvasSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }))

  const alignOptions = [
    { label: 'Top', value: 'start' },
    { label: 'Center', value: 'center' },
    { label: 'Bottom', value: 'end' },
  ]

  return (
    <div className="divide-y divide-gray-100">
      <SettingsAccordion title="Layout" defaultOpen>
        <div>
          <Label className="text-sm font-medium">Vertical Align</Label>
          <div className="flex gap-2 mt-2">
            {alignOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setProp((p: any) => (p.verticalAlign = option.value))}
                className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition-colors ${
                  (props.verticalAlign || 'start') === option.value
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
              min="0"
              max="40"
              value={props.padding || 0}
              onChange={(e) => setProp((p: any) => (p.padding = parseInt(e.target.value)))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0px</span>
              <span className="font-medium text-gray-700">{props.padding || 0}px</span>
              <span>40px</span>
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

ColumnCanvas.craft = {
  displayName: 'Column',
  props: {
    backgroundColor: '',
    padding: 0,
    verticalAlign: 'start',
  },
  rules: {
    canDrag: () => false,
  },
  related: {
    settings: ColumnCanvasSettings,
  },
}
