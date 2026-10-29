import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { profile } from "@/content/site";
import "./globals.css";

// Headlines, numbers and labels: a heavy grotesque whose width axis (wdth) drives the widening titles.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["wdth", "opsz"],
  variable: "--font-display",
  display: "swap",
});

// Body text: a clean sans that stays easy to read at small sizes.
const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lopeselio.online"),
  title: `${profile.name}: games, blockchains and the software in between`,
  description: profile.intro,
  openGraph: {
    title: profile.name,
    description: profile.intro,
    url: "https://lopeselio.online",
    images: ["/media/cryptara-cover.jpg"],
    type: "profile",
  },
  twitter: { card: "summary_large_image", creator: "@ElioCodes" },
};

export const viewport: Viewport = { themeColor: "#0C0E13" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
