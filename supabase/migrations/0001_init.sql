-- Invitation system: initial schema
-- Events are created by staff (Supabase Auth users). Guests register themselves
-- through a public link, so registrations are inserted by the server with the
-- service role; staff read and manage them through RLS.

create extension if not exists "pgcrypto";

-- ---------- helpers ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- events ----------
create type public.event_type as enum ('private', 'business');

create table public.events (
  id                     uuid primary key default gen_random_uuid(),
  slug                   text not null unique,
  title                  text not null,
  event_type             public.event_type not null default 'private',
  description            text,
  date_time              timestamptz not null,
  venue_name             text,
  address                text,
  lat                    double precision,
  lng                    double precision,
  template_id            text not null default 'classic',
  media_url              text,
  primary_color          text,
  gift_link_url          text,
  reminder_offset_hours  integer not null default 24 check (reminder_offset_hours >= 0),
  reminder_sent_at       timestamptz,
  rsvp_deadline          timestamptz,
  max_guests             integer check (max_guests is null or max_guests > 0),
  is_active              boolean not null default true,
  created_by             uuid references auth.users(id) on delete set null,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index events_date_time_idx on public.events (date_time);
create index events_reminder_due_idx on public.events (date_time)
  where reminder_sent_at is null and is_active;

create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- ---------- registrations ----------
create type public.registration_status as enum ('confirmed', 'cancelled');
create type public.registration_source as enum ('self', 'manual');

create table public.registrations (
  id           uuid primary key default gen_random_uuid(),
  event_id     uuid not null references public.events(id) on delete cascade,
  full_name    text not null check (char_length(full_name) between 1 and 120),
  phone        text not null check (phone ~ '^\+[1-9][0-9]{6,14}$'),  -- E.164
  email        text check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  guest_count  integer not null default 1 check (guest_count between 1 and 50),
  guest_names  jsonb not null default '[]'::jsonb,
  notes        text check (notes is null or char_length(notes) <= 1000),
  status       public.registration_status not null default 'confirmed',
  source       public.registration_source not null default 'self',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (event_id, phone)
);

create index registrations_event_idx on public.registrations (event_id);

create trigger registrations_set_updated_at
  before update on public.registrations
  for each row execute function public.set_updated_at();

-- ---------- row level security ----------
alter table public.events enable row level security;
alter table public.registrations enable row level security;

-- Staff: any authenticated user sees and manages everything (single business).
create policy "staff full access to events"
  on public.events for all
  to authenticated
  using (true) with check (true);

create policy "staff full access to registrations"
  on public.registrations for all
  to authenticated
  using (true) with check (true);

-- Public guests never touch the tables directly: the registration endpoint
-- runs on the server with the service role, which bypasses RLS. The public
-- event page reads only the columns it needs through the same server path.
-- No policies for `anon` on purpose.

-- ---------- storage ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'event-media',
  'event-media',
  true,
  10485760, -- 10 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

create policy "public read event media"
  on storage.objects for select
  to public
  using (bucket_id = 'event-media');

create policy "staff upload event media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'event-media');

create policy "staff update event media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'event-media');

create policy "staff delete event media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'event-media');
