export const products = [
  { id: 1, name: "Camisa Essential", category: "Camisas", price: 189.9, color: "Off-white", image: "photo-1598554747436-c9293d6a588f", tag: "ESSENCIAL" },
  { id: 2, name: "Vestido Aurora", category: "Vestidos", price: 279.9, color: "Areia", image: "photo-1515372039744-b8f02a3ae446", tag: "NOVIDADE" },
  { id: 3, name: "Blazer Contemporâneo", category: "Alfaiataria", price: 359.9, color: "Caramelo", image: "photo-1591047139829-d91aecb6caea", tag: "NOSSA ESCOLHA" },
  { id: 4, name: "Bolsa Everyday", category: "Acessórios", price: 229.9, color: "Cognac", image: "photo-1548036328-c9fa89d128fa", tag: "ESSENCIAL" },
];
export const categories = ["Todos", "Camisas", "Vestidos", "Alfaiataria", "Acessórios"];
export const currency = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const photo = (id: string, width = 700) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export type Product = (typeof products)[number];
