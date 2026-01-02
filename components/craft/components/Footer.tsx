'use client'

import React from 'react'
import { useNode } from '@craftjs/core'

interface FooterLink {
  label: string
  url: string
}

interface FooterColumn {
  title: string
  links: FooterLink[]
}

interface SocialLink {
  platform: 'facebook' | 'instagram' | 'youtube' | 'twitter'
  url: string
}

interface FooterProps {
  brandName: string
  brandDescription: string
  copyrightText: string
  columns: FooterColumn[]
  socialLinks: SocialLink[]
  backgroundColor: string
  textColor: string
  accentColor: string
  borderColor: string
  showCorners: boolean
  cornerStyle: 1 | 2 | 3 | 4
  cornerSize: number
  invertCorners: boolean
  paddingVertical: number
  paddingHorizontal: number
}

const defaultColumns: FooterColumn[] = [
  {
    title: 'Services',
    links: [
      { label: 'Divine Liturgy', url: '/schedule' },
      { label: 'Vespers', url: '/schedule' },
      { label: 'Confession', url: '/sacraments' },
      { label: 'Baptism', url: '/sacraments' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'About Us', url: '/about' },
      { label: 'Parish Council', url: '/about/council' },
      { label: 'Ministries', url: '/ministries' },
      { label: 'Youth', url: '/youth' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Bulletin', url: '/bulletin' },
      { label: 'Calendar', url: '/calendar' },
      { label: 'Donate', url: '/give' },
      { label: 'Contact', url: '/contact' },
    ],
  },
]

const defaultSocialLinks: SocialLink[] = [
  { platform: 'facebook', url: 'https://facebook.com' },
  { platform: 'instagram', url: 'https://instagram.com' },
  { platform: 'youtube', url: 'https://youtube.com' },
]

const SocialIcon = ({ platform }: { platform: string }) => {
  const icons: Record<string, React.ReactNode> = {
    facebook: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
      </svg>
    ),
    instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    youtube: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  }
  return <>{icons[platform] || null}</>
}

export const Footer = ({
  brandName = 'Holy Trinity Orthodox Church',
  brandDescription = 'A parish of the Orthodox Church in America, serving the faithful since 1923.',
  copyrightText = '© 2025 Holy Trinity Orthodox Church. All rights reserved.',
  columns = defaultColumns,
  socialLinks = defaultSocialLinks,
  backgroundColor = '#0F0A08',
  textColor = '#A89F91',
  accentColor = '#C9A227',
  borderColor = '#2A1F18',
  showCorners = true,
  cornerStyle = 1,
  cornerSize = 60,
  invertCorners = true,
  paddingVertical = 64,
  paddingHorizontal = 32,
}: FooterProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((state) => ({
    selected: state.events.selected,
  }))

  const cornerSrc = `/corner-${cornerStyle}.svg`
  const cornerFilter = invertCorners ? 'invert(1) brightness(0.8) sepia(1) saturate(0.5)' : 'none'

  return (
    <footer
      ref={(ref) => { if (ref) connect(drag(ref)) }}
      className="relative w-full"
      style={{
        backgroundColor,
        paddingTop: `${paddingVertical}px`,
        paddingBottom: `${paddingVertical}px`,
        paddingLeft: `${paddingHorizontal}px`,
        paddingRight: `${paddingHorizontal}px`,
        borderTop: `1px solid ${borderColor}`,
        outline: selected ? '2px solid #C9A227' : 'none',
      }}
    >
      {/* Corner Ornaments */}
      {showCorners && (
        <>
          <img src={cornerSrc} alt="" className="absolute pointer-events-none select-none" style={{ top: '16px', left: '16px', width: `${cornerSize}px`, height: `${cornerSize}px`, opacity: 0.3, filter: cornerFilter }} />
          <img src={cornerSrc} alt="" className="absolute pointer-events-none select-none" style={{ top: '16px', right: '16px', width: `${cornerSize}px`, height: `${cornerSize}px`, opacity: 0.3, filter: cornerFilter, transform: 'scaleX(-1)' }} />
        </>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="grid gap-10 md:grid-cols-4 mb-10">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-serif mb-3" style={{ color: accentColor }}>
              {brandName}
            </h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: textColor }}>
              {brandDescription}
            </p>
            
            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-200"
                    style={{ color: textColor }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = accentColor)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = textColor)}
                  >
                    <SocialIcon platform={social.platform} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link Columns */}
          {columns.map((column, colIndex) => (
            <div key={colIndex}>
              <h4
                className="text-sm uppercase tracking-wider font-semibold mb-4"
                style={{ color: accentColor }}
              >
                {column.title}
              </h4>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.url}
                      className="text-sm transition-colors duration-200 hover:underline"
                      style={{ color: textColor }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = accentColor)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = textColor)}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div
          className="pt-6 text-center text-sm"
          style={{ borderTop: `1px solid ${borderColor}`, color: textColor, opacity: 0.6 }}
        >
          {copyrightText}
        </div>
      </div>
    </footer>
  )
}

