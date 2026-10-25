"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Icon from "@/components/ui/icon";
import { useStore } from "./store-provider";

export default function CampaignHero() {
  const [slide, setSlide] = useState(0);
  const { selectCollection } = useStore();
  const collection = slide === 0 ? "casual" : "evening";

  return (
    <section aria-label="Campanhas Essen Fashion" aria-roledescription="carrossel" className="relative aspect-[1920/815] overflow-hidden bg-[#b3a083] max-tablet:aspect-[4/5]">
      <Link href="/#colecao" onClick={() => selectCollection(collection)} className="absolute inset-0" aria-label={slide === 0 ? "Explorar a coleção Casual" : "Explorar ocasiões especiais"}>
        {slide === 0 ? <>
          <Image src="/images/campaign/casual-desktop.webp" alt="Coleção Casual: mulher com vestido de tricô em meio à natureza" fill priority sizes="(max-width: 700px) 1px, 100vw" className="hidden object-cover tablet:block" />
          <Image src="/images/campaign/pleats.webp" alt="Vestido leve para os dias de verão" fill priority sizes="(max-width: 700px) 100vw, 1px" className="object-cover object-[center_40%] tablet:hidden" />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent tablet:hidden" />
          <div className="absolute bottom-14 left-7 text-white tablet:hidden"><p className="mb-3 text-[9px] tracking-[3px]">ESSEN FASHION / NOVO OLHAR</p><h1 className="font-serif text-5xl">Casuais</h1><p className="mt-3 text-sm">Leveza para acompanhar seus dias.</p><span className="mt-6 inline-block border-b border-white pb-1 text-[11px] tracking-[2px]">EXPLORE A COLEÇÃO</span></div>
          <h1 className="sr-only max-tablet:hidden">Essen Fashion — descubra a coleção Casual</h1>
        </> : <>
          <Image src="/images/campaign/evening.webp" alt="Vestido longo de festa sob a luz do verão" fill sizes="100vw" className="object-cover object-[center_34%] tablet:object-[center_37%]" />
          <div className="absolute inset-0 bg-linear-to-r from-black/35 to-transparent" />
          <div className="absolute top-1/2 left-[8%] -translate-y-1/2 text-white max-tablet:top-auto max-tablet:bottom-14 max-tablet:left-7 max-tablet:translate-y-0"><p className="mb-5 text-[10px] tracking-[3px]">ESSEN FASHION</p><h1 className="max-w-lg font-serif text-[clamp(42px,5vw,82px)] leading-[1.05]">Feita para<br />o seu momento.</h1><p className="mt-5 max-w-xs text-sm leading-6 max-tablet:text-xs">Descubra peças que tornam cada ocasião ainda mais sua.</p><span className="mt-7 inline-block border-b border-white pb-2 text-[11px] tracking-[2px]">EXPLORE A COLEÇÃO</span></div>
        </>}
      </Link>
      <button aria-label="Campanha anterior" onClick={() => setSlide(slide === 0 ? 1 : 0)} className="absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center text-white max-tablet:left-0 max-tablet:size-8"><span className="rotate-180"><Icon name="arrow" size={24} /></span></button>
      <button aria-label="Próxima campanha" onClick={() => setSlide(slide === 0 ? 1 : 0)} className="absolute top-1/2 right-3 flex size-10 -translate-y-1/2 items-center justify-center text-white max-tablet:right-0 max-tablet:size-8"><Icon name="arrow" size={24} /></button>
      <div className="absolute right-0 bottom-4 left-0 flex justify-center gap-1" aria-label="Selecionar campanha">{[0, 1].map((value) => <button key={value} onClick={() => setSlide(value)} aria-label={`Ver campanha ${value + 1}`} aria-pressed={slide === value} className="flex size-8 items-center justify-center"><span className={`h-0.5 w-6 ${slide === value ? "bg-white" : "bg-white/40"}`} /></button>)}</div>
      <span className="sr-only" aria-live="polite">Campanha {slide + 1} de 2</span>
    </section>
  );
}
