/**
 * Default website template structure for new pages
 * This creates a basic website layout with common sections
 */
export function getDefaultPageTemplate() {
  return {
    ROOT: {
      type: {
        resolvedName: 'div',
      },
      isCanvas: true,
      props: {},
      displayName: 'div',
      custom: {},
      hidden: false,
      nodes: ['navbar', 'heroSection', 'contentSection'],
      linkedNodes: {},
    },
    navbar: {
      type: {
        resolvedName: 'Navbar',
      },
      isCanvas: false,
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
      displayName: 'Navbar',
      custom: {},
      hidden: false,
      parent: 'ROOT',
      nodes: [],
      linkedNodes: {},
    },
    heroSection: {
      type: {
        resolvedName: 'HeroSection',
      },
      isCanvas: false,
      props: {
        title: 'Welcome to Our Parish',
        subtitle: 'Join us in worship, fellowship, and service to our community',
        imageUrl: '',
      },
      displayName: 'Hero Section',
      custom: {},
      hidden: false,
      parent: 'ROOT',
      nodes: [],
      linkedNodes: {},
    },
    contentSection: {
      type: {
        resolvedName: 'div',
      },
      isCanvas: true,
      props: {},
      displayName: 'div',
      custom: {},
      hidden: false,
      parent: 'ROOT',
      nodes: ['textBlock1', 'imageBlock1', 'buttonBlock1'],
      linkedNodes: {},
    },
    textBlock1: {
      type: {
        resolvedName: 'TextBlock',
      },
      isCanvas: false,
      props: {
        content: 'This is your new page. Start editing by selecting components and customizing them in the settings panel.',
        align: 'center',
        size: 'lg',
      },
      displayName: 'Text Block',
      custom: {},
      hidden: false,
      parent: 'contentSection',
      nodes: [],
      linkedNodes: {},
    },
    imageBlock1: {
      type: {
        resolvedName: 'ImageBlock',
      },
      isCanvas: false,
      props: {
        imageUrl: '',
        alt: 'Parish image',
        caption: '',
        width: 16,
        height: 9,
        objectFit: 'cover',
      },
      displayName: 'Image Block',
      custom: {},
      hidden: false,
      parent: 'contentSection',
      nodes: [],
      linkedNodes: {},
    },
    buttonBlock1: {
      type: {
        resolvedName: 'ButtonBlock',
      },
      isCanvas: false,
      props: {
        text: 'Learn More',
        url: '#',
        variant: 'default',
        size: 'default',
        fullWidth: false,
      },
      displayName: 'Button Block',
      custom: {},
      hidden: false,
      parent: 'contentSection',
      nodes: [],
      linkedNodes: {},
    },
  }
}

/**
 * Empty template - just a canvas
 */
export function getEmptyTemplate() {
  return {
    ROOT: {
      type: {
        resolvedName: 'div',
      },
      isCanvas: true,
      props: {},
      displayName: 'div',
      custom: {},
      hidden: false,
      nodes: [],
      linkedNodes: {},
    },
  }
}

