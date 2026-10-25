"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/components/store/store-provider";
import QuantityControl from "@/components/store/quantity-control";
import OrderSummary from "@/components/checkout/order-summary";
import CheckoutProgress from "@/components/checkout/checkout-progress";
import Icon from "@/components/ui/icon";
import { cartKey } from "@/lib/cart";
import { currency, photo, products } from "@/lib/catalog";

export default function BagPage() {
  const { cart, count, ready, updateQuantity } = useStore();
  return (
    <main id="conteudo" className="mx-auto w-full max-w-[1400px] px-[6%] py-8 tablet:py-12">
      <CheckoutProgress current={1} />
      <p className="text-[10px] tracking-[2px] text-olive">SEUS PRÓXIMOS ESSENCIAIS</p>
      <div className="mt-3 mb-9 flex flex-wrap items-end justify-between gap-5"><h1 className="text-4xl tracking-tight tablet:text-5xl">Minha sacola <span className="text-2xl text-muted">({count})</span></h1><Link href="/#colecao" className="border-b border-line pb-1 text-xs">Continuar explorando ↗</Link></div>
      {!ready ? <p role="status" className="py-20 text-center text-muted">Carregando sua sacola…</p> : cart.length === 0 ? (
        <section className="mb-12 flex flex-col items-center gap-5 border border-line px-6 py-20 text-center"><Icon name="bag" size={42} /><h2 className="text-3xl">Espaço para novos favoritos.</h2><p className="max-w-sm text-sm leading-7 text-muted">Sua sacola está vazia. Explore a coleção e encontre as peças que combinam com você.</p><Link href="/#colecao" className="mt-2 bg-foreground px-8 py-4 text-xs text-white hover:bg-olive">Descobrir a coleção →</Link></section>
      ) : (
        <div className="mb-12 grid gap-10 desktop:grid-cols-[minmax(0,1fr)_360px] wide:grid-cols-[minmax(0,1fr)_400px]">
          <section aria-label="Itens da sacola">
            <div className="hidden justify-between border-b border-line pb-4 text-[10px] tracking-widest text-muted tablet:flex"><span>PRODUTO</span><span>TOTAL</span></div>
            {cart.map((item) => {
              const product = products.find((entry) => entry.id === item.productId);
              if (!product) return null;
              return <article key={cartKey(item)} className="flex gap-4 border-b border-line py-6 tablet:gap-6"><Link href={`/produto/${product.id}`} className="shrink-0"><Image src={photo(product.image, 300)} alt={product.name} width={110} height={145} unoptimized className="h-[130px] w-[90px] object-cover tablet:h-[155px] tablet:w-[115px]" /></Link><div className="min-w-0 flex-1"><h2 className="font-sans text-sm"><Link href={`/produto/${product.id}`}>{product.name}</Link></h2><p className="mt-2 text-xs text-muted">{product.color} · Tamanho {item.size}</p><p className="mt-2 text-xs">{currency(product.price)}</p><div className="mt-4 flex flex-wrap items-center gap-3"><QuantityControl quantity={item.quantity} onChange={(value) => updateQuantity(cartKey(item), value)} label={`${product.name}, tamanho ${item.size}`} /><button onClick={() => updateQuantity(cartKey(item), 0)} className="p-2 text-[11px] text-muted underline underline-offset-4" aria-label={`Remover ${product.name}, tamanho ${item.size}`}>Remover</button></div></div><p className="hidden shrink-0 text-sm tablet:block">{currency(product.price * item.quantity)}</p></article>;
            })}
            <p className="mt-5 text-[11px] leading-6 text-muted">Confira tamanhos e quantidades antes de continuar. A sacola é salva neste navegador.</p>
          </section>
          <OrderSummary><Link href="/checkout" className="mt-6 flex w-full items-center justify-between gap-4 bg-foreground px-6 py-4 text-xs text-white hover:bg-olive">Continuar para entrega <Icon name="arrow" size={18} /></Link></OrderSummary>
        </div>
      )}
    </main>
  );
}
