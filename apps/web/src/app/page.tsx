"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const products = [
  { id: 1, name: "Camisa Essential", category: "Camisas", price: 189.9, color: "Off-white", image: "photo-1598554747436-c9293d6a588f", tag: "ESSENCIAL" },
  { id: 2, name: "Vestido Aurora", category: "Vestidos", price: 279.9, color: "Areia", image: "photo-1515372039744-b8f02a3ae446", tag: "NOVIDADE" },
  { id: 3, name: "Blazer Contemporâneo", category: "Alfaiataria", price: 359.9, color: "Caramelo", image: "photo-1591047139829-d91aecb6caea", tag: "NOSSA ESCOLHA" },
  { id: 4, name: "Bolsa Everyday", category: "Acessórios", price: 229.9, color: "Cognac", image: "photo-1548036328-c9fa89d128fa", tag: "ESSENCIAL" },
];
const categories = ["Todos", "Camisas", "Vestidos", "Alfaiataria", "Acessórios"];
const currency = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const photo = (id: string, width = 700) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

function Icon({ name, size = 22 }: { name: "search" | "bag" | "heart" | "arrow" | "close" | "menu" | "minus" | "plus"; size?: number }) {
  const paths = {
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
    bag: <><path d="M5 7h14l1 14H4L5 7Z" /><path d="M8 8V6a4 4 0 0 1 8 0v2" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />,
    arrow: <path d="M4 12h16M14 6l6 6-6 6" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    menu: <path d="M3 6h18M3 12h18M3 18h18" />,
    minus: <path d="M5 12h14" />,
    plus: <path d="M5 12h14M12 5v14" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

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
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <div className="announcement">UM NOVO OLHAR PARA O SEU ESTILO <a href="#essencia">Conheça a Essence ↗</a></div>
      <header className="header">
        <div className="header-inner">
          <button className="icon-button mobile-menu" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? "close" : "menu"} /></button>
          <a className="brand" href="#" aria-label="Essence Fashion, início">essence<span>FASHION</span></a>
          <nav id="main-nav" className={menuOpen ? "navigation is-open" : "navigation"} aria-label="Navegação principal">
            <a href="#colecao" onClick={() => selectCategory("Todos")}>Novidades <span className="nav-dot" /></a>
            <a href="#colecao" onClick={() => selectCategory("Vestidos")}>Vestidos</a>
            <a href="#colecao" onClick={() => selectCategory("Alfaiataria")}>Alfaiataria</a>
            <a href="#colecao" onClick={() => selectCategory("Acessórios")}>Acessórios</a>
            <a href="#essencia" onClick={() => setMenuOpen(false)}>Nossa essência</a>
          </nav>
          <div className="header-actions">
            <button className="icon-button" aria-label="Buscar produtos" aria-expanded={searchOpen} onClick={() => setSearchOpen(!searchOpen)}><Icon name="search" /></button>
            <a className={`icon-button favorite-header ${favoritesOnly ? "selected" : ""}`} href="#colecao" aria-label={`Ver favoritos, ${favorites.length} produtos`} onClick={() => { setFavoritesOnly(!favoritesOnly); setCategory("Todos"); setQuery(""); }}><Icon name="heart" /></a>
            <button className="icon-button bag-button" aria-label={`Abrir sacola com ${count} itens`} onClick={() => bagDialog.current?.showModal()}><Icon name="bag" /><span>{count}</span></button>
          </div>
        </div>
        {searchOpen && <form className="search-bar" role="search" onSubmit={(event) => { event.preventDefault(); document.getElementById("colecao")?.scrollIntoView({ behavior: "smooth" }); }}><label htmlFor="product-search">O que você está procurando?</label><input id="product-search" type="search" placeholder="Busque uma peça…" value={query} onChange={(event) => { setQuery(event.target.value); setCategory("Todos"); setFavoritesOnly(false); }} autoFocus /><button type="submit" className="icon-button" aria-label="Ver resultados"><Icon name="arrow" /></button></form>}
      </header>
      <main id="conteudo">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span /> NOVA COLEÇÃO · ESSENTIALS</p>
            <h1 id="hero-title">Seu estilo.<br />Sua <em>essência.</em></h1>
            <p className="hero-description">Peças que acompanham seus dias.<br />E expressam tudo o que você é.</p>
            <a className="button button-dark" href="#colecao" onClick={() => selectCategory("Todos")}>Explore a coleção <Icon name="arrow" size={19} /></a>
            <div className="hero-footnote"><span className="small-line" /> Menos excessos. Mais você.</div>
          </div>
          <div className="hero-visual">
            <Image src={photo("photo-1539109136881-3be0616acf4b", 1500)} alt="Moda feminina em tons neutros para inspirar seus looks" fill priority unoptimized sizes="(max-width: 700px) 100vw, 55vw" className="hero-image" />
            <div className="image-caption"><span>O EXTRAORDINÁRIO<br />ESTÁ NO SIMPLES.</span><span className="caption-mark">e.</span></div>
            <div className="collection-label">ESSENCE EDIT <span>01 / 26</span></div>
          </div>
          <span className="hero-side-label">FEITA PARA A SUA MELHOR VERSÃO</span>
        </section>
        <div className="values-strip"><span>Estilo que permanece</span><i>✳</i><span>Detalhes que fazem a diferença</span><i>✳</i><span>Seu jeito de vestir</span><i>✳</i><span>Essencialmente você</span></div>
        <section className="collection section-container" id="colecao" aria-labelledby="collection-title">
          <div className="section-top"><div><p className="eyebrow">O SEU PRÓXIMO FAVORITO</p><h2 id="collection-title">Essenciais para <em>você.</em></h2></div><p className="section-description">Uma seleção para combinar com seu ritmo.<br />Descubra novas possibilidades.</p></div>
          <div className="collection-controls"><div className="filters" aria-label="Filtrar por categoria">{categories.map((item) => <button key={item} onClick={() => selectCategory(item)} className={category === item ? "filter active" : "filter"} aria-pressed={category === item}>{item}</button>)}</div><span className="product-count" role="status">{visible.length} peças{favoritesOnly ? " favoritas" : " selecionadas"}</span></div>
          <div className="product-grid">{visible.map((product) => <article className="product" key={product.id}>
            <div className="product-image-wrap"><Image src={photo(product.image)} alt={`${product.name} — imagem ilustrativa`} fill unoptimized sizes="(max-width: 600px) 48vw, (max-width: 900px) 45vw, 24vw" /><span className="product-tag">{product.tag}</span><button className={`product-favorite icon-button ${favorites.includes(product.id) ? "selected" : ""}`} aria-label={`${favorites.includes(product.id) ? "Remover" : "Adicionar"} ${product.name} ${favorites.includes(product.id) ? "dos" : "aos"} favoritos`} aria-pressed={favorites.includes(product.id)} onClick={() => setFavorites((current) => current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id])}><Icon name="heart" size={19} /></button><button className="quick-add" onClick={() => addToBag(product.id)}>Adicionar à sacola <Icon name="plus" size={16} /></button></div>
            <div className="product-meta"><h3>{product.name}</h3><span>{currency(product.price)}</span></div><div className="product-detail"><span>{product.color}</span><span>3x de {currency(product.price / 3)}</span></div>
          </article>)}</div>
          {visible.length === 0 && <div className="empty-state"><p>{favoritesOnly ? "Seus favoritos começam por aqui. Toque no coração das peças que você amar." : "Nenhuma peça encontrada para esta busca."}</p><button className="text-button" onClick={() => selectCategory("Todos")}>Ver todas as peças <Icon name="arrow" size={18} /></button></div>}
          <p className="demo-note">Vitrine demonstrativa. Produtos, imagens e preços ilustrativos.</p>
          <p className="bag-notice" role="status">{notice}</p>
        </section>
        <section className="editorial section-container" id="essencia" aria-labelledby="essence-title">
          <div className="editorial-image"><Image src={photo("photo-1445205170230-053b83016050", 1000)} alt="Seleção de roupas em uma arara, com texturas e tons naturais" fill unoptimized sizes="(max-width: 700px) 100vw, 50vw" /><span>THE ESSENCE OF EVERYDAY</span></div>
          <div className="editorial-copy"><p className="eyebrow">MAIS DO QUE VESTIR</p><h2 id="essence-title">Um encontro com<br />a sua <em>essência.</em></h2><p>Acreditamos no estilo que nasce de dentro. Na liberdade de misturar, experimentar e encontrar beleza no seu próprio jeito.</p><p>A Essence Fashion é um convite para se vestir de você, em cada momento do dia.</p><a className="text-button" href="#colecao" onClick={() => selectCategory("Todos")}>Encontre seu próximo essencial <Icon name="arrow" size={19} /></a><span className="editorial-signature" aria-hidden="true">essence</span></div>
        </section>
        <section className="closing"><p className="eyebrow">VISTA O QUE FAZ SENTIDO PARA VOCÊ</p><h2>O seu melhor look é <em>ser você.</em></h2><a className="text-button" href="#colecao" onClick={() => selectCategory("Todos")}>Descubra a coleção <Icon name="arrow" size={19} /></a></section>
      </main>
      <footer className="footer section-container"><div className="footer-top"><a className="brand" href="#">essence<span>FASHION</span></a><p>Seu estilo. Sua essência.</p><a href="#conteudo">Voltar ao início ↑</a></div><div className="footer-bottom"><span>© 2026 Essence Fashion</span><span>Moda para expressar quem você é.</span></div></footer>
      <dialog ref={bagDialog} className="bag-dialog" aria-labelledby="bag-title" onClick={(event) => { if (event.target === event.currentTarget) bagDialog.current?.close(); }}>
        <div className="bag-heading"><div><p className="eyebrow">SEUS ESCOLHIDOS</p><h2 id="bag-title">Minha sacola <span>({count})</span></h2></div><button className="icon-button" aria-label="Fechar sacola" onClick={() => bagDialog.current?.close()}><Icon name="close" /></button></div>
        <p className="demo-note">Sacola demonstrativa, sem cobrança ou finalização de compra.</p>
        {count === 0 ? <div className="empty-state"><Icon name="bag" size={40} /><p>Sua sacola está esperando seus novos favoritos.</p><button className="button button-dark" onClick={() => { bagDialog.current?.close(); document.getElementById("colecao")?.scrollIntoView({ behavior: "smooth" }); }}>Explorar coleção <Icon name="arrow" size={18} /></button></div> : <><div className="bag-items">{products.filter((product) => bag[product.id] > 0).map((product) => <div className="bag-item" key={product.id}><Image src={photo(product.image, 200)} alt={product.name} width={70} height={90} unoptimized /><div><h3>{product.name}</h3><p>{currency(product.price)}</p><div className="quantity"><button className="icon-button" aria-label={`Diminuir quantidade de ${product.name}`} onClick={() => setBag((current) => ({ ...current, [product.id]: Math.max(0, current[product.id] - 1) }))}><Icon name="minus" size={14} /></button><span aria-label="Quantidade">{bag[product.id]}</span><button className="icon-button" aria-label={`Aumentar quantidade de ${product.name}`} onClick={() => addToBag(product.id)}><Icon name="plus" size={14} /></button></div></div><strong>{currency(product.price * bag[product.id])}</strong></div>)}</div><div className="bag-total"><span>Subtotal</span><strong>{currency(total)}</strong></div><button className="button button-dark" onClick={() => bagDialog.current?.close()}>Continuar explorando <Icon name="arrow" size={18} /></button></>}
      </dialog>
    </>
  );
}
