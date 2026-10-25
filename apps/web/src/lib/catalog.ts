export const products = [
  {
    id: 1, name: "Camisa Essential", category: "Camisas", price: 189.9,
    color: "Off-white", image: "photo-1598554747436-c9293d6a588f", tag: "ESSENCIAL",
    sizes: ["PP", "P", "M", "G", "GG"],
    description: "Uma peça para acompanhar a sua rotina com leveza. A modelagem solta e o tom neutro abrem espaço para combinações que vão do casual ao escritório.",
  },
  {
    id: 2, name: "Vestido Aurora", category: "Vestidos", price: 279.9,
    color: "Areia", image: "photo-1515372039744-b8f02a3ae446", tag: "NOVIDADE",
    sizes: ["PP", "P", "M", "G", "GG"],
    description: "Movimento, simplicidade e um toque de personalidade. Um vestido para explorar novas combinações e encontrar o seu jeito de vestir.",
  },
  {
    id: 3, name: "Blazer Contemporâneo", category: "Alfaiataria", price: 359.9,
    color: "Caramelo", image: "photo-1591047139829-d91aecb6caea", tag: "NOSSA ESCOLHA",
    sizes: ["PP", "P", "M", "G", "GG"],
    description: "A terceira peça que transforma o look. Linhas simples e uma proposta versátil para combinar com jeans, vestidos ou sua alfaiataria favorita.",
  },
  {
    id: 4, name: "Bolsa Everyday", category: "Acessórios", price: 229.9,
    color: "Cognac", image: "photo-1548036328-c9fa89d128fa", tag: "ESSENCIAL",
    sizes: ["Único"],
    description: "Um detalhe que acompanha seus caminhos. A proposta atemporal e a cor fácil de combinar fazem dela uma inspiração para o dia a dia.",
  },
];
export const categories = ["Todos", "Camisas", "Vestidos", "Alfaiataria", "Acessórios"];
export const currency = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const photo = (id: string, width = 700) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
export type Product = (typeof products)[number];

export function installmentLabel(total: number, count = 3): string {
  const cents = Math.round(total * 100);
  const base = Math.floor(cents / count);
  const remainder = cents % count;
  const first = (base + (remainder > 0 ? 1 : 0)) / 100;
  const last = base / 100;
  return remainder > 0
    ? `${remainder}x de ${currency(first)} + ${count - remainder}x de ${currency(last)}`
    : `${count}x de ${currency(first)}`;
}
