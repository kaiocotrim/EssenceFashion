import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/store/product-detail";
import { products } from "@/lib/catalog";

export function generateStaticParams() {
  return products.map((product) => ({ id: String(product.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((item) => String(item.id) === id);
  return { title: product ? `${product.name} | Essen Fashion` : "Produto não encontrado | Essen Fashion" };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((item) => String(item.id) === id);
  if (!product) notFound();
  return <ProductDetail key={product.id} product={product} />;
}
