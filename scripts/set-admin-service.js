/**
 * Set a user as admin using service role key (bypasses RLS)
 * Run with: node scripts/set-admin-service.js EMAIL@example.com
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load .env.local file
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim()
      if (value && !value.startsWith('#')) {
        process.env[key] = value
      }
    }
  })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL in .env.local')
  process.exit(1)
}

if (!supabaseServiceKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY in .env.local')
  console.error('Please add SUPABASE_SERVICE_ROLE_KEY to your .env.local file')
  console.error('You can find this in your Supabase project settings under API keys')
  process.exit(1)
}

// Use service role key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setAdmin(email) {
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
    console.log('Checking auth.users table...')

    // Try to find user in auth schema
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
      console.error('Error listing auth users:', authError)
      return
    }

    const authUser = authUsers.users.find(u => u.email === email)

    if (authUser) {
      console.log('Found user in auth.users:', authUser.email)
      console.log('Creating profile in public.users table...')

      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: authUser.id,
          email: authUser.email,
          account_type: 'ADMIN',
          name: authUser.user_metadata?.name || authUser.email?.split('@')[0],
        })

      if (insertError) {
        console.error('Error creating user profile:', insertError)
        return
      }

      console.log(`✅ Successfully created admin profile for ${email}`)
      console.log(`User ID: ${authUser.id}`)
    } else {
      console.log('User not found in auth.users either.')
      console.log('Please make sure the user has signed up first.')
    }
    return
  }

  console.log('Found user:', user)
  console.log('Current account_type:', user.account_type)

  const { error: updateError } = await supabase
    .from('users')
    .update({ account_type: 'ADMIN' })
    .eq('id', user.id)

  if (updateError) {
    console.error('Error updating user:', updateError)
    return
  }

  console.log(`✅ Successfully set ${email} as ADMIN`)
  console.log(`User ID: ${user.id}`)
}

const email = process.argv[2]

if (!email) {
  console.error('Please provide an email address:')
  console.error('Usage: node scripts/set-admin-service.js EMAIL@example.com')
  process.exit(1)
}

setAdmin(email)
