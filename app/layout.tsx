import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "iClickHomes.com | Sherry Perry, CLICKpoint Realty",
  description:
    "Real estate in the Bryan/College Station area with Sherry Perry — CLICKpoint Realty, LLC. Traditional listings, REO, investment, and commercial properties.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
