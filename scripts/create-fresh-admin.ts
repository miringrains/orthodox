import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://trwhosectgaatgkojkiq.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyd2hvc2VjdGdhYXRna29qa2lxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDA4Mjg4NiwiZXhwIjoyMDc5NjU4ODg2fQ.nFef0_gnvtGGui0Wgte9nNmXWZI05Z8bHVBNZm69-sY'

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function createFreshAdmin() {
  const email = `kevin${Date.now()}@test.com`
  const password = 'OrthodoxAdmin2024!'

  try {
    // 1. Create auth user
    console.log('Creating auth user...')
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { first_name: 'Kevin', last_name: 'Admin' }
    })

    if (authError) {
      console.error('Auth error:', authError)
      return
    }

    const userId = authData.user!.id
    console.log('✓ Auth user created:', userId)

    // 2. Wait a moment for DB to sync
    await new Promise(r => setTimeout(r, 1000))

    // 3. Create profile in users table
    console.log('Creating profile...')
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        email,
        first_name: 'Kevin',
        last_name: 'Admin',
        is_platform_admin: true,
      })

    if (profileError) {
      console.error('Profile error:', profileError)
      // Try via RPC or raw SQL
    } else {
      console.log('✓ Profile created')
    }

    // 4. Get Test Parish
    const { data: parish } = await supabaseAdmin
      .from('parishes')
      .select('id, name, slug')
      .eq('slug', 'test-parish')
      .single()

    if (!parish) {
      console.error('Test Parish not found!')
      return
    }

    console.log('Parish found:', parish.name)

    // 5. Create parish membership
    console.log('Creating parish membership...')
    const { error: memberError } = await supabaseAdmin
      .from('parish_users')
      .insert({
        parish_id: parish.id,
        user_id: userId,
        role: 'admin',
      })

    if (memberError) {
      console.error('Membership error:', memberError)
    } else {
      console.log('✓ Parish membership created')
    }

    console.log('\n✅ Admin user created!')
    console.log('\nCredentials:')
    console.log('Email:', email)
    console.log('Password:', password)
    console.log('\nParish:', parish.name)
    console.log('Parish Slug:', parish.slug)
    console.log('\nLogin at: /login')
    console.log('Admin: /admin/dashboard')
    console.log('Public: /p/' + parish.slug)

  } catch (error) {
    console.error('Error:', error)
  }
}

createFreshAdmin()
