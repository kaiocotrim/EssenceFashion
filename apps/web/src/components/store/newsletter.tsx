"use client";

import { useState } from "react";
import Icon from "@/components/ui/icon";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <section className="border-y border-line bg-[#f6f5f2] px-6 py-16 text-center tablet:py-20" aria-labelledby="newsletter-title">
      <p className="text-[9px] tracking-[3px] text-muted">UM UNIVERSO DE POSSIBILIDADES</p>
      <h2 id="newsletter-title" className="mt-4 font-serif text-3xl tablet:text-[40px]">Faça parte da Essen Fashion</h2>
      <p className="mx-auto mt-4 max-w-lg text-xs leading-6 text-muted">Novas coleções, inspirações e um novo jeito de olhar para o seu estilo.<br className="max-tablet:hidden" /> Deixe seu e-mail e descubra o que vem a seguir.</p>
      <form className="mx-auto mt-8 flex max-w-lg border-b border-[#898989]" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); setEmail(""); }}>
        <label htmlFor="newsletter-email" className="sr-only">Seu e-mail</label>
        <input id="newsletter-email" type="email" required autoComplete="email" maxLength={120} value={email} onChange={(event) => { setEmail(event.target.value); setSubmitted(false); }} placeholder="Digite seu e-mail" className="min-w-0 flex-1 bg-transparent px-1 py-4 text-xs placeholder:text-muted" />
        <button type="submit" className="flex items-center gap-5 px-2 py-4 text-[10px] tracking-[1px]">INSCREVER-SE <Icon name="arrow" size={18} /></button>
      </form>
      <p role="status" className="mx-auto mt-4 min-h-5 max-w-lg text-[10px] leading-5 text-muted">{submitted ? "Este cadastro é demonstrativo. Seu e-mail não foi enviado nem adicionado a uma lista." : "Cadastro demonstrativo. Nenhum e-mail será enviado."}</p>
    </section>
  );
}
