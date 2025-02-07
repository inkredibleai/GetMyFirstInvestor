// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const SUPABASE_URL = "https://hozmcgmakzcsraugbavj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhvem1jZ21ha3pjc3JhdWdiYXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5NDY1ODAsImV4cCI6MjA1NDUyMjU4MH0.U3L3FBS2FInoVs5oy32eVvU3klubgx6z5_TuO2krDuw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    db: {
      schema: 'public'
    }
  }
);