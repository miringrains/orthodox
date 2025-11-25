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

  // Get user's parishes
  const { data: parishUsers } = await supabase
    .from('parish_users')
    .select('parish_id, role, parishes(*)')
    .eq('user_id', user.id)

  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account and parish settings</p>
      </div>

      {/* User Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <p className="text-sm text-muted-foreground">{userProfile?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Name</label>
            <p className="text-sm text-muted-foreground">
              {userProfile?.first_name} {userProfile?.last_name}
            </p>
          </div>
          <Button variant="outline">Edit Profile</Button>
        </CardContent>
      </Card>

      {/* Parish Memberships */}
      <Card>
        <CardHeader>
          <CardTitle>Parishes</CardTitle>
          <CardDescription>Parishes you belong to</CardDescription>
        </CardHeader>
        <CardContent>
          {parishUsers && parishUsers.length > 0 ? (
            <div className="space-y-2">
              {parishUsers.map((pu) => {
                const parish = pu.parishes as any
                return (
                  <div
                    key={pu.parish_id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">{parish?.name || 'Unknown Parish'}</p>
                      <p className="text-sm text-muted-foreground">Role: {pu.role}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">You are not a member of any parishes.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

