create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.sync_guestbook_status()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'approved' then
    new.is_approved = true;
    new.approved_at = coalesce(new.approved_at, timezone('utc', now()));
  else
    new.is_approved = false;

    if new.status <> 'approved' then
      new.approved_at = null;
    end if;
  end if;

  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email text,
  role text not null default 'guest',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  nickname text default '',
  avatar_url text,
  quote text default '',
  short_bio text default '',
  hobbies text[] not null default '{}',
  social_links jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  inserted_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  memory_date date not null,
  image_url text,
  video_url text,
  caption text default '',
  category text not null,
  album_name text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  inserted_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date not null,
  description text not null default '',
  image_url text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  inserted_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.guestbook_messages (
  id uuid primary key default gen_random_uuid(),
  sender_name text not null,
  message text not null,
  target_member_id uuid references public.members(id) on delete set null,
  is_anonymous boolean not null default false,
  status text not null default 'pending',
  is_approved boolean not null default false,
  approved_at timestamptz,
  inserted_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  options jsonb not null,
  correct_option_id text not null,
  success_message text not null default '',
  fail_message text not null default '',
  is_active boolean not null default false,
  inserted_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.secret_letters (
  id uuid primary key default gen_random_uuid(),
  sender_name text,
  target_member_id uuid references public.members(id) on delete set null,
  message text not null,
  is_anonymous boolean not null default false,
  status text not null default 'pending',
  is_public boolean not null default false,
  inserted_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.vote_categories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  is_active boolean not null default true,
  is_visible boolean not null default true,
  inserted_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.vote_categories(id) on delete cascade,
  target_member_id uuid not null references public.members(id) on delete cascade,
  voter_key text not null,
  inserted_at timestamptz not null default timezone('utc', now()),
  constraint votes_unique_voter_per_category unique (category_id, voter_key)
);

create table if not exists public.time_capsules (
  id uuid primary key default gen_random_uuid(),
  sender_name text not null,
  message text not null,
  unlock_date date not null,
  status text not null default 'locked',
  inserted_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reactions (
  id uuid primary key default gen_random_uuid(),
  target_type text not null,
  target_id text not null,
  reaction_type text not null default 'love',
  voter_key text not null,
  inserted_at timestamptz not null default timezone('utc', now()),
  constraint reactions_unique_target_voter unique (target_type, target_id, reaction_type, voter_key)
);

alter table if exists public.profiles add column if not exists display_name text;
alter table if exists public.profiles add column if not exists email text;
alter table if exists public.profiles add column if not exists role text not null default 'guest';
alter table if exists public.profiles add column if not exists created_at timestamptz not null default timezone('utc', now());
alter table if exists public.profiles add column if not exists updated_at timestamptz not null default timezone('utc', now());

alter table if exists public.members add column if not exists social_links jsonb not null default '{}'::jsonb;
alter table if exists public.memories add column if not exists video_url text;
alter table if exists public.memories add column if not exists album_name text;
alter table if exists public.guestbook_messages add column if not exists target_member_id uuid references public.members(id) on delete set null;
alter table if exists public.guestbook_messages add column if not exists is_anonymous boolean not null default false;
alter table if exists public.guestbook_messages add column if not exists status text not null default 'pending';
alter table if exists public.guestbook_messages add column if not exists is_approved boolean not null default false;
alter table if exists public.guestbook_messages add column if not exists approved_at timestamptz;
alter table if exists public.quiz_questions add column if not exists inserted_at timestamptz not null default timezone('utc', now());
alter table if exists public.quiz_questions add column if not exists updated_at timestamptz not null default timezone('utc', now());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, email, role)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'display_name', ''),
    new.email,
    'guest'
  )
  on conflict (id) do update
  set email = excluded.email;

  return new;
end;
$$;

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role from public.profiles where id = auth.uid()),
    'guest'
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() = 'admin';
$$;

