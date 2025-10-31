-- Schema for fantasy tennis application
-- Run in Supabase SQL editor

create extension if not exists "pgcrypto";

create table if not exists skills (
  id text primary key,
  name text not null,
  description text
);

create table if not exists tournaments (
  id text primary key,
  name text not null,
  start_date date,
  end_date date,
  location text,
  level text,
  display_date text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists players (
  id text primary key,
  name text not null,
  country text,
  ranking integer,
  dominant_hand text,
  birthdate date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists tournament_entries (
  id uuid primary key default gen_random_uuid(),
  tournament_id text not null references tournaments(id) on delete cascade,
  player_id text not null references players(id) on delete cascade,
  seed integer,
  entry_type text,
  status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tournament_id, player_id)
);

create table if not exists matches (
  id text primary key,
  tournament_id text not null references tournaments(id) on delete cascade,
  round text,
  scheduled_at timestamptz,
  display_date text,
  display_time text,
  player1_entry_id uuid references tournament_entries(id),
  player2_entry_id uuid references tournament_entries(id),
  winner_entry_id uuid references tournament_entries(id),
  player1_name text,
  player2_name text,
  player1_votes numeric,
  player2_votes numeric,
  score text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists fantasy_teams (
  id text primary key,
  user_id text not null,
  tournament_id text not null references tournaments(id) on delete cascade,
  name text,
  status text not null default 'current',
  points integer not null default 0,
  rank integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists fantasy_teams_user_id_idx on fantasy_teams (user_id);
create index if not exists fantasy_teams_tournament_id_idx on fantasy_teams (tournament_id);

create table if not exists team_players (
  id uuid primary key default gen_random_uuid(),
  fantasy_team_id text not null references fantasy_teams(id) on delete cascade,
  player_id text not null references players(id),
  skill_id text references skills(id),
  price numeric,
  tier integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (fantasy_team_id, player_id)
);

create index if not exists team_players_player_id_idx on team_players (player_id);

create table if not exists predictions (
  id text primary key,
  user_id text not null,
  match_id text not null references matches(id) on delete cascade,
  selected_player text not null,
  status text not null default 'pending',
  points_earned integer,
  is_correct boolean,
  total_votes integer,
  player1_votes numeric,
  player2_votes numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists predictions_user_id_idx on predictions (user_id);

create table if not exists tournament_performances (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  user_name text,
  user_email text,
  avatar text,
  tournament_id text not null references tournaments(id) on delete cascade,
  tournament_name text,
  tournament_date text,
  fantasy_team_id text references fantasy_teams(id) on delete set null,
  team_name text,
  team_snapshot jsonb,
  points integer not null,
  rank integer,
  total_participants integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, tournament_id)
);

create index if not exists tournament_performances_user_id_idx on tournament_performances (user_id);
create index if not exists tournament_performances_tournament_id_idx on tournament_performances (tournament_id);
