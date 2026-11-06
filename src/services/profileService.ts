import { supabase } from '@/lib/supabase';
import type { Tables } from '@/types/database.types';

export type Specialist = Pick<
  Tables<'profiles'>,
  'id' | 'first_name' | 'last_name'
>;

export async function getSpecialists(): Promise<Specialist[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name')
    .eq('role', 'technical_specialist')
    .eq('status', 'active')
    .order('last_name', { ascending: true })
    .order('first_name', { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}
