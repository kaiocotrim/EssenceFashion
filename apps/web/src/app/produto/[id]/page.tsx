import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/store/product-detail";
import { readManagement } from "@/lib/server/management-db";

async function CurrentProduct({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const data = await readManagement();
  const product = data.products.find((item) => String(item.id) === id && item.active !== false);
  if (!product) notFound();
  return <ProductDetail key={product.id} product={product} />;
}

export default function ProductPage(props: { params: Promise<{ id: string }> }) {
  return <Suspense fallback={<main className="p-16 text-center">Carregando peça…</main>}><CurrentProduct {...props} /></Suspense>;
}
