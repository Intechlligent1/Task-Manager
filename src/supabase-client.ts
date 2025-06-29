import { createClient } from "@supabase/supabase-js";

export const supabase= createClient(
    "https://bazklvaqvpzsyvwxtntb.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhemtsdmFxdnB6c3l2d3h0bnRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExODA3NjQsImV4cCI6MjA2Njc1Njc2NH0.zYbLMbSAePtDhjrL0p9LbJBtpXQ0LQkwXZZJC1lNt1o"
);