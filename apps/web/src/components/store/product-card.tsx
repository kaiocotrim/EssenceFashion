"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Icon from "@/components/ui/icon";
import { colorSwatch, currency, installmentLabel, photo, type Product } from "@/lib/catalog";
import { useStore } from "./store-provider";

type ProductCardProps = {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

export default function ProductCard({ product, isFavorite, onToggleFavorite }: ProductCardProps) {
  const [sizesOpen, setSizesOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToBag } = useStore();

  function add(size: string) {
    addToBag(product.id, size);
    setSizesOpen(false);
    setAdded(true);
  }

  return (
    <article className="group relative min-w-0">
      <div className="relative aspect-[.79] overflow-hidden bg-[#f1f0ee]">
        <Link href={`/produto/${product.id}`} aria-label={`Ver detalhes de ${product.name}`}>
          <Image src={photo(product.image)} alt={`${product.name} — imagem ilustrativa`} fill unoptimized={!product.image.startsWith("/")} sizes="(max-width: 700px) 47vw, (max-width: 1100px) 31vw, 24vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
        </Link>
        {product.compareAt && <span className="absolute top-3 left-3 bg-white px-2 py-1 text-[9px] tracking-wide text-[#a54c43]">{Math.round((1 - product.price / product.compareAt) * 100)}% OFF</span>}
        <button className={`absolute top-2 right-2 flex size-10 items-center justify-center rounded-full bg-white/60 transition-colors hover:bg-white ${isFavorite ? "[&>svg]:fill-black" : ""}`} aria-label={`${isFavorite ? "Remover" : "Adicionar"} ${product.name} ${isFavorite ? "dos" : "aos"} favoritos`} aria-pressed={isFavorite} onClick={onToggleFavorite}><Icon name="heart" size={19} /></button>
        <div className={`absolute inset-x-0 bottom-0 bg-white/95 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 max-tablet:opacity-100 ${sizesOpen || added ? "opacity-100" : "opacity-0"}`}>
          {sizesOpen ? <div className="px-3 py-4"><div className="mb-3 flex items-center justify-between gap-2"><span className="text-[9px] tracking-wider">ESCOLHA O TAMANHO</span><button onClick={() => setSizesOpen(false)} aria-label="Fechar seleção de tamanho" className="p-1"><Icon name="close" size={14} /></button></div><div className="flex flex-wrap justify-center gap-1.5">{product.sizes.map((size) => <button key={size} onClick={() => add(size)} className="min-h-9 min-w-8 border border-line px-2 text-[10px] transition-colors hover:border-black hover:bg-black hover:text-white">{size}</button>)}</div></div> : <button onClick={() => product.sizes.length === 1 ? add(product.sizes[0]) : setSizesOpen(true)} className="flex min-h-12 w-full items-center justify-center gap-3 px-3 py-3 text-[9px] tracking-[1px] max-tablet:min-h-10 max-tablet:text-[8px]">{added ? "ADICIONADO À SACOLA ✓" : "INCLUIR NA SACOLA"}{!added && <Icon name="plus" size={15} />}</button>}
        </div>
      </div>
      <div className="pt-4 pb-2 text-[11px] leading-6 max-tablet:text-[10px]">
        <h3 className="truncate font-sans text-[11px] font-normal tracking-[.7px] uppercase max-tablet:text-[10px]"><Link href={`/produto/${product.id}`}>{product.name}</Link></h3>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2">{product.compareAt && <span className="text-[10px] text-muted line-through">{currency(product.compareAt)}</span>}<span>{currency(product.price)}</span></div>
        <p className="text-[10px] text-muted max-tablet:text-[9px]">ou {installmentLabel(product.price)}</p>
        <div className="mt-2 flex items-center gap-2"><span className="size-3 border border-black/15" style={{ backgroundColor: colorSwatch(product.color) }} aria-hidden="true" /><span className="text-[9px] text-muted">{product.color}</span></div>
      </div>
      <span role="status" className="sr-only">{added ? `${product.name} adicionado à sacola` : ""}</span>
    </article>
  );
}
