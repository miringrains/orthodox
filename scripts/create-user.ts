import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local
config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://trwhosectgaatgkojkiq.supabase.co'
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyd2hvc2VjdGdhYXRna29qa2lxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDA4Mjg4NiwiZXhwIjoyMDc5NjU4ODg2fQ.nFef0_gnvtGGui0Wgte9nNmXWZI05Z8bHVBNZm69-sY'

// Create admin client with service role (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
})

async function createUser() {
  const email = `admin${Date.now()}@testparish.com`
  const password = 'TestPassword123!'
  const firstName = 'Test'
  const lastName = 'Admin'

  try {
    // 1. Create auth user via Admin API
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
      },
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
    console.log(`✓ Auth user created: ${email} (ID: ${userId})`)

    // 2. Insert profile using raw SQL (bypasses PostgREST cache issues)
    const { error: profileError } = await supabaseAdmin.rpc('exec_sql', {
      query: `
        INSERT INTO public.users (id, email, first_name, last_name, is_platform_admin)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO UPDATE SET
          email = EXCLUDED.email,
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name
      `,
      params: [userId, email, firstName, lastName, false],
    })

    // If RPC doesn't work, try direct SQL via MCP or use a different approach
    if (profileError) {
      console.log('RPC failed, trying direct insert...')
      // Use a direct SQL query via the REST API with service role
      const { error: directError } = await supabaseAdmin
        .from('users')
        .insert({
          id: userId,
          email,
          first_name: firstName,
          last_name: lastName,
          is_platform_admin: false,
        })

      if (directError) {
        console.error('Error creating profile:', directError)
        console.log('\n⚠️  Profile creation failed, but auth user was created.')
        console.log('You can manually insert the profile via SQL:')
        console.log(`
INSERT INTO public.users (id, email, first_name, last_name, is_platform_admin)
VALUES ('${userId}', '${email}', '${firstName}', '${lastName}', false);
        `)
        return
      }
    }

    console.log(`✓ Profile created for ${email}`)

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
        .select('id')
        .single()

      if (parishError) {
        console.error('Error creating test parish:', parishError)
        return
      }
      parish = newParish
    }

    // 4. Create parish membership
    const { error: membershipError } = await supabaseAdmin
      .from('parish_users')
      .upsert({
        parish_id: parish.id,
        user_id: userId,
        role: 'admin',
      }, {
        onConflict: 'parish_id,user_id',
      })

    if (membershipError) {
      console.error('Error creating parish membership:', membershipError)
      return
    }

    console.log(`✓ Parish membership created`)

    console.log('\n✅ User created successfully!')
    console.log(`\n📧 Email: ${email}`)
    console.log(`🔑 Password: ${password}`)
    console.log(`\nYou can now log in at: /login`)
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

createUser()

