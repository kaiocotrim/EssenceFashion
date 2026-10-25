import Link from "next/link";

export default function NotFound() {
  return <main id="conteudo" className="mx-auto w-full max-w-2xl px-6 py-24 text-center"><p className="text-xs tracking-widest text-olive">ESSEN FASHION / 404</p><h1 className="mt-5 text-4xl">Essa peça não está por aqui.</h1><p className="mt-5 leading-7 text-muted">Explore a coleção para encontrar seu próximo essencial.</p><Link href="/#colecao" className="mt-8 inline-flex bg-foreground px-7 py-4 text-xs text-white hover:bg-olive">Voltar à coleção →</Link></main>;
}
