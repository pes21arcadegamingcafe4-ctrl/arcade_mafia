/*
# Create Mafia Game Manager Schema

1. New Tables
- `roles` — Defines mafia game roles (name, team, abilities, image, side)
  - id (uuid, PK)
  - name (text, not null) — role name in Persian
  - side (text, not null) — 'mafia' or 'citizen'
  - description (text) — role description
  - image_url (text) — optional image URL for the role
  - is_default (boolean, default false) — whether it's a built-in role
  - created_at (timestamptz)

- `scenarios` — Predefined game scenarios with role sets
  - id (uuid, PK)
  - name (text, not null) — scenario name
  - description (text)
  - role_ids (jsonb) — array of {role_id, count} objects
  - is_default (boolean, default false)
  - created_at (timestamptz)

- `games` — Saved game sessions
  - id (uuid, PK)
  - name (text, not null) — game name
  - scenario_id (uuid, nullable, references scenarios)
  - player_names (jsonb) — array of player name strings
  - role_assignments (jsonb) — array of {player_name, role_id} objects
  - status (text, default 'setup') — 'setup', 'playing', 'finished'
  - created_at (timestamptz)

2. Security
- Enable RLS on all tables.
- Grant CRUD to anon + authenticated (no-auth app, single-tenant).
- Allow anon + authenticated full CRUD because data is intentionally shared/public.
*/

CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  side text NOT NULL DEFAULT 'citizen',
  description text DEFAULT '',
  image_url text DEFAULT '',
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON roles TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_roles" ON roles;
CREATE POLICY "anon_select_roles" ON roles FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_roles" ON roles;
CREATE POLICY "anon_insert_roles" ON roles FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_roles" ON roles;
CREATE POLICY "anon_update_roles" ON roles FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_roles" ON roles;
CREATE POLICY "anon_delete_roles" ON roles FOR DELETE
TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  role_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON scenarios TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_scenarios" ON scenarios;
CREATE POLICY "anon_select_scenarios" ON scenarios FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_scenarios" ON scenarios;
CREATE POLICY "anon_insert_scenarios" ON scenarios FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_scenarios" ON scenarios;
CREATE POLICY "anon_update_scenarios" ON scenarios FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_scenarios" ON scenarios;
CREATE POLICY "anon_delete_scenarios" ON scenarios FOR DELETE
TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  scenario_id uuid REFERENCES scenarios(id) ON DELETE SET NULL,
  player_names jsonb NOT NULL DEFAULT '[]'::jsonb,
  role_assignments jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'setup',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON games TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_games" ON games;
CREATE POLICY "anon_select_games" ON games FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_games" ON games;
CREATE POLICY "anon_insert_games" ON games FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_games" ON games;
CREATE POLICY "anon_update_games" ON games FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_games" ON games;
CREATE POLICY "anon_delete_games" ON games FOR DELETE
TO anon, authenticated USING (true);
