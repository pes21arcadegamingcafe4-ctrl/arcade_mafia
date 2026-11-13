export type Side = 'mafia' | 'citizen';

export interface Role {
  id: string;
  name: string;
  side: Side;
  description: string;
  image_url: string;
  is_default: boolean;
  created_at: string;
}

export interface ScenarioRoleEntry {
  role_id: string;
  count: number;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  role_ids: ScenarioRoleEntry[];
  is_default: boolean;
  created_at: string;
}

export interface RoleAssignment {
  player_name: string;
  role_id: string;
}

export type GameStatus = 'setup' | 'playing' | 'finished';

export interface Game {
  id: string;
  name: string;
  scenario_id: string | null;
  player_names: string[];
  role_assignments: RoleAssignment[];
  status: GameStatus;
  created_at: string;
}

export interface ScenarioWithRoles extends Scenario {
  roles: { role: Role; count: number }[];
  totalPlayers: number;
}
