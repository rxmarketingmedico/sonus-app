
-- Sessions table
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  mode text not null,
  duration integer not null,
  target_duration integer not null,
  frequency numeric not null,
  mood_pre integer,
  mood_post integer,
  ambient_sound text,
  created_at timestamptz default now() not null
);

alter table public.sessions enable row level security;

create policy "Users can manage their own sessions"
  on public.sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Sleep logs table
create table public.sleep_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  bedtime time not null,
  waketime time not null,
  quality integer not null,
  created_at timestamptz default now() not null
);

-- Validation trigger for quality
create or replace function public.validate_sleep_log_quality()
returns trigger
language plpgsql
as $$
begin
  if new.quality < 1 or new.quality > 5 then
    raise exception 'quality must be between 1 and 5';
  end if;
  return new;
end;
$$;

create trigger trg_validate_sleep_log_quality
  before insert or update on public.sleep_logs
  for each row execute function public.validate_sleep_log_quality();

alter table public.sleep_logs enable row level security;

create policy "Users can manage their own sleep logs"
  on public.sleep_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- User profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  goal text,
  period text,
  stress_level text,
  duration integer,
  onboarding_complete boolean default false,
  plan text default 'free',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can manage their own profile"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);
