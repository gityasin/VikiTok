import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase URL and anon key
// In a production app, these would be stored in environment variables
const supabaseUrl = 'https://smjajdirhkylvmdqivjz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtamFqZGlyaGt5bHZtZHFpdmp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODg3OTYsImV4cCI6MjA1NjY2NDc5Nn0.LUjUZ2WRpx9JblD2w5IyfuAvZ9Sl4ipQLdd3L0ajc3Y';

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase; 