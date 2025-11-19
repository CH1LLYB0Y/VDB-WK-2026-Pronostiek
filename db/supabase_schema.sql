-- Supabase schema for WK2026 pronostiek starter
create extension if not exists pgcrypto;

create table if not exists participants (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  group_name text,
  created_at timestamptz default now()
);

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  matchday int,
  stage text,
  team_a text,
  team_b text,
  kickoff timestamptz,
  score_a int,
  score_b int,
  result_locked boolean default false
);

create table if not exists predictions (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid references participants(id) on delete cascade,
  match_id uuid references matches(id) on delete cascade,
  pred_a int,
  pred_b int,
  created_at timestamptz default now()
);

create table if not exists leaderboard (
  participant_id uuid primary key references participants(id),
  points int default 0,
  correct_winner int default 0,
  correct_score int default 0,
  updated_at timestamptz default now()
);

create table if not exists config (
  key text primary key,
  value text
);

insert into config(key, value) values
('points_correct_score', '3'),
('points_correct_winner', '1')
on conflict do nothing;

-- Example seed: add a few matches. For full tournament, replace or extend this section.
insert into matches(matchday, stage, team_a, team_b, kickoff) values
(1, 'Group', 'Belgium', 'USA', '2026-06-12T18:00:00Z'),
(1, 'Group', 'France', 'Germany', '2026-06-12T21:00:00Z'),
(1, 'Group', 'Brazil', 'Argentina', '2026-06-13T18:00:00Z')
on conflict do nothing;
