/**
 * Curated Google Fonts for Orthodox Parish websites
 * 
 * All fonts are free for commercial use under the Open Font License.
 * https://fonts.google.com/
 */

export interface FontDefinition {
  name: string           // Display name
  family: string         // CSS font-family value
  googleId: string       // Google Fonts ID for URL
  category: 'serif' | 'sans-serif' | 'display'
  weights: number[]      // Available weights
  description?: string   // Optional description for UI
}

// Curated fonts suitable for Orthodox church websites
export const AVAILABLE_FONTS: FontDefinition[] = [
  // === SERIF FONTS (Traditional, Liturgical) ===
  {
    name: 'Cormorant Garamond',
    family: 'Cormorant Garamond, serif',
    googleId: 'Cormorant+Garamond',
    category: 'serif',
    weights: [400, 500, 600, 700],
    description: 'Elegant, traditional serif with Old Style numerals'
  },
  {
    name: 'Playfair Display',
    family: 'Playfair Display, serif',
    googleId: 'Playfair+Display',
    category: 'serif',
    weights: [400, 500, 600, 700],
    description: 'High contrast transitional serif, grand and elegant'
  },
  {
    name: 'Lora',
    family: 'Lora, serif',
    googleId: 'Lora',
    category: 'serif',
    weights: [400, 500, 600, 700],
    description: 'Contemporary serif with calligraphic roots'
  },
  {
    name: 'Crimson Pro',
    family: 'Crimson Pro, serif',
    googleId: 'Crimson+Pro',
    category: 'serif',
    weights: [400, 500, 600, 700],
    description: 'Warm, readable serif inspired by old-style typefaces'
  },
  {
    name: 'EB Garamond',
    family: 'EB Garamond, serif',
    googleId: 'EB+Garamond',
    category: 'serif',
    weights: [400, 500, 600, 700],
    description: 'Revival of Claude Garamond\'s classic design'
  },
  {
    name: 'Libre Baskerville',
    family: 'Libre Baskerville, serif',
    googleId: 'Libre+Baskerville',
    category: 'serif',
    weights: [400, 700],
    description: 'Timeless Baskerville revival, excellent readability'
  },
  {
    name: 'Merriweather',
    family: 'Merriweather, serif',
    googleId: 'Merriweather',
    category: 'serif',
    weights: [400, 700],
    description: 'Designed for screens, highly readable'
  },
  {
    name: 'Spectral',
    family: 'Spectral, serif',
    googleId: 'Spectral',
    category: 'serif',
    weights: [400, 500, 600, 700],
    description: 'Contemporary serif designed for long-form reading'
  },

  // === SANS-SERIF FONTS (Modern, Clean) ===
  {
    name: 'Source Sans 3',
    family: 'Source Sans 3, sans-serif',
    googleId: 'Source+Sans+3',
    category: 'sans-serif',
    weights: [400, 500, 600, 700],
    description: 'Adobe\'s versatile sans-serif, excellent for body text'
  },
  {
    name: 'Open Sans',
    family: 'Open Sans, sans-serif',
    googleId: 'Open+Sans',
    category: 'sans-serif',
    weights: [400, 500, 600, 700],
    description: 'Friendly, humanist sans-serif with excellent legibility'
  },
  {
    name: 'Nunito Sans',
    family: 'Nunito Sans, sans-serif',
    googleId: 'Nunito+Sans',
    category: 'sans-serif',
    weights: [400, 500, 600, 700],
    description: 'Rounded, warm sans-serif for a welcoming feel'
  },
  {
    name: 'Lato',
    family: 'Lato, sans-serif',
    googleId: 'Lato',
    category: 'sans-serif',
    weights: [400, 700],
    description: 'Warm yet professional, semi-rounded details'
  },
  {
    name: 'Alegreya Sans',
    family: 'Alegreya Sans, sans-serif',
    googleId: 'Alegreya+Sans',
    category: 'sans-serif',
    weights: [400, 500, 700],
    description: 'Humanist sans with dynamic rhythm, pairs well with Alegreya'
  },
  {
    name: 'PT Sans',
    family: 'PT Sans, sans-serif',
    googleId: 'PT+Sans',
    category: 'sans-serif',
    weights: [400, 700],
    description: 'Designed for Russian languages, includes Cyrillic'
  },
  {
    name: 'Inter',
    family: 'Inter, sans-serif',
    googleId: 'Inter',
    category: 'sans-serif',
    weights: [400, 500, 600, 700],
    description: 'Modern, versatile typeface designed for screens'
  },
  {
    name: 'DM Sans',
    family: 'DM Sans, sans-serif',
    googleId: 'DM+Sans',
    category: 'sans-serif',
    weights: [400, 500, 600, 700],
    description: 'Low-contrast geometric sans-serif, friendly and open'
  },

  // === DISPLAY FONTS (Headlines, Emphasis) ===
  {
    name: 'Cinzel',
    family: 'Cinzel, serif',
    googleId: 'Cinzel',
    category: 'display',
    weights: [400, 500, 600, 700],
    description: 'Roman inscriptional capitals, majestic and timeless'
  },
  {
    name: 'Alegreya',
    family: 'Alegreya, serif',
    googleId: 'Alegreya',
    category: 'display',
    weights: [400, 500, 600, 700],
    description: 'Calligraphic serif with dynamic rhythm'
  },
  {
    name: 'Cormorant',
    family: 'Cormorant, serif',
    googleId: 'Cormorant',
    category: 'display',
    weights: [400, 500, 600, 700],
    description: 'Delicate, refined display serif'
  },
]

/**
 * Get a font by its family name
 */
export function getFontByFamily(family: string): FontDefinition | undefined {
  return AVAILABLE_FONTS.find(f => f.family === family)
}

/**
 * Get a font by its name
 */
export function getFontByName(name: string): FontDefinition | undefined {
  return AVAILABLE_FONTS.find(f => f.name === name)
}

/**
 * Generate Google Fonts URL for loading specific fonts
 */
export function generateGoogleFontsUrl(fonts: FontDefinition[]): string {
  if (fonts.length === 0) return ''
  
  const families = fonts.map(font => {
    const weights = font.weights.join(';')
    return `family=${font.googleId}:wght@${weights}`
  })
  
  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`
}

/**
 * Generate Google Fonts URL for a single font family string
 */
export function generateFontUrl(fontFamily: string): string | null {
  const font = getFontByFamily(fontFamily)
  if (!font) return null
  
  return generateGoogleFontsUrl([font])
}

/**
 * Get fonts grouped by category
 */
export function getFontsByCategory() {
  return {
    serif: AVAILABLE_FONTS.filter(f => f.category === 'serif'),
    'sans-serif': AVAILABLE_FONTS.filter(f => f.category === 'sans-serif'),
    display: AVAILABLE_FONTS.filter(f => f.category === 'display'),
  }
}

/**
 * Default font for new pages
 */
export const DEFAULT_FONT: FontDefinition = AVAILABLE_FONTS.find(
  f => f.name === 'Source Sans 3'
) || AVAILABLE_FONTS[0]

