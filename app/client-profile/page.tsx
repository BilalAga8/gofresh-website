"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaUser, FaBoxOpen, FaHistory, FaEdit, FaSignOutAlt, FaSave, FaTimes, FaChevronDown, FaChevronUp, FaHeart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

type ClientData = {
  emri: string;
  mbiemri: string;
  email: string;
  telefon: string;
  nipt: string;
};

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type FavoriteProduct = {
  product_id: string;
  products: {
    id: string;
    name: string;
    price: number;
    image: string;
    unit: string;
    discount: number;
  };
};

type Order = {
  id: string;
  created_at: string;
  total: number;
  status: string;
  adresa: string;
  order_items: OrderItem[];
};

const statusLabel: Record<string, { label: string; color: string }> = {
  pending:   { label: "Duke u procesuar", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Konfirmuar",        color: "bg-blue-100 text-blue-700" },
  delivered: { label: "Dorëzuar",          color: "bg-green-100 text-green-700" },
  cancelled: { label: "Anuluar",           color: "bg-red-100 text-red-700" },
};

export default function ClientProfile() {
  const { user, logout, isClientLoggedIn, authLoading } = useAuth();
  const router = useRouter();
  const [clientData, setClientData] = useState<ClientData>({ emri: "", mbiemri: "", email: "", telefon: "", nipt: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isClientLoggedIn) { router.replace("/login-client"); return; }

    async function fetchData() {
      if (!user) return;

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (profile) {
        setClientData({ emri: profile.emri ?? "", mbiemri: profile.mbiemri ?? "", email: user.email ?? "", telefon: profile.telefon ?? "", nipt: profile.nipt ?? "" });
      }

      const { data: ordersData } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersData) setOrders(ordersData);

      const { data: favsData } = await supabase
        .from("favorites")
        .select("product_id, products(id, name, price, image, unit, discount)")
        .eq("user_id", user.id);

      if (favsData) setFavorites(favsData as FavoriteProduct[]);
      setLoading(false);
    }

    fetchData();
  }, [user, isClientLoggedIn, authLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientData({ ...clientData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user) return;
    await supabase.from("profiles").update({ emri: clientData.emri, mbiemri: clientData.mbiemri, telefon: clientData.telefon, nipt: clientData.nipt }).eq("id", user.id);
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = async () => { await logout(); router.replace("/"); };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Duke ngarkuar profilin...</p>
        </div>
      </div>
    );
  }

  const initials = `${clientData.emri?.[0] ?? ""}${clientData.mbiemri?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-5xl mx-auto px-4">

        {/* Banner + Avatar */}
        <div className="relative bg-gradient-to-r from-green-600 to-green-400 rounded-2xl h-36 mb-16 shadow-md">
          <div className="absolute -bottom-12 left-6 w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-2xl font-bold text-green-600">
            {initials || <FaUser className="text-3xl text-green-400" />}
          </div>
          <div className="absolute -bottom-10 left-36">
            <h1 className="text-xl font-bold text-gray-800">{clientData.emri} {clientData.mbiemri}</h1>
            <p className="text-gray-500 text-sm">{clientData.email}</p>
          </div>
          <div className="absolute top-4 right-4">
            <button onClick={handleLogout} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm transition">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {saved && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-sm text-center">
            Të dhënat u ruajtën me sukses!
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Te dhenat personale */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <FaUser className="text-green-600" />
                <h2 className="text-lg font-semibold text-gray-800">Të dhënat personale</h2>
              </div>
              {isEditing ? (
                <div className="flex gap-2">
                  <button onClick={handleSave} className="flex items-center gap-1 text-sm bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition"><FaSave /> Ruaj</button>
                  <button onClick={() => setIsEditing(false)} className="flex items-center gap-1 text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300 transition"><FaTimes /> Anulo</button>
                </div>
              ) : (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition"><FaEdit /> Edito</button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Emri", name: "emri", value: clientData.emri },
                { label: "Mbiemri", name: "mbiemri", value: clientData.mbiemri },
                { label: "Telefon", name: "telefon", value: clientData.telefon },
                { label: "NIPT", name: "nipt", value: clientData.nipt },
              ].map((field) => (
                <div key={field.name}>
                  <label htmlFor={field.name} className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{field.label}</label>
                  {isEditing ? (
                    <input id={field.name} type="text" name={field.name} value={field.value} onChange={handleChange} className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400" />
                  ) : (
                    <p className="mt-1 text-gray-700 font-medium">{field.value || "—"}</p>
                  )}
                </div>
              ))}
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Email</p>
                <p className="mt-1 text-gray-700 font-medium">{clientData.email}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-3">
                <FaHeart className="text-red-500" />
                <h2 className="text-lg font-semibold text-gray-800">Të preferuarat</h2>
              </div>
              {favorites.length === 0 ? (
                <p className="text-sm text-gray-400">Nuk keni produkte të preferuara ende.</p>
              ) : (
                <div className="space-y-3">
                  {favorites.map((fav) => {
                    const p = fav.products;
                    const finalPrice = p.discount > 0
                      ? (p.price * (1 - p.discount / 100)).toFixed(2)
                      : p.price.toFixed(2);
                    return (
                      <Link key={fav.product_id} href={`/produktet/${p.id}`} className="flex items-center gap-3 hover:bg-gray-50 rounded-xl p-2 transition">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          {p.image ? (
                            <Image src={p.image} alt={p.name} fill className="object-cover" />
                          ) : (
                            <span className="flex items-center justify-center h-full text-xl">🥬</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                          <p className="text-xs text-green-600 font-bold">{finalPrice} Lek / {p.unit ?? "copë"}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-400 rounded-2xl p-6 text-white">
              <p className="text-sm font-semibold opacity-80 mb-1">Porosi totale</p>
              <p className="text-4xl font-bold">{orders.length}</p>
              <p className="text-sm opacity-70 mt-1">{orders.length === 0 ? "Asnjë porosi ende" : "Porosi të bëra"}</p>
            </div>
          </div>

          {/* Historiku i porosive */}
          <div className="md:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <FaHistory className="text-green-600" />
              <h2 className="text-lg font-semibold text-gray-800">Historiku i porosive</h2>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-10">
                <FaBoxOpen className="text-gray-200 text-6xl mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Nuk keni bërë asnjë porosi ende.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => {
                  const s = statusLabel[order.status] ?? { label: order.status, color: "bg-gray-100 text-gray-600" };
                  const isOpen = expandedOrder === order.id;
                  return (
                    <div key={order.id} className="border border-gray-100 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedOrder(isOpen ? null : order.id)}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              Porosi #{order.id.slice(0, 8).toUpperCase()}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(order.created_at).toLocaleDateString("sq-AL", { day: "2-digit", month: "long", year: "numeric" })}
                            </p>
                          </div>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${s.color}`}>{s.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-green-600">{Number(order.total).toFixed(2)} Lek</span>
                          {isOpen ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 border-t border-gray-100 pt-3 bg-gray-50">
                          <p className="text-xs text-gray-500 mb-3">📍 {order.adresa}</p>
                          <div className="space-y-2">
                            {order.order_items.map((item) => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-gray-700">{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                                <span className="font-medium text-gray-800">{(item.price * item.quantity).toFixed(2)} Lek</span>
                              </div>
                            ))}
                          </div>
                          <div className="border-t mt-3 pt-2 flex justify-between font-bold text-sm">
                            <span>Totali</span>
                            <span className="text-green-600">{Number(order.total).toFixed(2)} Lek</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
