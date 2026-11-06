import { supabase } from '@/lib/supabase';
import type { Tables } from '@/types/database.types';

export type Specialist = Pick<
  Tables<'profiles'>,
  'id' | 'first_name' | 'last_name'
>;

export type UserProfile = Pick<
  Tables<'profiles'>,
  'id' | 'first_name' | 'last_name' | 'role' | 'status'
>;

export async function getSpecialists(): Promise<Specialist[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name')
    .eq('role', 'technical_specialist')
    .eq('status', 'active')
    .order('last_name', { ascending: true })
    .order('first_name', { ascending: true });

  if (error) throw error;

  return data ?? [];
}

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, role, status')
    .eq('id', userId)
    .single();

  if (error) throw error;

  return data;
}

export function formatFullName(
  profile: Pick<UserProfile, 'first_name' | 'last_name'>,
): string {
  return [profile.first_name, profile.last_name].filter(Boolean).join(' ');
}

export function hasActiveAccess(profile: UserProfile): boolean {
  return (
    profile.status === 'active' &&
    (profile.role === 'manager' || profile.role === 'technical_specialist')
  );
}
