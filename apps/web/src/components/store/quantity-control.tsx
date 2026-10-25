"use client";

import Icon from "@/components/ui/icon";
import { MAX_QUANTITY } from "@/lib/cart";

type Props = { quantity: number; onChange: (value: number) => void; label: string; min?: number };

export default function QuantityControl({ quantity, onChange, label, min = 1 }: Props) {
  return (
    <div className="inline-flex items-center border border-line">
      <button type="button" className="p-3 disabled:cursor-not-allowed disabled:opacity-30" aria-label={`Diminuir quantidade de ${label}`} disabled={quantity <= min} onClick={() => onChange(quantity - 1)}><Icon name="minus" size={14} /></button>
      <span className="min-w-7 text-center text-xs" aria-live="polite">{quantity}</span>
      <button type="button" className="p-3 disabled:cursor-not-allowed disabled:opacity-30" aria-label={`Aumentar quantidade de ${label}`} disabled={quantity >= MAX_QUANTITY} onClick={() => onChange(quantity + 1)}><Icon name="plus" size={14} /></button>
    </div>
  );
}
