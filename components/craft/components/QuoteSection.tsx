'use client'

import React from 'react'
import { useNode } from '@craftjs/core'

interface QuoteSectionProps {
  quote: string
  attribution: string
  backgroundColor: string
  textColor: string
  accentColor: string
  showCorners: boolean
  cornerStyle: 1 | 2 | 3 | 4
  cornerSize: number
  invertCorners: boolean
  paddingVertical: number
  paddingHorizontal: number
  fontSize: 'small' | 'medium' | 'large'
  textAlign: 'left' | 'center' | 'right'
}

export const QuoteSection = ({
  quote = '"Acquire the Spirit of Peace and a thousand souls around you will be saved."',
  attribution = '— St. Seraphim of Sarov',
  backgroundColor = '#5C6B52',
  textColor = '#FFFFFF',
  accentColor = '#C9A227',
  showCorners = true,
  cornerStyle = 1,
  cornerSize = 60,
  invertCorners = true,
  paddingVertical = 64,
  paddingHorizontal = 32,
  fontSize = 'large',
  textAlign = 'center',
}: QuoteSectionProps) => {
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

  const fontSizeMap = {
    small: 'text-lg md:text-xl',
    medium: 'text-xl md:text-2xl',
    large: 'text-2xl md:text-3xl lg:text-4xl',
  }

  const textAlignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)) }}
      className="relative w-full"
      style={{
        backgroundColor,
        paddingTop: `${paddingVertical}px`,
        paddingBottom: `${paddingVertical}px`,
        paddingLeft: `${paddingHorizontal}px`,
        paddingRight: `${paddingHorizontal}px`,
        outline: selected ? '2px solid #C9A227' : 'none',
      }}
    >
      {/* Corner Ornaments */}
      {showCorners && (
        <>
          <img
            src={cornerSrc}
            alt=""
            className="absolute pointer-events-none select-none"
            style={{
              top: '16px',
              left: '16px',
              width: `${cornerSize}px`,
              height: `${cornerSize}px`,
              opacity: 0.4,
              filter: cornerFilter,
            }}
          />
          <img
            src={cornerSrc}
            alt=""
            className="absolute pointer-events-none select-none"
            style={{
              top: '16px',
              right: '16px',
              width: `${cornerSize}px`,
              height: `${cornerSize}px`,
              opacity: 0.4,
              filter: cornerFilter,
              transform: 'scaleX(-1)',
            }}
          />
          <img
            src={cornerSrc}
            alt=""
            className="absolute pointer-events-none select-none"
            style={{
              bottom: '16px',
              left: '16px',
              width: `${cornerSize}px`,
              height: `${cornerSize}px`,
              opacity: 0.4,
              filter: cornerFilter,
              transform: 'scaleY(-1)',
            }}
          />
          <img
            src={cornerSrc}
            alt=""
            className="absolute pointer-events-none select-none"
            style={{
              bottom: '16px',
              right: '16px',
              width: `${cornerSize}px`,
              height: `${cornerSize}px`,
              opacity: 0.4,
              filter: cornerFilter,
              transform: 'scale(-1, -1)',
            }}
          />
        </>
      )}

      {/* Quote Content */}
      <div className={`max-w-4xl mx-auto ${textAlignClass[textAlign]}`}>
        <blockquote
          className={`${fontSizeMap[fontSize]} font-serif italic leading-relaxed mb-6`}
          style={{ color: textColor }}
        >
          {quote}
        </blockquote>
        <cite
          className="text-sm md:text-base font-sans tracking-wider uppercase not-italic"
          style={{ color: accentColor }}
        >
          {attribution}
        </cite>
      </div>
    </div>
  )
}

