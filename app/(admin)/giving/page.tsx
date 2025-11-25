import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DollarSign, Heart, FolderKanban } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function GivingPage() {
  await requireAuth()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Get user's parishes
  const { data: parishUsers } = await supabase
    .from('parish_users')
    .select('parish_id')
    .eq('user_id', user.id)

  const parishIds = parishUsers?.map((pu) => pu.parish_id) || []

  const [fundsRes, donationsRes, projectsRes, needsRes] = await Promise.all([
    supabase
      .from('donation_funds')
      .select('*')
      .in('parish_id', parishIds),
    supabase
      .from('donations')
      .select('*, donation_funds(name)')
      .in('parish_id', parishIds)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('projects')
      .select('*')
      .in('parish_id', parishIds)
      .order('created_at', { ascending: false }),
    supabase
      .from('community_needs')
      .select('*')
      .in('parish_id', parishIds)
      .order('created_at', { ascending: false }),
  ])

  const funds = fundsRes.data || []
  const donations = donationsRes.data || []
  const projects = projectsRes.data || []
  const needs = needsRes.data || []

  const totalDonations = donations.reduce((sum, d) => sum + Number(d.amount), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Giving</h1>
        <p className="text-muted-foreground mt-2">Manage donations, funds, and projects</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDonations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{donations.length} donations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">Projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Community Needs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{needs.length}</div>
            <p className="text-xs text-muted-foreground">Active needs</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="donations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="donations">
            <DollarSign className="h-4 w-4 mr-2" />
            Donations
          </TabsTrigger>
          <TabsTrigger value="funds">
            <DollarSign className="h-4 w-4 mr-2" />
            Funds
          </TabsTrigger>
          <TabsTrigger value="projects">
            <FolderKanban className="h-4 w-4 mr-2" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="needs">
            <Heart className="h-4 w-4 mr-2" />
            Community Needs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="donations" className="space-y-4">
          {donations.length > 0 ? (
            <div className="space-y-2">
              {donations.map((donation) => (
                <Card key={donation.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">${Number(donation.amount).toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          {(donation.donation_funds as any)?.name || 'General'}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(donation.created_at || '').toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No donations yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="funds" className="space-y-4">
          {funds.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {funds.map((fund) => (
                <Card key={fund.id}>
                  <CardHeader>
                    <CardTitle>{fund.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{fund.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">Type: {fund.fund_type}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No donation funds yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          {projects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {project.description && (
                      <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                    )}
                    {project.goal_amount && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>
                            ${Number(project.current_amount || 0).toLocaleString()} / $
                            {Number(project.goal_amount).toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${Math.min(
                                ((Number(project.current_amount || 0) / Number(project.goal_amount)) *
                                  100),
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No projects yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="needs" className="space-y-4">
          {needs.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {needs.map((need) => (
                <Card key={need.id}>
                  <CardHeader>
                    <CardTitle>{need.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {need.description && (
                      <p className="text-sm text-muted-foreground mb-2">{need.description}</p>
                    )}
                    {need.goal_amount && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>
                            ${Number(need.current_amount || 0).toLocaleString()} / $
                            {Number(need.goal_amount).toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${Math.min(
                                ((Number(need.current_amount || 0) / Number(need.goal_amount)) * 100),
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No community needs yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

