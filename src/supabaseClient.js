import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zvdqkkxdkapiblhknvlu.supabase.co";
// const SUPABASE_ANON_KEY = process.env.SUPABASE_API_KEY;
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2ZHFra3hka2FwaWJsaGtudmx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzNTg5ODcsImV4cCI6MjA0ODkzNDk4N30.FIf0POBd4kDtuKM9lkXHehtY7v8IYjhMWR7QqFE843k";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);