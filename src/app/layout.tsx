import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RevealObserver from "@/components/RevealObserver";
import { site } from "@/data/site";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin", "latin-ext"], variable: "--font-manrope", display: "swap" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "VVX Construction – Ndërtim dhe zhvillim banesor",
    template: "%s | VVX Construction",
  },
  description:
    "VVX Construction ndërton dhe shet apartamente në Gjakovë. Zbuloni projektet, planimetritë interaktive dhe apartamentet e lira.",
  openGraph: {
    type: "website",
    locale: "sq_AL",
    siteName: "VVX Construction",
    images: [{ url: "/images/ext-lumi.webp", width: 1800, height: 1486 }],
  },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#04413C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq" className={`${manrope.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <head>
        <Script id="js-flag" strategy="beforeInteractive">
          {"document.documentElement.classList.add('js')"}
        </Script>
      </head>
      <body>
        <a
          href="#main"
          className="sr-only z-[60] bg-white px-4 py-2 text-sm text-brand focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Kalo te përmbajtja
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <RevealObserver />
      </body>
    </html>
  );
}
