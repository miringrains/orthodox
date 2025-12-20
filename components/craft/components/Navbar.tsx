'use client'

import { useNode } from '@craftjs/core'
import React, { useRef, useState } from 'react'
import Link from 'next/link'
import { Menu, X, Plus, Trash2, Loader2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SettingsAccordion } from '../controls/SettingsAccordion'
import { ColorPicker } from '../controls/ColorPicker'
import { createClient } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'

interface NavbarProps {
  logoUrl?: string
  logoText?: string
  logoHeight?: number
  showParishName?: boolean
  parishName?: string
  layout?: 'inline' | 'centered' | 'stacked'
  menuItems?: { label: string; url: string }[]
  ctaText?: string
  ctaUrl?: string
  backgroundColor?: string
  textColor?: string
  ctaBackgroundColor?: string
  ctaTextColor?: string
}

export function Navbar({ 
  logoUrl, 
  logoText = 'Parish', 
  logoHeight = 48,
  showParishName = false,
  parishName = '',
  layout = 'inline',
  menuItems = [],
  ctaText = '',
  ctaUrl = '#',
  backgroundColor = '#ffffff',
  textColor = '#1f2937',
  ctaBackgroundColor = '',
  ctaTextColor = '',
}: NavbarProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)
  const navRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    if (!navRef.current) return

    const checkWidth = () => {
      if (navRef.current) {
        const width = navRef.current.getBoundingClientRect().width
        setIsMobile(width < 640)
        if (width >= 640 && mobileMenuOpen) {
          setMobileMenuOpen(false)
        }
      }
    }

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

  // Centered layout: icon/logo on top, menu below
  if (layout === 'centered' && !isMobile) {
    return (
      <nav
        ref={(ref) => {
          if (ref) {
            navRef.current = ref
            connect(drag(ref))
          }
        }}
        className={`
          border-b shadow-sm sticky top-0 z-50
          ${isSelected ? 'ring-2 ring-primary' : ''}
        `}
        style={{ backgroundColor }}
      >
        <div className="px-4 py-4">
          {/* Centered Logo/Icon */}
          <div className="flex flex-col items-center mb-4">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={logoText || 'Logo'} 
                style={{ height: `${logoHeight}px` }}
                className="object-contain"
              />
            ) : (
              <span 
                className="text-2xl font-bold"
                style={{ color: textColor }}
              >
                {logoText}
              </span>
            )}
            {showParishName && parishName && (
              <span 
                className="mt-2 text-lg tracking-wide"
                style={{ color: textColor, fontFamily: 'serif' }}
              >
                {parishName}
              </span>
            )}
          </div>

          {/* Centered Menu */}
          <div className="flex items-center justify-center gap-8">
            {(menuItems || []).map((item, index) => (
              <Link
                key={index}
                href={item.url}
                className="hover:opacity-70 transition-opacity text-sm font-medium"
                style={{ 
                  color: textColor,
                  letterSpacing: '0.05em',
                }}
              >
                {item.label}
              </Link>
            ))}
            {ctaText && (
              <Button 
                asChild 
                size="sm"
                style={{
                  backgroundColor: ctaBackgroundColor || undefined,
                  color: ctaTextColor || undefined,
                }}
              >
                <Link href={ctaUrl || '#'}>{ctaText}</Link>
              </Button>
            )}
          </div>
        </div>
      </nav>
    )
  }

  // Stacked layout: logo and name on left, stacked
  if (layout === 'stacked' && !isMobile) {
    return (
      <nav
        ref={(ref) => {
          if (ref) {
            navRef.current = ref
            connect(drag(ref))
          }
        }}
        className={`
          border-b shadow-sm sticky top-0 z-50
          ${isSelected ? 'ring-2 ring-primary' : ''}
        `}
        style={{ backgroundColor }}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Parish Name stacked */}
            <div className="flex items-center gap-4">
              {logoUrl && (
                <img 
                  src={logoUrl} 
                  alt={logoText || 'Logo'} 
                  style={{ height: `${logoHeight}px` }}
                  className="object-contain"
                />
              )}
              <div className="flex flex-col">
                {!logoUrl && (
                  <span 
                    className="text-xl font-bold"
                    style={{ color: textColor }}
                  >
                    {logoText}
                  </span>
                )}
                {showParishName && parishName && (
                  <span 
                    className="text-lg tracking-wide"
                    style={{ color: textColor, fontFamily: 'serif' }}
                  >
                    {parishName}
                  </span>
                )}
              </div>
            </div>

            {/* Menu */}
            <div className="flex items-center gap-6">
              {(menuItems || []).map((item, index) => (
                <Link
                  key={index}
                  href={item.url}
                  className="hover:opacity-70 transition-opacity text-sm font-medium"
                  style={{ 
                    color: textColor,
                    letterSpacing: '0.025em',
                  }}
                >
                  {item.label}
                </Link>
              ))}
              {ctaText && (
                <Button 
                  asChild 
                  size="sm"
                  style={{
                    backgroundColor: ctaBackgroundColor || undefined,
                    color: ctaTextColor || undefined,
                  }}
                >
                  <Link href={ctaUrl || '#'}>{ctaText}</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // Default inline layout (and mobile fallback)
  return (
    <nav
      ref={(ref) => {
        if (ref) {
          navRef.current = ref
          connect(drag(ref))
        }
      }}
      className={`
        border-b shadow-sm sticky top-0 z-50
        ${isSelected ? 'ring-2 ring-primary' : ''}
      `}
      style={{ backgroundColor }}
    >
      <div className="px-4">
        <div 
          className="flex items-center justify-between"
          style={{ minHeight: logoUrl ? `${Math.max(64, logoHeight + 16)}px` : '64px' }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <div className="flex items-center gap-3">
                <img 
                  src={logoUrl} 
                  alt={logoText || 'Logo'} 
                  style={{ height: `${logoHeight}px` }}
                  className="object-contain"
                />
                {showParishName && parishName && (
                  <span 
                    className="text-lg tracking-wide hidden sm:block"
                    style={{ color: textColor, fontFamily: 'serif' }}
                  >
                    {parishName}
                  </span>
                )}
              </div>
            ) : (
              <span 
                className="text-xl font-bold"
                style={{ color: textColor }}
              >
                {logoText}
              </span>
            )}
          </div>

          {/* Desktop Menu */}
          {!isMobile && (
            <div className="flex items-center gap-6">
              {(menuItems || []).map((item, index) => (
                <Link
                  key={index}
                  href={item.url}
                  className="hover:opacity-70 transition-opacity text-sm font-medium"
                  style={{ 
                    color: textColor,
                    letterSpacing: '0.025em',
                  }}
                >
                  {item.label}
                </Link>
              ))}
              {ctaText && (
                <Button 
                  asChild 
                  size="sm"
                  style={{
                    backgroundColor: ctaBackgroundColor || undefined,
                    color: ctaTextColor || undefined,
                  }}
                >
                  <Link href={ctaUrl || '#'}>{ctaText}</Link>
                </Button>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              type="button"
              className="p-2 -mr-2 hover:opacity-70 transition-opacity rounded-md"
              onClick={handleToggleMenu}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
              style={{ color: textColor }}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <div className="border-t pb-4" style={{ backgroundColor }}>
            <div className="pt-4">
              <div className="flex flex-col gap-2">
                {(menuItems || []).map((item, index) => (
                  <Link
                    key={index}
                    href={item.url}
                    className="px-4 py-2 rounded-md hover:bg-black/5"
                    onClick={handleCloseMenu}
                    style={{ color: textColor }}
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
                      style={{
                        backgroundColor: ctaBackgroundColor || undefined,
                        color: ctaTextColor || undefined,
                      }}
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
  const params = useParams()
  const pageId = params.id as string
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Logo must be less than 2MB')
      return
    }

    setUploading(true)
    setUploadError('')

    try {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('You must be logged in to upload')
      }

      const { data: page } = await supabase
        .from('pages')
        .select('parish_id')
        .eq('id', pageId)
        .single()

      if (!page) {
        throw new Error('Page not found')
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `pages/${page.parish_id}/${pageId}/logo/${Date.now()}.${fileExt}`

      const { error: uploadErr } = await supabase.storage
        .from('media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadErr) throw uploadErr

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName)

      setProp((p: any) => (p.logoUrl = publicUrl))
    } catch (error: any) {
      console.error('Error uploading logo:', error)
      setUploadError(error.message || 'Failed to upload logo')
    } finally {
      setUploading(false)
    }
  }

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
      {/* Layout Section */}
      <SettingsAccordion title="Layout" defaultOpen>
        <div>
          <Label className="text-sm font-medium">Navbar Style</Label>
          <Select
            value={props.layout || 'inline'}
            onValueChange={(value) => setProp((p: any) => (p.layout = value))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inline">Inline (Logo Left)</SelectItem>
              <SelectItem value="stacked">Stacked (Icon + Name)</SelectItem>
              <SelectItem value="centered">Centered (Icon Above Menu)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            Centered and Stacked work best with icon-style logos
          </p>
        </div>
      </SettingsAccordion>

      {/* Logo Section */}
      <SettingsAccordion title="Logo / Icon" defaultOpen>
        <div>
          <Label className="text-sm font-medium">Logo Image</Label>
          <div
            className="mt-2 border-2 border-dashed border-gray-200 rounded-lg p-3 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              disabled={uploading}
              className="hidden"
            />
            {uploading ? (
              <Loader2 className="h-5 w-5 mx-auto animate-spin text-primary" />
            ) : props.logoUrl ? (
              <div className="space-y-2">
                <img src={props.logoUrl} alt="Logo" className="max-h-16 mx-auto" />
                <p className="text-xs text-gray-500">Click to change</p>
              </div>
            ) : (
              <div className="space-y-1 py-1">
                <ImageIcon className="h-5 w-5 mx-auto text-gray-400" />
                <p className="text-xs text-gray-500">Upload icon or logo</p>
              </div>
            )}
          </div>
          {uploadError && (
            <p className="text-xs text-red-500 mt-1">{uploadError}</p>
          )}
          {props.logoUrl && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => setProp((p: any) => (p.logoUrl = ''))}
            >
              <X className="h-4 w-4 mr-1" />
              Remove Logo
            </Button>
          )}
        </div>

        {props.logoUrl && (
          <div>
            <Label className="text-sm font-medium">Logo/Icon Size</Label>
            <div className="mt-2">
              <input
                type="range"
                min="32"
                max="120"
                value={props.logoHeight || 48}
                onChange={(e) => setProp((p: any) => (p.logoHeight = parseInt(e.target.value)))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Small</span>
                <span className="font-medium text-gray-700">{props.logoHeight || 48}px</span>
                <span>Large</span>
              </div>
            </div>
          </div>
        )}

        {!props.logoUrl && (
          <div>
            <Label className="text-sm font-medium">Text Logo</Label>
            <Input
              value={props.logoText || ''}
              onChange={(e) => setProp((p: any) => (p.logoText = e.target.value))}
              placeholder="Parish Name"
              className="mt-1"
            />
          </div>
        )}

        {/* Parish Name (shown alongside icon) */}
        {props.logoUrl && (
          <>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showParishName"
                checked={props.showParishName || false}
                onChange={(e) => setProp((p: any) => (p.showParishName = e.target.checked))}
                className="rounded"
              />
              <Label htmlFor="showParishName" className="text-sm">Show Parish Name</Label>
            </div>
            {props.showParishName && (
              <div>
                <Label className="text-sm font-medium">Parish Name</Label>
                <Input
                  value={props.parishName || ''}
                  onChange={(e) => setProp((p: any) => (p.parishName = e.target.value))}
                  placeholder="Holy Trinity Orthodox Church"
                  className="mt-1"
                />
              </div>
            )}
          </>
        )}
      </SettingsAccordion>

      {/* Colors Section */}
      <SettingsAccordion title="Colors">
        <ColorPicker
          label="Background"
          value={props.backgroundColor || '#ffffff'}
          onChange={(value) => setProp((p: any) => (p.backgroundColor = value))}
        />

        <ColorPicker
          label="Text Color"
          value={props.textColor || '#1f2937'}
          onChange={(value) => setProp((p: any) => (p.textColor = value))}
        />

        {props.ctaText && (
          <>
            <ColorPicker
              label="Button Background"
              value={props.ctaBackgroundColor || ''}
              onChange={(value) => setProp((p: any) => (p.ctaBackgroundColor = value))}
              placeholder="default"
            />
            <ColorPicker
              label="Button Text"
              value={props.ctaTextColor || ''}
              onChange={(value) => setProp((p: any) => (p.ctaTextColor = value))}
              placeholder="default"
            />
          </>
        )}
      </SettingsAccordion>

      {/* Menu Items Section */}
      <SettingsAccordion title="Menu Items">
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
    logoHeight: 48,
    showParishName: false,
    parishName: '',
    layout: 'inline',
    menuItems: [
      { label: 'Home', url: '/' },
      { label: 'About', url: '/about' },
      { label: 'Services', url: '/schedule' },
      { label: 'Contact', url: '/contact' },
    ],
    ctaText: 'Donate',
    ctaUrl: '/giving',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    ctaBackgroundColor: '',
    ctaTextColor: '',
  },
  related: {
    settings: NavbarSettings,
  },
}
