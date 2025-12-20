import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://trwhosectgaatgkojkiq.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyd2hvc2VjdGdhYXRna29qa2lxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDA4Mjg4NiwiZXhwIjoyMDc5NjU4ODg2fQ.nFef0_gnvtGGui0Wgte9nNmXWZI05Z8bHVBNZm69-sY'

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function createTestAdmin() {
  const email = 'admin@orthodox.test'
  const password = 'Orthodox2024!'

  try {
    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email === email)
    
    let userId: string

    if (existingUser) {
      console.log('User already exists, resetting password...')
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.id,
        { password }
      )
      if (updateError) throw updateError
      userId = existingUser.id
      console.log('✓ Password reset')
    } else {
      console.log('Creating new auth user...')
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { first_name: 'Test', last_name: 'Admin' }
      })
      if (authError) throw authError
      userId = authData.user!.id
      console.log('✓ Auth user created:', userId)
    }

    // Check if profile exists
    const { data: existingProfile } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', userId)
      .single()

    if (!existingProfile) {
      console.log('Creating profile...')
      const { error: profileError } = await supabaseAdmin
        .from('users')
        .insert({
          id: userId,
          email,
          first_name: 'Test',
          last_name: 'Admin',
          is_platform_admin: true,
        })
      if (profileError && !profileError.message.includes('duplicate')) {
        console.error('Profile error:', profileError)
      } else {
        console.log('✓ Profile created')
      }
    }

    // Get Test Parish
    const { data: parish } = await supabaseAdmin
      .from('parishes')
      .select('id, name, slug')
      .eq('slug', 'test-parish')
      .single()

    if (!parish) {
      console.error('Test Parish not found!')
      return
    }

    // Check if membership exists
    const { data: existingMembership } = await supabaseAdmin
      .from('parish_users')
      .select('id')
      .eq('user_id', userId)
      .eq('parish_id', parish.id)
      .single()

    if (!existingMembership) {
      console.log('Creating parish membership...')
      const { error: memberError } = await supabaseAdmin
        .from('parish_users')
        .insert({
          parish_id: parish.id,
          user_id: userId,
          role: 'admin',
        })
      if (memberError && !memberError.message.includes('duplicate')) {
        console.error('Membership error:', memberError)
      } else {
        console.log('✓ Parish membership created')
      }
    }

    console.log('\n✅ Test admin ready!')
    console.log('\nCredentials:')
    console.log('Email:', email)
    console.log('Password:', password)
    console.log('\nParish:', parish.name)
    console.log('Parish Slug:', parish.slug)
    console.log('\nLogin at: http://localhost:3000/login')
    console.log('Builder: http://localhost:3000/admin/pages')
    console.log('Public: http://localhost:3000/p/' + parish.slug)

  } catch (error) {
    console.error('Error:', error)
  }
}

createTestAdmin()
