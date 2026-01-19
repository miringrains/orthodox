import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DollarSign, Heart, FolderKanban, CreditCard, ArrowRight, ExternalLink, Link2, Calendar, TrendingUp, Download } from 'lucide-react'
import Link from 'next/link'

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
      .limit(20),
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
  
  // Group donations by month for chart data (simplified)
  const thisMonthDonations = donations.filter(d => {
    const date = new Date(d.created_at || '')
    const now = new Date()
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  })
  const thisMonthTotal = thisMonthDonations.reduce((sum, d) => sum + Number(d.amount), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-stone-900 dark:text-neutral-100" style={{ letterSpacing: '-0.02em' }}>
            Giving
          </h1>
          <p className="text-stone-500 dark:text-neutral-400 mt-2 text-[15px] tracking-wide">
            Manage donations, funds, and projects
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/giving/export">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/settings">
              <CreditCard className="h-4 w-4 mr-2" />
              Payment Settings
            </Link>
          </Button>
        </div>
      </div>

      {/* Connect Payment Platform Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Link2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Connect a Payment Platform</h2>
              <p className="text-indigo-100 text-sm mt-1">
                Accept online donations with Stripe or Tithe.ly
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="bg-white text-indigo-600 hover:bg-indigo-50">
              Connect Stripe
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ExternalLink className="h-4 w-4 mr-2" />
              Tithe.ly
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium text-stone-500 dark:text-neutral-400 tracking-wide">
              This Month
            </span>
            <Calendar className="h-4 w-4 text-stone-400" />
          </div>
          <div className="text-2xl font-bold text-stone-900 dark:text-neutral-100 tracking-tight">
            ${thisMonthTotal.toLocaleString()}
          </div>
          <p className="text-[12px] text-stone-500 dark:text-neutral-500 mt-1">
            {thisMonthDonations.length} donations
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium text-stone-500 dark:text-neutral-400 tracking-wide">
              All Time Total
            </span>
            <TrendingUp className="h-4 w-4 text-stone-400" />
          </div>
          <div className="text-2xl font-bold text-stone-900 dark:text-neutral-100 tracking-tight">
            ${totalDonations.toLocaleString()}
          </div>
          <p className="text-[12px] text-stone-500 dark:text-neutral-500 mt-1">
            {donations.length} donations
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium text-stone-500 dark:text-neutral-400 tracking-wide">
              Active Funds
            </span>
            <DollarSign className="h-4 w-4 text-stone-400" />
          </div>
          <div className="text-2xl font-bold text-stone-900 dark:text-neutral-100 tracking-tight">
            {funds.length}
          </div>
          <p className="text-[12px] text-stone-500 dark:text-neutral-500 mt-1">
            Donation funds
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium text-stone-500 dark:text-neutral-400 tracking-wide">
              Active Projects
            </span>
            <FolderKanban className="h-4 w-4 text-stone-400" />
          </div>
          <div className="text-2xl font-bold text-stone-900 dark:text-neutral-100 tracking-tight">
            {projects.length}
          </div>
          <p className="text-[12px] text-stone-500 dark:text-neutral-500 mt-1">
            Fundraising projects
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">
            Recent Donations
          </TabsTrigger>
          <TabsTrigger value="funds">
            Funds
          </TabsTrigger>
          <TabsTrigger value="projects">
            Projects
          </TabsTrigger>
          <TabsTrigger value="needs">
            Community Needs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recent">
          {donations.length > 0 ? (
            <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 rounded-xl overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 px-4 py-3 bg-stone-50 dark:bg-neutral-800 border-b border-stone-200 dark:border-neutral-700 text-[11px] font-medium text-stone-500 dark:text-neutral-400 uppercase tracking-wider">
                <div>Date</div>
                <div>Amount</div>
                <div>Fund</div>
                <div>Status</div>
              </div>
              {/* Rows */}
              <div className="divide-y divide-stone-100 dark:divide-neutral-800">
                {donations.map((donation) => (
                  <div key={donation.id} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 px-4 py-3 items-center">
                    <div className="text-[13px] text-stone-600 dark:text-neutral-300">
                      {new Date(donation.created_at || '').toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="text-[15px] font-semibold text-stone-900 dark:text-neutral-100">
                      ${Number(donation.amount).toLocaleString()}
                    </div>
                    <div className="text-[13px] text-stone-500 dark:text-neutral-400">
                      {(donation.donation_funds as any)?.name || 'General'}
                    </div>
                    <div>
                      <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${
                        donation.status === 'completed'
                          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                          : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                      }`}>
                        {donation.status || 'pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-6 w-6 text-stone-400 dark:text-neutral-500" />
                </div>
                <p className="text-stone-500 dark:text-neutral-400 text-[15px] tracking-wide">
                  No donations yet. Connect a payment platform to start receiving donations.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="funds">
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

        <TabsContent value="projects">
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

        <TabsContent value="needs">
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
