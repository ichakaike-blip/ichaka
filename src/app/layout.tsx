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
  title: {
    default: "Ikueze Excel Ikenna (ichaka) | Product Manager & Developer",
    template: "%s | Ikueze Excel Ikenna (ichaka)",
  },
  description: "Ikueze Excel Ikenna, also known as Ichaka. Product-minded execution from idea to final ship. Specialist in Product Management, Web Development, and AI Technology.",
  keywords: [
    "Ikueze Excel Ikenna",
    "ichaka",
    "EXCEL",
    "Ikueze",
    "Product Manager",
    "Software Developer",
    "Web Developer",
    "AI Technology",
    "Portfolio",
  ],
  authors: [{ name: "Ikueze Excel Ikenna" }],
  creator: "Ikueze Excel Ikenna",
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
    title: "Ikueze Excel Ikenna (ichaka) | Product Manager & Developer",
    description: "Ikueze Excel Ikenna, also known as Ichaka. Product-minded execution from idea to final ship.",
    siteName: "Ikueze Excel Ikenna (ichaka)",
    images: ["/logo.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ikueze Excel Ikenna (ichaka) | Product Manager & Developer",
    description: "Ikueze Excel Ikenna, also known as Ichaka. Product-minded execution from idea to final ship.",
    images: ["/logo.jpg"],
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
