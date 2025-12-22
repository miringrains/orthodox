/**
 * Default component presets for the Craft.js builder
 * These are built-in presets that are always available
 */

export interface ComponentPreset {
  id: string
  name: string
  componentType: string
  props: Record<string, any>
  isGlobal: true
  category?: string
}

// Hero Section Presets
export const heroPresets: ComponentPreset[] = [
  {
    id: 'hero-centered-overlay',
    name: 'Centered with Overlay',
    componentType: 'HeroSection',
    isGlobal: true,
    category: 'Hero',
    props: {
      heroStyle: 'centered',
      overlayOpacity: 60,
      contentAlign: 'center',
      verticalAlign: 'center',
      minHeight: 500,
      titleSize: 'xl',
      subtitleSize: 'md',
    },
  },
  {
    id: 'hero-full-image',
    name: 'Full Image Hero',
    componentType: 'HeroSection',
    isGlobal: true,
    category: 'Hero',
    props: {
      heroStyle: 'fullImage',
      overlayOpacity: 40,
      contentAlign: 'center',
      verticalAlign: 'center',
      minHeight: 600,
      showTitle: true,
      showSubtitle: true,
    },
  },
  {
    id: 'hero-minimal',
    name: 'Minimal (Solid Color)',
    componentType: 'HeroSection',
    isGlobal: true,
    category: 'Hero',
    props: {
      heroStyle: 'minimal',
      backgroundColor: '#1a1a1a',
      textColor: '#f5f0e8',
      overlayOpacity: 0,
      minHeight: 400,
      padding: 80,
    },
  },
  {
    id: 'hero-split',
    name: 'Split Layout',
    componentType: 'HeroSection',
    isGlobal: true,
    category: 'Hero',
    props: {
      heroStyle: 'split',
      contentAlign: 'left',
      overlayOpacity: 0,
      minHeight: 500,
    },
  },
]

// Section Presets
export const sectionPresets: ComponentPreset[] = [
  {
    id: 'section-light',
    name: 'Light Background',
    componentType: 'Section',
    isGlobal: true,
    category: 'Section',
    props: {
      backgroundType: 'solid',
      overlayColor: '#ffffff',
      textColor: '#1a1a1a',
      padding: 80,
      containerWidth: '1024px',
      contentAlign: 'center',
    },
  },
  {
    id: 'section-dark',
    name: 'Dark Background',
    componentType: 'Section',
    isGlobal: true,
    category: 'Section',
    props: {
      backgroundType: 'solid',
      overlayColor: '#1a1a1a',
      textColor: '#f5f0e8',
      padding: 80,
      containerWidth: '1024px',
      contentAlign: 'center',
    },
  },
  {
    id: 'section-cream',
    name: 'Cream/Parchment',
    componentType: 'Section',
    isGlobal: true,
    category: 'Section',
    props: {
      backgroundType: 'solid',
      overlayColor: '#f5f0e8',
      textColor: '#2c2c2c',
      padding: 80,
      containerWidth: '1024px',
      contentAlign: 'center',
    },
  },
  {
    id: 'section-with-pattern',
    name: 'With Damask Pattern',
    componentType: 'Section',
    isGlobal: true,
    category: 'Section',
    props: {
      backgroundType: 'solid',
      overlayColor: '#1a1a1a',
      textColor: '#f5f0e8',
      padding: 80,
      backgroundPattern: 'damask',
      patternOpacity: 5,
      patternColor: '#C9A962',
    },
  },
  {
    id: 'section-with-corners',
    name: 'With Corner Ornaments',
    componentType: 'Section',
    isGlobal: true,
    category: 'Section',
    props: {
      backgroundType: 'solid',
      overlayColor: '#1a1a1a',
      textColor: '#f5f0e8',
      padding: 80,
      cornerStyle: 'corner-1',
      cornerColor: '#C9A962',
      cornerSize: 80,
      cornerOpacity: 30,
    },
  },
]

// Divider Presets
export const dividerPresets: ComponentPreset[] = [
  {
    id: 'divider-gold-ornate',
    name: 'Gold Ornate',
    componentType: 'Divider',
    isGlobal: true,
    category: 'Divider',
    props: {
      dividerType: 'ornament',
      ornamentStyle: 'cross',
      color: '#C9A962',
      width: '120px',
      margin: { top: 24, right: 0, bottom: 24, left: 0 },
    },
  },
  {
    id: 'divider-simple-line',
    name: 'Simple Line',
    componentType: 'Divider',
    isGlobal: true,
    category: 'Divider',
    props: {
      dividerType: 'line',
      variant: 'single',
      thickness: 1,
      color: '#C9A962',
      width: '60px',
      margin: { top: 16, right: 0, bottom: 16, left: 0 },
    },
  },
  {
    id: 'divider-double-line',
    name: 'Double Line',
    componentType: 'Divider',
    isGlobal: true,
    category: 'Divider',
    props: {
      dividerType: 'line',
      variant: 'double',
      thickness: 1,
      gap: 4,
      color: '#C9A962',
      width: '80px',
      margin: { top: 20, right: 0, bottom: 20, left: 0 },
    },
  },
  {
    id: 'divider-ornament-diamond',
    name: 'Diamond Ornament',
    componentType: 'Divider',
    isGlobal: true,
    category: 'Divider',
    props: {
      dividerType: 'ornament',
      ornamentStyle: 'diamond',
      color: '#C9A962',
      width: '150px',
      margin: { top: 24, right: 0, bottom: 24, left: 0 },
    },
  },
]

// Navbar Presets
export const navbarPresets: ComponentPreset[] = [
  {
    id: 'navbar-light',
    name: 'Light Navbar',
    componentType: 'Navbar',
    isGlobal: true,
    category: 'Navbar',
    props: {
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      layout: 'inline',
      isTransparent: false,
      position: 'static',
    },
  },
  {
    id: 'navbar-dark',
    name: 'Dark Navbar',
    componentType: 'Navbar',
    isGlobal: true,
    category: 'Navbar',
    props: {
      backgroundColor: '#1a1a1a',
      textColor: '#f5f0e8',
      layout: 'inline',
      isTransparent: false,
      position: 'static',
    },
  },
  {
    id: 'navbar-transparent-overlay',
    name: 'Transparent Overlay',
    componentType: 'Navbar',
    isGlobal: true,
    category: 'Navbar',
    props: {
      backgroundColor: 'transparent',
      textColor: '#ffffff',
      layout: 'centered',
      isTransparent: true,
      position: 'overlay',
    },
  },
]

// All presets combined
export const DEFAULT_PRESETS: ComponentPreset[] = [
  ...heroPresets,
  ...sectionPresets,
  ...dividerPresets,
  ...navbarPresets,
]

/**
 * Get presets for a specific component type
 */
export function getPresetsForComponent(componentType: string): ComponentPreset[] {
  return DEFAULT_PRESETS.filter(p => p.componentType === componentType)
}

/**
 * Get a preset by ID
 */
export function getPresetById(id: string): ComponentPreset | undefined {
  return DEFAULT_PRESETS.find(p => p.id === id)
}

