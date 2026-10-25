"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Icon from "@/components/ui/icon";
import { categories, type Collection } from "@/lib/catalog";
import { useStore } from "./store-provider";

export function Brand() {
  return (
    <Link href="/" aria-label="Essen Fashion, início" className="shrink-0 whitespace-nowrap text-[26px] leading-none font-normal tracking-[.12em] max-tablet:text-[17px] max-tablet:tracking-[.09em]">
      ESSEN <span className="font-light">FASHION</span>
    </Link>
  );
}

export default function StoreHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaMenu, setMegaMenu] = useState<"clothes" | "occasions" | null>(null);
  const { count, favorites, query, selectCategory, selectCollection, setQuery, setFavoritesOnly } = useStore();
  const router = useRouter();

  function closeMenus() { setMenuOpen(false); setMegaMenu(null); }
  function collection(value: Collection) { selectCollection(value); closeMenus(); }
  function category(value: string) { selectCategory(value); closeMenus(); }
  function search(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFavoritesOnly(false);
    setSearchOpen(false);
    closeMenus();
    router.push("/#colecao");
  }

  return (
    <>
      <a className="fixed -top-24 left-4 z-50 bg-white p-4 focus:top-2.5" href="#conteudo">Pular para o conteúdo</a>
      <div className="bg-[#f5f4f0] px-5 py-2 text-center text-[9px] tracking-[1.8px] text-[#595959] max-tablet:text-[8px]">ESSEN FASHION — VISTA NOVAS POSSIBILIDADES</div>
      <header className="sticky top-0 z-30 border-b border-line bg-white" onKeyDown={(event) => { if (event.key === "Escape") { closeMenus(); setSearchOpen(false); } }} onMouseLeave={() => setMegaMenu(null)}>
        <div className="mx-auto flex h-[100px] max-w-[1800px] items-center justify-between gap-7 px-[3%] max-wide:h-[84px] max-tablet:h-[72px] max-tablet:gap-2 max-tablet:px-4">
          <button type="button" className="p-2 wide:hidden" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false); }}><Icon name={menuOpen ? "close" : "menu"} size={21} /></button>
          <Brand />
          <nav aria-label="Navegação principal" className="hidden items-center gap-6 text-[10px] tracking-[1.1px] wide:flex">
            <Link href="/#colecao" onMouseEnter={() => setMegaMenu(null)} onClick={() => collection("new")} className="py-10 hover:underline underline-offset-8">NOVIDADES</Link>
            <button type="button" aria-expanded={megaMenu === "clothes"} aria-controls="mega-menu" className="py-10 hover:underline underline-offset-8" onMouseEnter={() => setMegaMenu("clothes")} onClick={(event) => setMegaMenu(event.detail === 0 && megaMenu === "clothes" ? null : "clothes")}>ROUPAS</button>
            <button type="button" aria-expanded={megaMenu === "occasions"} aria-controls="mega-menu" className="py-10 hover:underline underline-offset-8" onMouseEnter={() => setMegaMenu("occasions")} onClick={(event) => setMegaMenu(event.detail === 0 && megaMenu === "occasions" ? null : "occasions")}>OCASIÕES</button>
            <Link href="/#colecao" onMouseEnter={() => setMegaMenu(null)} onClick={() => category("Vestidos")} className="py-10 hover:underline underline-offset-8">VESTIDOS</Link>
            <Link href="/#colecao" onMouseEnter={() => setMegaMenu(null)} onClick={() => collection("sale")} className="py-10 text-[#a54c43] hover:underline underline-offset-8">SALE</Link>
            <Link href="/#essencia" onMouseEnter={() => setMegaMenu(null)} onClick={closeMenus} className="py-10 hover:underline underline-offset-8">ESSEN EDIT</Link>
          </nav>
          <div className="flex shrink-0 items-center gap-2 max-tablet:ml-auto max-tablet:gap-0">
            <form role="search" onSubmit={search} className="mr-3 hidden w-[115px] items-center border-b border-[#b6b6b6] wide:flex">
              <label htmlFor="desktop-search" className="sr-only">Buscar produtos</label>
              <input id="desktop-search" type="search" value={query} placeholder="BUSCA" className="min-w-0 flex-1 bg-transparent py-2 text-[9px] tracking-widest outline-offset-0" onChange={(event) => { const value = event.target.value; selectCategory("Todos"); setQuery(value); }} />
              <button type="submit" aria-label="Pesquisar" className="p-1.5"><Icon name="search" size={17} /></button>
            </form>
            <button className="p-2 wide:hidden" aria-label="Buscar produtos" aria-expanded={searchOpen} onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }}><Icon name="search" size={20} /></button>
            <Link href="/#colecao" className="p-2 max-[360px]:hidden" aria-label={`Ver favoritos, ${favorites.length} peças`} onClick={() => { selectCategory("Todos"); setFavoritesOnly(true); closeMenus(); }}><Icon name="heart" size={20} /></Link>
            <Link href="/sacola" className="flex items-center gap-1 p-2" aria-label={`Abrir sacola com ${count} itens`} onClick={closeMenus}><Icon name="bag" size={20} /><span className="text-[10px]">({count})</span></Link>
          </div>
        </div>
        {megaMenu && <div id="mega-menu" className="absolute inset-x-0 top-full hidden border-y border-line bg-white px-[8%] py-10 shadow-md wide:block">
          <div className="mx-auto grid max-w-[1400px] grid-cols-[1fr_1fr_1fr_260px] gap-8">
            <div><h2 className="mb-5 font-sans text-[11px] tracking-widest">{megaMenu === "clothes" ? "CATEGORIAS" : "VISTA O MOMENTO"}</h2><div className="flex flex-col items-start gap-3 text-xs text-muted">{megaMenu === "clothes" ? categories.map((value) => <Link key={value} href="/#colecao" className="hover:text-black" onClick={() => category(value)}>{value === "Todos" ? "Ver todas as peças" : value}</Link>) : <><Link href="/#colecao" onClick={() => collection("evening")}>Festas e celebrações</Link><Link href="/#colecao" onClick={() => collection("casual")}>Todos os dias</Link><Link href="/#colecao" onClick={() => category("Alfaiataria")}>Do trabalho ao jantar</Link></>}</div></div>
            <div><h2 className="mb-5 font-sans text-[11px] tracking-widest">EM DESTAQUE</h2><div className="flex flex-col items-start gap-3 text-xs text-muted"><Link href="/#colecao" onClick={() => collection("new")}>Novidades</Link><Link href="/#colecao" onClick={() => collection("pleats")}>Plissados</Link><Link href="/#colecao" onClick={() => category("Vestidos")}>Vestidos para descobrir</Link><Link href="/#colecao" onClick={() => { selectCategory("Todos"); setFavoritesOnly(true); closeMenus(); }}>Seus favoritos</Link></div></div>
            <div><h2 className="mb-5 font-sans text-[11px] tracking-widest">ESSEN FASHION</h2><div className="flex flex-col items-start gap-3 text-xs text-muted"><Link href="/#essencia" onClick={closeMenus}>Nosso olhar</Link><Link href="/#elas-usam" onClick={closeMenus}>Inspire seu estilo</Link><Link href="/ajuda" onClick={closeMenus}>Atendimento e informações</Link></div></div>
            <Link href="/#colecao" onClick={() => collection("pleats")} className="relative h-[230px] overflow-hidden"><Image src="/images/campaign/pleats.webp" alt="Descubra a seleção de plissados" fill sizes="260px" className="object-cover object-[center_45%]" /><span className="absolute right-4 bottom-4 left-4 bg-white/90 py-2 text-center text-[10px] tracking-widest">EXPLORE PLISSADOS ↗</span></Link>
          </div>
        </div>}
        {menuOpen && <nav id="mobile-nav" aria-label="Navegação móvel" className="absolute inset-x-0 top-full max-h-[calc(100dvh-110px)] overflow-y-auto border-t border-line bg-white px-7 py-7 shadow-lg wide:hidden"><div className="grid gap-5 text-xs tracking-widest"><Link href="/#colecao" onClick={() => collection("new")}>NOVIDADES</Link><Link href="/#colecao" onClick={() => category("Todos")}>TODAS AS ROUPAS</Link>{categories.filter((value) => value !== "Todos").map((value) => <Link href="/#colecao" key={value} onClick={() => category(value)} className="pl-4 text-[11px] text-muted">{value.toUpperCase()}</Link>)}<Link href="/#colecao" onClick={() => collection("evening")}>OCASIÕES ESPECIAIS</Link><Link href="/#colecao" onClick={() => collection("sale")} className="text-[#a54c43]">SALE</Link><Link href="/#colecao" onClick={() => { selectCategory("Todos"); setFavoritesOnly(true); closeMenus(); }}>FAVORITOS ({favorites.length})</Link><Link href="/#essencia" onClick={closeMenus}>ESSEN EDIT</Link></div></nav>}
        {searchOpen && <form role="search" onSubmit={search} className="flex items-center gap-3 border-t border-line px-6 py-4 wide:hidden"><label htmlFor="mobile-search" className="sr-only">Buscar produtos</label><input id="mobile-search" type="search" placeholder="O QUE VOCÊ PROCURA?" value={query} onChange={(event) => { const value = event.target.value; selectCategory("Todos"); setQuery(value); }} className="min-w-0 flex-1 border-b border-line bg-transparent py-3 text-xs" autoFocus /><button type="submit" className="p-3" aria-label="Ver resultados"><Icon name="arrow" size={20} /></button></form>}
      </header>
    </>
  );
}
