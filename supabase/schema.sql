create table if not exists public.reader_states (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_reader_state_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists reader_states_updated_at on public.reader_states;

create trigger reader_states_updated_at
before update on public.reader_states
for each row
execute function public.set_reader_state_updated_at();

alter table public.reader_states enable row level security;

drop policy if exists "Users can read their own reader state" on public.reader_states;
create policy "Users can read their own reader state"
on public.reader_states
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own reader state" on public.reader_states;
create policy "Users can insert their own reader state"
on public.reader_states
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own reader state" on public.reader_states;
create policy "Users can update their own reader state"
on public.reader_states
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
