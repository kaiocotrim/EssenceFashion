"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import Icon from "@/components/ui/icon";
import { categories, type Collection } from "@/lib/catalog";
import { useStore } from "./store-provider";

function subscribeScroll(listener: () => void) {
  window.addEventListener("scroll", listener, { passive: true });
  return () => window.removeEventListener("scroll", listener);
}
const getScrolled = () => window.scrollY > 36;
const getServerScrolled = () => false;

export function Brand() {
  return (
    <Link href="/" aria-label="Essen Fashion, início" className="shrink-0 whitespace-nowrap font-serif text-[32px] leading-none font-normal tracking-[-1.3px] max-tablet:text-[21px] max-tablet:tracking-[-.8px] max-[360px]:text-[17px]">
      ESSEN FASHION
    </Link>
  );
}

export default function StoreHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaMenu, setMegaMenu] = useState<"clothes" | "occasions" | null>(null);
  const { count, favorites, query, selectCategory, selectCollection, setQuery, setFavoritesOnly } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const scrolled = useSyncExternalStore(subscribeScroll, getScrolled, getServerScrolled);
  const isHome = pathname === "/";
  const overlay = isHome && !scrolled && !menuOpen && !searchOpen && !megaMenu;
  const iconButton = `flex size-10 items-center justify-center rounded-full border transition-colors max-tablet:size-9 max-[360px]:size-8 ${overlay ? "border-white/35 hover:bg-white/15" : "border-line hover:bg-black/5"}`;

  function closeMenus() { setMenuOpen(false); setMegaMenu(null); setSearchOpen(false); }
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
      <header data-appearance={overlay ? "overlay" : "solid"} className={`${isHome ? "fixed inset-x-0" : "sticky"} top-0 z-40 border-b transition-colors duration-300 ${overlay ? "border-transparent bg-transparent text-white [text-shadow:0_1px_6px_#00000055]" : "border-line bg-white text-foreground"}`} onKeyDown={(event) => { if (event.key === "Escape") { closeMenus(); setSearchOpen(false); } }} onMouseLeave={() => setMegaMenu(null)}>
        <div className="mx-auto flex h-[88px] max-w-[1920px] items-center justify-between gap-6 px-[2.5%] max-tablet:h-[72px] max-tablet:gap-2 max-tablet:px-4">
          <button type="button" className="p-2 wide:hidden" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false); }}><Icon name={menuOpen ? "close" : "menu"} size={21} /></button>
          <Brand />
          <nav aria-label="Navegação principal" className="hidden items-center gap-7 text-[12px] wide:flex wide:max-[1250px]:gap-4 wide:max-[1250px]:text-[11px]">
            <Link href="/#colecao" onMouseEnter={() => setMegaMenu(null)} onClick={() => collection("new")} className="py-8 underline-offset-8 hover:underline">NOVIDADES</Link>
            <button type="button" aria-expanded={megaMenu === "clothes"} aria-controls="mega-menu" className="py-8 underline-offset-8 hover:underline" onMouseEnter={() => setMegaMenu("clothes")} onClick={(event) => setMegaMenu(event.detail === 0 && megaMenu === "clothes" ? null : "clothes")}>ROUPAS</button>
            <button type="button" aria-expanded={megaMenu === "occasions"} aria-controls="mega-menu" className="py-8 underline-offset-8 hover:underline" onMouseEnter={() => setMegaMenu("occasions")} onClick={(event) => setMegaMenu(event.detail === 0 && megaMenu === "occasions" ? null : "occasions")}>OCASIÕES</button>
            <Link href="/#colecao" onMouseEnter={() => setMegaMenu(null)} onClick={() => category("Vestidos")} className="py-8 underline-offset-8 hover:underline">VESTIDOS</Link>
            <Link href="/#colecao" onMouseEnter={() => setMegaMenu(null)} onClick={() => collection("sale")} className="py-8 underline-offset-8 hover:underline">SALE</Link>
            <Link href="/#essencia" onMouseEnter={() => setMegaMenu(null)} onClick={closeMenus} className="py-8 text-[#dc3325] underline-offset-8 hover:underline">ESSEN EDIT</Link>
          </nav>
          <div className="flex shrink-0 items-center gap-3 max-tablet:ml-auto max-tablet:gap-1.5">
            <button className={iconButton} aria-label="Buscar produtos" aria-expanded={searchOpen} aria-controls="store-search-panel" onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); setMegaMenu(null); }}><Icon name="search" size={17} /></button>
            <Link href="/conta" className={iconButton} aria-label="Minha conta" aria-current={pathname === "/conta" ? "page" : undefined} onClick={closeMenus}><Icon name="user" size={17} /></Link>
            <Link href="/sacola" className={`${iconButton} relative`} aria-label={`Abrir sacola com ${count} itens`} onClick={closeMenus}><Icon name="bag" size={17} />{count > 0 && <span className={`absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-[9px] ${overlay ? "bg-white text-black" : "bg-black text-white"}`}>{count}</span>}</Link>
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
        {searchOpen && <form id="store-search-panel" role="search" onSubmit={search} className="flex items-center gap-3 border-t border-line bg-white px-[5%] py-5 text-foreground"><label htmlFor="store-search" className="text-[11px] tracking-wider max-tablet:sr-only">O QUE VOCÊ PROCURA?</label><input id="store-search" type="search" placeholder="Busque uma peça…" value={query} onChange={(event) => { const value = event.target.value; selectCategory("Todos"); setQuery(value); }} className="min-w-0 flex-1 border-b border-line bg-transparent px-3 py-3 text-sm" autoFocus /><button type="submit" className="p-3" aria-label="Ver resultados"><Icon name="arrow" size={20} /></button></form>}
      </header>
    </>
  );
}
