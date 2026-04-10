"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
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
};

function ProductList({ title, category }: { readonly title: string; readonly category?: string }) {
  const { dispatch } = useCart();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchProducts() {
      let query = supabase.from("products").select("*");
      if (category) query = query.eq("category", category);
      const { data } = await query;
      if (data) {
        setProducts(data);
        const initial: Record<string, number> = {};
        data.forEach((p: Product) => { initial[p.id] = 1; });
        setQuantities(initial);
      }
      setLoading(false);
    }
    fetchProducts();
  }, [category]);

  useEffect(() => {
    if (!user) { setFavorites(new Set()); return; }
    supabase
      .from("favorites")
      .select("product_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) setFavorites(new Set(data.map((f) => f.product_id)));
      });
  }, [user]);

  const toggleFavorite = async (productId: string) => {
    if (!user) {
      alert("Duhet të hyni për të ruajtur të preferuarat!");
      return;
    }
    if (favorites.has(productId)) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("product_id", productId);
      setFavorites((prev) => { const s = new Set(prev); s.delete(productId); return s; });
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, product_id: productId });
      setFavorites((prev) => new Set(prev).add(productId));
    }
  };

  const changeQuantity = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] ?? 1) + delta),
    }));
  };

  if (loading) {
    return (
      <section className="pt-24 text-center">
        <p className="text-gray-500">Duke ngarkuar produktet...</p>
      </section>
    );
  }

  return (
    <section className="pt-24 text-center">
      <h2 className="text-2xl font-semibold text-green-700 mb-8">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
        {products.length > 0 ? (
          products.map((item) => {
            const discountedPrice = item.discount > 0
              ? (item.price * (1 - item.discount / 100)).toFixed(2)
              : null;
            const qty = quantities[item.id] ?? 1;
            const isFav = favorites.has(item.id);

            return (
              <div key={item.id} className="relative bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition flex flex-col">

                {/* Badge zbritje */}
                {item.discount > 0 && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                    -{item.discount}%
                  </span>
                )}

                {/* Butoni favorit */}
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className="absolute top-3 right-3 z-10 text-xl transition"
                >
                  {isFav
                    ? <FaHeart className="text-red-500" />
                    : <FaRegHeart className="text-gray-400 hover:text-red-400" />
                  }
                </button>

                {/* Foto */}
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={400}
                    height={160}
                    className="rounded-md mb-3 w-full h-40 object-cover"
                  />
                ) : (
                  <div className="rounded-md mb-3 w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                    Pa foto
                  </div>
                )}

                {/* Emri + cmimi */}
                <h3 className="text-lg font-semibold text-green-700">{item.name}</h3>
                {discountedPrice ? (
                  <div className="mt-1 mb-3">
                    <span className="text-gray-400 line-through text-sm mr-2">{item.price} €</span>
                    <span className="text-lg font-bold text-red-600">{discountedPrice} €</span>
                  </div>
                ) : (
                  <p className="mt-1 mb-3 text-lg font-bold text-green-700">{item.price} €</p>
                )}

                {/* Sasia +/- */}
                <div className="flex items-center justify-center gap-3 mb-3">
                  <button
                    onClick={() => changeQuantity(item.id, -1)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-lg font-bold transition"
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold w-6 text-center">{qty}</span>
                  <button
                    onClick={() => changeQuantity(item.id, 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-lg font-bold transition"
                  >
                    +
                  </button>
                </div>

                {/* Butoni shporte */}
                <button
                  onClick={() =>
                    dispatch({
                      type: "ADD_ITEM",
                      payload: {
                        id: item.id,
                        name: item.name,
                        price: discountedPrice ? Number.parseFloat(discountedPrice) : item.price,
                        quantity: qty,
                        image: item.image,
                      },
                    })
                  }
                  className="mt-auto w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 active:scale-95 transform transition text-sm font-semibold"
                >
                  Shto në shportë
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-gray-600">Nuk ka produkte në këtë kategori.</p>
        )}
      </div>
    </section>
  );
}

export default ProductList;
