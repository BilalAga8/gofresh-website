import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ToastMessage from "./components/ToastMessage";

export const metadata: Metadata = {
  title: "Go Fresh - Farm Website",
  description: "Produkte të freskëta dhe natyrale, direkt nga ferma tek ju.",
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
      </body>
    </html>
  );
}
