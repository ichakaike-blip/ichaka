import type { Metadata } from "next";
import { Cormorant_Garamond, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { siteUrl } from "@/lib/site";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant-garamond",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ichaka | Portfolio & Blog",
  description: "Ikueze Excel Ikenna (ichaka) portfolio and blog",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "ichaka | Portfolio & Blog",
    description: "Ikueze Excel Ikenna (ichaka) portfolio and blog",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ichaka | Portfolio & Blog",
    description: "Ikueze Excel Ikenna (ichaka) portfolio and blog",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${cormorantGaramond.variable} ${inter.variable} ${ibmPlexMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Navbar />
          <main className="border-t border-black/10 px-4 py-8 dark:border-white/10 md:px-6 md:py-10">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
