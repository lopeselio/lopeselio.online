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

// Short, plain summary for search results and link previews (kept under ~160 characters).
const description =
  "Software engineer and former venture-backed founder. I build full-stack web and mobile apps, on-chain games, and blockchain consumer and DeFi apps.";

export const metadata: Metadata = {
  metadataBase: new URL("https://lopeselio.online"),
  title: `${profile.name}: Software Engineer, Games and Blockchain`,
  description,
  applicationName: "lopeselio.online",
  authors: [{ name: profile.name, url: "https://lopeselio.online" }],
  creator: profile.name,
  keywords: [
    profile.name,
    "Elio Lopes",
    "software engineer",
    "full-stack developer",
    "mobile app developer",
    "blockchain developer",
    "Solana",
    "game developer",
    "Unity",
    "DeFi",
    "Web3",
    "Dubai",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  // Google Search Console ownership check for https://lopeselio.online/
  verification: { google: "mXwiDy9rhXUvytl28UbBj-Bgo4kOkyq4mamLETyVHyM" },
  openGraph: {
    title: `${profile.name}: ${profile.tagline}`,
    description,
    url: "https://lopeselio.online",
    siteName: "lopeselio.online",
    locale: "en_US",
    // made from docs/og-cover.html
    images: [{ url: "/media/og-cover.jpg", width: 1200, height: 630, alt: `${profile.name}: ${profile.tagline}` }],
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@ElioCodes",
    title: `${profile.name}: ${profile.tagline}`,
    description,
    images: ["/media/og-cover.jpg"],
  },
};

// Tells search engines who the site is about.
const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: "https://lopeselio.online",
  image: "https://lopeselio.online/media/elio-portrait.jpg",
  jobTitle: "Software Engineer",
  description,
  address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Vellore Institute of Technology" },
  knowsAbout: ["Full-stack web development", "Mobile apps", "Blockchain", "Solana", "Game development", "Unity", "DeFi"],
  sameAs: [profile.github, ...profile.socials.map((s) => s.href)],
};

export const viewport: Viewport = { themeColor: "#0C0E13" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
