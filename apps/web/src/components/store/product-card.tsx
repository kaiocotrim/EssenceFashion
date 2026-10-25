import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/ui/icon";
import { currency, installmentLabel, photo, type Product } from "@/lib/catalog";

type ProductCardProps = {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

export default function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
}: ProductCardProps) {
  return (
    <article className="group">
      <div className="relative aspect-[.73] overflow-hidden bg-[#eae7df] max-tablet:aspect-[.68]">
        <Link href={`/produto/${product.id}`} aria-label={`Ver detalhes de ${product.name}`}>
          <Image
            src={photo(product.image)}
            alt={`${product.name} — imagem ilustrativa`}
            fill
            unoptimized
            sizes="(max-width: 700px) 44vw, (max-width: 900px) 45vw, 23vw"
            className="object-cover transition-transform duration-600 group-hover:scale-[1.04]"
          />
        </Link>
        <span className="absolute top-[14px] left-3 bg-[#fffef9ec] px-[9px] py-[7px] text-[7px] tracking-[1px] max-tablet:top-2.5 max-tablet:left-2 max-tablet:p-1.5 max-tablet:text-[6px] max-tablet:tracking-[.5px]">
          {product.tag}
        </span>
        <button
          className={`absolute top-[9px] right-2 inline-flex min-h-10 min-w-9 items-center justify-center rounded-full bg-[#fffef9e8] p-1 max-tablet:top-[7px] max-tablet:right-[5px] max-tablet:min-h-8 max-tablet:min-w-[30px] max-tablet:[&>svg]:w-4 ${isFavorite ? "[&_svg]:fill-[#697154] [&_svg]:text-[#697154]" : ""}`}
          aria-label={`${isFavorite ? "Remover" : "Adicionar"} ${product.name} ${isFavorite ? "dos" : "aos"} favoritos`}
          aria-pressed={isFavorite}
          onClick={onToggleFavorite}
        >
          <Icon name="heart" size={19} />
        </button>
        <Link
          href={`/produto/${product.id}`}
          className="absolute right-2.5 bottom-2.5 left-2.5 flex items-center justify-between bg-[#fffef9f2] px-[13px] py-3 text-[10px] hover:bg-white max-tablet:right-[7px] max-tablet:bottom-[7px] max-tablet:left-[7px] max-tablet:px-[7px] max-tablet:py-[11px] max-tablet:text-[8px] max-tablet:[&>svg]:w-[13px]"
        >
          Escolher tamanho
          <Icon name="arrow" size={16} />
        </Link>
      </div>
      <div className="mt-[17px] flex items-baseline justify-between gap-1.5 desktop:max-wide:flex-col max-tablet:mt-3 max-tablet:flex-col max-tablet:gap-[7px]">
        <h3 className="text-xs font-normal max-tablet:text-[11px]">
          <Link href={`/produto/${product.id}`}>{product.name}</Link>
        </h3>
        <span className="text-[11px] whitespace-nowrap">
          {currency(product.price)}
        </span>
      </div>
      <div className="mt-[9px] flex justify-between gap-1.5 text-[9px] text-muted max-tablet:flex-col max-tablet:gap-[5px]">
        <span>{product.color}</span>
        <span>{installmentLabel(product.price)}</span>
      </div>
    </article>
  );
}
