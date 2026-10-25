import Link from "next/link";
import { Brand } from "./store-header";

export default function StoreFooter() {
  return (
    <footer className="mt-auto border-t border-line px-[6%] pt-10 pb-6">
      <div className="mx-auto flex max-w-[1335px] flex-wrap items-center justify-between gap-8 pb-8">
        <Brand />
        <p className="font-serif text-lg text-muted italic">Seu estilo. Sua essência.</p>
        <Link href="/#colecao" className="text-xs">Explorar a coleção ↗</Link>
      </div>
      <div className="mx-auto flex max-w-[1335px] justify-between gap-4 border-t border-line pt-5 text-[10px] text-muted">
        <span>© 2026 Essence Fashion</span>
        <span>Loja demonstrativa · Sem cobranças reais</span>
      </div>
    </footer>
  );
}
