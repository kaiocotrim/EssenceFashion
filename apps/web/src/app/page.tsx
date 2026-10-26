"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import Icon from "@/components/ui/icon";
import ProductCard from "@/components/store/product-card";
import CampaignHero from "@/components/store/campaign-hero";
import Newsletter from "@/components/store/newsletter";
import { categories, collectionLabels, matchesCollection } from "@/lib/catalog";
import { useStore } from "@/components/store/store-provider";

export default function Home() {
  const { products, catalogError, category, collection, query, favorites, favoritesOnly, notice, selectCategory, selectCollection, toggleFavorite } = useStore();
  const bestSellersRef = useRef<HTMLDivElement>(null);
  const visible = products.filter((product) =>
    matchesCollection(product, collection) &&
    (category === "Todos" || product.category === category) &&
    (!favoritesOnly || favorites.includes(product.id)) &&
    product.name.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR"))
  );
  const title = favoritesOnly ? "Seus favoritos" : query ? "Resultados da busca" : category !== "Todos" ? category : collectionLabels[collection];
  const bestSellers = [...products].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))).slice(0, 8);
  const inspiration = [
    { image: "style-1", title: "O SEU MOMENTO", collection: "evening" as const },
    { image: "style-2", title: "UM NOVO OLHAR", collection: "casual" as const },
    { image: "style-3", title: "LEVEZA EM MOVIMENTO", collection: "pleats" as const },
    { image: "style-4", title: "DO SEU JEITO", collection: "all" as const },
  ];

  function scrollProducts(direction: number) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    bestSellersRef.current?.scrollBy({ left: direction * bestSellersRef.current.clientWidth * .75, behavior: reduced ? "instant" : "smooth" });
  }

  return (
    <main id="conteudo" className="bg-[#fbf7f1]">
      {catalogError && <p role="alert" className="bg-red-50 px-6 py-4 text-center text-red-800">{catalogError}</p>}
      <CampaignHero />
      <section id="colecao" aria-labelledby="collection-title" className="mx-auto max-w-[1800px] px-[2.5%] pt-20 pb-14 max-tablet:px-4 max-tablet:pt-10 max-tablet:pb-9">
        <div className="relative">
          <h2 id="collection-title" className="font-serif text-[46px] leading-tight max-tablet:text-[32px]">{title}</h2>
          <button onClick={() => selectCollection("all")} className="absolute right-0 bottom-1 border-b border-black pb-1 text-[10px] tracking-wider max-tablet:bottom-1">VER TUDO</button>
        </div>
        <div className="mt-7 mb-7 flex items-center justify-between gap-4 border-b border-line pb-4">
          <div className="flex gap-6 overflow-x-auto text-[9px] tracking-widest max-tablet:gap-5" aria-label="Filtrar por categoria">{categories.map((item) => <button key={item} onClick={() => selectCategory(item)} aria-pressed={category === item} className="shrink-0 py-2 text-muted underline-offset-8 hover:text-black aria-pressed:text-black aria-pressed:underline">{item.toUpperCase()}</button>)}</div>
          <span role="status" className="shrink-0 text-[10px] text-muted max-tablet:hidden">{visible.length} peças</span>
        </div>
        {visible.length > 0 ? <div className="grid grid-cols-4 gap-x-5 gap-y-9 max-wide:grid-cols-3 max-tablet:grid-cols-2 max-tablet:gap-x-3 max-tablet:gap-y-6">{visible.map((product) => <ProductCard key={product.id} product={product} isFavorite={favorites.includes(product.id)} onToggleFavorite={() => toggleFavorite(product.id)} />)}</div> : <div className="border-y border-line px-6 py-14 text-center"><h3 className="font-serif text-2xl">{favoritesOnly ? "Seus próximos favoritos estão aqui." : "Vamos descobrir outras possibilidades?"}</h3><p className="mt-4 text-xs leading-6 text-muted">{favoritesOnly ? "Toque no coração das peças que você amar para guardá-las aqui." : "Nenhuma peça encontrada para esta seleção."}</p><button onClick={() => selectCollection("all")} className="mt-6 border-b border-black pb-1 text-xs">Ver a coleção completa →</button></div>}
        <p role="status" className="sr-only">{notice}</p>
      </section>

      <section aria-label="Explore nossas coleções" className="mx-auto grid max-w-[1800px] grid-cols-2 gap-5 px-[3%] max-tablet:grid-cols-1 max-tablet:gap-7 max-tablet:px-4">
        <article><Link href="/#colecao" onClick={() => selectCollection("pleats")} className="group relative block aspect-[.8] overflow-hidden"><Image src="/images/campaign/pleats.webp" alt="Vestido plissado em tons suaves, em um cenário de verão" fill sizes="(max-width: 700px) 92vw, 47vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.025]" /></Link><div className="py-7 text-center"><h2 className="font-serif text-[34px]">Plissados</h2><p className="mt-3 text-xs text-muted">Texturas para vestir a leveza de cada dia.</p><Link href="/#colecao" onClick={() => selectCollection("pleats")} className="mt-5 inline-block border-b border-black pb-1 text-[10px] tracking-[1.5px]">EXPLORAR</Link></div></article>
        <article><Link href="/#colecao" onClick={() => selectCollection("evening")} className="group relative block aspect-[.8] overflow-hidden"><Image src="/images/campaign/evening.webp" alt="Vestido de festa longo em uma paisagem mediterrânea" fill sizes="(max-width: 700px) 92vw, 47vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.025]" /></Link><div className="py-7 text-center"><h2 className="font-serif text-[34px]">Festas</h2><p className="mt-3 text-xs text-muted">Para os momentos que merecem ser lembrados.</p><Link href="/#colecao" onClick={() => selectCollection("evening")} className="mt-5 inline-block border-b border-black pb-1 text-[10px] tracking-[1.5px]">EXPLORAR</Link></div></article>
      </section>

      <section aria-labelledby="bestsellers-title" className="mx-auto max-w-[1800px] px-[3%] pt-14 pb-16 max-tablet:px-4 max-tablet:pt-9">
        <div className="mb-8 flex items-end justify-between gap-5"><div><p className="text-[9px] tracking-[2px] text-muted">UMA NOVA DESCOBERTA, A CADA OLHAR</p><h2 id="bestsellers-title" className="mt-3 font-serif text-[36px] max-tablet:text-3xl">Favoritos da coleção</h2></div><div className="flex gap-2"><button aria-label="Ver peças anteriores" className="flex size-10 items-center justify-center border border-line hover:border-black" onClick={() => scrollProducts(-1)}><span className="rotate-180"><Icon name="arrow" size={18} /></span></button><button aria-label="Ver próximas peças" className="flex size-10 items-center justify-center border border-line hover:border-black" onClick={() => scrollProducts(1)}><Icon name="arrow" size={18} /></button></div></div>
        <div ref={bestSellersRef} className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:thin] max-tablet:gap-3">{bestSellers.map((product) => <div key={product.id} className="w-[calc((100%_-_60px)/4)] shrink-0 snap-start max-wide:w-[calc((100%_-_40px)/3)] max-tablet:w-[calc((100%_-_12px)/2)]"><ProductCard product={product} isFavorite={favorites.includes(product.id)} onToggleFavorite={() => toggleFavorite(product.id)} /></div>)}</div>
      </section>

      <section id="essencia" className="bg-[#f3f1ec] px-6 py-14 text-center"><p className="text-[9px] tracking-[3px] text-muted">ESSEN EDIT</p><h2 className="mx-auto mt-4 max-w-3xl font-serif text-[38px] leading-tight max-tablet:text-3xl">Um olhar para a moda.<br /><em>Um encontro com você.</em></h2><p className="mx-auto mt-5 max-w-xl text-xs leading-7 text-muted">Entre texturas, movimentos e novas possibilidades, encontre o que faz sentido para o seu estilo. A Essen Fashion é um convite para viver cada momento do seu jeito.</p></section>

      <section id="elas-usam" aria-labelledby="inspiration-title" className="mx-auto max-w-[1800px] px-[3%] py-16 max-tablet:px-4 max-tablet:py-12"><div className="mb-8 text-center"><h2 id="inspiration-title" className="font-serif text-[36px] max-tablet:text-3xl">#EssenInspira</h2><p className="mt-3 text-xs text-muted">Diferentes momentos. A mesma vontade de ser você.</p></div><div className="grid grid-cols-4 gap-4 max-tablet:grid-cols-2 max-tablet:gap-x-3 max-tablet:gap-y-6">{inspiration.map((item) => <Link href="/#colecao" key={item.image} onClick={() => selectCollection(item.collection)} className="group"><div className="relative aspect-[.75] overflow-hidden bg-[#efefed]"><Image src={`/images/campaign/${item.image}.webp`} alt={`Inspiração Essen Fashion: ${item.title.toLowerCase()}`} fill sizes="(max-width: 700px) 45vw, 23vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" /></div><p className="mt-4 text-center text-[9px] tracking-[1.3px]">{item.title} ↗</p></Link>)}</div></section>
      <Newsletter />
    </main>
  );
}
