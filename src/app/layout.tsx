import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://trufitz.com"),
  title: {
    default: "TRUFITZ — Luxury Men's Streetwear",
    template: "%s · TRUFITZ",
  },
  description:
    "TRUFITZ crafts elevated men's streetwear — heavyweight cotton essentials, sharp tailoring, and limited drops. Considered design, premium fabrics, effortless every day.",
  keywords: [
    "men's streetwear",
    "luxury streetwear",
    "premium menswear",
    "oversized t-shirts",
    "designer shirts",
    "TRUFITZ",
  ],
  openGraph: {
    title: "TRUFITZ — Luxury Men's Streetwear",
    description:
      "Elevated men's streetwear. Heavyweight essentials, sharp tailoring, and limited drops.",
    type: "website",
    siteName: "TRUFITZ",
  },
  twitter: {
    card: "summary_large_image",
    title: "TRUFITZ — Luxury Men's Streetwear",
    description: "Elevated men's streetwear. Considered design, premium fabrics.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Header />
          <main id="main" className="pt-[72px]">
            {children}
          </main>
          <Footer />
        </Providers>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