create or replace function public.get_vote_results()
returns table (
  category_id uuid,
  target_member_id uuid,
  vote_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    votes.category_id,
    votes.target_member_id,
    count(*)::bigint as vote_count
  from public.votes
  inner join public.vote_categories
    on public.vote_categories.id = votes.category_id
  where public.vote_categories.is_visible = true
  group by votes.category_id, votes.target_member_id;
$$;

create or replace function public.get_reaction_counts()
returns table (
  target_type text,
  target_id text,
  reaction_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    reactions.target_type,
    reactions.target_id,
    count(*)::bigint as reaction_count
  from public.reactions
  group by reactions.target_type, reactions.target_id;
$$;

create or replace function public.get_public_time_capsules()
returns table (
  id uuid,
  sender_name text,
  unlock_date date,
  status text,
  message text,
  inserted_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    time_capsules.id,
    time_capsules.sender_name,
    time_capsules.unlock_date,
    case
      when time_capsules.status = 'hidden' then 'hidden'
      when time_capsules.status = 'opened' or time_capsules.unlock_date <= current_date then 'opened'
      else 'locked'
    end as status,
    case
      when time_capsules.status = 'opened' or time_capsules.unlock_date <= current_date then time_capsules.message
      else null
    end as message,
    time_capsules.inserted_at
  from public.time_capsules
  where time_capsules.status <> 'hidden'
  order by time_capsules.unlock_date asc, time_capsules.inserted_at desc;
$$;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_role_check'
  ) then
    alter table public.profiles
      add constraint profiles_role_check
      check (role in ('admin', 'member', 'guest'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'members_name_check'
  ) then
    alter table public.members
      add constraint members_name_check
      check (char_length(trim(name)) > 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'memories_title_check'
  ) then
    alter table public.memories
      add constraint memories_title_check
      check (char_length(trim(title)) > 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'memories_category_check'
  ) then
    alter table public.memories
      add constraint memories_category_check
      check (category in ('classroom', 'outing', 'event', 'funny'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'timeline_events_title_check'
  ) then
    alter table public.timeline_events
      add constraint timeline_events_title_check
      check (char_length(trim(title)) > 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'guestbook_sender_name_check'
  ) then
    alter table public.guestbook_messages
      add constraint guestbook_sender_name_check
      check (char_length(trim(sender_name)) between 1 and 40);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'guestbook_message_check'
  ) then
    alter table public.guestbook_messages
      add constraint guestbook_message_check
      check (char_length(trim(message)) between 1 and 280);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'guestbook_status_check'
  ) then
    alter table public.guestbook_messages
      add constraint guestbook_status_check
      check (status in ('pending', 'approved', 'rejected'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'quiz_correct_option_check'
  ) then
    alter table public.quiz_questions
      add constraint quiz_correct_option_check
      check (char_length(trim(correct_option_id)) > 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'secret_letters_message_check'
  ) then
    alter table public.secret_letters
      add constraint secret_letters_message_check
      check (char_length(trim(message)) between 1 and 800);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'secret_letters_status_check'
  ) then
    alter table public.secret_letters
      add constraint secret_letters_status_check
      check (status in ('pending', 'approved', 'rejected'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'vote_categories_title_check'
  ) then
    alter table public.vote_categories
      add constraint vote_categories_title_check
      check (char_length(trim(title)) > 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'votes_voter_key_check'
  ) then
    alter table public.votes
      add constraint votes_voter_key_check
      check (char_length(trim(voter_key)) > 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'time_capsules_sender_name_check'
  ) then
    alter table public.time_capsules
      add constraint time_capsules_sender_name_check
      check (char_length(trim(sender_name)) between 1 and 80);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'time_capsules_message_check'
  ) then
    alter table public.time_capsules
      add constraint time_capsules_message_check
      check (char_length(trim(message)) between 1 and 800);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'time_capsules_status_check'
  ) then
    alter table public.time_capsules
      add constraint time_capsules_status_check
      check (status in ('locked', 'opened', 'hidden'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'reactions_target_type_check'
  ) then
    alter table public.reactions
      add constraint reactions_target_type_check
      check (target_type in ('member', 'memory', 'timeline', 'guestbook'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'reactions_reaction_type_check'
  ) then
    alter table public.reactions
      add constraint reactions_reaction_type_check
      check (reaction_type in ('love'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'reactions_voter_key_check'
  ) then
    alter table public.reactions
      add constraint reactions_voter_key_check
      check (char_length(trim(voter_key)) > 0);
  end if;
end $$;

create index if not exists profiles_role_idx
  on public.profiles (role);

create index if not exists members_published_sort_idx
  on public.members (is_published, sort_order, inserted_at);

create index if not exists memories_published_sort_idx
  on public.memories (is_published, memory_date desc, sort_order, inserted_at);

create index if not exists timeline_events_published_sort_idx
  on public.timeline_events (is_published, event_date, sort_order, inserted_at);

create index if not exists guestbook_messages_status_idx
  on public.guestbook_messages (status, inserted_at desc);

create index if not exists guestbook_messages_target_member_idx
  on public.guestbook_messages (target_member_id);

create index if not exists secret_letters_status_idx
  on public.secret_letters (status, is_public, inserted_at desc);

create index if not exists secret_letters_target_member_idx
  on public.secret_letters (target_member_id);

create index if not exists vote_categories_active_idx
  on public.vote_categories (is_active, is_visible, inserted_at desc);

create index if not exists votes_category_target_idx
  on public.votes (category_id, target_member_id);

create index if not exists time_capsules_unlock_idx
  on public.time_capsules (status, unlock_date, inserted_at desc);

create index if not exists reactions_target_idx
  on public.reactions (target_type, target_id, reaction_type);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_members_updated_at on public.members;
create trigger set_members_updated_at
before update on public.members
for each row
execute function public.set_updated_at();

drop trigger if exists set_memories_updated_at on public.memories;
create trigger set_memories_updated_at
before update on public.memories
for each row
execute function public.set_updated_at();

drop trigger if exists set_timeline_events_updated_at on public.timeline_events;
create trigger set_timeline_events_updated_at
before update on public.timeline_events
for each row
execute function public.set_updated_at();

drop trigger if exists set_guestbook_messages_updated_at on public.guestbook_messages;
create trigger set_guestbook_messages_updated_at
before update on public.guestbook_messages
for each row
execute function public.set_updated_at();

drop trigger if exists sync_guestbook_status on public.guestbook_messages;
create trigger sync_guestbook_status
before insert or update on public.guestbook_messages
for each row
execute function public.sync_guestbook_status();

drop trigger if exists set_quiz_questions_updated_at on public.quiz_questions;
create trigger set_quiz_questions_updated_at
before update on public.quiz_questions
for each row
execute function public.set_updated_at();

drop trigger if exists set_secret_letters_updated_at on public.secret_letters;
create trigger set_secret_letters_updated_at
before update on public.secret_letters
for each row
execute function public.set_updated_at();

drop trigger if exists set_vote_categories_updated_at on public.vote_categories;
create trigger set_vote_categories_updated_at
before update on public.vote_categories
for each row
execute function public.set_updated_at();

drop trigger if exists set_time_capsules_updated_at on public.time_capsules;
create trigger set_time_capsules_updated_at
before update on public.time_capsules
for each row
execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

grant execute on function public.current_user_role() to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.get_vote_results() to anon, authenticated;
grant execute on function public.get_reaction_counts() to anon, authenticated;
grant execute on function public.get_public_time_capsules() to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.members enable row level security;
alter table public.memories enable row level security;
alter table public.timeline_events enable row level security;
alter table public.guestbook_messages enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.secret_letters enable row level security;
alter table public.vote_categories enable row level security;
alter table public.votes enable row level security;
alter table public.time_capsules enable row level security;
alter table public.reactions enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id or public.is_admin());

drop policy if exists "Admins can manage profiles" on public.profiles;
create policy "Admins can manage profiles"
on public.profiles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read published members" on public.members;
create policy "Public can read published members"
on public.members
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Admins can manage members" on public.members;
create policy "Admins can manage members"
on public.members
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read published memories" on public.memories;
create policy "Public can read published memories"
on public.memories
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Admins can manage memories" on public.memories;
create policy "Admins can manage memories"
on public.memories
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read published timeline events" on public.timeline_events;
create policy "Public can read published timeline events"
on public.timeline_events
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Admins can manage timeline events" on public.timeline_events;
create policy "Admins can manage timeline events"
on public.timeline_events
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read approved guestbook messages" on public.guestbook_messages;
create policy "Public can read approved guestbook messages"
on public.guestbook_messages
for select
to anon, authenticated
using (status = 'approved');

drop policy if exists "Public can insert pending guestbook messages" on public.guestbook_messages;
create policy "Public can insert pending guestbook messages"
on public.guestbook_messages
for insert
to anon, authenticated
with check (
  status = 'pending'
  and is_approved = false
);

drop policy if exists "Admins can manage guestbook messages" on public.guestbook_messages;
create policy "Admins can manage guestbook messages"
on public.guestbook_messages
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read active quiz" on public.quiz_questions;
create policy "Public can read active quiz"
on public.quiz_questions
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Admins can manage quiz questions" on public.quiz_questions;
create policy "Admins can manage quiz questions"
on public.quiz_questions
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read approved secret letters" on public.secret_letters;
create policy "Public can read approved secret letters"
on public.secret_letters
for select
to anon, authenticated
using (status = 'approved' and is_public = true);

drop policy if exists "Public can insert secret letters" on public.secret_letters;
create policy "Public can insert secret letters"
on public.secret_letters
for insert
to anon, authenticated
with check (
  status = 'pending'
  and is_public = false
);

drop policy if exists "Admins can manage secret letters" on public.secret_letters;
create policy "Admins can manage secret letters"
on public.secret_letters
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read active vote categories" on public.vote_categories;
create policy "Public can read active vote categories"
on public.vote_categories
for select
to anon, authenticated
using (is_active = true and is_visible = true);

drop policy if exists "Admins can manage vote categories" on public.vote_categories;
create policy "Admins can manage vote categories"
on public.vote_categories
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can insert votes" on public.votes;
create policy "Public can insert votes"
on public.votes
for insert
to anon, authenticated
with check (
  char_length(trim(voter_key)) > 0
  and exists (
    select 1
    from public.vote_categories
    where public.vote_categories.id = category_id
      and public.vote_categories.is_active = true
      and public.vote_categories.is_visible = true
  )
  and exists (
    select 1
    from public.members
    where public.members.id = target_member_id
      and public.members.is_published = true
  )
);

drop policy if exists "Admins can manage votes" on public.votes;
create policy "Admins can manage votes"
on public.votes
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can insert time capsules" on public.time_capsules;
create policy "Public can insert time capsules"
on public.time_capsules
for insert
to anon, authenticated
with check (
  status = 'locked'
  and unlock_date >= current_date
);

drop policy if exists "Admins can manage time capsules" on public.time_capsules;
create policy "Admins can manage time capsules"
on public.time_capsules
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can insert reactions" on public.reactions;
create policy "Public can insert reactions"
on public.reactions
for insert
to anon, authenticated
with check (
  char_length(trim(voter_key)) > 0
  and reaction_type = 'love'
);

drop policy if exists "Admins can manage reactions" on public.reactions;
create policy "Admins can manage reactions"
on public.reactions
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
