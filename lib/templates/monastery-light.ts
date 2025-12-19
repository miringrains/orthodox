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

// Craft.js serialized format:
// - ROOT type should be 'div' (string) since the editor uses <Element is="div" canvas>
// - HeroSection linkedNodes use 'div' type since it uses <Element is="div" canvas>
// - Section linkedNodes use { resolvedName: 'ColumnCanvas' } since it uses <Element is={ColumnCanvas} canvas>
const craftSchema = {
  ROOT: {
    type: 'div',
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
    isCanvas: false,
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
    linkedNodes: {
      'hero-content': 'node-hero-content',
    },
  },
  'node-hero-content': {
    type: 'div',
    isCanvas: true,
    props: {},
    displayName: 'div',
    custom: {},
    parent: 'node-hero',
    hidden: false,
    nodes: [],
    linkedNodes: {},
  },
  'node-welcome': {
    type: { resolvedName: 'Section' },
    isCanvas: false,
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
    linkedNodes: {
      'section-content': 'node-welcome-content',
    },
  },
  'node-welcome-content': {
    type: { resolvedName: 'ColumnCanvas' },
    isCanvas: true,
    props: {},
    displayName: 'Column',
    custom: {},
    parent: 'node-welcome',
    hidden: false,
    nodes: ['node-welcome-heading', 'node-welcome-divider', 'node-welcome-text'],
    linkedNodes: {},
  },
  'node-welcome-heading': {
    type: { resolvedName: 'Heading' },
    isCanvas: false,
    props: {
      text: 'About Our Community',
      level: 'h2',
      align: 'center',
      textColor: '#2C3E50',
      fontWeight: 'bold',
    },
    displayName: 'Heading',
    custom: {},
    parent: 'node-welcome-content',
    hidden: false,
    nodes: [],
    linkedNodes: {},
  },
  'node-welcome-divider': {
    type: { resolvedName: 'Divider' },
    isCanvas: false,
    props: {
      color: '#9A7B4F',
      width: '60px',
      thickness: 2,
      margin: 24,
    },
    displayName: 'Divider',
    custom: {},
    parent: 'node-welcome-content',
    hidden: false,
    nodes: [],
    linkedNodes: {},
  },
  'node-welcome-text': {
    type: { resolvedName: 'TextBlock' },
    isCanvas: false,
    props: {
      content: 'Our parish is a welcoming community rooted in the Orthodox Christian tradition. We gather for Divine Liturgy, fellowship, and service to one another. Whether you are exploring Orthodoxy for the first time or looking for a spiritual home, we invite you to join us.',
      align: 'center',
      size: 'lg',
      textColor: '#4A5568',
    },
    displayName: 'Text Block',
    custom: {},
    parent: 'node-welcome-content',
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
