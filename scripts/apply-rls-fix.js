/**
 * Apply RLS fix via Supabase Management API
 */

const fs = require('fs')
const path = require('path')
const https = require('https')

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

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

// Extract project ref from URL
const projectRef = supabaseUrl.match(/https:\/\/([^\.]+)\.supabase\.co/)?.[1]
const apiUrl = `https://${projectRef}.supabase.co/rest/v1/`

const sql = `
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can view all releases" ON releases;
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.account_type = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (is_admin());
CREATE POLICY "Admins can view all releases" ON releases
  FOR SELECT USING (is_admin());
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated, anon, service_role;
`

console.log('⚠️  Cannot execute SQL via REST API directly')
console.log('\n📝 Please follow these steps:')
console.log('\n1. Open this URL in your browser:')
console.log(`   https://supabase.com/dashboard/project/${projectRef}/sql/new`)
console.log('\n2. Copy and paste the following SQL:')
console.log('\n' + '='.repeat(70))
console.log(sql.trim())
console.log('\n' + '='.repeat(70))
console.log('\n3. Click "Run" to execute the SQL')
console.log('\nThis will fix the RLS policy infinite recursion issue.')
