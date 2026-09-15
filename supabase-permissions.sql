
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

create or replace view public.access_flow as
select
  al.id,
  p.full_name as user_name,
  al.page as access,
  case al.page
    when '/feed' then 'Visualizou o feed'
    when '/nova-publicacao' then 'Acessou a criação de publicação'
    when '/perfil' then 'Visualizou o perfil'
    when '/nova-publicacao/adocao' then 'Iniciou publicação de adoção'
    when '/nova-publicacao/perdido' then 'Iniciou publicação de animal perdido'
    else 'Acessou a página'
  end as action,
  al.accessed_at
from public.access_logs al
left join public.profiles p on p.id = al.user_id
order by al.accessed_at desc;

grant select on public.access_flow to authenticated;

grant select on storage.objects to anon, authenticated;
grant insert on storage.objects to authenticated;
