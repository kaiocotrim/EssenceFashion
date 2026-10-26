"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/icon";
import QuantityControl from "./quantity-control";
import { useStore } from "./store-provider";
import { colorSwatch, currency, installmentLabel, photo, type Product } from "@/lib/catalog";
import ProductCard from "./product-card";

export default function ProductDetail({ product: initial }: { product: Product }) {
  const { products, ready } = useStore();
  const product = products.find((item) => item.id === initial.id);
  if (ready && !product) return <main className="p-16 text-center"><h1 className="text-3xl">Peça indisponível</h1><Link href="/#colecao">Ver coleção</Link></main>;
  return <ProductDetailContent product={product ?? initial} />;
}

function ProductDetailContent({ product }: { product: Product }) {
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : "");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const { products, addToBag, favorites, toggleFavorite } = useStore();
  const router = useRouter();

  function add(buyNow = false) {
    if (!size) { setError("Escolha um tamanho para continuar."); return; }
    if (!addToBag(product.id, size, quantity)) { setError("Quantidade indisponível para este tamanho."); return; }
    setAdded(true);
    setError("");
    if (buyNow) router.push("/sacola");
  }

  return (
    <main id="conteudo" className="mx-auto w-full max-w-[1400px] px-[6%] py-8 tablet:py-12">
      <nav aria-label="Caminho de navegação" className="mb-8 flex flex-wrap gap-2 text-[11px] text-muted">
        <Link href="/">Início</Link><span aria-hidden="true">/</span><Link href="/#colecao">Coleção</Link><span aria-hidden="true">/</span><span aria-current="page">{product.name}</span>
      </nav>
      <div className="grid gap-10 tablet:grid-cols-2 tablet:gap-14">
        <div className="relative aspect-[.8] overflow-hidden bg-[#eae7df]">
          <Image src={photo(product.image, 1100)} alt={`${product.name}, imagem ilustrativa`} fill priority unoptimized={!product.image.startsWith("/")} sizes="(max-width: 700px) 88vw, 45vw" className="object-cover" />
          <span className="absolute top-5 left-5 bg-background px-4 py-2 text-[9px] tracking-widest">{product.tag}</span>
        </div>
        <section className="py-2 tablet:py-6" aria-labelledby="product-name">
          <p className="text-[10px] tracking-[2px] text-olive">ESSEN FASHION / {product.category.toUpperCase()}</p>
          <h1 id="product-name" className="mt-4 text-4xl leading-tight tracking-tight desktop:text-5xl">{product.name}</h1>
          <p className="mt-5 text-xl">{currency(product.price)}</p>
          <p className="mt-2 text-xs text-muted">{installmentLabel(product.price)} · Valores ilustrativos</p>
          <p className="mt-7 max-w-lg text-sm leading-7 text-muted">{product.description}</p>
          <div className="mt-7 border-t border-line pt-6"><p className="text-xs">Cor: <span className="text-muted">{product.color}</span></p><span className="mt-3 block size-7 rounded-full border-4 border-white outline outline-line" style={{ backgroundColor: colorSwatch(product.color) }} aria-hidden="true" /></div>
          <fieldset className="mt-6" aria-describedby={error ? "size-error" : undefined}>
            <legend className="mb-3 text-xs">Selecione o tamanho</legend>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((value) => <label key={value} className="cursor-pointer"><input type="radio" disabled={!(product.stock?.[value] ?? 0)} name="size" value={value} checked={size === value} onChange={() => { setSize(value); setError(""); setAdded(false); }} className="peer sr-only" /><span className="inline-flex min-h-11 min-w-11 items-center justify-center border border-line px-3 text-xs peer-checked:border-olive peer-checked:bg-olive peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-olive peer-disabled:opacity-30 peer-disabled:line-through">{value}</span></label>)}
            </div>
          </fieldset>
          {error && <p id="size-error" role="alert" className="mt-3 text-xs text-red-700">{error}</p>}
          <div className="mt-6 flex items-center gap-4"><span className="text-xs">Quantidade</span><QuantityControl quantity={quantity} onChange={setQuantity} label={product.name} /></div>
          <div className="mt-7 flex gap-3"><button onClick={() => add()} className="flex min-h-13 flex-1 items-center justify-between gap-5 bg-foreground px-6 py-4 text-xs text-white transition-colors hover:bg-olive">Adicionar à sacola <Icon name="bag" size={19} /></button><button onClick={() => toggleFavorite(product.id)} aria-pressed={favorites.includes(product.id)} aria-label={favorites.includes(product.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"} className={`border border-line px-4 ${favorites.includes(product.id) ? "[&>svg]:fill-olive [&>svg]:text-olive" : ""}`}><Icon name="heart" /></button></div>
          <button onClick={() => add(true)} className="mt-3 min-h-12 w-full border border-foreground p-3 text-xs hover:bg-[#efeee6]">Comprar agora</button>
          <p role="status" className="mt-4 min-h-5 text-xs text-olive">{added && <>Peça adicionada. <Link href="/sacola" className="underline underline-offset-4">Ver minha sacola →</Link></>}</p>
          <details className="mt-5 border-t border-line py-5 text-xs"><summary className="cursor-pointer">Sobre esta vitrine</summary><p className="mt-3 leading-6 text-muted">Produtos, descrições, tamanhos e imagens ilustrativos. Este é um fluxo de demonstração, sem estoque ou venda real.</p></details>
        </section>
      </div>
      <section className="mt-16 mb-10"><p className="text-[10px] tracking-widest text-olive">COMPONHA SEU ESTILO</p><h2 className="mt-3 mb-7 text-3xl">Você também pode <em>amar.</em></h2><div className="grid grid-cols-2 gap-5 desktop:grid-cols-3">{products.filter((item) => item.id !== product.id).map((item) => <ProductCard key={item.id} product={item} isFavorite={favorites.includes(item.id)} onToggleFavorite={() => toggleFavorite(item.id)} />)}</div></section>
    </main>
  );
}
