import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://trwhosectgaatgkojkiq.supabase.co'
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyd2hvc2VjdGdhYXRna29qa2lxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDA4Mjg4NiwiZXhwIjoyMDc5NjU4ODg2fQ.nFef0_gnvtGGui0Wgte9nNmXWZI05Z8bHVBNZm69-sY'

// Create admin client with service role
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createTestUser() {
  const email = `test${Date.now()}@parishplatform.com`
  const password = 'TestPassword123!'
  const firstName = 'Test'
  const lastName = 'Admin'

  try {
    // 1. Create new auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
      }
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      return
    }

    if (!authData.user) {
      console.error('No user returned')
      return
    }

    const userId = authData.user.id

    // 2. Create user profile - try upsert first
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .upsert({
        id: userId,
        email,
        first_name: firstName,
        last_name: lastName,
        is_platform_admin: false,
      }, {
        onConflict: 'id'
      })

    if (profileError) {
      console.error('Error creating profile (trying insert):', profileError)
      // Try insert instead
      const { error: insertError } = await supabaseAdmin
        .from('users')
        .insert({
          id: userId,
          email,
          first_name: firstName,
          last_name: lastName,
          is_platform_admin: false,
        })
      
      if (insertError) {
        console.error('Error inserting profile:', insertError)
        return
      }
    }

    // 3. Get or create test parish
    let { data: parish } = await supabaseAdmin
      .from('parishes')
      .select('id')
      .eq('slug', 'test-parish')
      .single()

    if (!parish) {
      const { data: newParish, error: parishError } = await supabaseAdmin
        .from('parishes')
        .insert({
          name: 'Test Parish',
          slug: 'test-parish',
          is_active: true,
        })
        .select()
        .single()

      if (parishError) {
        console.error('Error creating parish:', parishError)
        return
      }
      if (newParish) {
        parish = newParish
      } else {
        console.error('Failed to create test parish')
        return
      }
    }

    // 4. Create parish membership (admin role)
    if (!parish) {
      console.error('No parish available')
      return
    }

    const { error: membershipError } = await supabaseAdmin
      .from('parish_users')
      .insert({
        parish_id: parish.id,
        user_id: userId,
        role: 'admin',
      })

    if (membershipError) {
      console.error('Error creating membership:', membershipError)
      return
    }

    console.log('\n✅ Test user created successfully!\n')
    console.log('Credentials:')
    console.log('Email:', email)
    console.log('Password:', password)
    console.log('\nParish:')
    console.log('Name: Test Parish')
    console.log('Slug: test-parish')
    console.log('URL: /p/test-parish')
    console.log('\nAdmin Dashboard: /admin/dashboard')
    console.log('\n')

  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

createTestUser()

