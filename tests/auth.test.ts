import { supabase } from '@/lib/supabase'

const TEST_USER = {
  email: 'test@example.com',
  password: 'test123456'
}

async function testAuthFlow() {
  console.log('Testing sign in...')
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: TEST_USER.email,
    password: TEST_USER.password
  })

  if (error) {
    console.error('Sign in failed:', error.message)
    return
  }

  console.log('Sign in successful:', data.user?.email)

  // Test session
  const { data: { session } } = await supabase.auth.getSession()
  console.log('Session active:', !!session)

  // Test sign out
  const { error: signOutError } = await supabase.auth.signOut()
  if (signOutError) {
    console.error('Sign out failed:', signOutError.message)
    return
  }

  console.log('Sign out successful')
}

testAuthFlow() 