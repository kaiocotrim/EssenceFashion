"use client";

import { usePathname } from "next/navigation";
import StoreHeader from "./store-header";
import StoreFooter from "./store-footer";

export default function StoreChrome({ placement }: { placement: "header" | "footer" }) {
  const path = usePathname();
  if (path === "/admin" || path.startsWith("/admin/")) return null;
  return placement === "header" ? <StoreHeader /> : <StoreFooter />;
}
