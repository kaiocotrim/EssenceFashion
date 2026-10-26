# Supabase + Prisma da Essen Fashion

Projeto: `mvzyidfagofezowfomqt`. O banco continua no Supabase; o acesso a produtos,
estoque, histórico, envios, configurações e credenciais é feito pelo Prisma ORM.
O Supabase Storage guarda as fotos públicas do catálogo.

## Configurar a conexão

No painel do Supabase, abra **Connect → Session pooler**. Copie a conexão
PostgreSQL e substitua o marcador de senha pela senha do banco. Ela é diferente
da chave de API `sb_secret_...`. Caracteres especiais na senha precisam estar
codificados para URL; use a conexão no formato fornecido pelo painel.

Em `apps/web/.env.local`, preencha:

```dotenv
DATABASE_URL="conexao_postgresql_copiada_do_supabase"
DIRECT_URL="conexao_postgresql_para_migracoes"
```

Para desenvolvimento local, pode usar a mesma conexão **Session pooler** nos
dois campos. `DATABASE_URL` é usada pelo aplicativo; `DIRECT_URL` pela CLI de
migração, com fallback para `DATABASE_URL` quando não for informada. Não use
uma conexão de transaction pooler para executar migrações.

Na Vercel, configure `DATABASE_URL` com a conexão de execução adequada a
serverless (transaction pooler) e `DIRECT_URL` com a conexão direta/session pooler
para migrações. As URLs são privadas e não usam prefixo `NEXT_PUBLIC_`.
Reinicie o servidor após mudar as variáveis.

Para fotos, mantenha a URL do projeto e a chave privada do Storage:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://mvzyidfagofezowfomqt.supabase.co
SUPABASE_SECRET_KEY="chave_secret_do_projeto"
```

Também há suporte a `SUPABASE_URL` para a URL do servidor e à chave legada
`SUPABASE_SERVICE_ROLE_KEY`. Chaves de API não substituem a conexão PostgreSQL.
Não envie senhas/chaves pelo chat nem as versione no Git.

## Criar as tabelas com Prisma

Execute na raiz do repositório:

```sh
npm run db:validate --workspace=web
npm run db:migrate --workspace=web
npm run db:check --workspace=web
```

`db:migrate` usa `prisma migrate deploy`, sem reset ou exclusão de dados.
A migração inicial é aditiva e compatível com as tabelas `essen_*` da versão
anterior. A configuração e o schema ficam em `apps/web/prisma.config.ts` e
`apps/web/prisma/schema.prisma`. O cliente Prisma é gerado automaticamente em
dev, build, typecheck e testes. Os arquivos gerados não ficam no Git.

## Importar o catálogo

Para começar com o catálogo original e estoque zerado:

```sh
npm run db:seed --workspace=web
```

Se já houve alterações no painel local, use:

```sh
npm run db:import --workspace=web
```

O importador usa os modelos Prisma e envia as fotos locais em uso para o
Supabase Storage. Os comandos recusam sobrescrever uma loja já inicializada
e preservam os arquivos locais. Fotos enviadas antes de uma importação
interrompida podem permanecer no bucket sem uso.

O bucket `essen-product-images` é criado pela API do Storage na importação ou
no primeiro upload. Apenas fotos do catálogo ficam públicas. Um bucket privado
existente não é tornado público automaticamente.

## Administrador e operação

Com o banco conectado, rode `npm run dev` e abra `http://localhost:3000/admin`
para criar o administrador inicial. O Prisma salva somente o hash da senha e
o segredo de sessão no banco. O administrador do modo local anterior não é
copiado automaticamente. O cadastro inicial é limitado ao localhost em
desenvolvimento; depois, o login funciona nas instâncias que usam o mesmo banco.

O login do painel é próprio e não depende de Supabase Auth. `/conta` e o
checkout continuam demonstrativos: não processam pagamento, não criam pedidos
reais e não reservam estoque. Os envios ainda são cadastrados manualmente.

## Modelos e consistência

- `Product` / `essen_products`: cadastro e publicação.
- `ProductVariant` / `essen_product_variants`: estoque por tamanho.
- `StockMovement` / `essen_stock_movements`: histórico.
- `Shipment` / `essen_shipments`: expedição manual.
- `StoreSettings` / `essen_store_settings`: frete e revisão da loja.
- `Admin` / `essen_admin`: credenciais do painel.

As gravações usam transações Prisma e bloqueiam a revisão da loja no
PostgreSQL. Edições antigas são recusadas. Preços usam Decimal no banco;
valores negativos, SKUs duplicados e envios postados sem rastreio também são
impedidos por constraints SQL. As tabelas mantêm RLS e não concedem acesso
direto aos papéis públicos `anon` e `authenticated`.

Sem configuração de banco ou Supabase, o modo local com arquivos continua
disponível para desenvolvimento. Uma configuração parcial não é tratada como
conexão válida. A Vercel exige PostgreSQL para gravações e Storage para fotos.

## Validação

`npm test` executa o Prisma real com driver PostgreSQL contra um banco PGlite
temporário via TCP. Testa importação, tipos, edição de grade, transações,
rollback, revisão e credenciais; também testa o Storage com respostas simuladas.
`npm run test:admin --workspace=web` testa as APIs com arquivos temporários.
Nenhum desses testes usa o banco remoto ou as credenciais reais.

Referências: [Supabase com Prisma](https://supabase.com/docs/guides/database/prisma),
[Prisma com Next.js](https://www.prisma.io/docs/guides/v7/frameworks/nextjs).
