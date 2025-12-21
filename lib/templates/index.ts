/**
 * Orthodox Parish Website Templates - Registry
 * 
 * Central registry for all page templates. Import templates from individual files
 * and expose them through a unified API.
 */

import type { PageTemplate, TemplateCategory, TemplateMode, TemplateRegistry } from './types'

// Template imports will be added as they are created
import { monasteryLightTemplate } from './monastery-light'
import { monasteryDarkTemplate } from './monastery-dark'
import { cathedralLightTemplate } from './cathedral-light'
import { cathedralDarkTemplate } from './cathedral-dark'
import { paschaLightTemplate } from './pascha-light'
import { paschaDarkTemplate } from './pascha-dark'
import { byzantineLightTemplate } from './byzantine-light'
import { byzantineDarkTemplate } from './byzantine-dark'

// All available templates
const templates: PageTemplate[] = [
  monasteryLightTemplate,
  monasteryDarkTemplate,
  cathedralLightTemplate,
  cathedralDarkTemplate,
  paschaLightTemplate,
  paschaDarkTemplate,
  byzantineLightTemplate,
  byzantineDarkTemplate,
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
  monasteryLightTemplate,
  monasteryDarkTemplate,
  cathedralLightTemplate,
  cathedralDarkTemplate,
  paschaLightTemplate,
  paschaDarkTemplate,
  byzantineLightTemplate,
  byzantineDarkTemplate,
}


