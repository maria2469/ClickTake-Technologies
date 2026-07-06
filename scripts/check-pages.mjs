import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read from env
let envContent = '';
try {
  envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
} catch (e) {
  try {
    envContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
  } catch (err) {
    console.error('No .env or .env.local file found');
    process.exit(1);
  }
}

const get = (k) => {
  const m = envContent.match(new RegExp(`^${k}=(.*)$`, 'm'));
  return m ? m[1].trim() : null;
};

const SUPABASE_URL = get('VITE_SUPABASE_URL');
const SERVICE_ROLE_KEY = get('SUPABASE_SERVICE_ROLE_KEY') || get('SERVICE_ROLE_KEY');

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function check() {
  const { data: pages, error } = await supabase.from('pages').select('*');
  if (error) {
    console.error(error);
  } else {
    console.log('Pages in database:', pages.length);
    console.log(pages.map(p => ({ id: p.id, slug: p.slug, title: p.title, is_published: p.is_published })));
  }
}

check();
