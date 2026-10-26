import { connection } from "next/server";
import { readManagement } from "@/lib/server/management-db";

export async function GET() {
  await connection();
  const data = await readManagement();
  return Response.json({ products: data.products.filter((product) => product.active !== false), shipping: data.shipping }, { headers: { "Cache-Control": "no-store" } });
}
