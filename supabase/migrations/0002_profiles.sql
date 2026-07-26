-- Kamp.la — profiles (PRD 6.6, 7.1 "Kullanıcı Yönetimi — Supabase Auth")
-- Supabase Auth'un `auth.users` tablosuna 1:1 uzanan profil tablosu.
-- `tier` (free/premium, PRD 5.P) ve `role` (user/admin, PRD 5.R) burada tutulur.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  email text not null,
  avatar_url text,
  website_url text,
  facebook_url text,
  instagram_url text,
  x_url text,
  youtube_url text,
  show_visited_places boolean not null default false,
  tier text not null default 'free' check (tier in ('free', 'premium')),
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Yeni bir auth.users kaydı oluşunca otomatik profil satırı açan tetikleyici.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)) || '_' || substr(new.id::text, 1, 6),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;

-- Herkes (misafir dahil) herkese açık profil alanlarını görebilir (paylaşılan profil sayfası — PRD 5.J).
create policy "profiles_select_public"
  on public.profiles for select
  using (true);

-- Kullanıcı yalnızca kendi profilini güncelleyebilir.
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Adminler tüm profilleri güncelleyebilir (tier/hesap askıya alma — PRD 5.R).
create policy "profiles_update_admin"
  on public.profiles for update
  using (public.is_admin());

-- Kullanıcı kendi hesabını kalıcı olarak silebilir (PRD 5.J).
create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = id);

create policy "profiles_delete_admin"
  on public.profiles for delete
  using (public.is_admin());
