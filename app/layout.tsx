import type { Metadata } from "next";
import { Sora, Manrope, JetBrains_Mono } from "next/font/google";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], weight: ["400", "600", "700", "800"], variable: "--font-sora", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-manrope", display: "swap" });
const jbmono = JetBrains_Mono({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-jbmono", display: "swap" });

export const metadata: Metadata = {
  title: "iClickHomes.com | The Smartest Point in Real Estate — Sherry Perry, CLICKpoint Realty",
  description:
    "Live Texas MLS home search for Bryan/College Station, Houston, and Central & East Texas — plus exclusive REO / bank-owned inventory. Sherry Perry, Broker/Owner, CLICKpoint Realty, LLC.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable} ${jbmono.variable}`}>
      <body>
        <NavBar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
