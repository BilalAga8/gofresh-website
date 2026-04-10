"use client";

import Link from "next/link";
import Hero from "./components/Hero";
import ProductList from "./components/ProductList";

const categories = [
  { id: "fruta", label: "🍎 Frutat", bg: "/foto/molle.jpg" },
  { id: "perime", label: "🥕 Perimet", bg: "/foto/domate.jpg" },
  { id: "shporta", label: "🛒 Shporta (Ofertat)", bg: "/foto/shporta.jpg" },
  {
    id: "fruta-thata",
    label: "🥜 Produkte të Ambalazhuara",
    bg: "/foto/frutatethata.jpg",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <section id="categories" className="pt-24 text-center">
        <h2 className="text-2xl font-semibold text-green-700 mb-8">
          Zgjidh Kategorinë
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/produktet?category=${cat.id}`}
              className="relative py-12 rounded-lg shadow transition font-bold text-white overflow-hidden"
              style={{
                backgroundImage: `url(${cat.bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Overlay për kontrast */}
              <div className="absolute inset-0 bg-black/40"></div>
              {/* Teksti sipër overlay */}
              <span className="relative z-10 drop-shadow-lg">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>
      <ProductList title="Produktet Kryesore" />
    </>
  );
}
