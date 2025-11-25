'use client'

import { useNode } from '@craftjs/core'
import React from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface NavbarProps {
  logoUrl?: string
  logoText?: string
  menuItems?: { label: string; url: string }[]
  ctaText?: string
  ctaUrl?: string
}

export function Navbar({ logoUrl, logoText, menuItems, ctaText, ctaUrl }: NavbarProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <nav
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={`
        bg-white border-b shadow-sm sticky top-0 z-50
        ${isSelected ? 'ring-2 ring-primary' : ''}
      `}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={logoText || 'Logo'} className="h-8" />
            ) : (
              <span className="text-xl font-bold text-primary">{logoText || 'Parish'}</span>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {(menuItems || []).map((item, index) => (
              <Link
                key={index}
                href={item.url}
                className="text-gray-700 hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {ctaText && (
              <Button asChild size="sm">
                <Link href={ctaUrl || '#'}>{ctaText}</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`
            md:hidden border-t bg-white overflow-hidden transition-all duration-300 ease-in-out
            ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
          `}
          style={{
            display: mobileMenuOpen ? 'block' : 'none',
          }}
        >
          <div className="py-4">
            <div className="flex flex-col gap-4">
              {(menuItems || []).map((item, index) => (
                <Link
                  key={index}
                  href={item.url}
                  className="text-gray-700 hover:text-primary transition-colors px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {ctaText && (
                <Button asChild size="sm" className="w-full mx-2">
                  <Link href={ctaUrl || '#'}>{ctaText}</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavbarSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }))

  const addMenuItem = () => {
    setProp((props: any) => {
      props.menuItems = [...(props.menuItems || []), { label: 'New Item', url: '#' }]
    })
  }

  const removeMenuItem = (index: number) => {
    setProp((props: any) => {
      props.menuItems = props.menuItems.filter((_: any, i: number) => i !== index)
    })
  }

  const updateMenuItem = (index: number, field: 'label' | 'url', value: string) => {
    setProp((props: any) => {
      const newItems = [...(props.menuItems || [])]
      newItems[index] = { ...newItems[index], [field]: value }
      props.menuItems = newItems
    })
  }

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label>Logo Text</Label>
        <Input
          value={props.logoText || ''}
          onChange={(e) => setProp((props: any) => (props.logoText = e.target.value))}
          placeholder="Parish Name"
        />
      </div>
      <div>
        <Label>Logo URL (optional)</Label>
        <Input
          value={props.logoUrl || ''}
          onChange={(e) => setProp((props: any) => (props.logoUrl = e.target.value))}
          placeholder="https://example.com/logo.png"
        />
      </div>
      <div>
        <Label>Menu Items</Label>
        <div className="space-y-2 mt-2">
          {(props.menuItems || []).map((item: { label: string; url: string }, index: number) => (
            <div key={index} className="flex gap-2 items-center p-2 border rounded">
              <Input
                value={item.label}
                onChange={(e) => updateMenuItem(index, 'label', e.target.value)}
                placeholder="Label"
                className="flex-1"
              />
              <Input
                value={item.url}
                onChange={(e) => updateMenuItem(index, 'url', e.target.value)}
                placeholder="/url"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeMenuItem(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addMenuItem} className="w-full">
            Add Menu Item
          </Button>
        </div>
      </div>
      <div>
        <Label>CTA Button Text (optional)</Label>
        <Input
          value={props.ctaText || ''}
          onChange={(e) => setProp((props: any) => (props.ctaText = e.target.value))}
          placeholder="Donate"
        />
      </div>
      <div>
        <Label>CTA Button URL</Label>
        <Input
          value={props.ctaUrl || ''}
          onChange={(e) => setProp((props: any) => (props.ctaUrl = e.target.value))}
          placeholder="/giving"
        />
      </div>
    </div>
  )
}

Navbar.craft = {
  displayName: 'Navbar',
  props: {
    logoText: 'Parish',
    logoUrl: '',
    menuItems: [
      { label: 'Home', url: '/' },
      { label: 'About', url: '/about' },
      { label: 'Services', url: '/schedule' },
      { label: 'Contact', url: '/contact' },
    ],
    ctaText: 'Donate',
    ctaUrl: '/giving',
  },
  related: {
    settings: NavbarSettings,
  },
}

