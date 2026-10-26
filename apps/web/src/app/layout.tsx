import type { Metadata } from "next";
import { Suspense } from "react";
import { StoreProvider } from "@/components/store/store-provider";
import StoreChrome from "@/components/store/store-chrome";
import "./globals.css";

export const metadata: Metadata = {
  title: "Essen Fashion | Novas possibilidades de vestir.",
  description: "Descubra a Essen Fashion: inspirações, novidades e peças essenciais para expressar seu estilo em cada momento do dia.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <StoreProvider>
          <Suspense fallback={<div className="h-[88px] max-tablet:h-[72px]" aria-hidden="true" />}><StoreChrome placement="header" /></Suspense>
          {children}
          <Suspense fallback={null}><StoreChrome placement="footer" /></Suspense>
        </StoreProvider>
      </body>
    </html>
  );
}
