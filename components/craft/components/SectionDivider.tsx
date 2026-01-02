'use client'

import React from 'react'
import { useNode } from '@craftjs/core'

interface SectionDividerProps {
  dividerStyle: 1 | 2 | 3 | 4
  height: number
  paddingVertical: number
  invertColor: boolean // For dark themes
  opacity: number
}

export const SectionDivider = ({
  dividerStyle = 1,
  height = 20,
  paddingVertical = 24,
  invertColor = false,
  opacity = 0.6,
}: SectionDividerProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((state) => ({
    selected: state.events.selected,
  }))

  const dividerSrc = `/divider-${dividerStyle}.svg`
  
  const dividerFilter = invertColor 
    ? 'invert(1) brightness(0.9)' 
    : 'none'

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)) }}
      className="flex items-center justify-center w-full"
      style={{
        paddingTop: `${paddingVertical}px`,
        paddingBottom: `${paddingVertical}px`,
        outline: selected ? '2px solid #C9A227' : 'none',
      }}
    >
      <img
        src={dividerSrc}
        alt=""
        className="pointer-events-none select-none max-w-full"
        style={{
          height: `${height}px`,
          width: 'auto',
          opacity,
          filter: dividerFilter,
        }}
      />
    </div>
  )
}

const SectionDividerSettings = () => {
  const {
    actions: { setProp },
    dividerStyle,
    height,
    paddingVertical,
    invertColor,
    opacity,
  } = useNode((node) => ({
    dividerStyle: node.data.props.dividerStyle,
    height: node.data.props.height,
    paddingVertical: node.data.props.paddingVertical,
    invertColor: node.data.props.invertColor,
    opacity: node.data.props.opacity,
  }))

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">
          Divider Style
        </label>
        <select
          value={dividerStyle}
          onChange={(e) =>
            setProp((props: SectionDividerProps) => (props.dividerStyle = Number(e.target.value) as 1 | 2 | 3 | 4))
          }
          className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
        >
          <option value={1}>Style 1 - Diamond</option>
          <option value={2}>Style 2 - Ornate</option>
          <option value={3}>Style 3 - Cross</option>
          <option value={4}>Style 4 - Simple</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">
          Height ({height}px)
        </label>
        <input
          type="range"
          min={10}
          max={50}
          value={height}
          onChange={(e) =>
            setProp((props: SectionDividerProps) => (props.height = Number(e.target.value)))
          }
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">
          Vertical Padding ({paddingVertical}px)
        </label>
        <input
          type="range"
          min={8}
          max={64}
          value={paddingVertical}
          onChange={(e) =>
            setProp((props: SectionDividerProps) => (props.paddingVertical = Number(e.target.value)))
          }
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">
          Opacity ({Math.round(opacity * 100)}%)
        </label>
        <input
          type="range"
          min={10}
          max={100}
          value={opacity * 100}
          onChange={(e) =>
            setProp((props: SectionDividerProps) => (props.opacity = Number(e.target.value) / 100))
          }
          className="w-full"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-stone-700">
          <input
            type="checkbox"
            checked={invertColor}
            onChange={(e) =>
              setProp((props: SectionDividerProps) => (props.invertColor = e.target.checked))
            }
            className="rounded border-stone-300"
          />
          Invert Color (for dark themes)
        </label>
      </div>
    </div>
  )
}

SectionDivider.craft = {
  displayName: 'Section Divider',
  props: {
    dividerStyle: 1,
    height: 20,
    paddingVertical: 24,
    invertColor: false,
    opacity: 0.6,
  },
  related: {
    settings: SectionDividerSettings,
  },
  rules: {
    canDrag: () => true,
  },
}

export default SectionDivider

