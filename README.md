<div align="center">

# ESSENCE FASHION

### E-commerce de moda | Projeto em desenvolvimento

Uma experiência de compra moderna, intuitiva e responsiva, criada para a **Essence Fashion**.

[**Instagram da loja**](https://www.instagram.com/essencefashion3/)

</div>

---

## Sobre o projeto

O **Essence Fashion** é um projeto de e-commerce em desenvolvimento, pensado para levar a experiência da loja ao ambiente digital.

A proposta é construir uma plataforma com navegação simples, catálogo organizado e uma jornada de compra fluida, tanto no computador quanto no celular.

> **Status:** fase inicial de desenvolvimento. As funcionalidades descritas abaixo representam o planejamento do projeto e ainda não estão necessariamente implementadas.

## Tecnologias previstas

| Camada | Tecnologias |
| --- | --- |
| Front-end | Next.js, React, TypeScript |
| Estilização | Tailwind CSS |
| Back-end | Node.js, Express |
| Banco de dados e ORM | Prisma (banco de dados a definir) |
| Monorepo | Turborepo |

## Funcionalidades planejadas

- [ ] Página inicial com apresentação da loja e produtos em destaque
- [ ] Catálogo de produtos com categorias, busca e filtros
- [ ] Página de produto com fotos, descrição, preço e variações
- [ ] Carrinho de compras
- [ ] Fluxo de finalização de pedidos (checkout)
- [ ] Cadastro e autenticação de clientes
- [ ] Área do cliente para acompanhar pedidos
- [ ] Painel administrativo para gerenciar produtos, pedidos e estoque
- [ ] Integração com soluções de pagamento e entrega
- [ ] Layout responsivo para dispositivos móveis e desktop

## Organização planejada do repositório

O projeto deverá utilizar uma estrutura de monorepo com **Turborepo**:

```text
essence-fashion/
├── apps/
│   ├── web/            # Loja virtual com Next.js
│   └── api/            # API com Node.js e Express
├── packages/
│   ├── database/       # Modelos e acesso a dados com Prisma
│   ├── ui/             # Componentes compartilhados
│   └── config/         # Configurações compartilhadas
├── package.json
└── turbo.json
```

> A estrutura acima é uma referência inicial e poderá mudar durante o desenvolvimento.

## Como executar

O ambiente de desenvolvimento ainda está sendo preparado. As instruções de instalação, configuração de variáveis de ambiente e execução local serão adicionadas quando a estrutura inicial do projeto estiver disponível.

## Roadmap

1. Configuração do monorepo e das aplicações.
2. Definição da identidade visual e criação das telas.
3. Modelagem do banco de dados e desenvolvimento da API.
4. Implementação do catálogo, carrinho e checkout.
5. Desenvolvimento do painel administrativo.
6. Testes, otimizações e publicação.

## Loja

Acompanhe a **Essence Fashion** pelo Instagram:

**[@essencefashion3](https://www.instagram.com/essencefashion3/)**

---

<div align="center">

**Essence Fashion** — Projeto em desenvolvimento.

</div>
