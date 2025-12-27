import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { getUserParishes } from '@/lib/parish-context'
import { NavigationBuilder } from '@/components/admin/NavigationBuilder'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Navigation } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function NavigationPage() {
  await requireAuth()
  
  const supabase = await createClient()
  const parishes = await getUserParishes()

  if (parishes.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl text-stone-900 dark:text-neutral-100" style={{ letterSpacing: '-0.02em' }}>
            Navigation
          </h1>
          <p className="text-stone-500 dark:text-neutral-400 mt-2 text-[15px] tracking-wide">
            Manage your site's navigation menu
          </p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
              <Navigation className="h-6 w-6 text-stone-400 dark:text-neutral-500" />
            </div>
            <p className="text-stone-500 dark:text-neutral-400 text-[15px] tracking-wide">
              No parishes found. Please create a parish first.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Fetch navigation data for each parish
  // Note: site_navigation column was added via migration but types may not be updated
  const parishesWithNav = await Promise.all(
    parishes.map(async (parish) => {
      const { data } = await supabase
        .from('parishes')
        .select('*')
        .eq('id', parish.id)
        .single()
      
      // Type assertion for the new column that may not be in generated types
      const siteNavigation = (data as any)?.site_navigation || { items: [] }
      
      return {
        ...parish,
        site_navigation: siteNavigation as { items: any[] }
      }
    })
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-stone-900 dark:text-neutral-100" style={{ letterSpacing: '-0.02em' }}>
          Navigation
        </h1>
        <p className="text-stone-500 dark:text-neutral-400 mt-2 text-[15px] tracking-wide">
          Manage your site's navigation menu structure
        </p>
      </div>

      {parishes.length === 1 ? (
        <NavigationBuilder 
          parishId={parishesWithNav[0].id} 
          initialNavigation={parishesWithNav[0].site_navigation}
        />
      ) : (
        <Tabs defaultValue={parishesWithNav[0].id}>
          <TabsList className="bg-stone-100 dark:bg-neutral-800 p-1 rounded-lg">
            {parishesWithNav.map(parish => (
              <TabsTrigger 
                key={parish.id} 
                value={parish.id}
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-700 data-[state=active]:shadow-sm rounded-md text-[13px] tracking-wide"
              >
                {parish.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {parishesWithNav.map(parish => (
            <TabsContent key={parish.id} value={parish.id}>
              <NavigationBuilder 
                parishId={parish.id} 
                initialNavigation={parish.site_navigation}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}

      <Card>
        <CardHeader>
          <CardTitle>How Navigation Works</CardTitle>
          <CardDescription>
            Understanding the navigation system
          </CardDescription>
        </CardHeader>
        <CardContent className="text-[14px] text-stone-600 dark:text-neutral-300 space-y-3">
          <p>
            <span className="font-medium text-stone-800 dark:text-neutral-100">Menu Items:</span> Add items that will appear in your site's top navigation bar.
          </p>
          <p>
            <span className="font-medium text-stone-800 dark:text-neutral-100">Linking Pages:</span> Connect each menu item to a page you've created, or use an external URL.
          </p>
          <p>
            <span className="font-medium text-stone-800 dark:text-neutral-100">Dropdowns:</span> Add sub-items to create dropdown menus (one level deep).
          </p>
          <p>
            <span className="font-medium text-stone-800 dark:text-neutral-100">Order:</span> Use the arrow buttons to reorder items. Changes are saved when you click "Save Navigation".
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
