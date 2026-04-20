"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaBox, FaClipboardList, FaChevronDown, FaChevronUp, FaCloudUploadAlt, FaTimes, FaChartBar } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  discount: number;
  unit: string;
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
  email: string | null;
  order_items: OrderItem[];
}

const statusOptions = [
  { value: "pending",   label: "Duke u procesuar", color: "bg-yellow-100 text-yellow-700" },
  { value: "confirmed", label: "Konfirmuar",        color: "bg-blue-100 text-blue-700" },
  { value: "delivered", label: "Dorëzuar",          color: "bg-green-100 text-green-700" },
  { value: "cancelled", label: "Anuluar",           color: "bg-red-100 text-red-700" },
];

type Tab = "produktet" | "porosite" | "statistikat";

export default function AdminPanel() {
  const router = useRouter();
  const { isAdmin, setIsAdmin, adminLoading } = useAuth();
  const [tab, setTab] = useState<Tab>("porosite");

  // Produktet
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [discount, setDiscount] = useState("0");
  const [unit, setUnit] = useState("kg");
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Porosite
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");

  async function fetchProducts() {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (data) setProducts(data);
  }

  async function fetchOrders() {
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });
    if (data) setOrders([...data]);
  }

  useEffect(() => {
    supabase.from("products").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setProducts(data); });
    supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setOrders([...data]); });
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));

    const order = orders.find((o) => o.id === orderId);
    if (order?.email && ["confirmed", "delivered", "cancelled"].includes(newStatus)) {
      await fetch("/api/send-status-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toEmail: order.email,
          emri: order.emri,
          mbiemri: order.mbiemri,
          orderId: order.id,
          status: newStatus,
        }),
      });
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!name || !price || !category) { alert("Ju lutem plotësoni të gjitha fushat!"); return; }
    const productData = { name, price: Number.parseFloat(price), category, image, discount: Number.parseInt(discount) || 0, unit };
    if (editingId !== null) {
      const { error } = await supabase.from("products").update(productData).eq("id", editingId);
      if (error) { alert("Gabim gjatë editimit: " + error.message); return; }
      setEditingId(null);
    } else {
      const { error } = await supabase.from("products").insert(productData);
      if (error) { alert("Gabim gjatë shtimit: " + error.message); return; }
    }
    setName(""); setPrice(""); setCategory(""); setImage(""); setDiscount("0"); setUnit("kg");
    fetchProducts();
  };

  const handleEdit = (p: Product) => { setName(p.name); setPrice(p.price.toString()); setCategory(p.category); setImage(p.image ?? ""); setDiscount(p.discount?.toString() ?? "0"); setUnit(p.unit ?? "kg"); setEditingId(p.id); };
  const handleDelete = async (id: string) => { if (globalThis.confirm("Jeni të sigurt?")) { await supabase.from("products").delete().eq("id", id); fetchProducts(); } };
  const handleCancel = () => { setName(""); setPrice(""); setCategory(""); setImage(""); setDiscount("0"); setUnit("kg"); setEditingId(null); };

  const uploadImage = async (file: File) => {
    if (!file.type.startsWith("image/")) { alert("Ju lutem zgjidhni një imazh!"); return; }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(filename, file, { upsert: true });
    if (error) { alert("Gabim gjatë ngarkimit: " + error.message); setUploading(false); return; }
    const { data } = supabase.storage.from("product-images").getPublicUrl(filename);
    setImage(data.publicUrl);
    setUploading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadImage(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadImage(file);
  };
  const handleLogout = async () => {
    await fetch("/api/admin-logout", { method: "POST" });
    setIsAdmin(false);
    router.replace("/");
  };

  if (adminLoading) return null;
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
          <button
            onClick={() => setTab("statistikat")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition ${tab === "statistikat" ? "bg-green-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
          >
            <FaChartBar /> Statistikat
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
                          <span className="font-bold text-green-600">{Number(order.total).toFixed(2)} Lek</span>
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
                              {order.shenime && <p className="text-sm text-gray-500 italic mt-1">&quot;{order.shenime}&quot;</p>}
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Produktet</p>
                              {order.order_items.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm text-gray-700">
                                  <span>{item.name} x{item.quantity}</span>
                                  <span>{(item.price * item.quantity).toFixed(2)} Lek</span>
                                </div>
                              ))}
                              <div className="border-t mt-2 pt-2 flex justify-between font-bold text-sm">
                                <span>Totali</span>
                                <span className="text-green-600">{Number(order.total).toFixed(2)} Lek</span>
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
                <input type="number" placeholder="Çmimi (L)" value={price} onChange={(e) => setPrice(e.target.value)} className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400">
                  <option value="">Zgjidh Kategorinë</option>
                  <option value="fruta">Frutat</option>
                  <option value="perime">Perimet</option>
                  <option value="shporta">Shporta (Ofertat)</option>
                  <option value="fruta-thata">Produkte të Ambalazhuara</option>
                </select>
                {/* Upload foto */}
                <div className="sm:col-span-2">
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  {image ? (
                    <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200">
                      <Image src={image} alt="preview" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => setImage("")}
                        className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDrop={handleDrop}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition ${dragOver ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-green-400 hover:bg-gray-50"}`}
                    >
                      {uploading ? (
                        <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <FaCloudUploadAlt className="text-3xl text-gray-400 mb-1" />
                          <p className="text-sm text-gray-500">Kliko ose tërhiq foton këtu</p>
                          <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WEBP</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-600 whitespace-nowrap">Njësia:</label>
                  <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400">
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="copë">copë</option>
                    <option value="litër">litër</option>
                    <option value="pako">pako</option>
                    <option value="tufë">tufë</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
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
                    <strong>{p.name}</strong> — {p.price} Lek / {p.unit ?? "copë"}
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
        {/* TAB STATISTIKAT */}
        {tab === "statistikat" && (() => {
          const today = new Date().toDateString();
          const thisMonth = new Date().getMonth();
          const thisYear = new Date().getFullYear();

          const totalRevenue = orders.reduce((s, o) => s + Number(o.total), 0);
          const todayRevenue = orders
            .filter((o) => new Date(o.created_at).toDateString() === today)
            .reduce((s, o) => s + Number(o.total), 0);
          const monthRevenue = orders
            .filter((o) => {
              const d = new Date(o.created_at);
              return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
            })
            .reduce((s, o) => s + Number(o.total), 0);

          const statusCounts = statusOptions.map((s) => ({
            ...s,
            count: orders.filter((o) => o.status === s.value).length,
          }));
          const maxStatus = Math.max(...statusCounts.map((s) => s.count), 1);

          // Top produktet nga order_items
          const productTotals: Record<string, { name: string; qty: number; revenue: number }> = {};
          for (const order of orders) {
            for (const item of order.order_items) {
              if (!productTotals[item.name]) productTotals[item.name] = { name: item.name, qty: 0, revenue: 0 };
              productTotals[item.name].qty += item.quantity;
              productTotals[item.name].revenue += item.price * item.quantity;
            }
          }
          const topProducts = Object.values(productTotals)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
          const maxRevenue = Math.max(...topProducts.map((p) => p.revenue), 1);

          return (
            <div className="space-y-6">
              {/* Kartat e përmbledhjes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: "Të ardhura totale", value: `${totalRevenue.toFixed(2)} Lek`, color: "text-green-600" },
                  { label: "Këtë muaj", value: `${monthRevenue.toFixed(2)} Lek`, color: "text-blue-600" },
                  { label: "Sot", value: `${todayRevenue.toFixed(2)} Lek`, color: "text-purple-600" },
                  { label: "Total porosi", value: orders.length, color: "text-gray-700" },
                  { label: "Total produkte", value: products.length, color: "text-gray-700" },
                  { label: "Porosi sot", value: orders.filter((o) => new Date(o.created_at).toDateString() === today).length, color: "text-gray-700" },
                ].map((card) => (
                  <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                    <p className="text-xs text-gray-400 font-semibold uppercase mb-1">{card.label}</p>
                    <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                  </div>
                ))}
              </div>

              {/* Porosi sipas statusit */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <p className="text-sm font-semibold text-gray-700 mb-4">Porosi sipas statusit</p>
                <div className="space-y-3">
                  {statusCounts.map((s) => (
                    <div key={s.value}>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{s.label}</span>
                        <span className="font-semibold">{s.count}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full transition-all duration-500"
                          style={{
                            width: `${(s.count / maxStatus) * 100}%`,
                            backgroundColor: s.value === "delivered" ? "#16a34a" : s.value === "pending" ? "#ca8a04" : s.value === "confirmed" ? "#2563eb" : "#dc2626",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top 5 produktet */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <p className="text-sm font-semibold text-gray-700 mb-4">Top 5 produktet (nga të ardhurat)</p>
                {topProducts.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">Ende nuk ka të dhëna.</p>
                ) : (
                  <div className="space-y-3">
                    {topProducts.map((p, i) => (
                      <div key={p.name}>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span><span className="font-bold text-gray-700 mr-1">#{i + 1}</span>{p.name}</span>
                          <span className="font-semibold text-green-600">{p.revenue.toFixed(2)} Lek</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div
                            className="h-2.5 rounded-full bg-green-500 transition-all duration-500"
                            style={{ width: `${(p.revenue / maxRevenue) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

      </div>
    </section>
  );
}
