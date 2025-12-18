import type { PageTemplate } from './types'

/**
 * Monastery Light Template
 * 
 * Aesthetic: Monastic simplicity. Single-column focused content. 
 * Generous margins. Subtle gold rules as dividers. 
 * Evokes a scriptorium or quiet chapel.
 * 
 * Typography: Cormorant Garamond (headings) + Source Sans 3 (body)
 */

// Craft.js expects a flat structure where all nodes are at the root level
// Each node has: type, isCanvas, props, displayName, custom, hidden, nodes (array of child IDs), linkedNodes, parent
const craftSchema = {
  ROOT: {
    type: { resolvedName: 'div' },
    isCanvas: true,
    props: {
      className: 'min-h-[600px] w-full',
    },
    displayName: 'div',
    custom: {},
    hidden: false,
    nodes: ['node-navbar', 'node-hero', 'node-welcome'],
    linkedNodes: {},
  },
  'node-navbar': {
    type: { resolvedName: 'Navbar' },
    isCanvas: false,
    props: {
      logoText: 'Your Parish',
      logoUrl: '',
      logoHeight: 32,
      menuItems: [
        { label: 'Home', url: '/' },
        { label: 'Schedule', url: '/schedule' },
        { label: 'About', url: '/about' },
        { label: 'Contact', url: '/contact' },
      ],
      ctaText: 'Donate',
      ctaUrl: '/giving',
      backgroundColor: '#F9F6F2',
      textColor: '#2C3E50',
      ctaBackgroundColor: '#9A7B4F',
      ctaTextColor: '#ffffff',
    },
    displayName: 'Navbar',
    custom: {},
    parent: 'ROOT',
    hidden: false,
    nodes: [],
    linkedNodes: {},
  },
  'node-hero': {
    type: { resolvedName: 'HeroSection' },
    isCanvas: true,
    props: {
      title: 'Welcome to Our Parish',
      subtitle: 'A place of prayer, community, and spiritual growth',
      imageUrl: '',
      overlayColor: '#2C3E50',
      overlayOpacity: 70,
      textColor: '#F9F6F2',
      padding: 100,
      showTitle: true,
      showSubtitle: true,
    },
    displayName: 'Hero Section',
    custom: {},
    parent: 'ROOT',
    hidden: false,
    nodes: [],
    linkedNodes: {},
  },
  'node-welcome': {
    type: { resolvedName: 'Section' },
    isCanvas: true,
    props: {
      imageUrl: '',
      overlayColor: '#F9F6F2',
      overlayOpacity: 100,
      textColor: '#2C3E50',
      padding: 80,
      containerWidth: '768px',
    },
    displayName: 'Section',
    custom: {},
    parent: 'ROOT',
    hidden: false,
    nodes: [],
    linkedNodes: {},
  },
}

export const monasteryLightTemplate: PageTemplate = {
  id: 'monastery-light',
  name: 'Monastery',
  description: 'Contemplative and minimal. Warm parchment tones with subtle gold accents. Perfect for parishes seeking a serene, focused aesthetic.',
  category: 'monastery',
  mode: 'light',
  thumbnail: '/templates/monastery-light.svg',
  colors: {
    background: '#F9F6F2',
    primary: '#9A7B4F',
    accent: '#722F37',
    text: '#2C3E50',
  },
  fonts: {
    heading: 'Cormorant Garamond',
    body: 'Source Sans 3',
  },
  globalFonts: {
    fontFamily: 'Source Sans 3, sans-serif',
    baseFontSize: '16px',
    baseFontWeight: 'normal',
  },
  craftSchema: JSON.stringify(craftSchema),
}
