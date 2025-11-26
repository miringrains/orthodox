'use client'

import { useNode, Element } from '@craftjs/core'
import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { DropZoneContent } from './shared/DropZone'

interface ThreeColumnProps {
  gap?: number
  backgroundColor?: string
  padding?: { top: number; right: number; bottom: number; left: number }
}

export function ThreeColumn({
  gap = 20,
  backgroundColor,
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
        style={{ gap: `${gap}px` }}
      >
        <Element 
          is={DropZoneContent} 
          canvas 
          id="column-1"
          placeholder="Drop here"
          minHeight={100}
        />
        <Element 
          is={DropZoneContent} 
          canvas 
          id="column-2"
          placeholder="Drop here"
          minHeight={100}
        />
        <Element 
          is={DropZoneContent} 
          canvas 
          id="column-3"
          placeholder="Drop here"
          minHeight={100}
        />
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

      {/* Background Color */}
      <div>
        <Label className="text-sm font-medium">Background</Label>
        <div className="flex gap-2 mt-2">
          <input
            type="color"
            value={props.backgroundColor || '#ffffff'}
            onChange={(e) => setProp((p: any) => (p.backgroundColor = e.target.value))}
            className="h-9 w-12 rounded border border-gray-200 cursor-pointer"
          />
          <Input
            type="text"
            value={props.backgroundColor || ''}
            onChange={(e) => setProp((p: any) => (p.backgroundColor = e.target.value))}
            placeholder="transparent"
            className="flex-1"
          />
        </div>
      </div>

      {/* Padding Slider */}
      <div>
        <Label className="text-sm font-medium">Padding</Label>
        <div className="mt-2">
          <input
            type="range"
            min="0"
            max="80"
            value={props.padding?.top || 0}
            onChange={(e) => {
              const val = parseInt(e.target.value)
              setProp((p: any) => (p.padding = { top: val, right: val, bottom: val, left: val }))
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0px</span>
            <span className="font-medium text-gray-700">{props.padding?.top || 0}px</span>
            <span>80px</span>
          </div>
        </div>
      </div>
    </div>
  )
}

ThreeColumn.craft = {
  displayName: 'Three Column',
  props: {
    gap: 20,
    backgroundColor: '',
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
  },
  related: {
    settings: ThreeColumnSettings,
  },
}

