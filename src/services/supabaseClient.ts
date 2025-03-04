import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase URL and anon key
// In a production app, these would be stored in environment variables
const supabaseUrl = 'https://example.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlbXBvcmFyeWtleSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjE2MTU5MjAwLCJleHAiOjE5MzE3MzUyMDB9.temporary_key';

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase; 