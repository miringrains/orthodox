'use client'

import React from 'react'
import { useNode } from '@craftjs/core'

interface CTALink {
  label: string
  url: string
}

interface CTABannerProps {
  links: CTALink[]
  backgroundColor: string
  textColor: string
  hoverColor: string
  showDividers: boolean
  dividerStyle: 1 | 2 | 3 | 4
  dividerHeight: number
  invertDividers: boolean
  paddingVertical: number
  fontSize: 'small' | 'medium' | 'large'
}

const defaultLinks: CTALink[] = [
  { label: 'Plan Your Visit', url: '/visit' },
  { label: 'View Schedule', url: '/schedule' },
  { label: 'Give Online', url: '/give' },
  { label: 'Contact Us', url: '/contact' },
]

export const CTABanner = ({
  links = defaultLinks,
  backgroundColor = '#1A1410',
  textColor = '#C9A227',
  hoverColor = '#E8D48B',
  showDividers = true,
  dividerStyle = 1,
  dividerHeight = 16,
  invertDividers = true,
  paddingVertical = 32,
  fontSize = 'medium',
}: CTABannerProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((state) => ({
    selected: state.events.selected,
  }))

  const dividerSrc = `/divider-${dividerStyle}.svg`
  const dividerFilter = invertDividers ? 'invert(1) brightness(0.9)' : 'none'

  const fontSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)) }}
      className="w-full"
      style={{
        backgroundColor,
        paddingTop: `${paddingVertical}px`,
        paddingBottom: `${paddingVertical}px`,
        outline: selected ? '2px solid #C9A227' : 'none',
      }}
    >
      {/* Top Divider */}
      {showDividers && (
        <div className="flex justify-center mb-6">
          <img
            src={dividerSrc}
            alt=""
            className="pointer-events-none select-none"
            style={{
              height: `${dividerHeight}px`,
              width: 'auto',
              opacity: 0.5,
              filter: dividerFilter,
            }}
          />
        </div>
      )}

      {/* Links */}
      <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 px-4">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            className={`${fontSizeClass[fontSize]} font-medium uppercase tracking-widest transition-colors duration-200`}
            style={{ color: textColor }}
            onMouseEnter={(e) => (e.currentTarget.style.color = hoverColor)}
            onMouseLeave={(e) => (e.currentTarget.style.color = textColor)}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Bottom Divider */}
      {showDividers && (
        <div className="flex justify-center mt-6">
          <img
            src={dividerSrc}
            alt=""
            className="pointer-events-none select-none"
            style={{
              height: `${dividerHeight}px`,
              width: 'auto',
              opacity: 0.5,
              filter: dividerFilter,
              transform: 'scaleY(-1)',
            }}
          />
        </div>
      )}
    </div>
  )
}

const CTABannerSettings = () => {
  const {
    actions: { setProp },
    links,
    backgroundColor,
    textColor,
    hoverColor,
    showDividers,
    dividerStyle,
    fontSize,
  } = useNode((node) => ({
    links: node.data.props.links,
    backgroundColor: node.data.props.backgroundColor,
    textColor: node.data.props.textColor,
    hoverColor: node.data.props.hoverColor,
    showDividers: node.data.props.showDividers,
    dividerStyle: node.data.props.dividerStyle,
    fontSize: node.data.props.fontSize,
  }))

  const updateLink = (index: number, field: keyof CTALink, value: string) => {
    setProp((props: CTABannerProps) => {
      const newLinks = [...props.links]
      newLinks[index] = { ...newLinks[index], [field]: value }
      props.links = newLinks
    })
  }

  const addLink = () => {
    setProp((props: CTABannerProps) => {
      props.links = [...props.links, { label: 'New Link', url: '/' }]
    })
  }

  const removeLink = (index: number) => {
    setProp((props: CTABannerProps) => {
      props.links = props.links.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">Links</label>
        <div className="space-y-3">
          {links.map((link: CTALink, index: number) => (
            <div key={index} className="p-3 bg-stone-50 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateLink(index, 'label', e.target.value)}
                  placeholder="Label"
                  className="flex-1 px-2 py-1 border border-stone-300 rounded text-sm"
                />
                <button
                  onClick={() => removeLink(index)}
                  className="text-red-500 hover:text-red-700 text-sm px-2"
                >
                  ×
                </button>
              </div>
              <input
                type="text"
                value={link.url}
                onChange={(e) => updateLink(index, 'url', e.target.value)}
                placeholder="URL"
                className="w-full px-2 py-1 border border-stone-300 rounded text-sm"
              />
            </div>
          ))}
        </div>
        <button
          onClick={addLink}
          className="mt-2 text-sm text-stone-600 hover:text-stone-800"
        >
          + Add Link
        </button>
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">Font Size</label>
        <select
          value={fontSize}
          onChange={(e) => setProp((props: CTABannerProps) => (props.fontSize = e.target.value as 'small' | 'medium' | 'large'))}
          className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">Background</label>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setProp((props: CTABannerProps) => (props.backgroundColor = e.target.value))}
            className="w-full h-10 cursor-pointer rounded border border-stone-300"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">Text</label>
          <input
            type="color"
            value={textColor}
            onChange={(e) => setProp((props: CTABannerProps) => (props.textColor = e.target.value))}
            className="w-full h-10 cursor-pointer rounded border border-stone-300"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">Hover</label>
          <input
            type="color"
            value={hoverColor}
            onChange={(e) => setProp((props: CTABannerProps) => (props.hoverColor = e.target.value))}
            className="w-full h-10 cursor-pointer rounded border border-stone-300"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-stone-700">
          <input
            type="checkbox"
            checked={showDividers}
            onChange={(e) => setProp((props: CTABannerProps) => (props.showDividers = e.target.checked))}
            className="rounded border-stone-300"
          />
          Show Dividers
        </label>
      </div>

      {showDividers && (
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">Divider Style</label>
          <select
            value={dividerStyle}
            onChange={(e) => setProp((props: CTABannerProps) => (props.dividerStyle = Number(e.target.value) as 1 | 2 | 3 | 4))}
            className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
          >
            <option value={1}>Style 1</option>
            <option value={2}>Style 2</option>
            <option value={3}>Style 3</option>
            <option value={4}>Style 4</option>
          </select>
        </div>
      )}
    </div>
  )
}

CTABanner.craft = {
  displayName: 'CTA Banner',
  props: {
    links: defaultLinks,
    backgroundColor: '#1A1410',
    textColor: '#C9A227',
    hoverColor: '#E8D48B',
    showDividers: true,
    dividerStyle: 1,
    dividerHeight: 16,
    invertDividers: true,
    paddingVertical: 32,
    fontSize: 'medium',
  },
  related: {
    settings: CTABannerSettings,
  },
  rules: {
    canDrag: () => true,
  },
}

export default CTABanner

