import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Informações e atendimento | Essen Fashion" };

const sections = [
  { id: "sobre", title: "Sobre esta loja", text: "A Essen Fashion é uma vitrine demonstrativa. Você pode explorar produtos, escolher tamanhos, montar uma sacola e percorrer o checkout. Produtos, imagens, descrições, valores e prazos são ilustrativos. Não há venda ou reserva de estoque." },
  { id: "entrega", title: "Entrega", text: "No checkout, você pode escolher entre entrega padrão e expressa. Fretes e prazos são exemplos para apresentar a experiência de compra. Nenhum produto será enviado. Use dados fictícios ao experimentar o formulário." },
  { id: "pagamento", title: "Formas de pagamento", text: "A tela de pagamento apresenta Pix, cartão de crédito e boleto. O cartão exibido é fictício, não são gerados códigos Pix ou boletos e nenhuma cobrança é realizada. Ao concluir, você verá apenas o resumo da simulação." },
  { id: "privacidade", title: "Seus dados nesta demonstração", text: "A sacola e os favoritos são salvos no armazenamento local deste navegador. Nome, contato e endereço permanecem na memória durante o checkout e não são enviados a um servidor de pedidos. O formulário de novidades também é demonstrativo e não envia seu e-mail. Para remover a sacola e os favoritos, limpe os dados deste site no navegador." },
  { id: "atendimento", title: "Atendimento", text: "Esta demonstração ainda não possui um canal de atendimento comercial. Nenhum telefone, e-mail ou perfil social de outra marca é utilizado para representar a Essen Fashion. Explore a coleção ou consulte as informações acima para conhecer o funcionamento da prévia." },
];

export default function HelpPage() {
  return <main id="conteudo" className="mx-auto w-full max-w-4xl px-6 py-14 tablet:py-20"><Link href="/" className="text-[11px] text-muted">Início / Informações</Link><p className="mt-10 text-[10px] tracking-[2px] text-muted">ESTAMOS POR AQUI</p><h1 className="mt-4 font-serif text-4xl tablet:text-5xl">Um pouco mais sobre a Essen.</h1><div className="mt-10 border-t border-line">{sections.map((section) => <section id={section.id} key={section.id} className="border-b border-line py-8"><h2 className="font-serif text-2xl">{section.title}</h2><p className="mt-4 max-w-2xl text-sm leading-8 text-muted">{section.text}</p></section>)}</div><Link href="/#colecao" className="mt-10 inline-flex bg-black px-8 py-4 text-xs text-white">Voltar à coleção →</Link></main>;
}
