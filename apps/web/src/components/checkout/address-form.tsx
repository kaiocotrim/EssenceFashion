"use client";

import type { Dispatch, SetStateAction } from "react";
import Icon from "@/components/ui/icon";
import { currency } from "@/lib/catalog";
import { deliveryOptions, states, type Address } from "@/lib/checkout";

const fieldClass = "mt-2 min-h-12 w-full border border-line bg-background px-3 py-3 text-sm placeholder:text-muted/60";
const fields: { key: keyof Address; label: string; autoComplete: string; type?: string; maxLength: number; wide?: boolean; optional?: boolean }[] = [
  { key: "email", label: "E-mail", type: "email", autoComplete: "email", maxLength: 120, wide: true },
  { key: "name", label: "Nome completo", autoComplete: "shipping name", maxLength: 100 },
  { key: "phone", label: "Telefone com DDD", type: "tel", autoComplete: "shipping tel-national", maxLength: 16 },
  { key: "zip", label: "CEP", autoComplete: "shipping postal-code", maxLength: 9 },
  { key: "street", label: "Rua / Avenida", autoComplete: "shipping address-line1", maxLength: 120, wide: true },
  { key: "number", label: "Número", autoComplete: "off", maxLength: 12 },
  { key: "complement", label: "Complemento (opcional)", autoComplete: "shipping address-line2", maxLength: 80, optional: true },
  { key: "district", label: "Bairro", autoComplete: "shipping address-line3", maxLength: 80 },
  { key: "city", label: "Cidade", autoComplete: "shipping address-level2", maxLength: 80 },
];

type Props = {
  address: Address;
  setAddress: Dispatch<SetStateAction<Address>>;
  deliveryId: string;
  setDeliveryId: (id: string) => void;
  error: string;
  onContinue: () => void;
};

export default function AddressForm({ address, setAddress, deliveryId, setDeliveryId, error, onContinue }: Props) {
  return (
    <form onSubmit={(event) => { event.preventDefault(); onContinue(); }}>
      <h2 className="text-2xl">Para onde vamos?</h2>
      <p className="mt-3 text-xs leading-6 text-muted">Preencha os campos para explorar o checkout. Use dados fictícios nesta demonstração.</p>
      <div className="mt-6 grid gap-x-5 gap-y-5 tablet:grid-cols-2">
        {fields.map((field) => (
          <label key={field.key} className={`block text-xs ${field.wide ? "tablet:col-span-2" : ""}`}>
            {field.label}
            <input
              name={field.key}
              type={field.type || "text"}
              autoComplete={field.autoComplete}
              required={!field.optional}
              maxLength={field.maxLength}
              value={address[field.key]}
              inputMode={field.key === "zip" ? "numeric" : undefined}
              placeholder={field.key === "zip" ? "00000-000" : field.key === "phone" ? "(11) 99999-9999" : undefined}
              className={fieldClass}
              onChange={(event) => {
                let value = event.target.value;
                if (field.key === "zip") value = value.replace(/\D/g, "").slice(0, 8).replace(/^(\d{5})(\d)/, "$1-$2");
                setAddress((current) => ({ ...current, [field.key]: value }));
              }}
            />
          </label>
        ))}
        <label className="block text-xs">Estado<select name="state" required autoComplete="shipping address-level1" value={address.state} onChange={(event) => setAddress((current) => ({ ...current, state: event.target.value }))} className={fieldClass}><option value="">Selecione a UF</option>{states.map((state) => <option key={state} value={state}>{state}</option>)}</select></label>
      </div>
      <fieldset className="mt-9 border-t border-line pt-7">
        <legend className="pt-7 font-serif text-2xl">Como prefere receber?</legend>
        <div className="mt-5 space-y-3">{deliveryOptions.map((option) => <label key={option.id} className={`flex cursor-pointer items-center gap-3 border p-4 ${deliveryId === option.id ? "border-olive bg-olive/5" : "border-line"}`}><input type="radio" name="delivery" value={option.id} checked={deliveryId === option.id} onChange={() => setDeliveryId(option.id)} className="accent-olive" /><span className="flex-1 text-xs"><span className="block">{option.name}</span><span className="mt-1 block text-[10px] leading-5 text-muted">{option.description}</span></span><span className="text-xs">{currency(option.price)}</span></label>)}</div>
      </fieldset>
      {error && <p role="alert" className="mt-5 border-l-2 border-red-700 bg-red-50 p-4 text-xs text-red-800">{error}</p>}
      <button type="submit" className="mt-7 flex min-h-13 w-full items-center justify-between gap-4 bg-foreground px-6 py-4 text-xs text-white hover:bg-olive">Continuar para pagamento <Icon name="arrow" size={18} /></button>
    </form>
  );
}
