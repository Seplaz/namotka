import { supabase } from '@/lib/supabase';
import type { Tables } from '@/types/database.types';

export type Client = Pick<Tables<'clients'>, 'id' | 'inn' | 'kpp' | 'name'>;

export type FindOrCreateClientResult = {
  client: Client;
  wasCreated: boolean;
};

export async function searchClients(query: string): Promise<Client[]> {
  const normalizedQuery = query.trim();

  if (normalizedQuery.length < 2) {
    return [];
  }

  const numericParts = normalizedQuery.match(/\d+/g) ?? [];
  const textPart = normalizedQuery
    .replace(/\d+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const searchQueries = new Set<string>();

  for (const part of numericParts) {
    if (part.length >= 2) {
      searchQueries.add(part);
    }
  }

  if (textPart.length >= 2) {
    searchQueries.add(textPart);
  }

  if (searchQueries.size === 0) {
    searchQueries.add(normalizedQuery);
  }

  const results = await Promise.all(
    [...searchQueries].map((searchQuery) =>
      supabase.rpc('search_clients', {
        p_query: searchQuery,
      }),
    ),
  );

  const clientsById = new Map<string, Client>();

  for (const result of results) {
    if (result.error) {
      throw result.error;
    }

    for (const client of result.data ?? []) {
      clientsById.set(client.id, client);
    }
  }

  return [...clientsById.values()];
}

export async function findOrCreateClient(
  inn: string,
  kpp: string | null,
  name: string,
): Promise<FindOrCreateClientResult> {
  const { data, error } = await supabase.rpc('find_or_create_client', {
    p_inn: inn.trim(),
    p_kpp: kpp?.trim() || '',
    p_name: name.trim(),
  });

  if (error) {
    throw error;
  }

  const result = data?.[0];

  if (!result) {
    throw new Error('Не удалось найти или создать клиента.');
  }

  return {
    client: {
      id: result.id,
      inn: result.inn,
      kpp: result.kpp,
      name: result.name,
    },
    wasCreated: result.was_created,
  };
}
