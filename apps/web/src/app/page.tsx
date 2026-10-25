"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import Icon from "@/components/ui/icon";
import ProductCard from "@/components/store/product-card";
import { categories, currency, photo, products } from "@/lib/catalog";



export default function Home() {
  const [category, setCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [bag, setBag] = useState<Record<number, number>>({});
  const [notice, setNotice] = useState("");
  const bagDialog = useRef<HTMLDialogElement>(null);
  const count = Object.values(bag).reduce((sum, quantity) => sum + quantity, 0);
  const total = products.reduce((sum, product) => sum + product.price * (bag[product.id] || 0), 0);
  const visible = products.filter((product) => (category === "Todos" || product.category === category) && (!favoritesOnly || favorites.includes(product.id)) && product.name.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR")));

  function selectCategory(value: string) {
    setCategory(value);
    setQuery("");
    setFavoritesOnly(false);
    setMenuOpen(false);
  }

  function addToBag(id: number) {
    setBag((current) => ({ ...current, [id]: (current[id] || 0) + 1 }));
    setNotice(`${products.find((product) => product.id === id)?.name} adicionado à sacola.`);
  }

  return (
    <>
      <a className="fixed -top-24 left-4 z-50 bg-white p-4 focus:top-2.5" href="#conteudo">Pular para o conteúdo</a>
      <div className="bg-olive px-[6%] py-[11px] text-center text-[9px] tracking-[1.9px] text-white max-tablet:p-2.5 max-tablet:text-[8px] [&>a]:absolute [&>a]:right-[6%] [&>a]:text-[10px] [&>a]:tracking-[.3px] max-tablet:[&>a]:hidden">UM NOVO OLHAR PARA O SEU ESTILO <a href="#essencia">Conheça a Essence ↗</a></div>
      <header className="relative z-10 bg-background">
        <div className="mx-auto flex h-[103px] max-w-[1500px] items-center justify-between gap-[25px] px-[5.5%] max-desktop:h-[88px] max-desktop:gap-4 max-tablet:h-[83px] max-tablet:gap-2 max-tablet:px-[5%] max-tablet:[&>.brand]:mr-auto max-tablet:[&>.brand]:ml-1">
          <button className="inline-flex min-h-10 min-w-9 items-center justify-center p-1 tablet:hidden" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? "close" : "menu"} /></button>
          <a className="brand inline-flex flex-col items-center font-serif text-[43px] leading-[.8] tracking-[-2px] max-desktop:text-4xl max-tablet:text-[34px] [&>span]:mt-3 [&>span]:ml-[5px] [&>span]:font-sans [&>span]:text-[8px] [&>span]:tracking-[5px] max-tablet:[&>span]:mt-2.5 max-tablet:[&>span]:text-[7px] max-tablet:[&>span]:tracking-[4px]" href="#" aria-label="Essence Fashion, início">essence<span>FASHION</span></a>
          <nav id="main-nav" className={`hidden items-center gap-[29px] text-xs tablet:flex max-wide:gap-[17px] max-wide:text-[11px] max-desktop:gap-[13px] [&>a]:flex [&>a]:items-center [&>a]:gap-[7px] [&>a]:py-2.5 [&>a:hover]:text-olive tablet:max-desktop:[&>a:last-child]:hidden max-tablet:absolute max-tablet:inset-x-0 max-tablet:top-[83px] max-tablet:flex-col max-tablet:items-start max-tablet:gap-3 max-tablet:border-t max-tablet:border-line max-tablet:bg-background max-tablet:px-[6%] max-tablet:py-5 max-tablet:shadow-lg ${menuOpen ? "max-tablet:flex" : ""}`} aria-label="Navegação principal">
            <a href="#colecao" onClick={() => selectCategory("Todos")}>Novidades <span className="size-1 rounded-full bg-olive" /></a>
            <a href="#colecao" onClick={() => selectCategory("Vestidos")}>Vestidos</a>
            <a href="#colecao" onClick={() => selectCategory("Alfaiataria")}>Alfaiataria</a>
            <a href="#colecao" onClick={() => selectCategory("Acessórios")}>Acessórios</a>
            <a href="#essencia" onClick={() => setMenuOpen(false)}>Nossa essência</a>
          </nav>
          <div className="flex items-center gap-[19px] max-wide:gap-2.5 max-desktop:gap-[5px] max-tablet:gap-0.5">
            <button className="inline-flex min-h-10 min-w-9 items-center justify-center p-1" aria-label="Buscar produtos" aria-expanded={searchOpen} onClick={() => setSearchOpen(!searchOpen)}><Icon name="search" /></button>
            <a className={`inline-flex min-h-10 min-w-9 items-center justify-center p-1 ${favoritesOnly ? "[&_svg]:fill-[#697154] [&_svg]:text-[#697154]" : ""}`} href="#colecao" aria-label={`Ver favoritos, ${favorites.length} produtos`} onClick={() => { setFavoritesOnly(!favoritesOnly); setCategory("Todos"); setQuery(""); }}><Icon name="heart" /></a>
            <button className="inline-flex min-h-10 min-w-9 items-center justify-center p-1 gap-[7px] [&>span]:text-[11px]" aria-label={`Abrir sacola com ${count} itens`} onClick={() => bagDialog.current?.showModal()}><Icon name="bag" /><span>{count}</span></button>
          </div>
        </div>
        {searchOpen && <form className="flex items-center gap-5 border-t border-line px-[6%] py-5 max-tablet:gap-2 [&>label]:text-xs [&>label]:text-muted max-tablet:[&>label]:sr-only [&>input]:min-w-0 [&>input]:flex-1 [&>input]:border-0 [&>input]:border-b [&>input]:border-line [&>input]:bg-transparent [&>input]:p-3" role="search" onSubmit={(event) => { event.preventDefault(); document.getElementById("colecao")?.scrollIntoView({ behavior: "smooth" }); }}><label htmlFor="product-search">O que você está procurando?</label><input id="product-search" type="search" placeholder="Busque uma peça…" value={query} onChange={(event) => { setQuery(event.target.value); setCategory("Todos"); setFavoritesOnly(false); }} autoFocus /><button type="submit" className="inline-flex min-h-10 min-w-9 items-center justify-center p-1" aria-label="Ver resultados"><Icon name="arrow" /></button></form>}
      </header>
      <main id="conteudo">
        <section className="relative grid min-h-[620px] grid-cols-[46%_54%] bg-[#efeee6] max-wide:min-h-[560px] max-desktop:min-h-[530px] max-tablet:grid-cols-1 ultra:min-h-[740px] [&_h1]:my-[30px] [&_h1]:mb-6 [&_h1]:text-[clamp(65px,6.1vw,96px)] [&_h1]:leading-[1.05] [&_h1]:tracking-[-4px] max-wide:[&_h1]:text-[70px] max-desktop:[&_h1]:text-[59px] max-desktop:[&_h1]:tracking-[-2.5px] max-tablet:[&_h1]:mt-[22px] max-tablet:[&_h1]:mb-[18px] max-tablet:[&_h1]:text-[clamp(60px,13vw,85px)] [&_h1_em]:text-olive [&_.eyebrow]:flex [&_.eyebrow]:items-center [&_.eyebrow]:gap-2.5 [&_.eyebrow>span]:size-[5px] [&_.eyebrow>span]:rounded-full [&_.eyebrow>span]:bg-olive" aria-labelledby="hero-title">
          <div className="flex flex-col items-start pt-[95px] pr-5 pb-[50px] pl-[12%] max-wide:pt-[75px] max-desktop:pt-[65px] max-tablet:px-[8%] max-tablet:pt-[43px] max-tablet:pb-[34px] ultra:pl-[max(12%,calc((100vw-1335px)/2))]">
            <p className="eyebrow text-[9px] font-medium leading-[1.7] tracking-[2px]"><span /> NOVA COLEÇÃO · ESSENTIALS</p>
            <h1 id="hero-title">Seu estilo.<br />Sua <em>essência.</em></h1>
            <p className="text-sm leading-[1.9] text-[#717366] max-desktop:text-xs max-tablet:text-[13px]">Peças que acompanham seus dias.<br />E expressam tudo o que você é.</p>
            <a className="mt-[30px] max-tablet:mt-[23px] inline-flex min-h-[51px] items-center justify-between gap-[38px] px-[25px] py-4 text-[11px] transition-colors bg-foreground text-white hover:bg-olive" href="#colecao" onClick={() => selectCategory("Todos")}>Explore a coleção <Icon name="arrow" size={19} /></a>
            <div className="mt-auto flex items-center gap-3 pt-[42px] text-[10px] text-muted max-tablet:pt-[27px]"><span className="h-px w-[27px] bg-[#a9ab9d]" /> Menos excessos. Mais você.</div>
          </div>
          <div className="relative min-h-[620px] overflow-hidden bg-[#b4af9f] after:pointer-events-none after:absolute after:inset-x-0 after:top-[45%] after:bottom-0 after:bg-linear-to-b after:from-transparent after:to-[#24251b70] max-wide:min-h-[560px] max-desktop:min-h-[530px] max-tablet:min-h-[420px] ultra:min-h-[740px]">
            <Image src={photo("photo-1539109136881-3be0616acf4b", 1500)} alt="Moda feminina em tons neutros para inspirar seus looks" fill priority unoptimized sizes="(max-width: 700px) 100vw, 55vw" className="object-cover object-[center_43%] max-tablet:object-[center_40%]" />
            <div className="absolute right-[46px] bottom-[49px] left-[42px] z-10 flex items-end justify-between text-white max-desktop:right-[25px] max-desktop:left-[25px] max-tablet:bottom-8 [&>span:first-child]:text-[10px] [&>span:first-child]:leading-[1.9] [&>span:first-child]:tracking-[2px]"><span>O EXTRAORDINÁRIO<br />ESTÁ NO SIMPLES.</span><span className="font-serif text-7xl leading-[.6] italic">e.</span></div>
            <div className="absolute top-[30px] left-8 flex gap-5 text-[9px] tracking-[1.7px] text-white [&>span]:opacity-75 max-tablet:top-6 max-tablet:left-[25px]">ESSENCE EDIT <span>01 / 26</span></div>
          </div>
          <span className="absolute top-1/2 left-[19px] rotate-180 text-[8px] tracking-[2px] text-[#777a69] [writing-mode:vertical-rl] max-tablet:hidden">FEITA PARA A SUA MELHOR VERSÃO</span>
        </section>
        <div className="flex items-center justify-evenly gap-[18px] border-b border-line px-[4%] py-[25px] text-[10px] tracking-[.3px] [&>i]:text-[19px] [&>i]:text-[#8e957d] [&>i]:not-italic max-desktop:gap-3 max-desktop:text-[9px] max-desktop:[&>span:last-child]:hidden max-desktop:[&>i:last-of-type]:hidden max-tablet:justify-center max-tablet:gap-[23px] max-tablet:px-[5%] max-tablet:py-[19px] max-tablet:[&>span:nth-of-type(3)]:hidden max-tablet:[&>i:nth-of-type(2)]:hidden"><span>Estilo que permanece</span><i>✳</i><span>Detalhes que fazem a diferença</span><i>✳</i><span>Seu jeito de vestir</span><i>✳</i><span>Essencialmente você</span></div>
        <section className="pt-[88px] pb-[62px] max-tablet:pt-[50px] max-tablet:pb-8 mx-auto w-full max-w-[1500px] px-[5.5%] max-tablet:px-[6%]" id="colecao" aria-labelledby="collection-title">
          <div className="flex items-end justify-between gap-[25px] max-tablet:flex-col max-tablet:items-start max-tablet:gap-[18px] [&_.eyebrow]:mb-[17px] [&_.eyebrow]:text-olive max-tablet:[&_.eyebrow]:mb-[13px] [&_h2]:text-[clamp(34px,3.3vw,48px)] [&_h2]:leading-[1.15] [&_h2]:tracking-[-1.7px] max-tablet:[&_h2]:text-[37px]"><div><p className="eyebrow text-[9px] font-medium leading-[1.7] tracking-[2px]">O SEU PRÓXIMO FAVORITO</p><h2 id="collection-title">Essenciais para <em>você.</em></h2></div><p className="pb-[3px] text-[11px] leading-[1.8] text-muted max-tablet:[&>br]:hidden">Uma seleção para combinar com seu ritmo.<br />Descubra novas possibilidades.</p></div>
          <div className="mt-8 mb-[27px] flex items-center justify-between gap-[18px] max-tablet:mt-[25px] max-tablet:mb-[22px] max-tablet:flex-col max-tablet:items-start max-tablet:gap-[15px]"><div className="flex flex-wrap gap-2 max-tablet:gap-1.5" aria-label="Filtrar por categoria">{categories.map((item) => <button key={item} onClick={() => selectCategory(item)} className="border border-line px-[18px] py-2.5 text-[10px] transition-colors hover:bg-[#eeeee6] aria-pressed:border-olive aria-pressed:bg-olive aria-pressed:text-white max-tablet:px-[11px] max-tablet:py-[9px] max-tablet:text-[9px]" aria-pressed={category === item}>{item}</button>)}</div><span className="text-[10px] whitespace-nowrap text-muted" role="status">{visible.length} peças{favoritesOnly ? " favoritas" : " selecionadas"}</span></div>
          <div className="grid grid-cols-4 gap-6 max-wide:gap-4 max-desktop:grid-cols-2 max-desktop:gap-x-5 max-desktop:gap-y-[30px] max-tablet:gap-x-[13px] max-tablet:gap-y-[26px]">{visible.map((product) => <ProductCard
              key={product.id}
              product={product}
              isFavorite={favorites.includes(product.id)}
              onToggleFavorite={() => setFavorites((current) => current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id])}
              onAddToBag={() => addToBag(product.id)}
            />)}</div>
          {visible.length === 0 && <div className="flex flex-col items-center gap-5 px-[15px] py-[55px] text-center leading-[1.8] text-muted"><p>{favoritesOnly ? "Seus favoritos começam por aqui. Toque no coração das peças que você amar." : "Nenhuma peça encontrada para esta busca."}</p><button className="inline-flex items-center gap-[35px] border-b border-[#979b8a] py-2.5 text-[11px]" onClick={() => selectCategory("Todos")}>Ver todas as peças <Icon name="arrow" size={18} /></button></div>}
          <p className="mt-[22px] text-[10px] leading-[1.8] text-muted">Vitrine demonstrativa. Produtos, imagens e preços ilustrativos.</p>
          <p className="mt-2.5 min-h-[18px] text-[11px] text-olive" role="status">{notice}</p>
        </section>
        <section className="grid grid-cols-2 pb-20 max-tablet:grid-cols-1 max-tablet:pb-[45px] mx-auto w-full max-w-[1500px] px-[5.5%] max-tablet:px-[6%]" id="essencia" aria-labelledby="essence-title">
          <div className="relative min-h-[490px] bg-[#d1c5b2] [&>img]:object-cover [&>span]:absolute [&>span]:bottom-[27px] [&>span]:left-7 [&>span]:text-[9px] [&>span]:tracking-[2px] [&>span]:text-white max-desktop:min-h-[450px] max-tablet:min-h-[360px]"><Image src={photo("photo-1445205170230-053b83016050", 1000)} alt="Seleção de roupas em uma arara, com texturas e tons naturais" fill unoptimized sizes="(max-width: 700px) 100vw, 50vw" /><span>THE ESSENCE OF EVERYDAY</span></div>
          <div className="relative overflow-hidden bg-[#eeeee5] px-[13%] py-[65px] max-wide:px-[10%] max-wide:py-[55px] max-desktop:px-[9%] max-desktop:py-[45px] max-tablet:pt-10 max-tablet:pb-[50px] [&_.eyebrow]:text-olive [&_h2]:my-6 [&_h2]:text-[clamp(34px,3.2vw,48px)] [&_h2]:leading-[1.16] [&_h2]:tracking-[-1.2px] max-desktop:[&_h2]:text-[34px] max-tablet:[&_h2]:text-[40px] [&>p:not(.eyebrow)]:my-3 [&>p:not(.eyebrow)]:max-w-[350px] [&>p:not(.eyebrow)]:text-xs [&>p:not(.eyebrow)]:leading-[1.95] [&>p:not(.eyebrow)]:text-[#727367] max-tablet:[&>p:not(.eyebrow)]:max-w-none [&>a]:relative [&>a]:z-10 [&>a]:mt-4"><p className="eyebrow text-[9px] font-medium leading-[1.7] tracking-[2px]">MAIS DO QUE VESTIR</p><h2 id="essence-title">Um encontro com<br />a sua <em>essência.</em></h2><p>Acreditamos no estilo que nasce de dentro. Na liberdade de misturar, experimentar e encontrar beleza no seu próprio jeito.</p><p>A Essence Fashion é um convite para se vestir de você, em cada momento do dia.</p><a className="inline-flex items-center gap-[35px] border-b border-[#979b8a] py-2.5 text-[11px]" href="#colecao" onClick={() => selectCategory("Todos")}>Encontre seu próximo essencial <Icon name="arrow" size={19} /></a><span className="pointer-events-none absolute right-5 -bottom-5 font-serif text-[105px] tracking-[-8px] text-[#62694c0c]" aria-hidden="true">essence</span></div>
        </section>
        <section className="bg-[#f3f2ec] px-5 pt-[60px] pb-[70px] text-center [&_.eyebrow]:text-olive [&_h2]:mt-5 [&_h2]:mb-3 [&_h2]:text-[clamp(30px,3.7vw,52px)] [&_h2]:tracking-[-1.3px] max-tablet:px-[6%] max-tablet:py-[45px] max-tablet:[&_.eyebrow]:text-[8px] max-tablet:[&_.eyebrow]:tracking-[1.4px] max-tablet:[&_h2]:text-[33px] max-tablet:[&_h2]:leading-[1.2]"><p className="eyebrow text-[9px] font-medium leading-[1.7] tracking-[2px]">VISTA O QUE FAZ SENTIDO PARA VOCÊ</p><h2>O seu melhor look é <em>ser você.</em></h2><a className="inline-flex items-center gap-[35px] border-b border-[#979b8a] py-2.5 text-[11px]" href="#colecao" onClick={() => selectCategory("Todos")}>Descubra a coleção <Icon name="arrow" size={19} /></a></section>
      </main>
      <footer className="pt-[50px] pb-[22px] [&_.brand]:text-4xl max-tablet:pt-[35px] mx-auto w-full max-w-[1500px] px-[5.5%] max-tablet:px-[6%]"><div className="flex items-center justify-between gap-5 pb-10 [&>p]:font-serif [&>p]:text-lg [&>p]:text-muted [&>p]:italic [&>a:last-child]:text-[10px] max-tablet:flex-wrap max-tablet:gap-y-7 max-tablet:pb-[30px] max-tablet:[&>p]:text-[15px] max-tablet:[&>a:last-child]:w-full"><a className="brand inline-flex flex-col items-center font-serif text-[43px] leading-[.8] tracking-[-2px] max-desktop:text-4xl max-tablet:text-[34px] [&>span]:mt-3 [&>span]:ml-[5px] [&>span]:font-sans [&>span]:text-[8px] [&>span]:tracking-[5px] max-tablet:[&>span]:mt-2.5 max-tablet:[&>span]:text-[7px] max-tablet:[&>span]:tracking-[4px]" href="#">essence<span>FASHION</span></a><p>Seu estilo. Sua essência.</p><a href="#conteudo">Voltar ao início ↑</a></div><div className="flex justify-between gap-[15px] border-t border-line pt-[22px] text-[9px] text-muted max-tablet:text-[8px] max-tablet:leading-[1.7]"><span>© 2026 Essence Fashion</span><span>Moda para expressar quem você é.</span></div></footer>
      <dialog ref={bagDialog} className="m-auto max-h-[calc(100dvh-40px)] w-[min(520px,calc(100vw-24px))] border border-line bg-background p-[30px] text-foreground backdrop:bg-[#1f241b80] backdrop:backdrop-blur-sm max-tablet:p-[22px] [&>button]:w-full" aria-labelledby="bag-title" onClick={(event) => { if (event.target === event.currentTarget) bagDialog.current?.close(); }}>
        <div className="flex items-center justify-between gap-[15px] [&_h2]:mt-2 [&_h2]:text-[30px] [&_h2>span]:text-xl [&_h2>span]:text-muted"><div><p className="eyebrow text-[9px] font-medium leading-[1.7] tracking-[2px]">SEUS ESCOLHIDOS</p><h2 id="bag-title">Minha sacola <span>({count})</span></h2></div><button className="inline-flex min-h-10 min-w-9 items-center justify-center p-1" aria-label="Fechar sacola" onClick={() => bagDialog.current?.close()}><Icon name="close" /></button></div>
        <p className="mt-[22px] text-[10px] leading-[1.8] text-muted">Sacola demonstrativa, sem cobrança ou finalização de compra.</p>
        {count === 0 ? <div className="flex flex-col items-center gap-5 px-[15px] py-[55px] text-center leading-[1.8] text-muted"><Icon name="bag" size={40} /><p>Sua sacola está esperando seus novos favoritos.</p><button className="inline-flex min-h-[51px] items-center justify-between gap-[38px] px-[25px] py-4 text-[11px] transition-colors bg-foreground text-white hover:bg-olive" onClick={() => { bagDialog.current?.close(); document.getElementById("colecao")?.scrollIntoView({ behavior: "smooth" }); }}>Explorar coleção <Icon name="arrow" size={18} /></button></div> : <><div className="mt-[25px]">{products.filter((product) => bag[product.id] > 0).map((product) => <div className="flex items-start gap-4 border-b border-line py-[18px] [&>img]:object-cover [&>div]:flex-1 [&_h3]:mt-[5px] [&_h3]:mb-2 [&_h3]:text-xs [&_h3]:font-normal [&_p]:text-[11px] [&>strong]:pt-[5px] [&>strong]:text-[11px] [&>strong]:font-normal max-tablet:gap-2.5 max-tablet:[&>img]:h-20 max-tablet:[&>img]:w-[55px] max-tablet:[&>strong]:text-[10px]" key={product.id}><Image src={photo(product.image, 200)} alt={product.name} width={70} height={90} unoptimized /><div><h3>{product.name}</h3><p>{currency(product.price)}</p><div className="mt-1.5 inline-flex items-center gap-[5px] border border-line text-[11px] [&>button]:min-h-[30px] [&>button]:min-w-[30px]"><button className="inline-flex min-h-10 min-w-9 items-center justify-center p-1" aria-label={`Diminuir quantidade de ${product.name}`} onClick={() => setBag((current) => ({ ...current, [product.id]: Math.max(0, current[product.id] - 1) }))}><Icon name="minus" size={14} /></button><span aria-label="Quantidade">{bag[product.id]}</span><button className="inline-flex min-h-10 min-w-9 items-center justify-center p-1" aria-label={`Aumentar quantidade de ${product.name}`} onClick={() => addToBag(product.id)}><Icon name="plus" size={14} /></button></div></div><strong>{currency(product.price * bag[product.id])}</strong></div>)}</div><div className="flex justify-between py-[25px]"><span>Subtotal</span><strong>{currency(total)}</strong></div><button className="inline-flex min-h-[51px] items-center justify-between gap-[38px] px-[25px] py-4 text-[11px] transition-colors bg-foreground text-white hover:bg-olive" onClick={() => bagDialog.current?.close()}>Continuar explorando <Icon name="arrow" size={18} /></button></>}
      </dialog>
    </>
  );
}
