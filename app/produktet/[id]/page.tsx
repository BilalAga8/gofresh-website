"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaHeart, FaRegHeart, FaShoppingCart, FaCheckCircle } from "react-icons/fa";
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
      payload: {
        id: product.id,
        name: product.name,
        price: finalPrice,
        quantity,
        image: product.image,
      },
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="h-80 bg-gray-100 animate-pulse" />
        <div className="p-5 space-y-4">
          <div className="h-7 bg-gray-100 rounded-lg animate-pulse w-3/4" />
          <div className="h-5 bg-gray-100 rounded-lg animate-pulse w-1/3" />
          <div className="h-20 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (!product) return null;

  const discountedPrice = product.discount > 0
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : null;

  const finalPrice = discountedPrice ?? product.price.toFixed(2);

  return (
    <div className="min-h-screen bg-white pb-28">

      {/* Image Section */}
      <div className="relative w-full bg-gray-50" style={{ minHeight: "320px" }}>
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-14 left-4 z-10 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md"
        >
          <FaArrowLeft className="text-gray-700 text-sm" />
        </button>

        {/* Favorite button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-14 right-4 z-10 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md"
        >
          {isFav
            ? <FaHeart className="text-red-500" />
            : <FaRegHeart className="text-gray-500" />
          }
        </button>

        {/* Discount badge */}
        {product.discount > 0 && (
          <span className="absolute top-14 left-1/2 -translate-x-1/2 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
            -{product.discount}%
          </span>
        )}

        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            width={800}
            height={400}
            className="w-full object-cover"
            style={{ maxHeight: "380px" }}
            priority
          />
        ) : (
          <div className="w-full flex items-center justify-center text-gray-300 text-6xl" style={{ height: "320px" }}>
            🥬
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-5 pt-5">

        {/* Category pill */}
        <Link
          href={`/produktet?category=${product.category}`}
          className="inline-block text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full mb-3 capitalize"
        >
          {product.category}
        </Link>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h1>

        {/* Price */}
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-3xl font-extrabold text-green-600">{finalPrice} €</span>
          {discountedPrice && (
            <span className="text-base text-gray-400 line-through">{product.price.toFixed(2)} €</span>
          )}
          {discountedPrice && (
            <span className="text-sm font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
              -{product.discount}% zbritje
            </span>
          )}
        </div>

        {/* Highlights */}
        <div className="bg-green-50 rounded-2xl p-4 mb-5 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <FaCheckCircle className="text-green-500 shrink-0" />
            <span>Produkt i freskët direkt nga ferma</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <FaCheckCircle className="text-green-500 shrink-0" />
            <span>Dërgesa brenda 24 orëve</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <FaCheckCircle className="text-green-500 shrink-0" />
            <span>Cilësi e garantuar</span>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mb-5">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Përshkrimi</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
          </div>
        )}

        {/* Quantity selector */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Sasia</h2>
          <div className="flex items-center gap-0 w-fit border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-12 h-12 bg-gray-50 hover:bg-gray-100 text-xl font-bold text-gray-700 transition flex items-center justify-center"
            >
              −
            </button>
            <span className="w-12 h-12 flex items-center justify-center text-xl font-bold text-gray-900 border-x border-gray-200">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-12 h-12 bg-gray-50 hover:bg-gray-100 text-xl font-bold text-gray-700 transition flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="text-left">
            <p className="text-xs text-gray-400">Totali</p>
            <p className="text-xl font-extrabold text-green-600">
              {(Number.parseFloat(finalPrice) * quantity).toFixed(2)} €
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition active:scale-95 ${
              added
                ? "bg-green-500 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            <FaShoppingCart className="text-lg" />
            {added ? "U shtua!" : `Shto në shportë`}
          </button>
        </div>
      </div>

    </div>
  );
}
