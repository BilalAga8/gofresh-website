"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FaArrowLeft,
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaCheckCircle,
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  discount: number;
  unit: string;
  description?: string;
};

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { dispatch } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFav, setIsFav] = useState(false);
  const [added, setAdded] = useState(false);

  const id = typeof params.id === "string" ? params.id : params.id?.[0];

  useEffect(() => {
    if (!id) return;
    supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { router.replace("/produktet"); return; }
        setProduct(data);
        setLoading(false);
      });
  }, [id, router]);

  useEffect(() => {
    if (!user || !id) return;
    supabase
      .from("favorites")
      .select("product_id")
      .eq("user_id", user.id)
      .eq("product_id", id)
      .single()
      .then(({ data }) => setIsFav(!!data));
  }, [user, id]);

  const toggleFavorite = async () => {
    if (!user) { alert("Duhet të hyni për të ruajtur të preferuarat!"); return; }
    if (isFav) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("product_id", id);
      setIsFav(false);
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, product_id: id });
      setIsFav(true);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    const finalPrice = product.discount > 0
      ? Number.parseFloat((product.price * (1 - product.discount / 100)).toFixed(2))
      : product.price;

    dispatch({
      type: "ADD_ITEM",
      payload: { id: product.id, name: product.name, price: finalPrice, quantity, image: product.image },
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-24">
        <div className="max-w-5xl mx-auto md:px-6">
          <div className="md:grid md:grid-cols-2 md:gap-8">
            <div className="h-72 md:h-96 bg-gray-200 animate-pulse md:rounded-2xl" />
            <div className="p-5 space-y-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
              <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-10 bg-gray-200 rounded animate-pulse w-1/2" />
              <div className="h-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const discountedPrice = product.discount > 0
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : null;
  const finalPrice = discountedPrice ?? product.price.toFixed(2);
  const runningTotal = (Number.parseFloat(finalPrice) * quantity).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-24 pb-10">
      <div className="max-w-5xl mx-auto md:px-6 md:py-6">

        {/* Desktop: kthehu mbrapa */}
        <Link
          href="/produktet"
          className="hidden md:inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition mb-5"
        >
          <FaArrowLeft className="text-xs" /> Kthehu te produktet
        </Link>

        <div className="md:grid md:grid-cols-2 md:gap-8 md:bg-white md:rounded-2xl md:shadow-sm md:border md:border-gray-100 md:overflow-hidden">

          {/* ── Foto ── */}
          <div className="relative bg-white">
            {/* Mobile: back + fav butona mbi foto */}
            <div className="md:hidden absolute top-3 left-3 right-3 flex justify-between z-10">
              <button
                onClick={() => router.back()}
                className="w-9 h-9 bg-white/90 backdrop-blur rounded-full shadow flex items-center justify-center"
              >
                <FaArrowLeft className="text-gray-700 text-sm" />
              </button>
              <button
                onClick={toggleFavorite}
                className="w-9 h-9 bg-white/90 backdrop-blur rounded-full shadow flex items-center justify-center"
              >
                {isFav ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-500" />}
              </button>
            </div>

            {product.discount > 0 && (
              <span className="absolute top-3 left-1/2 -translate-x-1/2 z-10 md:left-3 md:translate-x-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                -{product.discount}%
              </span>
            )}

            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                width={700}
                height={500}
                className="w-full object-cover"
                style={{ height: "300px" }}
                priority
              />
            ) : (
              <div className="w-full flex items-center justify-center text-gray-200 text-7xl bg-gray-50" style={{ height: "300px" }}>
                🥬
              </div>
            )}

            {/* Desktop: fav buton mbi foto djathtas */}
            <button
              onClick={toggleFavorite}
              className="hidden md:flex absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow items-center justify-center hover:scale-110 transition"
            >
              {isFav ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-400" />}
            </button>
          </div>

          {/* ── Detajet ── */}
          <div className="px-5 pt-5 pb-4 md:p-8 md:flex md:flex-col md:justify-between">
            <div>
              {/* Kategoria */}
              <Link
                href={`/produktet?category=${product.category}`}
                className="inline-block text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full mb-3 capitalize hover:bg-green-100 transition"
              >
                {product.category}
              </Link>

              {/* Emri */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                {product.name}
              </h1>

              {/* Çmimi */}
              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-3xl font-extrabold text-green-600">{finalPrice} € / {product.unit ?? "copë"}</span>
                {discountedPrice && (
                  <>
                    <span className="text-base text-gray-400 line-through">{product.price.toFixed(2)} €</span>
                    <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                      -{product.discount}%
                    </span>
                  </>
                )}
              </div>

              {/* Highlights */}
              <div className="bg-green-50 rounded-xl p-4 mb-5 space-y-2">
                {[
                  "Produkt i freskët direkt nga ferma",
                  "Dërgesa brenda 24 orëve",
                  "Cilësi e garantuar",
                ].map((text) => (
                  <div key={text} className="flex items-center gap-2 text-sm text-gray-700">
                    <FaCheckCircle className="text-green-500 shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              {/* Përshkrimi */}
              {product.description && (
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{product.description}</p>
              )}

              {/* Sasia */}
              <div className="mb-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Sasia</p>
                <div className="flex items-center w-fit border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-11 h-11 bg-gray-50 hover:bg-gray-100 text-xl font-bold text-gray-600 transition"
                  >
                    −
                  </button>
                  <span className="w-11 h-11 flex items-center justify-center text-lg font-bold text-gray-900 border-x border-gray-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-11 h-11 bg-gray-50 hover:bg-gray-100 text-xl font-bold text-gray-600 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Butoni i shportës — për të dyja mobile dhe desktop */}
            <div className="mt-2 pb-6 md:pb-0">
              {added ? (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-4">
                  <FaCheckCircle className="text-green-500 text-xl shrink-0" />
                  <div>
                    <p className="font-semibold text-green-700 text-sm">U shtua në shportë!</p>
                    <Link href="/cart" className="text-green-600 text-xs font-bold hover:underline">
                      Shko te shporta →
                    </Link>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition active:scale-95 text-base"
                >
                  <FaShoppingCart />
                  Shto në shportë — {runningTotal} €
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
