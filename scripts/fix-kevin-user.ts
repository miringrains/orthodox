import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://trwhosectgaatgkojkiq.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyd2hvc2VjdGdhYXRna29qa2lxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDA4Mjg4NiwiZXhwIjoyMDc5NjU4ODg2fQ.nFef0_gnvtGGui0Wgte9nNmXWZI05Z8bHVBNZm69-sY'

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function fixUser() {
  const userId = '390baed8-93fc-490d-8d5b-a427d75fe186'
  const newPassword = 'OrthodoxAdmin2024!'

  // 1. Reset password
  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: newPassword
  })

  if (error) {
    console.error('Error resetting password:', error)
    return
  }

  console.log('✓ Password reset!')

  // 2. Verify profile exists in users table
  const { data: profile } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (profile) {
    console.log('✓ Profile exists:', profile.email)
  } else {
    console.log('Creating profile...')
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        email: 'kevin@breakthruweb.com',
        first_name: 'Kevin',
        last_name: 'Admin',
        is_platform_admin: true,
      })
    if (profileError) {
      console.error('Error creating profile:', profileError)
    } else {
      console.log('✓ Profile created')
    }
  }

  // 3. Verify parish_users membership
  const { data: membership } = await supabaseAdmin
    .from('parish_users')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (membership) {
    console.log('✓ Parish membership exists: role =', membership.role)
  } else {
    // Get Test Parish ID
    const { data: parish } = await supabaseAdmin
      .from('parishes')
      .select('id')
      .eq('slug', 'test-parish')
      .single()
    
    if (parish) {
      const { error: memberError } = await supabaseAdmin
        .from('parish_users')
        .insert({
          parish_id: parish.id,
          user_id: userId,
          role: 'admin',
        })
      if (memberError) {
        console.error('Error creating membership:', memberError)
      } else {
        console.log('✓ Parish membership created')
      }
    }
  }

  console.log('\n✅ User fixed!')
  console.log('\nCredentials:')
  console.log('Email: kevin@breakthruweb.com')
  console.log('Password:', newPassword)
  console.log('\nLogin at: /login')
}

fixUser()
