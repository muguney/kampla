-- Kamp.la — lists & list_items (PRD 6.7, 5.H "Harita Listelerim")

create table if not exists public.lists (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  type text not null default 'custom' check (type in ('favorites', 'visited', 'custom')),
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lists_owner_id_idx on public.lists (owner_id);

create trigger lists_set_updated_at
  before update on public.lists
  for each row execute function public.set_updated_at();

alter table public.lists enable row level security;

-- Sahibi kendi listelerini her zaman görebilir.
create policy "lists_select_own"
  on public.lists for select
  using (auth.uid() = owner_id);

-- "Profilde Görünür Yap" ile herkese açık işaretlenen listeler herkese görünür (PRD 5.H, 5.K).
create policy "lists_select_public"
  on public.lists for select
  using (is_public = true);

create policy "lists_insert_own"
  on public.lists for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy "lists_update_own"
  on public.lists for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "lists_delete_own"
  on public.lists for delete
  using (auth.uid() = owner_id);


create table if not exists public.list_items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references public.lists (id) on delete cascade,
  location_id uuid not null references public.locations (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (list_id, location_id)
);

create index if not exists list_items_list_id_idx on public.list_items (list_id);
create index if not exists list_items_location_id_idx on public.list_items (location_id);

alter table public.list_items enable row level security;

-- Bir liste öğesi, listenin kendisi görünürse (sahibi ya da public) görünür.
create policy "list_items_select"
  on public.list_items for select
  using (
    exists (
      select 1 from public.lists ls
      where ls.id = list_id
        and (ls.owner_id = auth.uid() or ls.is_public = true)
    )
  );

create policy "list_items_insert_owner"
  on public.list_items for insert
  to authenticated
  with check (
    exists (
      select 1 from public.lists ls
      where ls.id = list_id and ls.owner_id = auth.uid()
    )
  );

create policy "list_items_delete_owner"
  on public.list_items for delete
  using (
    exists (
      select 1 from public.lists ls
      where ls.id = list_id and ls.owner_id = auth.uid()
    )
  );
