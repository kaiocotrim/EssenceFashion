# Essence Fashion

Base com Next.js, React, TypeScript, Tailwind CSS e Turborepo, usando npm workspaces.

## Desenvolvimento

Requer Node.js 22 ou superior.

```sh
npm install
npm run dev
```

Abra http://localhost:3000. O aplicativo fica em `apps/web`.

A loja inclui o fluxo completo de demonstração:

- `/`: apresentação da marca, coleção, busca, filtros e favoritos.
- `/produto/1` a `/produto/4`: detalhes, seleção de tamanho e quantidade.
- `/sacola`: revisão das peças, remoção e alteração das quantidades.
- `/checkout`: endereço, entrega, resumo do pedido e pagamento por Pix, cartão ou boleto.

A sacola e os favoritos são salvos no navegador e permanecem ao recarregar.
Dados de contato e endereço ficam apenas na memória durante o checkout;
recarregar a página reinicia a etapa de entrega. Use dados fictícios na demonstração.
Produtos, imagens, descrições, preços, fretes e prazos são ilustrativos. As imagens
são carregadas do Unsplash e dependem de acesso à internet.

O pagamento é uma interface demonstrativa: utiliza cartão fictício, não emite
Pix ou boletos, não cria pedidos no servidor e não realiza cobranças. A conclusão
mostra o resumo da simulação e esvazia a sacola. Uma integração com provedor de
pagamento e backend será necessária para vendas reais.

A interface usa componentes React com classes utilitárias do Tailwind CSS 4.
O tema e os estilos globais de acessibilidade ficam em `apps/web/src/app/globals.css`;
os cards e ícones reutilizáveis ficam em `apps/web/src/components`, e o catálogo
demonstrativo fica em `apps/web/src/lib/catalog.ts`.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

## Hospedagem na Vercel

Importe o repositório na sua conta Vercel e selecione `apps/web` como Root Directory e Next.js como framework. Mantenha habilitado o acesso aos arquivos fora da Root Directory para o workspace e o lockfile da raiz.

A Vercel é o serviço de hospedagem e não precisa ser instalada como dependência do aplicativo. A publicação depende de conectar uma conta Vercel.
resende
