import type { Metadata } from "next";
import { Suspense } from "react";
import ProduktetClient from "./ProduktetClient";

export const metadata: Metadata = {
  title: "Produktet",
  description: "Shfleto gamën tonë të plotë — fruta, perime, mjaltë, produkte bio dhe shporta ofertash. Cilësi e garantuar, çmime të arsyeshme.",
  keywords: ["fruta", "perime", "mjaltë", "bio", "shporta", "oferta", "produkte natyrale"],
  openGraph: {
    title: "Produktet | Agro Fresh",
    description: "Fruta, perime, mjaltë dhe produkte bio direkt nga ferma. Shiko ofertat tona.",
    images: [{ url: "/foto/molle.jpg", alt: "Produktet Agro Fresh" }],
  },
  alternates: { canonical: "https://gofresh-website.vercel.app/produktet" },
};

export default function ProduktetPage() {
  return (
    <Suspense fallback={<div className="pt-24 text-center">Duke ngarkuar...</div>}>
      <ProduktetClient />
    </Suspense>
  );
}
