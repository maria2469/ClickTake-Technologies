import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const newLead = {
    name: "Test User",
    email: "test@example.com",
    phone: "+123456789",
    service_interest: "Web Dev",
    source_page: "Test",
    status: "New",
    message: "Test message contents here...",
    internal_notes: JSON.stringify(["Test Note"])
  };
  const { data, error } = await supabase.from('leads').insert(newLead).select();
  if (error) {
    console.error('Error inserting lead:', error);
  } else {
    console.log('Insert success:', data);
    const { error: deleteError } = await supabase.from('leads').delete().eq('id', data[0].id);
    console.log('Cleanup error:', deleteError);
  }
}

run();
