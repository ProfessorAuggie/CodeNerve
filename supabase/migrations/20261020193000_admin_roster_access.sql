create or replace function public.is_faculty()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'teacher')
  );
$$;

create policy "faculty can read all profiles"
  on public.profiles for select
  using (public.is_faculty() or auth.uid() = id);

create policy "faculty can update student approvals"
  on public.profiles for update
  using (public.is_faculty() and role = 'student')
  with check (public.is_faculty() and role = 'student');

create policy "faculty can read all problem progress"
  on public.problem_progress for select
  using (public.is_faculty() or auth.uid() = user_id);

create policy "faculty can read all lesson progress"
  on public.lesson_progress for select
  using (public.is_faculty() or auth.uid() = user_id);

create policy "faculty can read all quiz scores"
  on public.quiz_scores for select
  using (public.is_faculty() or auth.uid() = user_id);
