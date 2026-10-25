"use client";

import { currency, installmentLabel } from "@/lib/catalog";
import { paymentMethods, type PaymentMethod } from "@/lib/checkout";
import Icon from "@/components/ui/icon";

type Props = {
  method: PaymentMethod;
  setMethod: (method: PaymentMethod) => void;
  installments: number;
  setInstallments: (value: number) => void;
  total: number;
  onSubmit: () => void;
};

export default function PaymentForm({ method, setMethod, installments, setInstallments, total, onSubmit }: Props) {
  return (
    <form onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
      <fieldset>
        <legend className="font-serif text-2xl">Seu jeito de pagar.</legend>
        <p className="mt-3 text-xs leading-6 text-muted">Escolha uma forma de pagamento para visualizar o fluxo. Nenhuma cobrança será realizada.</p>
        <div className="mt-6 grid gap-3 tablet:grid-cols-3">{paymentMethods.map((option) => <label key={option.id} className={`flex cursor-pointer items-start gap-3 border p-4 ${method === option.id ? "border-olive bg-olive/5" : "border-line"}`}><input type="radio" name="payment" value={option.id} checked={method === option.id} onChange={() => setMethod(option.id)} className="mt-0.5 accent-olive" /><span className="text-xs"><span className="block">{option.name}</span><span className="mt-2 block text-[10px] leading-4 text-muted">{option.description}</span></span></label>)}</div>
      </fieldset>
      <div className="mt-6 border border-line p-6" aria-live="polite">
        {method === "pix" && <div><p className="text-[10px] tracking-[2px] text-olive">PIX</p><h3 className="mt-3 font-serif text-xl">Simples, do seu jeito.</h3><p className="mt-3 text-xs leading-6 text-muted">Em uma compra real, o próximo passo exibiria o QR Code e o código Pix. Nesta demonstração, nenhum código de pagamento é gerado.</p><p className="mt-5 text-sm">Valor da simulação: {currency(total)}</p></div>}
        {method === "card" && <div>
          <div className="mb-6 max-w-xs bg-olive p-6 text-white"><p className="text-[9px] tracking-[2px]">ESSENCE / CARTÃO DE TESTE</p><p className="mt-8 font-mono text-lg tracking-widest">•••• •••• •••• 4242</p><div className="mt-5 flex justify-between text-[10px]"><span>DEMONSTRAÇÃO</span><span>12/30</span></div></div>
          <p className="text-xs leading-6 text-muted">Usamos um cartão fictício nesta prévia. Não informe dados reais de cartão.</p>
          <div className="mt-4 grid gap-4 tablet:grid-cols-2"><label className="text-xs tablet:col-span-2">Número do cartão de teste<input value="4242 4242 4242 4242" readOnly className="mt-2 w-full border border-line bg-[#f5f4ee] p-3 text-sm text-muted" /></label><label className="text-xs">Validade<input value="12/30" readOnly className="mt-2 w-full border border-line bg-[#f5f4ee] p-3 text-sm text-muted" /></label><label className="text-xs">CVV de teste<input value="123" readOnly className="mt-2 w-full border border-line bg-[#f5f4ee] p-3 text-sm text-muted" /></label><label className="text-xs tablet:col-span-2">Parcelamento<select value={installments} onChange={(event) => setInstallments(Number(event.target.value))} className="mt-2 min-h-12 w-full border border-line bg-background p-3 text-sm">{[1, 2, 3].map((count) => <option key={count} value={count}>{installmentLabel(total, count)} · Total {currency(total)}</option>)}</select></label></div>
        </div>}
        {method === "boleto" && <div><p className="text-[10px] tracking-[2px] text-olive">BOLETO</p><h3 className="mt-3 font-serif text-xl">Pagamento à vista.</h3><p className="mt-3 text-xs leading-6 text-muted">Em uma compra real, o boleto seria emitido ao finalizar o pedido. Esta prévia não emite boletos nem reserva produtos.</p><p className="mt-5 text-sm">Valor da simulação: {currency(total)}</p></div>}
      </div>
      <p className="mt-5 text-[11px] leading-6 text-muted">Ao concluir, você verá apenas a confirmação da simulação. Nenhum pedido será enviado e nenhum dado será transmitido a um serviço de pagamento.</p>
      <button type="submit" className="mt-6 flex min-h-13 w-full items-center justify-between gap-4 bg-foreground px-6 py-4 text-xs text-white hover:bg-olive">Concluir simulação <Icon name="arrow" size={18} /></button>
    </form>
  );
}
