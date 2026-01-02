'use client'

import React from 'react'
import { useNode, Element } from '@craftjs/core'

interface CornerFrameProps {
  cornerStyle: 1 | 2 | 3 | 4
  cornerSize: number
  cornerOpacity: number
  invertCorners: boolean // For dark themes, invert the corners
  backgroundColor: string
  padding: number
  children?: React.ReactNode
}

export const CornerFrame = ({
  cornerStyle = 1,
  cornerSize = 60,
  cornerOpacity = 0.4,
  invertCorners = false,
  backgroundColor = 'transparent',
  padding = 32,
  children,
}: CornerFrameProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((state) => ({
    selected: state.events.selected,
  }))

  const cornerSrc = `/corner-${cornerStyle}.svg`
  
  const cornerFilter = invertCorners 
    ? 'invert(1) brightness(0.8) sepia(1) saturate(0.5)' 
    : 'none'

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      className="relative"
      style={{
        backgroundColor,
        padding: `${padding}px`,
        outline: selected ? '2px solid #C9A227' : 'none',
      }}
    >
      {/* Top Left Corner */}
      <img
        src={cornerSrc}
        alt=""
        className="absolute pointer-events-none select-none"
        style={{
          top: 0,
          left: 0,
          width: `${cornerSize}px`,
          height: `${cornerSize}px`,
          opacity: cornerOpacity,
          filter: cornerFilter,
        }}
      />
      
      {/* Top Right Corner */}
      <img
        src={cornerSrc}
        alt=""
        className="absolute pointer-events-none select-none"
        style={{
          top: 0,
          right: 0,
          width: `${cornerSize}px`,
          height: `${cornerSize}px`,
          opacity: cornerOpacity,
          filter: cornerFilter,
          transform: 'scaleX(-1)',
        }}
      />
      
      {/* Bottom Left Corner */}
      <img
        src={cornerSrc}
        alt=""
        className="absolute pointer-events-none select-none"
        style={{
          bottom: 0,
          left: 0,
          width: `${cornerSize}px`,
          height: `${cornerSize}px`,
          opacity: cornerOpacity,
          filter: cornerFilter,
          transform: 'scaleY(-1)',
        }}
      />
      
      {/* Bottom Right Corner */}
      <img
        src={cornerSrc}
        alt=""
        className="absolute pointer-events-none select-none"
        style={{
          bottom: 0,
          right: 0,
          width: `${cornerSize}px`,
          height: `${cornerSize}px`,
          opacity: cornerOpacity,
          filter: cornerFilter,
          transform: 'scale(-1, -1)',
        }}
      />
      
      {/* Content */}
      <Element id="corner-frame-content" is="div" canvas>
        {children}
      </Element>
    </div>
  )
}

const CornerFrameSettings = () => {
  const {
    actions: { setProp },
    cornerStyle,
    cornerSize,
    cornerOpacity,
    invertCorners,
    backgroundColor,
    padding,
  } = useNode((node) => ({
    cornerStyle: node.data.props.cornerStyle,
    cornerSize: node.data.props.cornerSize,
    cornerOpacity: node.data.props.cornerOpacity,
    invertCorners: node.data.props.invertCorners,
    backgroundColor: node.data.props.backgroundColor,
    padding: node.data.props.padding,
  }))

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">
          Corner Style
        </label>
        <select
          value={cornerStyle}
          onChange={(e) =>
            setProp((props: CornerFrameProps) => (props.cornerStyle = Number(e.target.value) as 1 | 2 | 3 | 4))
          }
          className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
        >
          <option value={1}>Style 1 - Ornate</option>
          <option value={2}>Style 2 - Floral</option>
          <option value={3}>Style 3 - Classic</option>
          <option value={4}>Style 4 - Simple</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">
          Corner Size ({cornerSize}px)
        </label>
        <input
          type="range"
          min={30}
          max={120}
          value={cornerSize}
          onChange={(e) =>
            setProp((props: CornerFrameProps) => (props.cornerSize = Number(e.target.value)))
          }
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">
          Corner Opacity ({Math.round(cornerOpacity * 100)}%)
        </label>
        <input
          type="range"
          min={10}
          max={100}
          value={cornerOpacity * 100}
          onChange={(e) =>
            setProp((props: CornerFrameProps) => (props.cornerOpacity = Number(e.target.value) / 100))
          }
          className="w-full"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-stone-700">
          <input
            type="checkbox"
            checked={invertCorners}
            onChange={(e) =>
              setProp((props: CornerFrameProps) => (props.invertCorners = e.target.checked))
            }
            className="rounded border-stone-300"
          />
          Invert Corners (for dark themes)
        </label>
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">
          Background Color
        </label>
        <input
          type="color"
          value={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor}
          onChange={(e) =>
            setProp((props: CornerFrameProps) => (props.backgroundColor = e.target.value))
          }
          className="w-full h-10 cursor-pointer rounded border border-stone-300"
        />
        <button
          onClick={() => setProp((props: CornerFrameProps) => (props.backgroundColor = 'transparent'))}
          className="mt-1 text-xs text-stone-500 hover:text-stone-700"
        >
          Set Transparent
        </button>
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">
          Padding ({padding}px)
        </label>
        <input
          type="range"
          min={16}
          max={80}
          value={padding}
          onChange={(e) =>
            setProp((props: CornerFrameProps) => (props.padding = Number(e.target.value)))
          }
          className="w-full"
        />
      </div>
    </div>
  )
}

CornerFrame.craft = {
  displayName: 'Corner Frame',
  props: {
    cornerStyle: 1,
    cornerSize: 60,
    cornerOpacity: 0.4,
    invertCorners: false,
    backgroundColor: 'transparent',
    padding: 32,
  },
  related: {
    settings: CornerFrameSettings,
  },
  rules: {
    canDrag: () => true,
  },
}

export default CornerFrame

