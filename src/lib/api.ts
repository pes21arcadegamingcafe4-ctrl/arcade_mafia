import { supabase } from './supabase';
import type { Role, Scenario, Game, ScenarioRoleEntry, ScenarioWithRoles } from '@/types';

export async function fetchRoles(): Promise<Role[]> {
  const { data, error } = await supabase.from('roles').select('*').order('created_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createRole(role: Omit<Role, 'id' | 'created_at'>): Promise<Role> {
  const { data, error } = await supabase.from('roles').insert(role).select().single();
  if (error) throw error;
  return data;
}

export async function updateRole(id: string, updates: Partial<Omit<Role, 'id' | 'created_at'>>): Promise<Role> {
  const { data, error } = await supabase.from('roles').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteRole(id: string): Promise<void> {
  const { error } = await supabase.from('roles').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchScenarios(): Promise<Scenario[]> {
  const { data, error } = await supabase.from('scenarios').select('*').order('created_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createScenario(
  scenario: Omit<Scenario, 'id' | 'created_at'>
): Promise<Scenario> {
  const { data, error } = await supabase.from('scenarios').insert(scenario).select().single();
  if (error) throw error;
  return data;
}

export async function updateScenario(
  id: string,
  updates: Partial<Omit<Scenario, 'id' | 'created_at'>>
): Promise<Scenario> {
  const { data, error } = await supabase.from('scenarios').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteScenario(id: string): Promise<void> {
  const { error } = await supabase.from('scenarios').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchGames(): Promise<Game[]> {
  const { data, error } = await supabase.from('games').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createGame(game: Omit<Game, 'id' | 'created_at'>): Promise<Game> {
  const { data, error } = await supabase.from('games').insert(game).select().single();
  if (error) throw error;
  return data;
}

export async function updateGame(
  id: string,
  updates: Partial<Omit<Game, 'id' | 'created_at'>>
): Promise<Game> {
  const { data, error } = await supabase.from('games').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteGame(id: string): Promise<void> {
  const { error } = await supabase.from('games').delete().eq('id', id);
  if (error) throw error;
}

export function buildScenarioWithRoles(
  scenario: Scenario,
  roles: Role[]
): ScenarioWithRoles {
  const entries: ScenarioRoleEntry[] = scenario.role_ids ?? [];
  const rolesWithCount = entries
    .map((entry) => {
      const role = roles.find((r) => r.id === entry.role_id);
      if (!role) return null;
      return { role, count: entry.count };
    })
    .filter((x): x is { role: Role; count: number } => x !== null);

  const totalPlayers = rolesWithCount.reduce((sum, r) => sum + r.count, 0);

  return {
    ...scenario,
    roles: rolesWithCount,
    totalPlayers,
  };
}