const FooterSettings = () => {
  const {
    actions: { setProp },
    brandName,
    brandDescription,
    copyrightText,
    columns,
    backgroundColor,
    textColor,
    accentColor,
    showCorners,
    cornerStyle,
  } = useNode((node) => ({
    brandName: node.data.props.brandName,
    brandDescription: node.data.props.brandDescription,
    copyrightText: node.data.props.copyrightText,
    columns: node.data.props.columns,
    backgroundColor: node.data.props.backgroundColor,
    textColor: node.data.props.textColor,
    accentColor: node.data.props.accentColor,
    showCorners: node.data.props.showCorners,
    cornerStyle: node.data.props.cornerStyle,
  }))

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">Brand Name</label>
        <input
          type="text"
          value={brandName}
          onChange={(e) => setProp((props: FooterProps) => (props.brandName = e.target.value))}
          className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">Brand Description</label>
        <textarea
          value={brandDescription}
          onChange={(e) => setProp((props: FooterProps) => (props.brandDescription = e.target.value))}
          rows={2}
          className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">Copyright Text</label>
        <input
          type="text"
          value={copyrightText}
          onChange={(e) => setProp((props: FooterProps) => (props.copyrightText = e.target.value))}
          className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">Background</label>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setProp((props: FooterProps) => (props.backgroundColor = e.target.value))}
            className="w-full h-10 cursor-pointer rounded border border-stone-300"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">Text</label>
          <input
            type="color"
            value={textColor}
            onChange={(e) => setProp((props: FooterProps) => (props.textColor = e.target.value))}
            className="w-full h-10 cursor-pointer rounded border border-stone-300"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">Accent</label>
          <input
            type="color"
            value={accentColor}
            onChange={(e) => setProp((props: FooterProps) => (props.accentColor = e.target.value))}
            className="w-full h-10 cursor-pointer rounded border border-stone-300"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-stone-700">
          <input
            type="checkbox"
            checked={showCorners}
            onChange={(e) => setProp((props: FooterProps) => (props.showCorners = e.target.checked))}
            className="rounded border-stone-300"
          />
          Show Corner Ornaments
        </label>
      </div>

      {showCorners && (
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">Corner Style</label>
          <select
            value={cornerStyle}
            onChange={(e) => setProp((props: FooterProps) => (props.cornerStyle = Number(e.target.value) as 1 | 2 | 3 | 4))}
            className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
          >
            <option value={1}>Style 1</option>
            <option value={2}>Style 2</option>
            <option value={3}>Style 3</option>
            <option value={4}>Style 4</option>
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">Footer Columns</label>
        <p className="text-xs text-stone-500">
          Edit column links in the page editor or update in code.
        </p>
      </div>
    </div>
  )
}

Footer.craft = {
  displayName: 'Footer',
  props: {
    brandName: 'Holy Trinity Orthodox Church',
    brandDescription: 'A parish of the Orthodox Church in America, serving the faithful since 1923.',
    copyrightText: '© 2025 Holy Trinity Orthodox Church. All rights reserved.',
    columns: defaultColumns,
    socialLinks: defaultSocialLinks,
    backgroundColor: '#0F0A08',
    textColor: '#A89F91',
    accentColor: '#C9A227',
    borderColor: '#2A1F18',
    showCorners: true,
    cornerStyle: 1,
    cornerSize: 60,
    invertCorners: true,
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  related: {
    settings: FooterSettings,
  },
  rules: {
    canDrag: () => true,
  },
}

export default Footer

