/**
 * Orthodox Parish Website Templates - Registry
 * 
 * Central registry for all page templates. Import templates from individual files
 * and expose them through a unified API.
 * 
 * Two production-ready templates:
 * - Cathedral (Dark): Dramatic design with rich gold accents
 * - Monastery (Light): Warm, contemplative design with sage green accents
 */

import type { PageTemplate, TemplateCategory, TemplateMode, TemplateRegistry } from './types'

// Template imports
import { cathedralDarkTemplate } from './cathedral-dark'
import { monasteryLightTemplate } from './monastery-light'

// All available templates
const templates: PageTemplate[] = [
  cathedralDarkTemplate,
  monasteryLightTemplate,
]

/**
 * Template Registry - provides access to all templates
 */
export const templateRegistry: TemplateRegistry = {
  templates,
  
  getById: (id: string) => {
    return templates.find(t => t.id === id)
  },
  
  getByCategory: (category: TemplateCategory) => {
    return templates.filter(t => t.category === category)
  },
  
  getByMode: (mode: TemplateMode) => {
    return templates.filter(t => t.mode === mode)
  },
  
  getAll: () => {
    return [...templates]
  },
}

// Re-export types
export type { PageTemplate, TemplateCategory, TemplateMode, TemplateRegistry } from './types'

// Export individual templates for direct access if needed
export {
  cathedralDarkTemplate,
  monasteryLightTemplate,
}
