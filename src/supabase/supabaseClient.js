import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_SERVICEKEY;
console.log(supabaseUrl, supabaseKey);

 const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'public',
  },
  auth: {
    persistSession: true,
  },
  storage: {
    // Optional storage configuration
  }
});
console.log(supabase)
export default supabase;