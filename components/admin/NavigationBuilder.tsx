'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  GripVertical, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  ExternalLink,
  FileText,
  Save,
  Loader2
} from 'lucide-react'

interface NavigationItem {
  id: string
  label: string
  pageId?: string
  url?: string
  order: number
  children?: NavigationItem[]
}

interface NavigationData {
  items: NavigationItem[]
}

interface Page {
  id: string
  title: { en?: string } | string
  slug: string
  kind: string
}

interface NavigationBuilderProps {
  parishId: string
  initialNavigation?: NavigationData
}

function generateId() {
  return `nav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function getPageTitle(page: Page): string {
  if (typeof page.title === 'string') return page.title
  return page.title?.en || page.slug || 'Untitled'
}

export function NavigationBuilder({ parishId, initialNavigation }: NavigationBuilderProps) {
  const supabase = createClient()
  const [items, setItems] = useState<NavigationItem[]>(initialNavigation?.items || [])
  const [pages, setPages] = useState<Page[]>([])
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [editingItem, setEditingItem] = useState<string | null>(null)

  // Fetch pages for this parish
  useEffect(() => {
    async function fetchPages() {
      const { data } = await supabase
        .from('pages')
        .select('id, title, slug, kind')
        .eq('parish_id', parishId)
        .order('kind')
      
      if (data) {
        setPages(data)
      }
    }
    fetchPages()
  }, [parishId, supabase])

  const handleSave = async () => {
    setSaving(true)
    setSaveStatus('idle')
    
    try {
      const { error } = await supabase
        .from('parishes')
        .update({ 
          site_navigation: { items },
          updated_at: new Date().toISOString()
        })
        .eq('id', parishId)
      
      if (error) throw error
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      console.error('Error saving navigation:', error)
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const addItem = (parentId?: string) => {
    const newItem: NavigationItem = {
      id: generateId(),
      label: 'New Item',
      order: parentId 
        ? (items.find(i => i.id === parentId)?.children?.length || 0)
        : items.length,
    }

    if (parentId) {
      setItems(items.map(item => {
        if (item.id === parentId) {
          return {
            ...item,
            children: [...(item.children || []), newItem]
          }
        }
        return item
      }))
      setExpandedItems(prev => new Set([...prev, parentId]))
    } else {
      setItems([...items, newItem])
    }
    setEditingItem(newItem.id)
  }

  const updateItem = (id: string, updates: Partial<NavigationItem>, parentId?: string) => {
    if (parentId) {
      setItems(items.map(item => {
        if (item.id === parentId) {
          return {
            ...item,
            children: item.children?.map(child => 
              child.id === id ? { ...child, ...updates } : child
            )
          }
        }
        return item
      }))
    } else {
      setItems(items.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ))
    }
  }

  const deleteItem = (id: string, parentId?: string) => {
    if (parentId) {
      setItems(items.map(item => {
        if (item.id === parentId) {
          return {
            ...item,
            children: item.children?.filter(child => child.id !== id)
          }
        }
        return item
      }))
    } else {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const moveItem = (id: string, direction: 'up' | 'down', parentId?: string) => {
    const moveInArray = (arr: NavigationItem[]) => {
      const index = arr.findIndex(item => item.id === id)
      if (index === -1) return arr
      if (direction === 'up' && index === 0) return arr
      if (direction === 'down' && index === arr.length - 1) return arr
      
      const newArr = [...arr]
      const swapIndex = direction === 'up' ? index - 1 : index + 1
      ;[newArr[index], newArr[swapIndex]] = [newArr[swapIndex], newArr[index]]
      return newArr.map((item, i) => ({ ...item, order: i }))
    }

    if (parentId) {
      setItems(items.map(item => {
        if (item.id === parentId && item.children) {
          return { ...item, children: moveInArray(item.children) }
        }
        return item
      }))
    } else {
      setItems(moveInArray(items))
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const renderItem = (item: NavigationItem, parentId?: string, index?: number, total?: number) => {
    const isExpanded = expandedItems.has(item.id)
    const hasChildren = item.children && item.children.length > 0
    const isEditing = editingItem === item.id
    const linkedPage = pages.find(p => p.id === item.pageId)

    return (
      <div key={item.id} className="border rounded-lg bg-white mb-2">
        <div className="flex items-center gap-2 p-3">
          <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
          
          {!parentId && (
            <button
              onClick={() => toggleExpand(item.id)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
          
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <Input
                value={item.label}
                onChange={(e) => updateItem(item.id, { label: e.target.value }, parentId)}
                onBlur={() => setEditingItem(null)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingItem(null)}
                autoFocus
                className="h-8"
              />
            ) : (
              <button
                onClick={() => setEditingItem(item.id)}
                className="text-left font-medium hover:text-primary truncate block w-full"
              >
                {item.label}
              </button>
            )}
          </div>

          <div className="flex items-center gap-1">
            {linkedPage ? (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {getPageTitle(linkedPage)}
              </span>
            ) : item.url ? (
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />
                External
              </span>
            ) : null}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => moveItem(item.id, 'up', parentId)}
              disabled={index === 0}
              className="h-7 w-7 p-0"
            >
              ↑
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => moveItem(item.id, 'down', parentId)}
              disabled={index === (total || 0) - 1}
              className="h-7 w-7 p-0"
            >
              ↓
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteItem(item.id, parentId)}
              className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Item Settings (expanded) */}
        {isExpanded && !parentId && (
          <div className="border-t px-3 py-3 bg-gray-50 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Link to Page</Label>
                <Select
                  value={item.pageId || '_none'}
                  onValueChange={(value) => updateItem(item.id, { 
                    pageId: value === '_none' ? undefined : value,
                    url: value === '_none' ? item.url : undefined
                  })}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Select page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">No page linked</SelectItem>
                    {pages.map(page => (
                      <SelectItem key={page.id} value={page.id}>
                        {getPageTitle(page)} ({page.kind})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Or External URL</Label>
                <Input
                  value={item.url || ''}
                  onChange={(e) => updateItem(item.id, { 
                    url: e.target.value,
                    pageId: e.target.value ? undefined : item.pageId
                  })}
                  placeholder="https://..."
                  className="h-8 text-sm"
                  disabled={!!item.pageId}
                />
              </div>
            </div>

            {/* Children */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs">Dropdown Items</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addItem(item.id)}
                  className="h-6 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Sub-item
                </Button>
              </div>
              {hasChildren && (
                <div className="pl-4 border-l-2 border-gray-200">
                  {item.children?.map((child, i) => renderItem(child, item.id, i, item.children?.length))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Site Navigation</CardTitle>
        <div className="flex items-center gap-2">
          {saveStatus === 'success' && (
            <span className="text-sm text-green-600">Saved!</span>
          )}
          {saveStatus === 'error' && (
            <span className="text-sm text-red-600">Error saving</span>
          )}
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Navigation
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Build your site's navigation menu. Click on items to edit, drag to reorder.
        </p>

        <div className="space-y-2 mb-4">
          {items.map((item, i) => renderItem(item, undefined, i, items.length))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <p className="mb-2">No navigation items yet</p>
            <Button variant="outline" onClick={() => addItem()}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Item
            </Button>
          </div>
        )}

        {items.length > 0 && (
          <Button variant="outline" onClick={() => addItem()} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Menu Item
          </Button>
        )}

        {/* Preview */}
        <div className="mt-6 pt-6 border-t">
          <Label className="text-xs text-muted-foreground mb-2 block">Preview</Label>
          <div className="bg-gray-900 text-white rounded-lg p-4">
            <nav className="flex items-center gap-6">
              {items.map(item => (
                <div key={item.id} className="relative group">
                  <span className="text-sm hover:text-gray-300 cursor-pointer">
                    {item.label}
                    {item.children && item.children.length > 0 && ' ▾'}
                  </span>
                  {item.children && item.children.length > 0 && (
                    <div className="absolute top-full left-0 mt-1 bg-gray-800 rounded shadow-lg py-1 min-w-[150px] hidden group-hover:block">
                      {item.children.map(child => (
                        <div key={child.id} className="px-3 py-1.5 text-sm hover:bg-gray-700">
                          {child.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

