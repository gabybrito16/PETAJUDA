
grant usage on schema public to anon, authenticated;
grant select on public.posts to anon, authenticated;
grant insert, update, delete on public.posts to authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert on public.access_logs to authenticated;

drop policy if exists "Profiles are readable" on public.profiles;
drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile" on public.profiles for select using (auth.uid() = id);

drop policy if exists "Users can insert own access log" on public.access_logs;
drop policy if exists "Users can read own access log" on public.access_logs;
create policy "Users can insert own access log" on public.access_logs for insert with check (auth.uid() = user_id);
create policy "Users can read own access log" on public.access_logs for select using (auth.uid() = user_id);

create or replace view public.feed_posts as
select
  p.id, p.user_id, p.type, p.name, p.neighborhood, p.description, p.photo_url,
  p.species, p.gender, p.breed, p.age, p.whatsapp, p.color, p.last_seen,
  p.created_at, pr.full_name as author_name
from public.posts p
join public.profiles pr on pr.id = p.user_id;

grant select on public.feed_posts to anon, authenticated;

grant select on storage.objects to anon, authenticated;
grant insert on storage.objects to authenticated;
