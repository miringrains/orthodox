import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { getUserParishes } from '@/lib/parish-context'
import { NavigationBuilder } from '@/components/admin/NavigationBuilder'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const dynamic = 'force-dynamic'

export default async function NavigationPage() {
  await requireAuth()
  
  const supabase = await createClient()
  const parishes = await getUserParishes()

  if (parishes.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Navigation</h1>
          <p className="text-muted-foreground mt-2">Manage your site's navigation menu</p>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No parishes found. Please create a parish first.
          </CardContent>
        </Card>
      </div>
    )
  }

  // Fetch navigation data for each parish
  const parishesWithNav = await Promise.all(
    parishes.map(async (parish) => {
      const { data } = await supabase
        .from('parishes')
        .select('site_navigation')
        .eq('id', parish.id)
        .single()
      
      return {
        ...parish,
        site_navigation: data?.site_navigation || { items: [] }
      }
    })
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Navigation</h1>
        <p className="text-muted-foreground mt-2">
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
          <TabsList>
            {parishesWithNav.map(parish => (
              <TabsTrigger key={parish.id} value={parish.id}>
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
          <CardTitle className="text-lg">How Navigation Works</CardTitle>
          <CardDescription>
            Understanding the navigation system
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            <strong>Menu Items:</strong> Add items that will appear in your site's top navigation bar.
          </p>
          <p>
            <strong>Linking Pages:</strong> Connect each menu item to a page you've created, or use an external URL.
          </p>
          <p>
            <strong>Dropdowns:</strong> Add sub-items to create dropdown menus (one level deep).
          </p>
          <p>
            <strong>Order:</strong> Use the arrow buttons to reorder items. Changes are saved when you click "Save Navigation".
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

