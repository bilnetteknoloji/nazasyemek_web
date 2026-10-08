-- Ziyaret analizi ayrıntısı: işletim sistemi, tarayıcı, ülke/şehir, giriş sayfası.
--   • `os` / `browser` tarayıcı kimliğinden sunucuda çıkarılan kaba sınıftır
--     ("iOS", "Chrome"); tarayıcı kimliğinin kendisi SAKLANMAZ.
--   • `country` / `city` Cloudflare'in eklediği konum başlıklarından gelir
--     (ülke kodu ve şehir adı); IP saklanmaz.
--   • `entry`: ziyaretin ilk sayfası (siteye dışarıdan gelinen sayfa).

alter table public.page_views
  add column os      text check (length(os) <= 30),
  add column browser text check (length(browser) <= 30),
  add column country text check (length(country) <= 2),
  add column city    text check (length(city) <= 80),
  add column entry   boolean not null default false;

-- Kanal: arama motoru / sosyal medya / başka site / doğrudan.
create function private.channel(p_source text, p_referrer text) returns text
language sql immutable set search_path = '' as $$
  select case
    when coalesce(p_source, p_referrer) is null then 'Doğrudan'
    when coalesce(p_source, p_referrer) ~* '(^|\.)(google|yandex|bing|yahoo|duckduckgo|ecosia|yaani|baidu|naver|seznam)\.'
      or p_source ~* '^(google|yandex|bing|yahoo)$' then 'Arama motoru'
    when coalesce(p_source, p_referrer) ~* '(instagram|facebook|fb\.|tiktok|t\.co$|twitter|x\.com|linkedin|youtube|whatsapp|pinterest|telegram)'
      then 'Sosyal medya'
    else 'Başka site'
  end;
$$;
grant execute on function private.channel(text, text) to authenticated, service_role;

-- Arama motoru adı (yalnızca arama kanalı için).
create function private.search_engine(p_source text, p_referrer text) returns text
language sql immutable set search_path = '' as $$
  select case
    when coalesce(p_source, p_referrer) ~* 'google' then 'Google'
    when coalesce(p_source, p_referrer) ~* 'yandex' then 'Yandex'
    when coalesce(p_source, p_referrer) ~* 'bing' then 'Bing'
    when coalesce(p_source, p_referrer) ~* 'yahoo' then 'Yahoo'
    when coalesce(p_source, p_referrer) ~* 'duckduckgo' then 'DuckDuckGo'
    else 'Diğer'
  end;
$$;
grant execute on function private.search_engine(text, text) to authenticated, service_role;

