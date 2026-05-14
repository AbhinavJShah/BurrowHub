import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://tsifmmzbgsojuivryhge.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzaWZtbXpiZ3NvanVpdnJ5aGdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1ODk5NzYsImV4cCI6MjA5NDE2NTk3Nn0.5SeTWDiMyPgX0hVqDQf3ZcviIXGdZO0Tr0nmD1wCKnM"

export const supabase = createClient(supabaseUrl, supabaseKey)