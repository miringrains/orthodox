'use client'

import React, { useState } from 'react'
import { templateRegistry, type PageTemplate, type TemplateMode } from '@/lib/templates'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Sun, Moon, Sparkles, Church, Building2, FileX } from 'lucide-react'

interface TemplatePickerProps {
  open: boolean
  onClose: () => void
  onSelectTemplate: (template: PageTemplate | null) => void
  title?: string
  description?: string
  showBlankOption?: boolean
}

export function TemplatePicker({
  open,
  onClose,
  onSelectTemplate,
  title = 'Choose a Template',
  description = 'Select a starting point for your page design. Templates can be fully customized after selection.',
  showBlankOption = true,
}: TemplatePickerProps) {
  const [selectedMode, setSelectedMode] = useState<TemplateMode | 'all'>('all')
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate | null>(null)
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null)

  const templates = templateRegistry.getAll()
  
  const filteredTemplates = selectedMode === 'all' 
    ? templates 
    : templates.filter(t => t.mode === selectedMode)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'monastery':
        return <Church className="h-4 w-4" />
      case 'cathedral':
        return <Building2 className="h-4 w-4" />
      case 'pascha':
        return <Sparkles className="h-4 w-4" />
      default:
        return null
    }
  }

  const handleSelect = () => {
    onSelectTemplate(selectedTemplate)
    onClose()
  }

  const handleBlankSelect = () => {
    onSelectTemplate(null)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {/* Mode Filter */}
        <div className="flex items-center gap-2 border-b pb-4">
          <span className="text-sm font-medium text-muted-foreground mr-2">Theme:</span>
          <Button
            variant={selectedMode === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedMode('all')}
          >
            All
          </Button>
          <Button
            variant={selectedMode === 'light' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedMode('light')}
          >
            <Sun className="h-4 w-4 mr-1" />
            Light
          </Button>
          <Button
            variant={selectedMode === 'dark' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedMode('dark')}
          >
            <Moon className="h-4 w-4 mr-1" />
            Dark
          </Button>
        </div>

        {/* Template Grid */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Blank Option */}
            {showBlankOption && (
              <button
                onClick={handleBlankSelect}
                className="group relative aspect-[4/3] rounded-lg border-2 border-dashed border-gray-300 hover:border-primary transition-all flex flex-col items-center justify-center gap-3 bg-gray-50 hover:bg-gray-100"
              >
                <FileX className="h-10 w-10 text-gray-400 group-hover:text-primary transition-colors" />
                <div className="text-center">
                  <p className="font-medium text-gray-700 group-hover:text-primary transition-colors">
                    Start from Scratch
                  </p>
                  <p className="text-xs text-gray-500">Build your own design</p>
                </div>
              </button>
            )}

            {/* Template Cards */}
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                onMouseEnter={() => setHoveredTemplate(template.id)}
                onMouseLeave={() => setHoveredTemplate(null)}
                className={`
                  group relative aspect-[4/3] rounded-lg border-2 transition-all overflow-hidden
                  ${selectedTemplate?.id === template.id 
                    ? 'border-primary ring-2 ring-primary ring-offset-2' 
                    : 'border-gray-200 hover:border-primary/50'}
                `}
              >
                {/* Template Preview Background */}
                <div 
                  className="absolute inset-0"
                  style={{ backgroundColor: template.colors.background }}
                >
                  {/* Simulated content preview */}
                  <div className="absolute inset-0 p-3 flex flex-col">
                    {/* Simulated navbar */}
                    <div 
                      className="h-6 rounded-sm mb-2 flex items-center px-2"
                      style={{ backgroundColor: template.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
                    >
                      <div 
                        className="h-2 w-12 rounded-full"
                        style={{ backgroundColor: template.colors.text }}
                      />
                    </div>
                    
                    {/* Simulated hero */}
                    <div 
                      className="flex-1 rounded-sm mb-2 flex items-center justify-center"
                      style={{ backgroundColor: template.colors.secondary || template.colors.primary, opacity: 0.3 }}
                    >
                      <div 
                        className="h-3 w-20 rounded-full"
                        style={{ backgroundColor: template.colors.text, opacity: 0.5 }}
                      />
                    </div>
                    
                    {/* Simulated sections */}
                    <div className="flex gap-1">
                      <div 
                        className="flex-1 h-8 rounded-sm"
                        style={{ backgroundColor: template.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
                      />
                      <div 
                        className="flex-1 h-8 rounded-sm"
                        style={{ backgroundColor: template.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
                      />
                    </div>
                  </div>

                  {/* Gold accent bar */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{ backgroundColor: template.colors.primary }}
                  />
                </div>

                {/* Hover overlay with info */}
                <div className={`
                  absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-3 transition-opacity
                  ${hoveredTemplate === template.id || selectedTemplate?.id === template.id ? 'opacity-100' : 'opacity-0'}
                `}>
                  <div className="flex items-center gap-2 text-white mb-1">
                    {getCategoryIcon(template.category)}
                    <span className="font-semibold">{template.name}</span>
                    {template.mode === 'dark' ? (
                      <Moon className="h-3 w-3 text-gray-300" />
                    ) : (
                      <Sun className="h-3 w-3 text-yellow-300" />
                    )}
                  </div>
                  <p className="text-xs text-gray-300 text-center line-clamp-2">
                    {template.description}
                  </p>
                  
                  {/* Color palette preview */}
                  <div className="flex gap-1 mt-3">
                    <div 
                      className="w-4 h-4 rounded-full border border-white/30" 
                      style={{ backgroundColor: template.colors.primary }}
                      title="Primary"
                    />
                    {template.colors.secondary && (
                      <div 
                        className="w-4 h-4 rounded-full border border-white/30" 
                        style={{ backgroundColor: template.colors.secondary }}
                        title="Secondary"
                      />
                    )}
                    <div 
                      className="w-4 h-4 rounded-full border border-white/30" 
                      style={{ backgroundColor: template.colors.accent }}
                      title="Accent"
                    />
                  </div>

                  {/* Typography preview */}
                  <p className="text-[10px] text-gray-400 mt-2">
                    {template.fonts.heading} + {template.fonts.body}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSelect} 
            disabled={!selectedTemplate}
          >
            Use Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

