"use client";

import Link from "next/link";
import { Brand } from "./store-header";
import { useStore } from "./store-provider";

export default function StoreFooter() {
  const { selectCategory, selectCollection } = useStore();
  const linkClass = "block py-1.5 text-[11px] leading-5 text-muted transition-colors hover:text-black";
  return (
    <footer className="mt-auto bg-white px-[5%] pt-14 pb-6">
      <div className="mx-auto grid max-w-[1600px] grid-cols-[1.4fr_1fr_1fr_1fr] gap-12 pb-12 max-desktop:grid-cols-2 max-tablet:gap-x-6 max-tablet:gap-y-9">
        <div className="max-tablet:col-span-2"><Brand /><p className="mt-6 max-w-xs text-xs leading-7 text-muted">Novas possibilidades de vestir.<br />O mesmo compromisso com o seu estilo.</p><Link href="/#essencia" className="mt-4 inline-block border-b border-black pb-1 text-[10px] tracking-wider">DESCUBRA A ESSEN</Link></div>
        <div><h2 className="mb-4 font-sans text-[10px] tracking-[1.5px]">INSTITUCIONAL</h2><Link href="/#essencia" className={linkClass}>A marca</Link><Link href="/#elas-usam" className={linkClass}>Essen Inspira</Link><Link href="/ajuda#privacidade" className={linkClass}>Privacidade dos dados</Link><Link href="/ajuda#sobre" className={linkClass}>Sobre a demonstração</Link></div>
        <div><h2 className="mb-4 font-sans text-[10px] tracking-[1.5px]">EXPLORE</h2><Link href="/#colecao" onClick={() => selectCollection("new")} className={linkClass}>Novidades</Link><Link href="/#colecao" onClick={() => selectCategory("Vestidos")} className={linkClass}>Vestidos</Link><Link href="/#colecao" onClick={() => selectCategory("Blusas")} className={linkClass}>Blusas</Link><Link href="/#colecao" onClick={() => selectCategory("Alfaiataria")} className={linkClass}>Alfaiataria</Link><Link href="/#colecao" onClick={() => selectCollection("sale")} className={linkClass}>Seleção especial</Link></div>
        <div><h2 className="mb-4 font-sans text-[10px] tracking-[1.5px]">SUPORTE E AJUDA</h2><Link href="/sacola" className={linkClass}>Minha sacola</Link><Link href="/ajuda#entrega" className={linkClass}>Entrega</Link><Link href="/ajuda#pagamento" className={linkClass}>Formas de pagamento</Link><Link href="/ajuda#atendimento" className={linkClass}>Atendimento</Link><p className="mt-4 text-[9px] leading-5 tracking-wider text-muted">PIX · CARTÃO · BOLETO<br />EM MODO DEMONSTRAÇÃO</p></div>
      </div>
      <div className="mx-auto flex max-w-[1600px] flex-wrap justify-between gap-4 border-t border-line pt-6 text-[9px] leading-5 text-muted"><span>© 2026 ESSEN FASHION</span><span>Vitrine demonstrativa · Produtos, fotos e valores ilustrativos · Sem cobranças reais</span></div>
    </footer>
  );
}
