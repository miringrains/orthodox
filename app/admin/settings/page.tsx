import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  await requireAuth()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Get user's parishes - use the same function as other pages
  const { data: parishUsers, error: parishUsersError } = await supabase
    .from('parish_users')
    .select('parish_id, role, parishes(*)')
    .eq('user_id', user.id)

  if (parishUsersError) {
    console.error('Error fetching parish_users in settings:', parishUsersError)
  }

  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-stone-900 dark:text-neutral-100" style={{ letterSpacing: '-0.02em' }}>
          Settings
        </h1>
        <p className="text-stone-500 dark:text-neutral-400 mt-2 text-base">
          Manage your account and parish settings
        </p>
      </div>

      {/* User Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Profile</CardTitle>
          <CardDescription className="text-sm">Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <label className="text-sm font-medium text-stone-700 dark:text-neutral-300">Email</label>
            <p className="text-base text-stone-600 dark:text-neutral-400 mt-1">{userProfile?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-stone-700 dark:text-neutral-300">Name</label>
            <p className="text-base text-stone-600 dark:text-neutral-400 mt-1">
              {userProfile?.first_name} {userProfile?.last_name}
            </p>
          </div>
          <Button variant="outline">Edit Profile</Button>
        </CardContent>
      </Card>

      {/* Parish Memberships */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Parishes</CardTitle>
          <CardDescription className="text-sm">Parishes you belong to</CardDescription>
        </CardHeader>
        <CardContent>
          {parishUsers && parishUsers.length > 0 ? (
            <div className="space-y-3">
              {parishUsers.map((pu) => {
                const parish = pu.parishes as any
                return (
                  <div
                    key={pu.parish_id}
                    className="flex items-center justify-between p-4 bg-stone-50 dark:bg-neutral-800/50 rounded-xl"
                  >
                    <div>
                      <p className="font-semibold text-lg text-stone-900 dark:text-neutral-100">
                        {parish?.name || 'Unknown Parish'}
                      </p>
                      <p className="text-sm text-stone-500 dark:text-neutral-400 mt-0.5">
                        Role: <span className="capitalize">{pu.role}</span>
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-base text-stone-500 dark:text-neutral-400">
              You are not a member of any parishes.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
