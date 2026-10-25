export type Address = {
  email: string; name: string; phone: string; zip: string; street: string;
  number: string; complement: string; district: string; city: string; state: string;
};
export const emptyAddress: Address = {
  email: "", name: "", phone: "", zip: "", street: "", number: "",
  complement: "", district: "", city: "", state: "",
};
export const states = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
export const deliveryOptions = [
  { id: "standard", name: "Entrega padrão", description: "5 a 8 dias úteis · Prazo ilustrativo", price: 19.9 },
  { id: "express", name: "Entrega expressa", description: "2 a 3 dias úteis · Prazo ilustrativo", price: 29.9 },
];
export const paymentMethods = [
  { id: "pix", name: "Pix", description: "Pagamento instantâneo" },
  { id: "card", name: "Cartão de crédito", description: "Até 3 parcelas" },
  { id: "boleto", name: "Boleto", description: "Pagamento à vista" },
] as const;
export type PaymentMethod = (typeof paymentMethods)[number]["id"];

export function addressError(address: Address): string {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email.trim())) return "Informe um e-mail válido.";
  if (address.name.trim().split(/\s+/).length < 2) return "Informe seu nome e sobrenome.";
  if (!/^\d{10,11}$/.test(address.phone.replace(/\D/g, ""))) return "Informe um telefone com DDD, com 10 ou 11 dígitos.";
  if (!/^\d{8}$/.test(address.zip.replace(/\D/g, ""))) return "Informe um CEP com 8 dígitos.";
  if (![address.street, address.number, address.district, address.city].every((value) => value.trim())) return "Preencha todos os campos obrigatórios do endereço.";
  if (!states.includes(address.state)) return "Selecione um estado válido.";
  return "";
}
