# Essence Fashion

Base com Next.js, React, TypeScript, Tailwind CSS e Turborepo, usando npm workspaces.

## Desenvolvimento

Requer Node.js 22 ou superior.

```sh
npm install
npm run dev
```

Abra http://localhost:3000. O aplicativo fica em `apps/web`.

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

## Hospedagem na Vercel

Importe o repositório na sua conta Vercel e selecione `apps/web` como Root Directory e Next.js como framework. Mantenha habilitado o acesso aos arquivos fora da Root Directory para o workspace e o lockfile da raiz.

A Vercel é o serviço de hospedagem e não precisa ser instalada como dependência do aplicativo. A publicação depende de conectar uma conta Vercel.
