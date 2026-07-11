import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '../.env.local');
if (!fs.existsSync(envPath)) {
  console.error('.env.local file not found at', envPath);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const getEnvVar = (key) => {
  const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return match ? match[1].trim() : null;
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const serviceRoleKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Supabase URL or Service Role Key missing in .env.local!');
  process.exit(1);
}

async function runQuery(endpoint, method, body = null) {
  const url = `${supabaseUrl}/rest/v1/${endpoint}`;
  const headers = {
    'apikey': serviceRoleKey,
    'Authorization': `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'resolution=merge-duplicates'
  };
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  const response = await fetch(url, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request to ${endpoint} failed: ${response.status}\n${text}`);
  }
  return response.status === 204 ? null : await response.json();
}

async function main() {
  console.log('=== Cleaning up duplicate services ===\n');

  // 1. Delete duplicate unprefixed slugs (keep prefixed versions)
  const slugsToDelete = [
    'llm', 'chatbots', 'prompt-engineering', 'cv-nlp',
    'python-backend', 'full-stack', 'auth', 'saas',
    'content-strategy', 'paid-advertising', 'cro',
    'graphic-design', 'video-production',
  ];

  console.log('Deleting duplicate services (unprefixed slugs)...');
  for (const slug of slugsToDelete) {
    try {
      await runQuery(`services?slug=eq.${slug}`, 'DELETE');
      console.log(`  ✓ Deleted: ${slug}`);
    } catch (e) {
      console.error(`  ✗ ${slug}: ${e.message}`);
    }
  }

  // 2. Update digital-marketing/* services' category to 'marketing'
  console.log('\nUpdating digital-marketing/* services category → marketing...');
  try {
    await runQuery(
      `services?category=eq.digital-marketing`,
      'PATCH',
      { category: 'marketing' }
    );
    console.log('  ✓ Updated digital-marketing category → marketing');
  } catch (e) {
    console.error(`  ✗ ${e.message}`);
  }

  // 3. Update seo service category to 'marketing'
  console.log('\nUpdating seo service category → marketing...');
  try {
    await runQuery(
      `services?slug=eq.seo`,
      'PATCH',
      { category: 'marketing' }
    );
    console.log('  ✓ Updated seo category → marketing');
  } catch (e) {
    console.error(`  ✗ ${e.message}`);
  }

  // 4. Delete duplicate 'digital-marketing' entry from service_categories
  console.log('\nDeleting duplicate service_categories entry (digital-marketing)...');
  try {
    await runQuery(`service_categories?key=eq.digital-marketing`, 'DELETE');
    console.log('  ✓ Deleted digital-marketing category');
  } catch (e) {
    console.error(`  ✗ ${e.message}`);
  }

  // 5. Add accent_color to marketing category
  console.log('\nSetting accent_color for marketing category...');
  try {
    await runQuery(
      `service_categories?key=eq.marketing`,
      'PATCH',
      { accent_color: 'text-emerald-400' }
    );
    console.log('  ✓ Updated marketing accent_color');
  } catch (e) {
    console.error(`  ✗ ${e.message}`);
  }

  // Verify remaining services
  console.log('\n=== Remaining services ===');
  const remaining = await runQuery('services?select=slug,category,title&order=display_order', 'GET');
  for (const s of remaining) {
    console.log(`  ${s.slug.padEnd(35)} ${s.category.padEnd(18)} ${s.title}`);
  }
  console.log(`\nTotal: ${remaining.length} services`);
}

main().catch(e => { console.error(e); process.exit(1); });
