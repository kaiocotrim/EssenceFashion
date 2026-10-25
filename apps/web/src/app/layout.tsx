import type { Metadata } from "next";
import { StoreProvider } from "@/components/store/store-provider";
import StoreHeader from "@/components/store/store-header";
import StoreFooter from "@/components/store/store-footer";
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
          <StoreHeader />
          {children}
          <StoreFooter />
        </StoreProvider>
      </body>
    </html>
  );
}
