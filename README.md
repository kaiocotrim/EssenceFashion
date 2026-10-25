# Essence Fashion

Base com Next.js, React, TypeScript, Tailwind CSS e Turborepo, usando npm workspaces.

## Desenvolvimento

Requer Node.js 22 ou superior.

```sh
npm install
npm run dev
```

Abra http://localhost:3000. O aplicativo fica em `apps/web`.

A página inicial inclui apresentação da marca, coleção com filtros por categoria,
busca por nome, favoritos e sacola demonstrativa com controle de quantidade e subtotal.
O layout se adapta a celulares e computadores. Produtos e preços são ilustrativos;
as imagens são carregadas do Unsplash e dependem de acesso à internet. Favoritos e
sacola ficam na memória da página e são reiniciados ao recarregar. Não há checkout
ou integração de pagamentos.

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

## Hospedagem na Vercel

Importe o repositório na sua conta Vercel e selecione `apps/web` como Root Directory e Next.js como framework. Mantenha habilitado o acesso aos arquivos fora da Root Directory para o workspace e o lockfile da raiz.

A Vercel é o serviço de hospedagem e não precisa ser instalada como dependência do aplicativo. A publicação depende de conectar uma conta Vercel.
resende
