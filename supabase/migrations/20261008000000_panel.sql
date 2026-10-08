-- NAZ-AŞ yönetim paneli: CRM (talepler + müşteriler), menü, belgeler, galeri,
-- blog, site ayarları, ziyaret analizi.
--   • Tek admin. Yetki `private.is_admin()` içinde toplanır.
--   • Ziyaretçinin (anon) hiçbir tabloya yazma izni yok. Form ve ziyaret
--     kayıtları sunucuda secret key ile yazılır.
--   • Site içeriği (menü, belgeler, galeri, blog, ayarlar) anon ile OKUNUR;
--     tablo boşsa site kendi dosyalarındaki veriyi gösterir.

-- Yardımcılar ------------------------------------------------------------------
create schema if not exists private;
grant usage on schema private to authenticated, service_role;

create table public.admins (
  user_id uuid primary key references auth.users on delete cascade
);
alter table public.admins enable row level security;
create policy "admins: kendi satırı" on public.admins
  for select to authenticated using (user_id = (select auth.uid()));

create function private.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
revoke execute on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated;

create function private.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Türkiye odaklı E.164: 05xx… / 5xx… / 905xx… / +… → +90…
create function private.normalize_phone(raw text) returns text
language plpgsql immutable set search_path = '' as $$
declare
  digits text := regexp_replace(coalesce(raw, ''), '\D', '', 'g');
begin
  if digits = '' then return null; end if;
  if left(trim(raw), 1) = '+' then return '+' || digits; end if;
  if length(digits) = 11 and left(digits, 1) = '0' then return '+9' || digits; end if;
  if length(digits) = 10 then return '+90' || digits; end if;
  if length(digits) = 12 and left(digits, 2) = '90' then return '+' || digits; end if;
  return '+' || digits;
end;
$$;

-- CRM --------------------------------------------------------------------------
-- yeni → teklif verildi → müşteri (sözleşmeli) / pasif
create type public.contact_status as enum ('yeni', 'teklif', 'musteri', 'pasif');

create table public.contacts (
  id              uuid primary key default gen_random_uuid(),
  name            text,
  company         text,
  email           text check (email = lower(email)),
  phone           text,
  address         text,
  meals           text,
  service         text,
  status          public.contact_status not null default 'yeni',
  source          text,
  kvkk_consent_at timestamptz,
  last_seen_at    timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  deleted_at      timestamptz
);
create unique index contacts_email_key on public.contacts (email) where email is not null;
create unique index contacts_phone_key on public.contacts (phone) where phone is not null;
create index contacts_last_seen_idx on public.contacts (last_seen_at desc);
create trigger contacts_touch before update on public.contacts
  for each row execute function private.touch_updated_at();

create table public.submissions (
  id          uuid primary key default gen_random_uuid(),
  contact_id  uuid not null references public.contacts on delete cascade,
  kind        text not null check (kind in ('teklif', 'on-hesaplama')),
  data        jsonb not null,
  status      text not null default 'yeni' check (status in ('yeni', 'ilgilenildi', 'kapandi')),
  created_at  timestamptz not null default now()
);
create index submissions_contact_idx on public.submissions (contact_id, created_at desc);
create index submissions_created_idx on public.submissions (created_at desc);

create table public.notes (
  id          uuid primary key default gen_random_uuid(),
  contact_id  uuid not null references public.contacts on delete cascade,
  body        text not null check (length(body) between 1 and 5000),
  created_at  timestamptz not null default now()
);
create index notes_contact_idx on public.notes (contact_id, created_at desc);

