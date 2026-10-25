"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/components/store/store-provider";
import CheckoutProgress from "@/components/checkout/checkout-progress";
import OrderSummary from "@/components/checkout/order-summary";
import AddressForm from "@/components/checkout/address-form";
import PaymentForm from "@/components/checkout/payment-form";
import { currency } from "@/lib/catalog";
import { orderTotal } from "@/lib/cart";
import { addressError, deliveryOptions, emptyAddress, paymentMethods, type PaymentMethod } from "@/lib/checkout";

type Receipt = { total: number; count: number; method: string };

export default function CheckoutPage() {
  const { cart, ready, subtotal, count, clearBag } = useStore();
  const [step, setStep] = useState<2 | 3>(2);
  const [address, setAddress] = useState({ ...emptyAddress });
  const [deliveryId, setDeliveryId] = useState("standard");
  const [method, setMethod] = useState<PaymentMethod>("pix");
  const [installments, setInstallments] = useState(1);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const submitted = useRef(false);
  const delivery = deliveryOptions.find((option) => option.id === deliveryId) ?? deliveryOptions[0];
  const total = orderTotal(subtotal, delivery.price);

  useEffect(() => {
    titleRef.current?.focus();
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [step, receipt]);

  function goToStep(value: 2 | 3) {
    setStep(value);
  }
  function continueToPayment() {
    const message = addressError(address);
    setError(message);
    if (!message) goToStep(3);
  }
  function finish() {
    if (submitted.current || cart.length === 0) return;
    const message = addressError(address);
    if (message) { setError(message); goToStep(2); return; }
    submitted.current = true;
    setReceipt({ total, count, method: paymentMethods.find((item) => item.id === method)!.name });
    clearBag();
    setAddress({ ...emptyAddress });
  }

  return (
    <main id="conteudo" className="mx-auto w-full max-w-[1400px] px-[6%] py-8 tablet:py-12">
      {receipt ? (
        <section className="mx-auto my-10 max-w-xl border border-line bg-[#f5f4ee] px-6 py-14 text-center tablet:p-14">
          <span aria-hidden="true" className="mx-auto flex size-14 items-center justify-center rounded-full bg-olive text-2xl text-white">✓</span>
          <p className="mt-7 text-[10px] tracking-[2px] text-olive">DEMONSTRAÇÃO CONCLUÍDA</p>
          <h1 ref={titleRef} tabIndex={-1} className="mt-4 text-4xl">Seu estilo, a um passo.</h1>
          <p role="status" className="mt-5 text-sm leading-7 text-muted">Você percorreu o fluxo completo da Essen Fashion. Esta foi uma simulação: nenhuma compra foi realizada e nenhum pagamento foi processado.</p>
          <dl className="my-7 space-y-3 border-y border-line py-5 text-xs"><div className="flex justify-between gap-3"><dt>Peças na simulação</dt><dd>{receipt.count}</dd></div><div className="flex justify-between gap-3"><dt>Forma escolhida</dt><dd>{receipt.method}</dd></div><div className="flex justify-between gap-3"><dt>Total ilustrativo</dt><dd>{currency(receipt.total)}</dd></div></dl>
          <Link href="/#colecao" className="inline-flex bg-foreground px-7 py-4 text-xs text-white hover:bg-olive">Voltar à coleção →</Link>
        </section>
      ) : <>
        <CheckoutProgress current={step} />
        <p className="text-[10px] tracking-[2px] text-olive">SEU ESTILO, EM CADA DETALHE</p>
        <h1 ref={titleRef} tabIndex={-1} className="mt-3 text-4xl tracking-tight tablet:text-5xl">{step === 2 ? "Vamos até você." : "O último detalhe."}</h1>
        <p className="mt-4 mb-9 text-xs leading-6 text-muted">Checkout demonstrativo · Use dados fictícios · Sem cobrança real</p>
        {!ready ? <p role="status" className="py-20 text-center text-muted">Carregando seu pedido…</p> : cart.length === 0 ? <section className="mb-12 border border-line p-10 text-center"><h2 className="text-3xl">Sua sacola está vazia.</h2><p className="mt-4 text-sm text-muted">Escolha uma peça antes de continuar para a entrega e o pagamento.</p><Link href="/#colecao" className="mt-7 inline-flex bg-foreground px-7 py-4 text-xs text-white hover:bg-olive">Explorar a coleção →</Link></section> : (
          <div className="mb-14 grid gap-10 desktop:grid-cols-[minmax(0,1fr)_360px] wide:grid-cols-[minmax(0,1fr)_400px]">
            <section aria-label={step === 2 ? "Dados de entrega" : "Forma de pagamento"}>
              {step === 2 ? <AddressForm address={address} setAddress={setAddress} deliveryId={deliveryId} setDeliveryId={setDeliveryId} error={error} onContinue={continueToPayment} /> : <>
                <div className="mb-8 border border-line p-5"><div className="flex items-center justify-between gap-4"><h2 className="font-sans text-xs">Entregar para {address.name}</h2><button onClick={() => goToStep(2)} className="p-2 text-[11px] text-olive underline underline-offset-4">Editar</button></div><p className="mt-2 text-xs leading-6 text-muted">{address.street}, {address.number}{address.complement && ` · ${address.complement}`}<br />{address.district} · {address.city}/{address.state} · {address.zip}</p><p className="mt-2 text-[11px] text-muted">{delivery.name} · {currency(delivery.price)}</p></div>
                <PaymentForm method={method} setMethod={setMethod} installments={installments} setInstallments={setInstallments} total={total} onSubmit={finish} />
              </>}
              <div className="mt-7">{step === 2 ? <Link href="/sacola" className="text-xs text-muted">← Voltar à sacola</Link> : <button onClick={() => goToStep(2)} className="text-xs text-muted">← Voltar à entrega</button>}</div>
            </section>
            <OrderSummary shipping={delivery.price} />
          </div>
        )}
      </>}
    </main>
  );
}
