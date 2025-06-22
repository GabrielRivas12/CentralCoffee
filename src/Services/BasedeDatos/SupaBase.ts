import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const url = 'https://zrxeteoauwceolemurjd.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyeGV0ZW9hdXdjZW9sZW11cmpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MjkzODAsImV4cCI6MjA2NjEwNTM4MH0.nX_K0VkdzjZB9GymyvUvQeIxNjs0ccRjZuiIW5c5D0U'

export const supabase = createClient(url, key)
