"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaCheckCircle, FaShoppingBag, FaLock } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function Checkout() {
  const { state, dispatch } = useCart();
  const { user, authLoading, isClientLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!isClientLoggedIn) router.replace("/login-client?redirect=/checkout");
  }, [authLoading, isClientLoggedIn, router]);

  const [emri, setEmri] = useState("");
  const [mbiemri, setMbiemri] = useState("");
  const [telefon, setTelefon] = useState("");
  const [adresa, setAdresa] = useState("");
  const [shenime, setShenime] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).single().then(({ data }) => {
      if (data) {
        setEmri(data.emri ?? "");
        setMbiemri(data.mbiemri ?? "");
        setTelefon(data.telefon ?? "");
      }
    });
  }, [user]);

  const handleOrder = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!emri || !mbiemri || !telefon || !adresa) {
      alert("Ju lutem plotësoni të gjitha fushat!");
      return;
    }
    if (state.items.length === 0) {
      alert("Shporta është bosh!");
      return;
    }

    setLoading(true);

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user?.id ?? null,
        total: total,
        status: "pending",
        emri,
        mbiemri,
        telefon,
        adresa,
        shenime,
      })
      .select()
      .single();

    if (error || !order) {
      alert("Ndodhi një gabim. Ju lutem provoni përsëri.");
      setLoading(false);
      return;
    }

    await supabase.from("order_items").insert(
      state.items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }))
    );

    // Dërgo email konfirmimi
    if (user?.email) {
      await fetch("/api/send-order-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toEmail: user.email,
          emri,
          mbiemri,
          telefon,
          orderId: order.id,
          items: state.items,
          total,
          adresa,
        }),
      });
    }

    dispatch({ type: "CLEAR_CART" });
    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <section className="pt-24 min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Porosia u dërgua!</h2>
          <p className="text-gray-500 text-sm mb-8">
            Faleminderit! Do ju kontaktojmë sa më shpejt për konfirmimin e porosisë.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition font-semibold"
          >
            Kthehu në Home
          </button>
        </div>
      </section>
    );
  }

  if (state.items.length === 0) {
    router.replace("/cart");
    return null;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <section className="pt-24 min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <FaLock className="text-green-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Duhet të hyni</h2>
          <p className="text-gray-500 text-sm mb-8">
            Për të vazhduar me porosinë, ju lutem hyni ose regjistrohuni.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href={`/login-client?redirect=/checkout`}
              className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition font-semibold"
            >
              Hyr në llogari
            </Link>
            <Link
              href="/register-client"
              className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition font-semibold"
            >
              Regjistrohu
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-24 min-h-screen bg-gray-50 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <FaShoppingBag className="text-green-600" /> Porosia
        </h2>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Forma */}
          <form onSubmit={handleOrder} className="flex-1 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Të dhënat e dorëzimit</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="emri" className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Emri</label>
                  <input id="emri" type="text" value={emri} onChange={(e) => setEmri(e.target.value)} className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
                </div>
                <div>
                  <label htmlFor="mbiemri" className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Mbiemri</label>
                  <input id="mbiemri" type="text" value={mbiemri} onChange={(e) => setMbiemri(e.target.value)} className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
                </div>
                <div>
                  <label htmlFor="telefon" className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Telefon</label>
                  <input id="telefon" type="text" value={telefon} onChange={(e) => setTelefon(e.target.value)} className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
                </div>
                <div>
                  <label htmlFor="adresa" className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Adresa</label>
                  <input id="adresa" type="text" value={adresa} onChange={(e) => setAdresa(e.target.value)} className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="shenime" className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Shënime (opsionale)</label>
                  <textarea id="shenime" value={shenime} onChange={(e) => setShenime(e.target.value)} rows={3} className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none" placeholder="P.sh. orar dërgese, udhëzime..." />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition active:scale-95 disabled:opacity-50 text-lg"
            >
              {loading ? "Duke dërguar..." : "Konfirmo Porosinë →"}
            </button>
          </form>

          {/* Permbledhja */}
          <div className="lg:w-72">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Përmbledhja</h3>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="truncate max-w-36">{item.name} x{item.quantity}</span>
                    <span className="font-medium text-gray-800">{(item.price * item.quantity).toFixed(2)} Lek</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold text-gray-800">
                  <span>Totali</span>
                  <span className="text-green-600">{total.toFixed(2)} Lek</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