const QuoteSectionSettings = () => {
  const {
    actions: { setProp },
    quote,
    attribution,
    backgroundColor,
    textColor,
    accentColor,
    showCorners,
    cornerStyle,
    cornerSize,
    invertCorners,
    paddingVertical,
    paddingHorizontal,
    fontSize,
    textAlign,
  } = useNode((node) => ({
    quote: node.data.props.quote,
    attribution: node.data.props.attribution,
    backgroundColor: node.data.props.backgroundColor,
    textColor: node.data.props.textColor,
    accentColor: node.data.props.accentColor,
    showCorners: node.data.props.showCorners,
    cornerStyle: node.data.props.cornerStyle,
    cornerSize: node.data.props.cornerSize,
    invertCorners: node.data.props.invertCorners,
    paddingVertical: node.data.props.paddingVertical,
    paddingHorizontal: node.data.props.paddingHorizontal,
    fontSize: node.data.props.fontSize,
    textAlign: node.data.props.textAlign,
  }))

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">
          Quote Text
        </label>
        <textarea
          value={quote}
          onChange={(e) =>
            setProp((props: QuoteSectionProps) => (props.quote = e.target.value))
          }
          rows={3}
          className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">
          Attribution
        </label>
        <input
          type="text"
          value={attribution}
          onChange={(e) =>
            setProp((props: QuoteSectionProps) => (props.attribution = e.target.value))
          }
          className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">
            Font Size
          </label>
          <select
            value={fontSize}
            onChange={(e) =>
              setProp((props: QuoteSectionProps) => (props.fontSize = e.target.value as 'small' | 'medium' | 'large'))
            }
            className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">
            Text Align
          </label>
          <select
            value={textAlign}
            onChange={(e) =>
              setProp((props: QuoteSectionProps) => (props.textAlign = e.target.value as 'left' | 'center' | 'right'))
            }
            className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">
            Background
          </label>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) =>
              setProp((props: QuoteSectionProps) => (props.backgroundColor = e.target.value))
            }
            className="w-full h-10 cursor-pointer rounded border border-stone-300"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">
            Text Color
          </label>
          <input
            type="color"
            value={textColor}
            onChange={(e) =>
              setProp((props: QuoteSectionProps) => (props.textColor = e.target.value))
            }
            className="w-full h-10 cursor-pointer rounded border border-stone-300"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">
            Accent
          </label>
          <input
            type="color"
            value={accentColor}
            onChange={(e) =>
              setProp((props: QuoteSectionProps) => (props.accentColor = e.target.value))
            }
            className="w-full h-10 cursor-pointer rounded border border-stone-300"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-stone-700">
          <input
            type="checkbox"
            checked={showCorners}
            onChange={(e) =>
              setProp((props: QuoteSectionProps) => (props.showCorners = e.target.checked))
            }
            className="rounded border-stone-300"
          />
          Show Corner Ornaments
        </label>
      </div>

      {showCorners && (
        <>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1">
              Corner Style
            </label>
            <select
              value={cornerStyle}
              onChange={(e) =>
                setProp((props: QuoteSectionProps) => (props.cornerStyle = Number(e.target.value) as 1 | 2 | 3 | 4))
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
              max={100}
              value={cornerSize}
              onChange={(e) =>
                setProp((props: QuoteSectionProps) => (props.cornerSize = Number(e.target.value)))
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
                  setProp((props: QuoteSectionProps) => (props.invertCorners = e.target.checked))
                }
                className="rounded border-stone-300"
              />
              Invert Corners (for dark backgrounds)
            </label>
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">
          Vertical Padding ({paddingVertical}px)
        </label>
        <input
          type="range"
          min={32}
          max={128}
          value={paddingVertical}
          onChange={(e) =>
            setProp((props: QuoteSectionProps) => (props.paddingVertical = Number(e.target.value)))
          }
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">
          Horizontal Padding ({paddingHorizontal}px)
        </label>
        <input
          type="range"
          min={16}
          max={80}
          value={paddingHorizontal}
          onChange={(e) =>
            setProp((props: QuoteSectionProps) => (props.paddingHorizontal = Number(e.target.value)))
          }
          className="w-full"
        />
      </div>
    </div>
  )
}

QuoteSection.craft = {
  displayName: 'Quote Section',
  props: {
    quote: '"Acquire the Spirit of Peace and a thousand souls around you will be saved."',
    attribution: '— St. Seraphim of Sarov',
    backgroundColor: '#5C6B52',
    textColor: '#FFFFFF',
    accentColor: '#C9A227',
    showCorners: true,
    cornerStyle: 1,
    cornerSize: 60,
    invertCorners: true,
    paddingVertical: 64,
    paddingHorizontal: 32,
    fontSize: 'large',
    textAlign: 'center',
  },
  related: {
    settings: QuoteSectionSettings,
  },
  rules: {
    canDrag: () => true,
  },
}

export default QuoteSection

