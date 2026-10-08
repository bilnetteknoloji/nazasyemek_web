-- Son ziyaretler listesi için ek sınıflar (kişisel veri değil):
--   • `region`: il/bölge (Cloudflare `cf-region`), `lang`: tarayıcı dili ("tr", "en-US"),
--   • `screen`: ekran genişliği (px).
alter table public.page_views
  add column region text check (length(region) <= 80),
  add column lang   text check (length(lang) <= 12),
  add column screen int  check (screen between 0 and 10000);