-- Analiz raporu: önceki dönemle karşılaştırma, kanallar, arama motorları,
-- işletim sistemi, tarayıcı, ülke/şehir, saat ve gün dağılımı, giriş sayfaları,
-- tek sayfada çıkma oranı. Günler Türkiye saatine göre. security invoker:
-- RLS uygulanır, yalnızca admin sonuç alır.
create or replace function public.analytics_overview(p_from timestamptz, p_to timestamptz)
returns jsonb
language sql stable security invoker set search_path = '' as $$
  with
  v as (
    select *, private.channel(source, referrer) as channel
    from public.page_views where at >= p_from and at < p_to
  ),
  prev as (
    select * from public.page_views
    where at >= p_from - (p_to - p_from) and at < p_from
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
  -- Ziyaret = aynı gün aynı ziyaretçi.
  visits as (
    select visitor, (at at time zone 'Europe/Istanbul')::date as day, count(*) as views
    from v group by 1, 2
  ),
  prev_visits as (
    select count(*) as n from (
      select 1 from prev group by visitor, (at at time zone 'Europe/Istanbul')::date
    ) x
  ),
  subs as (
    select kind from public.submissions where created_at >= p_from and created_at < p_to
  ),
  prev_subs as (
    select count(*) as n from public.submissions
    where created_at >= p_from - (p_to - p_from) and created_at < p_from
  ),
  grouped as (
    select 'pages' as k, path as name, count(*) as views, count(distinct visitor) as visitors from v group by path
    union all
    select 'entries', path, count(*), count(distinct visitor) from v where entry group by path
    union all
    select 'sources', coalesce(source, referrer, 'Doğrudan'), count(*), count(distinct visitor) from v group by 2
    union all
    select 'channels', channel, count(*), count(distinct visitor) from v group by channel
    union all
    select 'engines', private.search_engine(source, referrer), count(*), count(distinct visitor)
      from v where channel = 'Arama motoru' group by 2
    union all
    select 'devices', device, count(*), count(distinct visitor) from v group by device
    union all
    select 'os', coalesce(os, 'Bilinmiyor'), count(*), count(distinct visitor) from v group by 2
    union all
    select 'browsers', coalesce(browser, 'Bilinmiyor'), count(*), count(distinct visitor) from v group by 2
    union all
    select 'countries', coalesce(country, '??'), count(*), count(distinct visitor) from v group by 2
    union all
    select 'cities', city, count(*), count(distinct visitor) from v where city is not null group by city
  ),
  ranked as (
    select *, row_number() over (partition by k order by views desc, name) as rn from grouped
  )
  select jsonb_build_object(
    'views', (select count(*) from v),
    'visitors', (select coalesce(sum(visitors), 0) from per_day),
    'visits', (select count(*) from visits),
    'submissions', (select count(*) from subs),
    'bounce', (
      select case when count(*) = 0 then 0
             else round(100.0 * count(*) filter (where views = 1) / count(*)) end
      from visits
    ),
    'pagesPerVisit', (
      select case when count(*) = 0 then 0 else round(avg(views)::numeric, 1) end from visits
    ),
    'previous', jsonb_build_object(
      'views', (select count(*) from prev),
      'visits', (select n from prev_visits),
      'submissions', (select n from prev_subs)
    ),
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
    'hours', (
      select coalesce(jsonb_agg(jsonb_build_object('hour', h, 'views', coalesce(c, 0)) order by h), '[]'::jsonb)
      from generate_series(0, 23) h
      left join (
        select extract(hour from at at time zone 'Europe/Istanbul')::int as hr, count(*) as c from v group by 1
      ) x on x.hr = h
    ),
    'weekdays', (
      select coalesce(jsonb_agg(jsonb_build_object('day', d, 'views', coalesce(c, 0)) order by d), '[]'::jsonb)
      from generate_series(1, 7) d
      left join (
        select extract(isodow from at at time zone 'Europe/Istanbul')::int as dw, count(*) as c from v group by 1
      ) x on x.dw = d
    ),
    'groups', (
      select coalesce(jsonb_object_agg(k, items), '{}'::jsonb) from (
        select k, jsonb_agg(jsonb_build_object('name', name, 'views', views, 'visitors', visitors) order by views desc, name) as items
        from ranked where rn <= 12 group by k
      ) g
    ),
    'forms', (
      select coalesce(jsonb_agg(jsonb_build_object('name', kind, 'views', n) order by n desc), '[]'::jsonb)
      from (select kind, count(*) as n from subs group by kind) x
    ),
    -- Önceki panel sürümüyle uyumluluk (yayın geçişi sırasında).
    'pages', (
      select coalesce(jsonb_agg(jsonb_build_object('path', name, 'views', views, 'visitors', visitors) order by views desc), '[]'::jsonb)
      from ranked where k = 'pages' and rn <= 10
    ),
    'sources', (
      select coalesce(jsonb_agg(jsonb_build_object('name', name, 'views', views) order by views desc), '[]'::jsonb)
      from ranked where k = 'sources' and rn <= 8
    ),
    'devices', (
      select coalesce(jsonb_agg(jsonb_build_object('name', name, 'views', views) order by views desc), '[]'::jsonb)
      from ranked where k = 'devices'
    )
  );
$$;
