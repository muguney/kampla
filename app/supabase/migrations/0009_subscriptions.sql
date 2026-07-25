-- Kamp.la — subscriptions (PRD 6.9, 5.P "Üyelik Tipleri — Ücretsiz/Premium")
-- RevenueCat webhook'ları (App Store / Play Store / Stripe) bu tabloyu senkronize eder.

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  provider text not null check (provider in ('app_store', 'play_store', 'stripe')),
  plan text not null,
  status text not null default 'trial' check (status in ('active', 'canceled', 'expired', 'trial')),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  auto_renew boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);

create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

alter table public.subscriptions enable row level security;

-- Kullanıcı yalnızca kendi abonelik geçmişini görebilir.
create policy "subscriptions_select_own"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "subscriptions_select_admin"
  on public.subscriptions for select
  using (public.is_admin());

-- Insert/update RevenueCat webhook'unu işleyen Edge Function tarafından
-- service_role anahtarıyla yapılır (RLS'i bypass eder); burada yalnızca admin
-- panelinden manuel müdahale ihtimaline karşı bir politika bırakılıyor.
create policy "subscriptions_update_admin"
  on public.subscriptions for update
  using (public.is_admin());

create policy "subscriptions_insert_admin"
  on public.subscriptions for insert
  to authenticated
  with check (public.is_admin());
