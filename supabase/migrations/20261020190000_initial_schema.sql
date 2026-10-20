create extension if not exists "pgcrypto";

create type public.user_role as enum ('student', 'teacher', 'admin');
create type public.approval_status as enum ('approved', 'pending', 'disapproved');
create type public.problem_status as enum ('NOT_STARTED', 'ATTEMPTED', 'SOLVED', 'REVISION_NEEDED');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  role public.user_role not null default 'student',
  university text not null default 'CodeNerve Explorer',
  semester integer not null default 1,
  registration_number text unique,
  batch text,
  track text not null default 'global' check (track in ('global', 'lpu')),
  avatar text,
  approval_status public.approval_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.problem_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  problem_id text not null,
  status public.problem_status not null,
  first_attempted timestamptz,
  solved_at timestamptz,
  notes text,
  submission_url text,
  updated_at timestamptz not null default now(),
  primary key (user_id, problem_id)
);

create table public.problem_bookmarks (
  user_id uuid not null references public.profiles(id) on delete cascade,
  problem_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, problem_id)
);

create table public.lesson_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null,
  completed boolean not null default true,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table public.quiz_scores (
  user_id uuid not null references public.profiles(id) on delete cascade,
  quiz_id text not null,
  score integer not null,
  total integer not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, quiz_id)
);

create index problem_progress_user_idx on public.problem_progress(user_id);
create index lesson_progress_user_idx on public.lesson_progress(user_id);
create index quiz_scores_user_idx on public.quiz_scores(user_id);

alter table public.profiles enable row level security;
alter table public.problem_progress enable row level security;
alter table public.problem_bookmarks enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quiz_scores enable row level security;

create policy "users can read their profile" on public.profiles for select using (auth.uid() = id);
create policy "users can update their profile" on public.profiles for update using (auth.uid() = id);
create policy "users can manage their progress" on public.problem_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users can manage their bookmarks" on public.problem_bookmarks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users can manage their lessons" on public.lesson_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users can manage their quizzes" on public.quiz_scores for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, registration_number, batch, track)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    new.email,
    new.raw_user_meta_data->>'registration_number',
    new.raw_user_meta_data->>'batch',
    coalesce(new.raw_user_meta_data->>'track', 'global')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
