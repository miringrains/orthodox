/**
 * Orthodox Parish Website Templates - Type Definitions
 * 
 * These templates translate Orthodox visual traditions into modern web design:
 * - Sacred white space (generous breathing room)
 * - Liturgical color restraint (gold, burgundy, deep blue as accents)
 * - Typography hierarchy (serif headings, sans-serif body)
 * - Photography over clip art
 */

export interface TemplateColors {
  background: string
  primary: string
  secondary?: string
  accent: string
  text: string
}

export interface TemplateFonts {
  heading: string
  body: string
}

export interface PageTemplate {
  id: string
  name: string
  description: string
  category: 'monastery' | 'cathedral' | 'pascha'
  mode: 'light' | 'dark'
  thumbnail: string
  colors: TemplateColors
  fonts: TemplateFonts
  craftSchema: string // Serialized Craft.js JSON
  globalFonts: {
    fontFamily: string
    baseFontSize: string
    baseFontWeight: string
  }
}

export type TemplateCategory = 'monastery' | 'cathedral' | 'pascha'
export type TemplateMode = 'light' | 'dark'

export interface TemplateRegistry {
  templates: PageTemplate[]
  getById: (id: string) => PageTemplate | undefined
  getByCategory: (category: TemplateCategory) => PageTemplate[]
  getByMode: (mode: TemplateMode) => PageTemplate[]
  getAll: () => PageTemplate[]
}


