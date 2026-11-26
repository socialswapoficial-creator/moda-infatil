# Painel da Moda Infantil

Sirva a raiz do repositório por HTTP. A vitrine abre em `/` e o painel abre em `/admin/`. Para testar localmente, use `python3 -m http.server 8000` e acesse `http://localhost:8000/admin/`.

1. Em um projeto Supabase ativo, aplique a migração em `supabase/migrations/`. Ela cria as tabelas, as regras de acesso, o bucket público de imagens e importa as 18 peças da vitrine.
2. Preencha `supabase-config.js` com a URL do projeto e a chave **publicável**.
3. Crie o usuário em **Authentication → Users**. Copie o UUID desse usuário e execute no SQL Editor, substituindo o identificador de exemplo:

   ```sql
   insert into public.moda_catalog_admins (user_id)
   values ('00000000-0000-0000-0000-000000000000');
   ```

4. Publique a raiz do repositório no host da vitrine e acesse `/admin/` com a conta autorizada. Use a vitrine e o painel da mesma publicação para manter a configuração em comum.

A API permite a leitura pública do catálogo e dos banners. As alterações e os uploads exigem uma conta na lista de administradores. O painel aceita apenas as seis categorias existentes. Sem configuração ou durante uma falha de conexão, a vitrine mostra o catálogo de demonstração.
