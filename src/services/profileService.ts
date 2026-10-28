import { supabase } from '@/lib/supabase';
import type { Tables } from '@/types/database.types';

export type Specialist = Pick<Tables<'profiles'>, 'id' | 'username'>;

export async function getSpecialists(): Promise<Specialist[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username')
    .eq('role', 'technical_specialist')
    .eq('status', 'active')
    .order('username', { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}
