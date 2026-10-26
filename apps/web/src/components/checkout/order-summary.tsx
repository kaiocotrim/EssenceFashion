"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/components/store/store-provider";
import { cartKey, orderTotal } from "@/lib/cart";
import { currency, photo } from "@/lib/catalog";
import type { ReactNode } from "react";

export default function OrderSummary({ shipping = null, children }: { shipping?: number | null; children?: ReactNode }) {
  const { products, cart, count, subtotal } = useStore();
  const total = orderTotal(subtotal, shipping ?? 0);
  return (
    <aside aria-label="Resumo do pedido" className="self-start border border-line bg-[#f5f4ee] p-6 tablet:sticky tablet:top-8 tablet:p-8">
      <div className="flex items-baseline justify-between gap-3"><h2 className="text-2xl">Seu pedido</h2><span className="text-[11px] text-muted">{count} {count === 1 ? "peça" : "peças"}</span></div>
      <ul className="mt-6 space-y-4">
        {cart.map((item) => {
          const product = products.find((entry) => entry.id === item.productId);
          if (!product) return null;
          return <li key={cartKey(item)} className="flex gap-3"><Link href={`/produto/${product.id}`}><Image src={photo(product.image, 180)} alt={product.name} width={50} height={65} unoptimized={!product.image.startsWith("/")} className="h-[65px] w-[50px] object-cover" /></Link><div className="min-w-0 flex-1 text-[11px]"><Link href={`/produto/${product.id}`}>{product.name}</Link><p className="mt-1 text-muted">{product.color} · {item.size} · Qtd. {item.quantity}</p><p className="mt-2">{currency(product.price * item.quantity)}</p></div></li>;
        })}
      </ul>
      <dl className="mt-6 space-y-3 border-t border-line pt-5 text-xs">
        <div className="flex justify-between gap-3"><dt className="text-muted">Subtotal</dt><dd>{currency(subtotal)}</dd></div>
        <div className="flex justify-between gap-3"><dt className="text-muted">Entrega</dt><dd>{shipping === null ? "Na próxima etapa" : currency(shipping)}</dd></div>
        <div className="flex justify-between gap-3 border-t border-line pt-4 text-base"><dt>{shipping === null ? "Subtotal dos produtos" : "Total"}</dt><dd className="font-medium">{currency(total)}</dd></div>
      </dl>
      {children}
      <p className="mt-5 text-[10px] leading-5 text-muted">Loja demonstrativa. Produtos, frete e valores ilustrativos. Nenhuma cobrança será realizada.</p>
    </aside>
  );
}
