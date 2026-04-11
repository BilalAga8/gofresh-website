import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ToastMessage from "./components/ToastMessage";

const BASE_URL = "https://gofresh-website.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Agro Fresh - Produkte të Freskëta nga Ferma",
    template: "%s | Agro Fresh",
  },
  description: "Produkte 100% natyrale dhe bio, direkt nga ferma tek dera juaj. Fruta, perime, mjaltë dhe më shumë — me çmimet më të mira në Tiranë.",
  keywords: ["produkte natyrale", "fruta", "perime", "bio", "fermë", "Tiranë", "Shqipëri", "mjaltë", "produkte bio", "agro fresh"],
  authors: [{ name: "Agro Fresh" }],
  creator: "Agro Fresh",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "sq_AL",
    url: BASE_URL,
    siteName: "Agro Fresh",
    title: "Agro Fresh - Produkte të Freskëta nga Ferma",
    description: "Produkte 100% natyrale dhe bio, direkt nga ferma tek dera juaj. Fruta, perime, mjaltë dhe më shumë.",
    images: [
      {
        url: "/foto/sera1.jpg",
        width: 1200,
        height: 630,
        alt: "Agro Fresh - Fermë natyrale",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Agro Fresh - Produkte të Freskëta nga Ferma",
    description: "Produkte 100% natyrale dhe bio, direkt nga ferma tek dera juaj.",
    images: ["/foto/sera1.jpg"],
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: "daca0a7422789657",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sq">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <ToastMessage />
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
