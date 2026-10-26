export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  color: string;
  image: string;
  tag: string;
  sizes: string[];
  description: string;
  occasion?: "Casual" | "Festa";
  fabric?: string;
  featured?: boolean;
  isNew?: boolean;
  compareAt?: number;
  active?: boolean;
  stock?: Record<string, number>;
  sku?: string;
};

export const products: Product[] = [
  {
    id: 1, name: "Camisa Essential", category: "Camisas", price: 189.9,
    color: "Off-white", image: "photo-1598554747436-c9293d6a588f", tag: "ESSENCIAL",
    sizes: ["PP", "P", "M", "G", "GG"],
    description: "Uma peça para acompanhar a sua rotina com leveza. A modelagem solta e o tom neutro abrem espaço para combinações que vão do casual ao escritório.",
  },
  {
    id: 2, name: "Vestido Aurora", category: "Vestidos", price: 279.9,
    color: "Rosa", image: "/images/products/vestido-aurora.webp", tag: "NOVIDADE",
    occasion: "Festa", featured: true, isNew: true, fabric: "Cetim",
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
  {
    id: 5, name: "Vestido Midi Serena", category: "Vestidos", price: 389.9,
    color: "Off-white", image: "/images/products/vestido-serena.webp", tag: "NOVIDADE",
    sizes: ["PP", "P", "M", "G", "GG"], occasion: "Casual", fabric: "Algodão", featured: true, isNew: true,
    description: "Linhas delicadas e uma silhueta leve para acompanhar dias especiais. Uma proposta romântica para compor com seus acessórios favoritos.",
  },
  {
    id: 6, name: "Top Iris", category: "Blusas", price: 199.9,
    color: "Preto", image: "/images/products/top-iris.webp", tag: "ESSEN EDIT",
    sizes: ["PP", "P", "M", "G", "GG"], occasion: "Festa", fabric: "Alfaiataria", featured: true, isNew: true,
    description: "O encontro entre linhas marcantes e a versatilidade do preto. Um top para composições que vão do jantar aos seus momentos de celebração.",
  },
  {
    id: 7, name: "Vestido Longo Brisa", category: "Vestidos", price: 459.9,
    color: "Verde-água", image: "/images/products/vestido-brisa.webp", tag: "NOVIDADE",
    sizes: ["PP", "P", "M", "G", "GG"], occasion: "Festa", fabric: "Plissado", featured: true, isNew: true,
    description: "Um convite ao movimento. Uma silhueta longa, de presença delicada, para vestir os momentos que merecem ficar na memória.",
  },
  {
    id: 8, name: "Chemise Luna", category: "Chemises", price: 329.9,
    color: "Azul marinho", image: "/images/products/chemise-luna.webp", tag: "ESSEN EDIT",
    sizes: ["PP", "P", "M", "G", "GG"], occasion: "Casual", fabric: "Linho",
    description: "A elegância descontraída da chemise em uma proposta para todos os dias. Experimente com sandálias e acessórios naturais.",
  },
  {
    id: 9, name: "Vestido Midi Olivia", category: "Vestidos", price: 349.9,
    color: "Off-white", image: "/images/products/vestido-olivia.webp", tag: "SELEÇÃO ESPECIAL",
    sizes: ["PP", "P", "M", "G", "GG"], occasion: "Casual", fabric: "Plissado", compareAt: 429.9,
    description: "Um novo olhar para a leveza. A modelagem midi inspira combinações descomplicadas, cheias de personalidade.",
  },
  {
    id: 10, name: "Blusa Nora", category: "Blusas", price: 219.9,
    color: "Azul", image: "/images/products/blusa-nora.webp", tag: "ESSEN EDIT",
    sizes: ["PP", "P", "M", "G", "GG"], occasion: "Casual", fabric: "Algodão", isNew: true,
    description: "Detalhes que dão um novo ritmo aos seus looks. Uma peça para combinar com alfaiataria, saias ou seu jeans favorito.",
  },
  {
    id: 11, name: "Vestido Longo Elisa", category: "Vestidos", price: 429.9,
    color: "Preto", image: "/images/products/vestido-elisa.webp", tag: "SELEÇÃO ESPECIAL",
    sizes: ["PP", "P", "M", "G", "GG"], occasion: "Festa", fabric: "Plissado", compareAt: 519.9,
    description: "Vestir uma ocasião especial pode ser simples. Uma proposta longa e elegante, para deixar o seu estilo em primeiro plano.",
  },
];
export const categories = ["Todos", "Vestidos", "Blusas", "Chemises", "Camisas", "Alfaiataria", "Acessórios"];
export type Collection = "featured" | "all" | "new" | "sale" | "casual" | "evening" | "pleats";
export const collectionLabels: Record<Collection, string> = {
  featured: "Em Destaque", all: "Nossa coleção", new: "Novidades", sale: "Seleção especial",
  casual: "Casual", evening: "Ocasiões especiais", pleats: "Plissados",
};
export function matchesCollection(product: Product, collection: Collection) {
  switch (collection) {
    case "featured": return Boolean(product.featured);
    case "new": return Boolean(product.isNew);
    case "sale": return Boolean(product.compareAt && product.compareAt > product.price);
    case "casual": return product.occasion === "Casual";
    case "evening": return product.occasion === "Festa";
    case "pleats": return product.fabric === "Plissado";
    default: return true;
  }
}
export const currency = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const photo = (id: string, width = 700) => id.startsWith("/") || id.startsWith("https://") ? id : `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

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

export function colorSwatch(color: string): string {
  const colors: Record<string, string> = {
    "Rosa": "#c183a4", "Off-white": "#f1eee4", "Verde-água": "#92d7bc",
    "Azul marinho": "#202b42", "Azul": "#9ac3d9", "Preto": "#292929",
    "Caramelo": "#ad8261", "Cognac": "#a76f47",
  };
  return colors[color] ?? "#e3d8c8";
}
