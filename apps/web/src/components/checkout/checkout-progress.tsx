import Link from "next/link";

export default function CheckoutProgress({ current }: { current: 1 | 2 | 3 }) {
  return (
    <nav aria-label="Etapas da compra" className="mb-10 border-b border-line pb-6">
      <ol className="flex items-center gap-4 text-[11px] tablet:gap-8">
        {["Sacola", "Entrega", "Pagamento"].map((label, index) => (
          <li key={label} aria-current={current === index + 1 ? "step" : undefined} className={`flex items-center gap-2 ${current >= index + 1 ? "text-olive" : "text-muted"}`}>
            <span className={`flex size-6 items-center justify-center rounded-full border text-[10px] ${current >= index + 1 ? "border-olive bg-olive text-white" : "border-line"}`}>{index + 1 < current ? "✓" : index + 1}</span>
            {index === 0 && current > 1 ? <Link href="/sacola" className="underline-offset-4 hover:underline">{label}</Link> : label}
          </li>
        ))}
      </ol>
    </nav>
  );
}
