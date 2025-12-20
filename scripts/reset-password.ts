import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://trwhosectgaatgkojkiq.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyd2hvc2VjdGdhYXRna29qa2lxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDA4Mjg4NiwiZXhwIjoyMDc5NjU4ODg2fQ.nFef0_gnvtGGui0Wgte9nNmXWZI05Z8bHVBNZm69-sY'

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function resetPassword() {
  const userId = '390baed8-93fc-490d-8d5b-a427d75fe186'
  const newPassword = 'OrthodoxParish2024!'

  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: newPassword
  })

  if (error) {
    console.error('Error resetting password:', error)
    return
  }

  console.log('\n✅ Password reset successfully!')
  console.log('\nCredentials:')
  console.log('Email: kevin@breakthruweb.com')
  console.log('Password: OrthodoxParish2024!')
  console.log('\nLogin at: /login')
}

resetPassword()
