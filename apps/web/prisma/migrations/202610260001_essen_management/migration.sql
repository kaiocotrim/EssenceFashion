-- Initial Prisma migration. Additive and compatible with the earlier Essen tables.
begin;

create table if not exists public.essen_store_settings (
  id boolean primary key default true check (id),
  revision integer not null default 0 check (revision >= 0),
  initialized boolean not null default false,
  shipping jsonb not null default '{}'::jsonb check (jsonb_typeof(shipping) = 'object'),
  updated_at timestamptz not null default now()
);
insert into public.essen_store_settings(id) values (true) on conflict (id) do nothing;

create table if not exists public.essen_products (
  id bigint primary key check (id > 0),
  sku text not null check (length(sku) between 1 and 50),
  name text not null check (length(name) between 1 and 120),
  category text not null,
  price numeric(12,2) not null check (price > 0),
  compare_at numeric(12,2) check (compare_at > price),
  color text not null,
  image text not null,
  tag text not null default '',
  description text not null,
  occasion text check (occasion in ('Casual','Festa')),
  fabric text,
  active boolean not null default false,
  featured boolean not null default false,
  is_new boolean not null default false
);
create unique index if not exists essen_products_sku_unique on public.essen_products(lower(sku));

create table if not exists public.essen_product_variants (
  product_id bigint not null references public.essen_products(id),
  size text not null check (length(size) between 1 and 12),
  quantity integer not null default 0 check (quantity between 0 and 100000),
  position integer not null default 0,
  primary key (product_id, size)
);

create table if not exists public.essen_stock_movements (
  id text primary key,
  product_id bigint not null references public.essen_products(id),
  product_name text not null,
  size text not null,
  before_quantity integer not null check (before_quantity >= 0),
  after_quantity integer not null check (after_quantity >= 0),
  reason text not null,
  occurred_at timestamptz not null
);
create index if not exists essen_movements_time on public.essen_stock_movements(occurred_at desc);

create table if not exists public.essen_shipments (
  id text primary key,
  reference text not null,
  recipient text not null,
  destination text not null,
  service text not null check (service in ('PAC','SEDEX')),
  status text not null check (status in ('preparing','posted','delivered')),
  tracking text not null default '',
  created_at timestamptz not null,
  check (tracking = '' or tracking ~ '^[A-Z]{2}[0-9]{9}[A-Z]{2}$'),
  check (status = 'preparing' or tracking <> '')
);

create table if not exists public.essen_admin (
  id boolean primary key default true check (id),
  salt text not null check (salt ~ '^[a-f0-9]{32}$'),
  hash text not null check (hash ~ '^[a-f0-9]{128}$'),
  secret text not null check (secret ~ '^[a-f0-9]{64}$')
);

alter table public.essen_store_settings enable row level security;
alter table public.essen_products enable row level security;
alter table public.essen_product_variants enable row level security;
alter table public.essen_stock_movements enable row level security;
alter table public.essen_shipments enable row level security;
alter table public.essen_admin enable row level security;


-- Supabase roles are optional when testing on standalone PostgreSQL.
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') and exists (select 1 from pg_roles where rolname = 'authenticated') and exists (select 1 from pg_roles where rolname = 'service_role') then
revoke all on public.essen_store_settings, public.essen_products,
  public.essen_product_variants, public.essen_stock_movements,
  public.essen_shipments, public.essen_admin from public, anon, authenticated;
grant select, insert, update, delete on public.essen_store_settings,
  public.essen_products, public.essen_product_variants, public.essen_stock_movements,
  public.essen_shipments, public.essen_admin to service_role;
  end if;
end;
$$;

commit;
