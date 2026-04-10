"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaBox, FaClipboardList, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  discount: number;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  created_at: string;
  total: number;
  status: string;
  emri: string;
  mbiemri: string;
  telefon: string;
  adresa: string;
  shenime: string;
  order_items: OrderItem[];
}

const statusOptions = [
  { value: "pending",   label: "Duke u procesuar", color: "bg-yellow-100 text-yellow-700" },
  { value: "confirmed", label: "Konfirmuar",        color: "bg-blue-100 text-blue-700" },
  { value: "delivered", label: "Dorëzuar",          color: "bg-green-100 text-green-700" },
  { value: "cancelled", label: "Anuluar",           color: "bg-red-100 text-red-700" },
];

type Tab = "produktet" | "porosite";

export default function AdminPanel() {
  const router = useRouter();
  const { isAdmin, setIsAdmin } = useAuth();
  const [tab, setTab] = useState<Tab>("porosite");

  // Produktet
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [discount, setDiscount] = useState("0");
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Porosite
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
      fetchOrders();
    } else {
      router.replace("/login-admin");
    }
  }, [isAdmin, router]);

  async function fetchProducts() {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (data) setProducts(data);
  }

  async function fetchOrders() {
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });
    if (data) setOrders(data);
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!name || !price || !category) { alert("Ju lutem plotësoni të gjitha fushat!"); return; }
    const productData = { name, price: Number.parseFloat(price), category, image, discount: Number.parseInt(discount) || 0 };
    if (editingId !== null) {
      await supabase.from("products").update(productData).eq("id", editingId);
      setEditingId(null);
    } else {
      await supabase.from("products").insert(productData);
    }
    setName(""); setPrice(""); setCategory(""); setImage(""); setDiscount("0");
    fetchProducts();
  };

  const handleEdit = (p: Product) => { setName(p.name); setPrice(p.price.toString()); setCategory(p.category); setImage(p.image ?? ""); setDiscount(p.discount?.toString() ?? "0"); setEditingId(p.id); };
  const handleDelete = async (id: string) => { if (globalThis.confirm("Jeni të sigurt?")) { await supabase.from("products").delete().eq("id", id); fetchProducts(); } };
  const handleCancel = () => { setName(""); setPrice(""); setCategory(""); setImage(""); setDiscount("0"); setEditingId(null); };
  const handleLogout = () => { setIsAdmin(false); router.replace("/"); };

  if (!isAdmin) return null;

  const filteredOrders = filterStatus === "all" ? orders : orders.filter((o) => o.status === filterStatus);
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <section className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 pb-12">

        {/* Header */}
        <div className="flex justify-between items-center py-6">
          <h1 className="text-2xl font-bold text-gray-800">Paneli i Adminit</h1>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm transition">
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("porosite")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition ${tab === "porosite" ? "bg-green-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
          >
            <FaClipboardList />
            Porositë
            {pendingCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{pendingCount}</span>
            )}
          </button>
          <button
            onClick={() => setTab("produktet")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition ${tab === "produktet" ? "bg-green-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
          >
            <FaBox /> Produktet
          </button>
        </div>

        {/* TAB POROSITE */}
        {tab === "porosite" && (
          <div>
            {/* Filter */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {[{ value: "all", label: "Të gjitha" }, ...statusOptions].map((s) => (
                <button
                  key={s.value}
                  onClick={() => setFilterStatus(s.value)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition border ${filterStatus === s.value ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
                >
                  {s.label}
                  {s.value !== "all" && (
                    <span className="ml-1 opacity-70">({orders.filter((o) => o.status === s.value).length})</span>
                  )}
                </button>
              ))}
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center text-gray-400 border border-gray-100">
                Nuk ka porosi.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => {
                  const s = statusOptions.find((x) => x.value === order.status) ?? statusOptions[0];
                  const isOpen = expandedOrder === order.id;
                  return (
                    <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <button
                        onClick={() => setExpandedOrder(isOpen ? null : order.id)}
                        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">#{order.id.slice(0, 8).toUpperCase()}</p>
                            <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString("sq-AL", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                          </div>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${s.color}`}>{s.label}</span>
                          <span className="text-sm text-gray-600">{order.emri} {order.mbiemri}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-green-600">{Number(order.total).toFixed(2)} €</span>
                          {isOpen ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 border-t border-gray-100 bg-gray-50">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Klienti</p>
                              <p className="text-sm text-gray-700">{order.emri} {order.mbiemri}</p>
                              <p className="text-sm text-gray-700">📞 {order.telefon}</p>
                              <p className="text-sm text-gray-700">📍 {order.adresa}</p>
                              {order.shenime && <p className="text-sm text-gray-500 italic mt-1">"{order.shenime}"</p>}
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Produktet</p>
                              {order.order_items.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm text-gray-700">
                                  <span>{item.name} x{item.quantity}</span>
                                  <span>{(item.price * item.quantity).toFixed(2)} €</span>
                                </div>
                              ))}
                              <div className="border-t mt-2 pt-2 flex justify-between font-bold text-sm">
                                <span>Totali</span>
                                <span className="text-green-600">{Number(order.total).toFixed(2)} €</span>
                              </div>
                            </div>
                          </div>

                          {/* Ndrysho statusin */}
                          <div className="flex items-center gap-2 mt-2">
                            <p className="text-xs text-gray-400 font-semibold uppercase">Statusi:</p>
                            <div className="flex gap-2 flex-wrap">
                              {statusOptions.map((st) => (
                                <button
                                  key={st.value}
                                  onClick={() => handleStatusChange(order.id, st.value)}
                                  className={`px-3 py-1 rounded-full text-xs font-semibold transition ${order.status === st.value ? st.color + " ring-2 ring-offset-1 ring-green-400" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"}`}
                                >
                                  {st.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB PRODUKTET */}
        {tab === "produktet" && (
          <div>
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 space-y-4">
              <h2 className="font-semibold text-gray-800 mb-2">{editingId ? "Edito Produktin" : "Shto Produkt të Ri"}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" placeholder="Emri i produktit" value={name} onChange={(e) => setName(e.target.value)} className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
                <input type="number" placeholder="Çmimi (€)" value={price} onChange={(e) => setPrice(e.target.value)} className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400">
                  <option value="">Zgjidh Kategorinë</option>
                  <option value="fruta">Frutat</option>
                  <option value="perime">Perimet</option>
                  <option value="shporta">Shporta (Ofertat)</option>
                  <option value="fruta-thata">Produkte të Ambalazhuara</option>
                </select>
                <input type="text" placeholder="Imazhi (p.sh. /foto/domate.jpg)" value={image} onChange={(e) => setImage(e.target.value)} className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
                <div className="flex items-center gap-3 sm:col-span-2">
                  <label className="text-sm font-medium text-gray-600 whitespace-nowrap">Zbritje (%):</label>
                  <input type="number" min="0" max="100" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 text-sm font-semibold transition">
                  {editingId ? "Ruaj Ndryshimet" : "Shto Produkt"}
                </button>
                {editingId && (
                  <button type="button" onClick={handleCancel} className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 text-sm font-semibold transition">
                    Anulo
                  </button>
                )}
              </div>
            </form>

            <div className="space-y-2">
              {products.map((p) => (
                <div key={p.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex justify-between items-center">
                  <span className="text-sm">
                    <strong>{p.name}</strong> — {p.price} €
                    {p.discount > 0 && <span className="ml-2 text-red-500 text-xs font-semibold">-{p.discount}%</span>}
                    <span className="text-gray-400 text-xs ml-2">({p.category})</span>
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(p)} className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 text-xs transition">Edito</button>
                    <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-xs transition">Fshi</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