-- Menü -------------------------------------------------------------------------
-- days: [{day, soup, main, side, extra, calories}, …] — src/data/menu.ts → Meal
create table public.menu_weeks (
  id         uuid primary key default gen_random_uuid(),
  label      text not null check (length(label) between 1 and 60),
  days       jsonb not null default '[]'::jsonb check (jsonb_typeof(days) = 'array'),
  sort       int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger menu_weeks_touch before update on public.menu_weeks
  for each row execute function private.touch_updated_at();

-- Belgeler ---------------------------------------------------------------------
-- pdf_url / thumb_url: ya sitenin kendi dosyası (/belgeler/…) ya da Storage adresi.
create table public.certificates (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  subtitle     text not null default '',
  pdf_url      text not null,
  thumb_url    text,
  thumb_width  int,
  thumb_height int,
  visible      boolean not null default true,
  sort         int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger certificates_touch before update on public.certificates
  for each row execute function private.touch_updated_at();

-- Galeri -----------------------------------------------------------------------
create table public.gallery_items (
  id         uuid primary key default gen_random_uuid(),
  type       text not null default 'photo' check (type in ('photo', 'video')),
  grp        text not null check (grp in ('tesis', 'mutfak', 'kumanya', 'servis', 'organizasyon', 'video')),
  alt        text not null default '',
  src        text not null,
  thumb      text not null,
  width      int not null default 1600,
  height     int not null default 1200,
  visible    boolean not null default true,
  sort       int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger gallery_items_touch before update on public.gallery_items
  for each row execute function private.touch_updated_at();

-- Blog -------------------------------------------------------------------------
create table public.posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title        text not null,
  excerpt      text,
  body         text not null,
  cover_url    text,
  status       text not null default 'taslak' check (status in ('taslak', 'yayinda')),
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index posts_published_idx on public.posts (published_at desc);
create trigger posts_touch before update on public.posts
  for each row execute function private.touch_updated_at();

-- Ayarlar ----------------------------------------------------------------------
-- contact: {"phone","mobile","whatsapp","email","workingHours","instagram","tiktok","facebook"}
-- stats:   {"quick":[{value,label}×4], "capacity":[{value,suffix,label,…}]}
create table public.settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);
create trigger settings_touch before update on public.settings
  for each row execute function private.touch_updated_at();

-- Ziyaret analizi --------------------------------------------------------------
-- Çerezsiz, kişisel veri tutmayan sayfa görüntüleme kaydı. IP ve tarayıcı
-- SAKLANMAZ; `visitor` IP + tarayıcı + gün değerinin sunucuda gizli anahtarla
-- alınmış, her gün değişen karmasıdır. `referrer` yalnızca alan adıdır.
create table public.page_views (
  id       bigint generated always as identity primary key,
  at       timestamptz not null default now(),
  path     text not null check (length(path) between 1 and 300),
  referrer text check (length(referrer) <= 255),
  source   text check (length(source) <= 60),
  device   text not null check (device in ('mobile', 'tablet', 'desktop')),
  visitor  text not null check (length(visitor) <= 64)
);
create index page_views_at_idx on public.page_views (at desc);

-- RLS ----------------------------------------------------------------------------
alter table public.contacts      enable row level security;
alter table public.submissions   enable row level security;
alter table public.notes         enable row level security;
alter table public.menu_weeks    enable row level security;
alter table public.certificates  enable row level security;
alter table public.gallery_items enable row level security;
alter table public.posts         enable row level security;
alter table public.settings      enable row level security;
alter table public.page_views    enable row level security;

create policy "admin" on public.contacts      for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admin" on public.submissions   for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admin" on public.notes         for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admin" on public.menu_weeks    for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admin" on public.certificates  for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admin" on public.gallery_items for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admin" on public.posts         for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admin" on public.settings      for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admin okur" on public.page_views for select to authenticated
  using ((select private.is_admin()));

-- Ziyaretçi: yalnızca okuma (site sunucusu publishable key = anon ile okur).
create policy "ziyaretçi" on public.menu_weeks    for select to anon using (true);
create policy "ziyaretçi" on public.certificates  for select to anon using (visible);
create policy "ziyaretçi" on public.gallery_items for select to anon using (visible);
create policy "ziyaretçi" on public.settings      for select to anon using (true);
create policy "ziyaretçi" on public.posts         for select to anon
  using (status = 'yayinda' and published_at <= now());

-- Form → CRM ---------------------------------------------------------------------
-- Tek transaction: kurumu/kişiyi e-posta, yoksa telefonla bul ya da oluştur;
-- boş alanlarını doldur (dolu alana yazmaz), gönderimi ekle. Dönüş: submission id.
-- Yalnızca service_role (secret key) çalıştırabilir.
create function public.submit_lead(p_kind text, p_data jsonb) returns uuid
language plpgsql security invoker set search_path = '' as $$
declare
  v_email   text := nullif(lower(trim(p_data ->> 'email')), '');
  v_phone   text := private.normalize_phone(p_data ->> 'phone');
  v_name    text := nullif(trim(p_data ->> 'name'), '');
  v_company text := nullif(trim(p_data ->> 'company'), '');
  v_address text := nullif(trim(p_data ->> 'address'), '');
  v_meals   text := nullif(trim(p_data ->> 'meals'), '');
  v_service text := nullif(trim(p_data ->> 'service'), '');
  v_contact uuid;
  v_submission uuid;
begin
  if v_email is null and v_phone is null then
    raise exception 'submit_lead: e-posta ya da telefon gerekli';
  end if;

  if v_email is not null then
    select id into v_contact from public.contacts where email = v_email;
  end if;
  if v_contact is null and v_phone is not null then
    select id into v_contact from public.contacts where phone = v_phone;
  end if;

  if v_contact is null then
    insert into public.contacts (name, company, email, phone, address, meals, service, source, kvkk_consent_at)
    values (v_name, v_company, v_email, v_phone, v_address, v_meals, v_service, p_kind, now())
    returning id into v_contact;
  else
    update public.contacts c set
      name     = coalesce(c.name, v_name),
      company  = coalesce(c.company, v_company),
      email    = coalesce(c.email, case when not exists (
                   select 1 from public.contacts o where o.email = v_email) then v_email end),
      phone    = coalesce(c.phone, case when not exists (
                   select 1 from public.contacts o where o.phone = v_phone) then v_phone end),
      address  = coalesce(c.address, v_address),
      -- Öğün sayısı ve hizmet türü değişebilir: son talep geçerlidir.
      meals    = coalesce(v_meals, c.meals),
      service  = coalesce(v_service, c.service),
      kvkk_consent_at = coalesce(c.kvkk_consent_at, now()),
      last_seen_at = now(),
      deleted_at   = null
    where c.id = v_contact;
  end if;

  insert into public.submissions (contact_id, kind, data)
  values (v_contact, p_kind, p_data)
  returning id into v_submission;

  return v_submission;
end;
$$;
revoke execute on function public.submit_lead(text, jsonb) from public, anon, authenticated;
grant execute on function public.submit_lead(text, jsonb) to service_role;
revoke execute on function private.normalize_phone(text) from public, anon, authenticated;
grant execute on function private.normalize_phone(text) to service_role;

-- Analiz özeti -------------------------------------------------------------------
-- Tek çağrıda sayılar, günlük seri ve dağılımlar. Günler Türkiye saatine göre.
-- security invoker: RLS uygulanır, yalnızca admin sonuç alır.
create function public.analytics_overview(p_from timestamptz, p_to timestamptz)
returns jsonb
language sql stable security invoker set search_path = '' as $$
  with
  v as (
    select * from public.page_views where at >= p_from and at < p_to
  ),
  days as (
    select generate_series(
      (p_from at time zone 'Europe/Istanbul')::date,
      ((p_to - interval '1 second') at time zone 'Europe/Istanbul')::date,
      interval '1 day'
    )::date as day
  ),
  per_day as (
    select (at at time zone 'Europe/Istanbul')::date as day,
           count(*) as views,
           count(distinct visitor) as visitors
    from v group by 1
  ),
  subs as (
    select kind from public.submissions where created_at >= p_from and created_at < p_to
  ),
  pages as (
    select path, count(*) as views, count(distinct visitor) as visitors
    from v group by path order by views desc limit 10
  ),
  sources as (
    select coalesce(source, referrer, 'Doğrudan') as name, count(*) as views
    from v group by 1 order by views desc limit 8
  ),
  devices as (
    select device as name, count(*) as views from v group by 1
  ),
  forms as (
    select kind as name, count(*) as views from subs group by 1
  )
  select jsonb_build_object(
    'views', (select count(*) from v),
    'visitors', (select coalesce(sum(visitors), 0) from per_day),
    'submissions', (select count(*) from subs),
    'live', (
      select count(distinct visitor) from public.page_views
      where at > now() - interval '5 minutes'
    ),
    'series', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'day', d.day,
        'views', coalesce(p.views, 0),
        'visitors', coalesce(p.visitors, 0)
      ) order by d.day), '[]'::jsonb)
      from days d left join per_day p using (day)
    ),
    'pages', (select coalesce(jsonb_agg(to_jsonb(x) order by x.views desc), '[]'::jsonb) from pages x),
    'sources', (select coalesce(jsonb_agg(to_jsonb(x) order by x.views desc), '[]'::jsonb) from sources x),
    'devices', (select coalesce(jsonb_agg(to_jsonb(x) order by x.views desc), '[]'::jsonb) from devices x),
    'forms', (select coalesce(jsonb_agg(to_jsonb(x) order by x.views desc), '[]'::jsonb) from forms x)
  );
$$;
revoke execute on function public.analytics_overview(timestamptz, timestamptz) from public, anon;
grant execute on function public.analytics_overview(timestamptz, timestamptz) to authenticated;

-- Storage --------------------------------------------------------------------------
-- Tek herkese açık bucket: galeri/, belgeler/, blog/ klasörleri.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('media', 'media', true, 20971520,
   array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf', 'video/mp4'])
on conflict (id) do nothing;

create policy "admin: media" on storage.objects for all to authenticated
  using (bucket_id = 'media' and (select private.is_admin()))
  with check (bucket_id = 'media' and (select private.is_admin()));

-- Yetkiler ---------------------------------------------------------------------
-- Yeni projelerde tablolar Data API'ye kendiliğinden açılmayabilir; açıkça
-- verilir. Satır düzeyindeki asıl sınır yukarıdaki RLS politikalarıdır.
grant select on public.menu_weeks, public.certificates, public.gallery_items,
  public.settings, public.posts to anon;
grant select, insert, update, delete on all tables in schema public to authenticated, service_role;
grant usage, select on all sequences in schema public to authenticated, service_role;
grant execute on function public.analytics_overview(timestamptz, timestamptz) to service_role;
