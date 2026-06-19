-- ============================================================================
-- Battle Archive — Supabase schema
-- ============================================================================
-- How to use:
-- 1. Open your Supabase project → SQL Editor → New query
-- 2. Paste this file's contents and Run
-- 3. Create an admin user:
--      a. Supabase Dashboard → Authentication → Users → "Add user" (email + password,
--         set "Auto Confirm User")
--      b. Run this in SQL Editor (replace the email):
--           insert into public.profiles (id, role)
--           select id, 'admin' from auth.users where email = 'you@example.com'
--           on conflict (id) do update set role = 'admin';
-- 4. Confirm these project secrets are set (server-side only):
--           MY_SUPABASE_URL
--           MY_SUPABASE_SERVICE_ROLE_KEY
--
-- Security model:
--   - Public read of battle data via RLS SELECT policies
--   - Admin login = Supabase email/password sign-in + profiles.role = 'admin'
--   - Writes happen only through TanStack Start server functions that use
--     the SERVICE ROLE key AND verify the caller's bearer token + admin role.
-- ============================================================================

-- ---------- Profiles + roles ----------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        text not null default 'user' check (role in ('user','admin')),
  created_at  timestamptz not null default now()
);

grant select, update on public.profiles to authenticated;
grant all on public.profiles to service_role;

alter table public.profiles enable row level security;

drop policy if exists "profiles_self_read"   on public.profiles;
drop policy if exists "profiles_self_update" on public.profiles;

-- Users can read and update their own profile row (but NOT the role column —
-- only the service role can grant admin).
create policy "profiles_self_read"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "profiles_self_update"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

-- Auto-create a profile row when a new auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'user')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Battle data ----------
create table if not exists public.battles (
  id              text primary key,
  slug            text not null unique,
  name            text not null,
  year            integer not null default 0,
  era             text not null default 'ancient',
  region          text not null default '',
  location        text not null default '',
  lat             double precision not null default 0,
  lng             double precision not null default 0,
  commanders      jsonb not null default '[]'::jsonb,
  forces          jsonb not null default '{}'::jsonb,
  casualties      jsonb not null default '{}'::jsonb,
  outcome         text not null default '',
  hero_image      text not null default '',
  summary         text not null default '',
  narrative       text not null default '',
  background      text,
  course          text,
  turning_points  text,
  aftermath       text,
  fun_fact        text,
  created_at      timestamptz not null default now()
);

create table if not exists public.battle_quizzes (
  id             text primary key,
  battle_id      text not null references public.battles(id) on delete cascade,
  kind           text not null check (kind in ('mc','tf','open')),
  question       text not null,
  options        jsonb not null default '[]'::jsonb,
  correct_index  integer not null default 0,
  explanation    text,
  created_at     timestamptz not null default now()
);
create index if not exists battle_quizzes_battle_id_idx on public.battle_quizzes(battle_id);

create table if not exists public.battle_gallery (
  id          text primary key,
  battle_id   text not null references public.battles(id) on delete cascade,
  url         text not null,
  created_at  timestamptz not null default now()
);
create index if not exists battle_gallery_battle_id_idx on public.battle_gallery(battle_id);

-- ---------- Data API grants ----------
grant usage on schema public to anon, authenticated;

grant select on public.battles        to anon, authenticated;
grant select on public.battle_quizzes to anon, authenticated;
grant select on public.battle_gallery to anon, authenticated;

grant all on public.battles        to service_role;
grant all on public.battle_quizzes to service_role;
grant all on public.battle_gallery to service_role;

-- ---------- RLS ----------
alter table public.battles        enable row level security;
alter table public.battle_quizzes enable row level security;
alter table public.battle_gallery enable row level security;

drop policy if exists "battles_public_read"        on public.battles;
drop policy if exists "battle_quizzes_public_read" on public.battle_quizzes;
drop policy if exists "battle_gallery_public_read" on public.battle_gallery;

create policy "battles_public_read"
  on public.battles for select
  to anon, authenticated
  using (true);

create policy "battle_quizzes_public_read"
  on public.battle_quizzes for select
  to anon, authenticated
  using (true);

create policy "battle_gallery_public_read"
  on public.battle_gallery for select
  to anon, authenticated
  using (true);

-- ---------- Voting ----------
create table if not exists public.vote_candidates (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  era         text not null default 'ancient',
  description text not null default '',
  active      boolean not null default true,
  vote_count  integer not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.battle_votes (
  user_id      uuid not null references auth.users(id) on delete cascade,
  candidate_id uuid not null references public.vote_candidates(id) on delete cascade,
  created_at   timestamptz not null default now(),
  primary key (user_id)
);
create index if not exists battle_votes_candidate_idx on public.battle_votes(candidate_id);

grant select on public.vote_candidates to anon, authenticated;
grant all    on public.vote_candidates to service_role;
grant select, insert, delete on public.battle_votes to authenticated;
grant all    on public.battle_votes to service_role;

alter table public.vote_candidates enable row level security;
alter table public.battle_votes    enable row level security;

drop policy if exists "vote_candidates_public_read" on public.vote_candidates;
drop policy if exists "battle_votes_self_read"      on public.battle_votes;
drop policy if exists "battle_votes_self_insert"    on public.battle_votes;
drop policy if exists "battle_votes_self_delete"    on public.battle_votes;

create policy "vote_candidates_public_read"
  on public.vote_candidates for select
  to anon, authenticated
  using (true);

create policy "battle_votes_self_read"
  on public.battle_votes for select
  to authenticated
  using (auth.uid() = user_id);

create policy "battle_votes_self_insert"
  on public.battle_votes for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "battle_votes_self_delete"
  on public.battle_votes for delete
  to authenticated
  using (auth.uid() = user_id);

-- Keep vote_count in sync via trigger
create or replace function public.bump_vote_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.vote_candidates set vote_count = vote_count + 1 where id = new.candidate_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.vote_candidates set vote_count = greatest(0, vote_count - 1) where id = old.candidate_id;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists battle_votes_count_trg on public.battle_votes;
create trigger battle_votes_count_trg
  after insert or delete on public.battle_votes
  for each row execute function public.bump_vote_count();
