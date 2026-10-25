"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Icon from "@/components/ui/icon";
import { useStore } from "./store-provider";

export function Brand() {
  return (
    <Link href="/" aria-label="Essence Fashion, início" className="inline-flex shrink-0 flex-col items-center font-serif text-[38px] leading-[.8] tracking-[-2px] max-tablet:text-[30px]">
      essence
      <span className="mt-3 ml-1 font-sans text-[8px] tracking-[5px] max-tablet:mt-2 max-tablet:text-[7px]">FASHION</span>
    </Link>
  );
}

export default function StoreHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count, favorites, query, selectCategory, setQuery, setFavoritesOnly } = useStore();
  const router = useRouter();
  const nav = ["Todos", "Vestidos", "Alfaiataria", "Acessórios"];

  return (
    <>
      <a className="fixed -top-24 left-4 z-50 bg-white p-4 focus:top-2.5" href="#conteudo">Pular para o conteúdo</a>
      <div className="bg-olive px-[6%] py-2.5 text-center text-[9px] tracking-[1.9px] text-white">UM NOVO OLHAR PARA O SEU ESTILO</div>
      <header className="relative z-20 border-b border-line bg-background">
        <div className="mx-auto flex h-[100px] max-w-[1500px] items-center justify-between gap-5 px-[5.5%] max-tablet:h-20 max-tablet:gap-2 max-tablet:px-[5%]">
          <button className="p-2 tablet:hidden" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "close" : "menu"} size={20} />
          </button>
          <Brand />
          <nav id="main-nav" aria-label="Navegação principal" className={`items-center gap-7 text-xs max-wide:gap-4 max-wide:text-[11px] tablet:flex max-tablet:absolute max-tablet:inset-x-0 max-tablet:top-20 max-tablet:flex-col max-tablet:items-start max-tablet:border-y max-tablet:border-line max-tablet:bg-background max-tablet:p-6 ${menuOpen ? "flex" : "hidden"}`}>
            {nav.map((category) => (
              <Link key={category} href="/#colecao" className="py-2 hover:text-olive" onClick={() => { selectCategory(category); setMenuOpen(false); }}>
                {category === "Todos" ? "Novidades" : category}
              </Link>
            ))}
            <Link href="/#essencia" className="py-2 max-desktop:hidden max-tablet:block" onClick={() => setMenuOpen(false)}>Nossa essência</Link>
          </nav>
          <div className="flex items-center gap-3 max-tablet:ml-auto max-tablet:gap-0">
            <button className="p-2" aria-label="Buscar produtos" aria-expanded={searchOpen} onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }}><Icon name="search" size={20} /></button>
            <Link href="/#colecao" className="p-2" aria-label={`Ver favoritos, ${favorites.length} peças`} onClick={() => { selectCategory("Todos"); setFavoritesOnly(true); }}><Icon name="heart" size={20} /></Link>
            <Link href="/sacola" className="flex items-center gap-1.5 p-2" aria-label={`Abrir sacola com ${count} itens`}><Icon name="bag" size={20} /><span className="text-[11px]">{count}</span></Link>
          </div>
        </div>
        {searchOpen && (
          <form role="search" className="flex items-center gap-3 border-t border-line px-[6%] py-4" onSubmit={(event) => { event.preventDefault(); setFavoritesOnly(false); setSearchOpen(false); router.push("/#colecao"); }}>
            <label htmlFor="product-search" className="text-xs text-muted max-tablet:sr-only">O que você procura?</label>
            <input id="product-search" type="search" placeholder="Busque uma peça…" value={query} onChange={(event) => { const value = event.target.value; selectCategory("Todos"); setQuery(value); }} className="min-w-0 flex-1 border-b border-line bg-transparent p-3" autoFocus />
            <button type="submit" className="p-3" aria-label="Ver resultados"><Icon name="arrow" size={20} /></button>
          </form>
        )}
      </header>
    </>
  );
}
