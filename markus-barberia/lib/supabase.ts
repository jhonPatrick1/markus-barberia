import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Crea y exporta el cliente para usarlo en cualquier parte de tu página
export const supabase = createClient(supabaseUrl, supabaseKey);