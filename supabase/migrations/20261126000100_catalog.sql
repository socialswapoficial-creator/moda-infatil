create table public.moda_catalog_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
create table public.moda_products (
  id text primary key check (id ~ '^[a-z0-9-]{1,80}$'),
  name text not null check (char_length(trim(name)) between 1 and 100),
  category text not null check (category in ('camisetas','vestidos','shorts','bebes','conjuntos','moletons')),
  price integer not null check (price between 0 and 99999999),
  color text not null check (char_length(trim(color)) between 1 and 50),
  color_hex text not null check (color_hex ~ '^#[0-9a-fA-F]{6}$'),
  sizes text[] not null check (cardinality(sizes) between 1 and 20 and array_position(sizes,null) is null),
  image text not null check (image ~ '^([a-z0-9-]+\.webp|products/[a-f0-9-]+\.(jpg|png|webp))$')
);
create table public.moda_hero (
  id boolean primary key default true check (id),
  desktop text check (desktop is null or desktop ~ '^hero/[a-f0-9-]+\.(jpg|png|webp)$'),
  mobile text check (mobile is null or mobile ~ '^hero/[a-f0-9-]+\.(jpg|png|webp)$')
);

alter table public.moda_catalog_admins enable row level security;
alter table public.moda_products enable row level security;
alter table public.moda_hero enable row level security;
revoke all on public.moda_catalog_admins, public.moda_products, public.moda_hero from anon, authenticated;
grant select on public.moda_catalog_admins to authenticated;
grant select on public.moda_products, public.moda_hero to anon, authenticated;
grant insert, update, delete on public.moda_products to authenticated;
grant update on public.moda_hero to authenticated;
create policy "Read own catalog membership" on public.moda_catalog_admins
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Read products" on public.moda_products for select to anon, authenticated using (true);
create policy "Read hero" on public.moda_hero for select to anon, authenticated using (true);
create policy "Manage products" on public.moda_products for all to authenticated
  using (exists (select 1 from public.moda_catalog_admins where user_id = (select auth.uid())))
  with check (exists (select 1 from public.moda_catalog_admins where user_id = (select auth.uid())));
create policy "Manage hero" on public.moda_hero for update to authenticated
  using (exists (select 1 from public.moda_catalog_admins where user_id = (select auth.uid())))
  with check (exists (select 1 from public.moda_catalog_admins where user_id = (select auth.uid())));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('moda-infantil-media', 'moda-infantil-media', true, 5242880, array['image/jpeg','image/png','image/webp']);
create policy "Upload Moda Infantil media" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'moda-infantil-media' and name ~ '^(products|hero)/[a-f0-9-]+\.(jpg|png|webp)$'
    and exists (select 1 from public.moda_catalog_admins where user_id = (select auth.uid()))
  );
insert into public.moda_hero (id) values (true);
insert into public.moda_products (id,name,category,price,color,color_hex,sizes,image) values
  ('camiseta', 'Camiseta Sol Bordado', 'camisetas', 4990, 'Azul bebê', '#a8cce0', array['2','4','6','8'], 'camiseta.webp'),
  ('vestido', 'Vestido Xadrez de Algodão', 'vestidos', 8990, 'Amarelo manteiga', '#e9d48b', array['2','4','6','8'], 'vestido.webp'),
  ('short', 'Short Jeans Leve', 'shorts', 6490, 'Jeans claro', '#8ea9bc', array['4','6','8','10'], 'short.webp'),
  ('body', 'Body Algodão Nuvem', 'bebes', 3990, 'Creme', '#e3d8bf', array['P','M','G'], 'body.webp'),
  ('conjunto', 'Conjunto Listras do Mar', 'conjuntos', 9990, 'Azul e branco', '#9dbbd4', array['2','4','6','8'], 'conjunto.webp'),
  ('moletom', 'Moletom Dia de Sol', 'moletons', 7990, 'Amarelo manteiga', '#e9d48b', array['4','6','8','10'], 'moletom.webp'),
  ('camiseta-veleiro', 'Camiseta Veleiro Bordado', 'camisetas', 5290, 'Branco', '#f3f1e7', array['2','4','6','8'], 'camiseta-veleiro.webp'),
  ('camiseta-margarida', 'Camiseta Margarida', 'camisetas', 4990, 'Lilás', '#cbb7df', array['2','4','6','8'], 'camiseta-margarida.webp'),
  ('vestido-coral', 'Vestido de Algodão com Babados', 'vestidos', 8490, 'Coral', '#df8581', array['2','4','6','8'], 'vestido-coral.webp'),
  ('vestido-jardim', 'Vestido Jardim', 'vestidos', 9290, 'Verde menta', '#a9cbb5', array['2','4','6','8'], 'vestido-jardim.webp'),
  ('short-sarja', 'Short de Sarja', 'shorts', 6490, 'Bege', '#c8af89', array['4','6','8','10'], 'short-sarja.webp'),
  ('short-marinheiro', 'Short de Malha com Cordão', 'shorts', 5590, 'Azul marinho', '#314864', array['4','6','8','10'], 'short-marinheiro.webp'),
  ('body-menta', 'Body de Algodão Liso', 'bebes', 3990, 'Verde menta', '#b9d6c4', array['P','M','G'], 'body-menta.webp'),
  ('body-nuvens', 'Body Chuva de Nuvens', 'bebes', 4290, 'Rosa claro', '#edcad4', array['P','M','G'], 'body-nuvens.webp'),
  ('moletom-capuz', 'Moletom com Capuz', 'moletons', 9490, 'Verde sálvia', '#a2af96', array['4','6','8','10'], 'moletom-capuz.webp'),
  ('moletom-lilas', 'Moletom Gola Redonda', 'moletons', 7990, 'Lavanda', '#bba9d6', array['4','6','8','10'], 'moletom-lilas.webp'),
  ('conjunto-salvia', 'Conjunto de Algodão', 'conjuntos', 9990, 'Verde sálvia', '#a2af96', array['2','4','6','8'], 'conjunto-salvia.webp'),
  ('conjunto-caramelo', 'Conjunto Listrado Caramelo', 'conjuntos', 10990, 'Creme e caramelo', '#bd9165', array['2','4','6','8'], 'conjunto-caramelo.webp');
