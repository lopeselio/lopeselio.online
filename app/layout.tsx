import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { profile } from "@/content/site";
import "./globals.css";

// One family; its width axis (wdth) is the main typographic device on the page.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
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
    <html lang="en" className={archivo.variable}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
