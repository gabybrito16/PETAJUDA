create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  whatsapp text not null,
  cpf text not null,
  cep text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('adoption','lost')),
  name text not null,
  neighborhood text not null,
  description text not null,
  photo_url text,
  species text,
  gender text,
  breed text,
  age text,
  whatsapp text not null,
  color text,
  last_seen text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.posts enable row level security;

create policy "Profiles are readable" on public.profiles for select using (true);
create policy "Users create own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Posts are readable" on public.posts for select using (true);
create policy "Users create own posts" on public.posts for insert with check (auth.uid() = user_id);
create policy "Users update own posts" on public.posts for update using (auth.uid() = user_id);
create policy "Users delete own posts" on public.posts for delete using (auth.uid() = user_id);

create or replace function public.create_profile_for_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, whatsapp, cpf, cep)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name','Usuário'), coalesce(new.raw_user_meta_data->>'whatsapp',''), coalesce(new.raw_user_meta_data->>'cpf',''), coalesce(new.raw_user_meta_data->>'cep',''));
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.create_profile_for_new_user();

insert into storage.buckets (id, name, public) values ('post-photos', 'post-photos', true);
create policy "Public can view post photos" on storage.objects for select using (bucket_id = 'post-photos');
create policy "Authenticated users upload post photos" on storage.objects for insert to authenticated with check (bucket_id = 'post-photos' and (storage.foldername(name))[1] = auth.uid()::text);
