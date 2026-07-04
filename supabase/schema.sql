create table if not exists public.reader_store_snapshots (
  id text primary key,
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

drop trigger if exists reader_store_snapshots_updated_at on public.reader_store_snapshots;

create trigger reader_store_snapshots_updated_at
before update on public.reader_store_snapshots
for each row
execute function public.set_reader_state_updated_at();

alter table public.reader_store_snapshots enable row level security;
