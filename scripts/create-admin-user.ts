import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://trwhosectgaatgkojkiq.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyd2hvc2VjdGdhYXRna29qa2lxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDA4Mjg4NiwiZXhwIjoyMDc5NjU4ODg2fQ.nFef0_gnvtGGui0Wgte9nNmXWZI05Z8bHVBNZm69-sY'

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function createAdminUser() {
  const email = 'admin@orthodox-parish.com'
  const password = 'OrthodoxAdmin2024!'
  const firstName = 'Parish'
  const lastName = 'Admin'
  const parishId = '0aa4c7f9-64c8-454a-9354-c30ad29dc3c8' // Test Parish

  try {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { first_name: firstName, last_name: lastName }
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      return
    }

    const userId = authData.user!.id
    console.log(`✓ Auth user created: ${email} (ID: ${userId})`)

    // 2. Create user profile
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .upsert({
        id: userId,
        email,
        first_name: firstName,
        last_name: lastName,
        is_platform_admin: false,
      }, { onConflict: 'id' })

    if (profileError) {
      console.error('Error creating profile:', profileError)
    } else {
      console.log('✓ Profile created')
    }

    // 3. Create parish membership (admin role)
    const { error: membershipError } = await supabaseAdmin
      .from('parish_users')
      .upsert({
        parish_id: parishId,
        user_id: userId,
        role: 'admin',
      }, { onConflict: 'parish_id,user_id' })

    if (membershipError) {
      console.error('Error creating membership:', membershipError)
    } else {
      console.log('✓ Parish membership created (admin role)')
    }

    console.log('\n✅ Admin user created successfully!')
    console.log('\nCredentials:')
    console.log('Email:', email)
    console.log('Password:', password)
    console.log('\nParish: Test Parish')
    console.log('Login at: /login')
    console.log('Admin Dashboard: /admin/dashboard')

  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

createAdminUser()
