/**
 * Make a user an admin
 * Run with: npx ts-node --esm scripts/make-admin.ts EMAIL@example.com
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function makeAdmin(email: string) {
  console.log(`Looking for user with email: ${email}`)

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error) {
    console.error('Error finding user:', error)
    return
  }

  if (!user) {
    console.error('User not found!')
    return
  }

  console.log('Found user:', user)

  const { error: updateError } = await supabase
    .from('users')
    .update({ account_type: 'ADMIN' })
    .eq('id', user.id)

  if (updateError) {
    console.error('Error updating user:', updateError)
    return
  }

  console.log(`✅ Successfully promoted ${email} to ADMIN`)
  console.log(`User ID: ${user.id}`)
}

const email = process.argv[2]

if (!email) {
  console.error('Please provide an email address:')
  console.error('Usage: npx ts-node --esm scripts/make-admin.ts EMAIL@example.com')
  process.exit(1)
}

makeAdmin(email)
