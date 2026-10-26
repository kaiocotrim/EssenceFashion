# Essen Fashion

Base com Next.js, React, TypeScript, Tailwind CSS e Turborepo, usando npm workspaces.

## Desenvolvimento

Requer Node.js 22.12 ou superior (ou Node.js 24).

```sh
npm install
npm run dev
```

Abra http://localhost:3000. O aplicativo fica em `apps/web`.

A loja usa o nome **Essen Fashion** e a direção visual da referência indicada:
[Amissima](https://www.amissima.com.br/home.asp). A página inicial reúne campanhas,
menu de categorias e ocasiões, vitrine com compra rápida por tamanho, seleção de
coleções, favoritos, inspiração de looks e formulário demonstrativo de novidades.

A loja inclui o fluxo completo de demonstração:

- `/`: apresentação da marca, coleção, busca, filtros e favoritos.
- `/produto/1` a `/produto/11`: detalhes, seleção de tamanho e quantidade.
- `/sacola`: revisão das peças, remoção e alteração das quantidades.
- `/checkout`: endereço, entrega, resumo do pedido e pagamento por Pix, cartão ou boleto.
- `/ajuda`: informações sobre entrega, pagamento, privacidade e o funcionamento da demonstração.

A sacola e os favoritos são salvos no navegador e permanecem ao recarregar.
Dados de contato e endereço ficam apenas na memória durante o checkout;
recarregar a página reinicia a etapa de entrega. Use dados fictícios na demonstração.
Produtos, imagens, descrições, preços, fretes e prazos são ilustrativos. Os banners e as novas fotos de produto ficam em `apps/web/public/images`, com
as fontes registradas em `SOURCES.md`. Parte do catálogo original ainda utiliza
fotos do Unsplash e depende de acesso à internet. O formulário de novidades é
local e não envia nem cadastra e-mails em um serviço externo.

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

### Painel de gestão local

Acesse `http://localhost:3000/admin` com `npm run dev` em execução. No primeiro
acesso, crie uma senha de administração com pelo menos 10 caracteres. O cadastro
inicial é permitido apenas no localhost, em desenvolvimento. A sessão dura 12 horas.

O painel é exclusivo da Essen Fashion e permite:

- Cadastrar e editar produtos, preços, tamanhos, descrições, fotos e publicação.
- Enviar fotos JPG, PNG e WebP de até 4 MB ou informar uma URL HTTPS.
- Ajustar o estoque por tamanho, com motivo e histórico de movimentações.
- Cadastrar envios manualmente, atualizar a situação e guardar códigos de rastreio.
- Configurar CEP de origem, embalagem e valores fixos demonstrativos de PAC/SEDEX.

O catálogo público, os detalhes dos produtos, a sacola e o checkout consultam os
dados gerenciados. O estoque inicial é zero: informe as quantidades reais antes
de testar a inclusão de peças na sacola. O checkout continua demonstrativo:
não cria pedidos, não processa pagamentos e não dá baixa no estoque.

Produtos, configurações, envios, histórico, fotos e credenciais ficam em
`apps/web/.data` (ignorado pelo Git). Faça backup dessa pasta. A senha é armazenada
como hash; o acesso usa cookie HttpOnly. Para testes isolados, é possível definir
`ESSEN_DATA_DIRECTORY` com um diretório separado.

O modo local funciona em um único servidor com disco persistente. Para usar o
Supabase no localhost e na Vercel, siga [a configuração do banco](supabase/README.md).
O Prisma ORM gerencia os modelos PostgreSQL, as migrações e as transações.
As tabelas mantêm RLS; o Supabase Storage guarda as fotos. Configure `DATABASE_URL`
e `DIRECT_URL` no servidor e execute `npm run db:migrate --workspace=web`.
O catálogo local pode ser carregado com `npm run db:seed --workspace=web` ou
importado com `npm run db:import --workspace=web`. A chave do Supabase continua
necessária para o Storage. Sem PostgreSQL, as gravações são bloqueadas na Vercel.
Ainda não há integração de cotação, contratação de frete ou emissão de etiquetas.
Os preços e prazos exibidos no checkout são simulações fixas configuráveis.

Os testes de integração podem ser executados após o build com
`npm run test:admin --workspace=web`; eles usam dados temporários separados.

Importe o repositório na sua conta Vercel e selecione `apps/web` como Root Directory e Next.js como framework. Mantenha habilitado o acesso aos arquivos fora da Root Directory para o workspace e o lockfile da raiz.

A Vercel é o serviço de hospedagem e não precisa ser instalada como dependência do aplicativo. A publicação depende de conectar uma conta Vercel.
resende
