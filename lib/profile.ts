import { supabase } from './supabase'
import { Tables } from '@/types/supabase'

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export async function updateProfile(
  userId: string,
  updates: Partial<Tables<'profiles'>>
) {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)

  if (error) throw error
}

export async function createProfile(
  profile: Tables<'profiles'>
) {
  const { error } = await supabase
    .from('profiles')
    .insert([profile])

  if (error) throw error
} 