import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zvdqkkxdkapiblhknvlu.supabase.co";
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_API_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);