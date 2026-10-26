"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Icon from "@/components/ui/icon";
import { useStore } from "./store-provider";

export default function CampaignHero() {
  const [slide, setSlide] = useState(0);
  const { selectCollection } = useStore();

  return (
    <section aria-label="Campanhas Essen Fashion" aria-roledescription="carrossel" className="relative aspect-[2052/766] overflow-hidden bg-[#f7f7f7] max-tablet:aspect-[4/5]">
      <Link hidden={slide !== 0} href="/#colecao" onClick={() => selectCollection("new")} className="absolute inset-0 text-[#173d55] max-tablet:text-white" aria-label="Explorar a coleção Rio da Essen Fashion">
        <Image src="/images/banner1.png" alt="Campanha Essen Fashion com modelo de vestido azul e óculos de sol, em duas poses sobre fundo branco" fill priority sizes="100vw" className="object-cover object-center max-tablet:object-right" />
        <div className="absolute inset-0 max-tablet:bg-linear-to-t max-tablet:from-black/55 max-tablet:via-transparent max-tablet:to-transparent" />
        <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-campaign text-[clamp(90px,9vw,170px)] leading-none max-tablet:top-auto max-tablet:bottom-28 max-tablet:left-6 max-tablet:translate-x-0 max-tablet:translate-y-0 max-tablet:text-[112px]">Rio</h1>
        <span className="absolute top-[68%] left-1/2 -translate-x-1/2 border-b border-current pb-1 text-[18px] leading-tight max-tablet:top-auto max-tablet:bottom-20 max-tablet:left-8 max-tablet:translate-x-0 max-tablet:text-sm">SHOP NOW</span>
      </Link>
      {slide === 1 && <Link href="/#colecao" onClick={() => selectCollection("evening")} className="absolute inset-0" aria-label="Explorar ocasiões especiais">
          <Image src="/images/campaign/evening.webp" alt="Vestido longo de festa sob a luz do verão" fill sizes="100vw" className="object-cover object-[center_34%] tablet:object-[center_37%]" />
          <div className="absolute inset-0 bg-linear-to-r from-black/35 to-transparent" />
          <div className="absolute top-1/2 left-[8%] -translate-y-1/2 text-white max-tablet:top-auto max-tablet:bottom-14 max-tablet:left-7 max-tablet:translate-y-0"><p className="mb-5 text-[10px] tracking-[3px]">ESSEN FASHION</p><h1 className="max-w-lg font-serif text-[clamp(42px,5vw,82px)] leading-[1.05]">Feita para<br />o seu momento.</h1><p className="mt-5 max-w-xs text-sm leading-6 max-tablet:text-xs">Descubra peças que tornam cada ocasião ainda mais sua.</p><span className="mt-7 inline-block border-b border-white pb-2 text-[11px] tracking-[2px]">EXPLORE A COLEÇÃO</span></div>
      </Link>}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/45 to-transparent max-tablet:h-36 max-tablet:from-black/65" />
      <button aria-label="Campanha anterior" onClick={() => setSlide(slide === 0 ? 1 : 0)} className="absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center text-white max-tablet:left-0 max-tablet:size-8"><span className="rotate-180"><Icon name="arrow" size={24} /></span></button>
      <button aria-label="Próxima campanha" onClick={() => setSlide(slide === 0 ? 1 : 0)} className="absolute top-1/2 right-3 flex size-10 -translate-y-1/2 items-center justify-center text-white max-tablet:right-0 max-tablet:size-8"><Icon name="arrow" size={24} /></button>
      <div className="absolute right-0 bottom-4 left-0 mx-auto flex w-fit justify-center gap-1 rounded-full bg-black/20 px-2" aria-label="Selecionar campanha">{[0, 1].map((value) => <button key={value} onClick={() => setSlide(value)} aria-label={`Ver campanha ${value + 1}`} aria-pressed={slide === value} className="flex size-8 items-center justify-center"><span className={`h-0.5 w-6 ${slide === value ? "bg-white" : "bg-white/40"}`} /></button>)}</div>
      <span className="sr-only" aria-live="polite">Campanha {slide + 1} de 2</span>
    </section>
  );
}
