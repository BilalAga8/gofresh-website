"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { FaHeart, FaRegHeart, FaSearch, FaTimes } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  discount: number;
  unit: string;
};

const CATEGORIES = [
  { id: "", label: "Të gjitha" },
  { id: "fruta", label: "🍎 Fruta" },
  { id: "perime", label: "🥕 Perime" },
  { id: "shporta", label: "🛒 Shporta" },
  { id: "fruta-thata", label: "🥜 Të ambalazhuara" },
];

const SORT_OPTIONS = [
  { id: "default", label: "Renditja" },
  { id: "price-asc", label: "Çmimi ↑" },
  { id: "price-desc", label: "Çmimi ↓" },
  { id: "discount", label: "Me zbritje" },
];

function ProductList({ title, category: initialCategory, onlyDiscounted = false }: { readonly title: string; readonly category?: string; readonly onlyDiscounted?: boolean }) {
  const { dispatch } = useCart();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory ?? "");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    setActiveCategory(initialCategory ?? "");
  }, [initialCategory]);

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase.from("products").select("*");
      if (data) {
        setProducts(data);
        const initial: Record<string, number> = {};
        data.forEach((p: Product) => { initial[p.id] = 1; });
        setQuantities(initial);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!user) { setFavorites(new Set()); return; }
    supabase.from("favorites").select("product_id").eq("user_id", user.id).then(({ data }) => {
      if (data) setFavorites(new Set(data.map((f) => f.product_id)));
    });
  }, [user]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (onlyDiscounted) list = list.filter((p) => p.discount > 0);
    if (activeCategory) list = list.filter((p) => p.category === activeCategory);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }

    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "discount") list.sort((a, b) => b.discount - a.discount);

    return list;
  }, [products, activeCategory, search, sort, onlyDiscounted]);

  const toggleFavorite = async (productId: string) => {
    if (!user) { alert("Duhet të hyni për të ruajtur të preferuarat!"); return; }
    if (favorites.has(productId)) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("product_id", productId);
      setFavorites((prev) => { const s = new Set(prev); s.delete(productId); return s; });
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, product_id: productId });
      setFavorites((prev) => new Set(prev).add(productId));
    }
  };

  const changeQuantity = (id: string, delta: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(0.5, Math.round(((prev[id] ?? 1) + delta) * 10) / 10) }));
  };

  const setQuantity = (id: string, value: string) => {
    const n = Number.parseFloat(value);
    if (!Number.isNaN(n) && n >= 0.1) setQuantities((prev) => ({ ...prev, [id]: n }));
    else if (value === "") setQuantities((prev) => ({ ...prev, [id]: 0.5 }));
  };

  if (loading) {
    return (
      <section className="pt-24 text-center">
        <div className="flex justify-center gap-3 flex-wrap px-6 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 w-48 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="pt-10 px-6 pb-12">
      <h2 className="text-2xl font-semibold text-green-700 mb-6 text-center">{title}</h2>

      {/* Shiriti i kërkimit + renditja */}
      <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kërko produkt..."
            className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 bg-white"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <FaTimes className="text-sm" />
            </button>
          )}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-400 bg-white"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Filtrat e kategorisë */}
      <div className="flex gap-2 flex-wrap justify-center mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition ${
              activeCategory === cat.id
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid produkteve */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((item) => {
            const discountedPrice = item.discount > 0
              ? (item.price * (1 - item.discount / 100)).toFixed(2)
              : null;
            const qty = quantities[item.id] ?? 1;
            const isFav = favorites.has(item.id);

            return (
              <div key={item.id} className="relative bg-white shadow-md rounded-xl p-4 hover:shadow-xl transition flex flex-col">
                {item.discount > 0 && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                    -{item.discount}%
                  </span>
                )}
                <button onClick={() => toggleFavorite(item.id)} className="absolute top-3 right-3 z-10 text-xl transition">
                  {isFav ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-400 hover:text-red-400" />}
                </button>

                <Link href={`/produktet/${item.id}`} className="block">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} width={400} height={160} className="rounded-lg mb-3 w-full h-40 object-cover" />
                  ) : (
                    <div className="rounded-lg mb-3 w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">Pa foto</div>
                  )}
                  <h3 className="text-base font-semibold text-green-700 hover:text-green-500 transition">{item.name}</h3>
                </Link>
                {discountedPrice ? (
                  <div className="mt-1 mb-3">
                    <span className="text-gray-400 line-through text-sm mr-2">{item.price} €</span>
                    <span className="text-lg font-bold text-red-600">{discountedPrice} € / {item.unit ?? "copë"}</span>
                  </div>
                ) : (
                  <p className="mt-1 mb-3 text-lg font-bold text-green-700">{item.price} € / {item.unit ?? "copë"}</p>
                )}

                <div className="flex items-center justify-center gap-3 mb-3">
                  <button onClick={() => changeQuantity(item.id, -1)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-lg font-bold transition">−</button>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={qty}
                    onChange={(e) => setQuantity(item.id, e.target.value)}
                    className="w-14 text-center text-lg font-semibold border border-gray-200 rounded-lg py-0.5 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  <button onClick={() => changeQuantity(item.id, 1)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-lg font-bold transition">+</button>
                </div>

                <button
                  onClick={() => dispatch({
                    type: "ADD_ITEM",
                    payload: {
                      id: item.id,
                      name: item.name,
                      price: discountedPrice ? Number.parseFloat(discountedPrice) : item.price,
                      quantity: qty,
                      image: item.image,
                    },
                  })}
                  className="mt-auto w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 active:scale-95 transform transition text-sm font-semibold"
                >
                  Shto në shportë
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">Nuk u gjet asnjë produkt.</p>
          {(search || activeCategory) && (
            <button
              onClick={() => { setSearch(""); setActiveCategory(""); }}
              className="mt-4 text-green-600 text-sm hover:underline"
            >
              Pastro filtrat
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export default ProductList;
