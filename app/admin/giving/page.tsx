import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DollarSign, Heart, FolderKanban, Wallet } from 'lucide-react'

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
        <h1 className="font-display text-3xl text-stone-900 dark:text-neutral-100" style={{ letterSpacing: '-0.02em' }}>
          Giving
        </h1>
        <p className="text-stone-500 dark:text-neutral-400 mt-2 text-[15px] tracking-wide">
          Manage donations, funds, and projects
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-stone-900 dark:bg-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium text-stone-400 dark:text-neutral-400 tracking-wide">
              Total Donations
            </span>
            <DollarSign className="h-4 w-4 text-gold-400" />
          </div>
          <div className="text-3xl font-semibold text-white dark:text-neutral-100 tracking-tight">
            ${totalDonations.toLocaleString()}
          </div>
          <p className="text-[13px] text-stone-500 dark:text-neutral-500 mt-1 tracking-wide">
            {donations.length} donations
          </p>
        </div>
        <div className="bg-stone-900 dark:bg-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium text-stone-400 dark:text-neutral-400 tracking-wide">
              Active Projects
            </span>
            <FolderKanban className="h-4 w-4 text-gold-400" />
          </div>
          <div className="text-3xl font-semibold text-white dark:text-neutral-100 tracking-tight">
            {projects.length}
          </div>
          <p className="text-[13px] text-stone-500 dark:text-neutral-500 mt-1 tracking-wide">
            Projects
          </p>
        </div>
        <div className="bg-stone-900 dark:bg-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium text-stone-400 dark:text-neutral-400 tracking-wide">
              Community Needs
            </span>
            <Heart className="h-4 w-4 text-gold-400" />
          </div>
          <div className="text-3xl font-semibold text-white dark:text-neutral-100 tracking-tight">
            {needs.length}
          </div>
          <p className="text-[13px] text-stone-500 dark:text-neutral-500 mt-1 tracking-wide">
            Active needs
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="donations" className="space-y-4">
        <TabsList className="bg-stone-100 dark:bg-neutral-800 p-1 rounded-lg">
          <TabsTrigger value="donations" className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-700 data-[state=active]:shadow-sm rounded-md text-[13px] tracking-wide">
            <DollarSign className="h-4 w-4 mr-2" />
            Donations
          </TabsTrigger>
          <TabsTrigger value="funds" className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-700 data-[state=active]:shadow-sm rounded-md text-[13px] tracking-wide">
            <DollarSign className="h-4 w-4 mr-2" />
            Funds
          </TabsTrigger>
          <TabsTrigger value="projects" className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-700 data-[state=active]:shadow-sm rounded-md text-[13px] tracking-wide">
            <FolderKanban className="h-4 w-4 mr-2" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="needs" className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-700 data-[state=active]:shadow-sm rounded-md text-[13px] tracking-wide">
            <Heart className="h-4 w-4 mr-2" />
            Community Needs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="donations" className="space-y-4">
          {donations.length > 0 ? (
            <div className="space-y-2">
              {donations.map((donation) => (
                <Card key={donation.id}>
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-semibold text-[15px] text-stone-900 dark:text-neutral-100 tracking-tight">
                        ${Number(donation.amount).toLocaleString()}
                      </p>
                      <p className="text-[13px] text-stone-500 dark:text-neutral-400 tracking-wide">
                        {(donation.donation_funds as any)?.name || 'General'}
                      </p>
                    </div>
                    <p className="text-[13px] text-stone-400 dark:text-neutral-500 tracking-wide">
                      {new Date(donation.created_at || '').toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-stone-500 dark:text-neutral-400 text-[15px] tracking-wide">
                  No donations yet.
                </p>
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
                    <p className="text-[14px] text-stone-600 dark:text-neutral-300">{fund.description}</p>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-stone-500 dark:text-neutral-400 mt-3">
                      Type: {fund.fund_type}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-stone-500 dark:text-neutral-400 text-[15px] tracking-wide">
                  No donation funds yet.
                </p>
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
                      <p className="text-[14px] text-stone-600 dark:text-neutral-300 mb-4">{project.description}</p>
                    )}
                    {project.goal_amount && (
                      <div className="mt-4">
                        <div className="flex justify-between text-[13px] mb-2 tracking-wide">
                          <span className="text-stone-500 dark:text-neutral-400">Progress</span>
                          <span className="text-stone-700 dark:text-neutral-200 font-medium">
                            ${Number(project.current_amount || 0).toLocaleString()} / $
                            {Number(project.goal_amount).toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-stone-100 dark:bg-neutral-800 rounded-full h-2">
                          <div
                            className="bg-gold-500 h-2 rounded-full"
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
              <CardContent className="py-12 text-center">
                <p className="text-stone-500 dark:text-neutral-400 text-[15px] tracking-wide">
                  No projects yet.
                </p>
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
                      <p className="text-[14px] text-stone-600 dark:text-neutral-300 mb-4">{need.description}</p>
                    )}
                    {need.goal_amount && (
                      <div className="mt-4">
                        <div className="flex justify-between text-[13px] mb-2 tracking-wide">
                          <span className="text-stone-500 dark:text-neutral-400">Progress</span>
                          <span className="text-stone-700 dark:text-neutral-200 font-medium">
                            ${Number(need.current_amount || 0).toLocaleString()} / $
                            {Number(need.goal_amount).toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-stone-100 dark:bg-neutral-800 rounded-full h-2">
                          <div
                            className="bg-gold-500 h-2 rounded-full"
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
              <CardContent className="py-12 text-center">
                <p className="text-stone-500 dark:text-neutral-400 text-[15px] tracking-wide">
                  No community needs yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
