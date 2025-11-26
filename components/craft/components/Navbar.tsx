'use client'

import { useNode } from '@craftjs/core'
import React from 'react'
import Link from 'next/link'
import { Menu, X, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { SettingsAccordion } from '../controls/SettingsAccordion'

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
  const [isMobile, setIsMobile] = React.useState(false)
  const navRef = React.useRef<HTMLElement>(null)

  // Use ResizeObserver to detect actual container width (works in editor preview)
  React.useEffect(() => {
    if (!navRef.current) return

    const checkWidth = () => {
      if (navRef.current) {
        const width = navRef.current.getBoundingClientRect().width
        setIsMobile(width < 640)
        // Auto-close mobile menu when switching to desktop
        if (width >= 640 && mobileMenuOpen) {
          setMobileMenuOpen(false)
        }
      }
    }

    // Initial check
    checkWidth()

    const resizeObserver = new ResizeObserver(() => {
      checkWidth()
    })

    resizeObserver.observe(navRef.current)
    return () => resizeObserver.disconnect()
  }, [mobileMenuOpen])

  const handleToggleMenu = () => {
    setMobileMenuOpen(prev => !prev)
  }

  const handleCloseMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <nav
      ref={(ref) => {
        if (ref) {
          navRef.current = ref
          connect(drag(ref))
        }
      }}
      className={`
        bg-white border-b shadow-sm sticky top-0 z-50
        ${isSelected ? 'ring-2 ring-primary' : ''}
      `}
    >
      <div className="px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={logoText || 'Logo'} className="h-8" />
            ) : (
              <span className="text-xl font-bold text-primary">{logoText || 'Parish'}</span>
            )}
          </div>

          {/* Desktop Menu - shown when not mobile */}
          {!isMobile && (
            <div className="flex items-center gap-6">
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
          )}

          {/* Mobile Menu Button - shown when mobile */}
          {isMobile && (
            <button
              type="button"
              className="p-2 -mr-2 text-gray-700 hover:text-primary transition-colors rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={handleToggleMenu}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          )}
        </div>

        {/* Mobile Menu - shown when mobile and menu is open */}
        {isMobile && mobileMenuOpen && (
          <div className="border-t bg-white pb-4">
            <div className="pt-4">
              <div className="flex flex-col gap-2">
                {(menuItems || []).map((item, index) => (
                  <Link
                    key={index}
                    href={item.url}
                    className="text-gray-700 hover:text-primary transition-colors px-4 py-2 rounded-md hover:bg-gray-50"
                    onClick={handleCloseMenu}
                  >
                    {item.label}
                  </Link>
                ))}
                {ctaText && (
                  <div className="px-4 pt-2">
                    <Button 
                      asChild 
                      size="sm" 
                      className="w-full"
                      onClick={handleCloseMenu}
                    >
                      <Link href={ctaUrl || '#'}>{ctaText}</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

function NavbarSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }))

  const addMenuItem = () => {
    setProp((p: any) => {
      p.menuItems = [...(p.menuItems || []), { label: 'New Item', url: '#' }]
    })
  }

  const removeMenuItem = (index: number) => {
    setProp((p: any) => {
      p.menuItems = p.menuItems.filter((_: any, i: number) => i !== index)
    })
  }

  const updateMenuItem = (index: number, field: 'label' | 'url', value: string) => {
    setProp((p: any) => {
      const newItems = [...(p.menuItems || [])]
      newItems[index] = { ...newItems[index], [field]: value }
      p.menuItems = newItems
    })
  }

  return (
    <div className="divide-y divide-gray-100">
      {/* Brand Section */}
      <SettingsAccordion title="Brand" defaultOpen>
        <div>
          <Label className="text-sm font-medium">Logo Text</Label>
          <Input
            value={props.logoText || ''}
            onChange={(e) => setProp((p: any) => (p.logoText = e.target.value))}
            placeholder="Parish Name"
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-sm font-medium">Logo Image URL</Label>
          <Input
            value={props.logoUrl || ''}
            onChange={(e) => setProp((p: any) => (p.logoUrl = e.target.value))}
            placeholder="https://example.com/logo.png"
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">Optional - will override logo text</p>
        </div>
      </SettingsAccordion>

      {/* Menu Items Section */}
      <SettingsAccordion title="Menu Items" defaultOpen>
        <div className="space-y-2">
          {(props.menuItems || []).map((item: { label: string; url: string }, index: number) => (
            <div key={index} className="flex gap-2 items-center p-2 bg-gray-50 rounded-lg">
              <div className="flex-1 space-y-1">
                <Input
                  value={item.label}
                  onChange={(e) => updateMenuItem(index, 'label', e.target.value)}
                  placeholder="Label"
                  className="h-8 text-sm"
                />
                <Input
                  value={item.url}
                  onChange={(e) => updateMenuItem(index, 'url', e.target.value)}
                  placeholder="/url"
                  className="h-8 text-sm"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeMenuItem(index)}
                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button 
            variant="outline" 
            onClick={addMenuItem} 
            className="w-full h-9"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </div>
      </SettingsAccordion>

      {/* CTA Button Section */}
      <SettingsAccordion title="CTA Button">
        <div>
          <Label className="text-sm font-medium">Button Text</Label>
          <Input
            value={props.ctaText || ''}
            onChange={(e) => setProp((p: any) => (p.ctaText = e.target.value))}
            placeholder="Donate"
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">Leave empty to hide button</p>
        </div>
        <div>
          <Label className="text-sm font-medium">Button URL</Label>
          <Input
            value={props.ctaUrl || ''}
            onChange={(e) => setProp((p: any) => (p.ctaUrl = e.target.value))}
            placeholder="/giving"
            className="mt-1"
          />
        </div>
      </SettingsAccordion>
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

