"use client";

import Image from "next/image";
import Icon from "@/components/ui/icon";
import ProductCard from "@/components/store/product-card";
import { categories, photo, products } from "@/lib/catalog";
import { useStore } from "@/components/store/store-provider";

export default function Home() {
  const { category, query, favorites, favoritesOnly, notice, selectCategory, toggleFavorite } = useStore();
  const visible = products.filter((product) =>
    (category === "Todos" || product.category === category) &&
    (!favoritesOnly || favorites.includes(product.id)) &&
    product.name.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR"))
  );

  return (
    <>
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
              onToggleFavorite={() => toggleFavorite(product.id)}
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
    </>
  );
}
