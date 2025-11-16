import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ViewTransitionsWrapper } from "@/components/ViewTransitionsWrapper";
import { StoreProvider } from "@/store/StoreProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkyConnect Explorer - Explora Aeropuertos del Mundo",
  description:
    "Busca y explora aeropuertos de todo el mundo. Información detallada sobre códigos IATA/ICAO, ubicaciones, zonas horarias y más.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <ViewTransitionsWrapper>{children}</ViewTransitionsWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}
