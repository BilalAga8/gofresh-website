import Link from "next/link";
import { FaLeaf, FaTruck, FaSeedling, FaHeart, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const vlerat = [
  { icon: <FaLeaf className="text-green-500 text-2xl" />, title: "100% Natyrale", desc: "Asnjë pesticide, asnjë kimikate — vetëm produkte të pastra nga natyra." },
  { icon: <FaSeedling className="text-green-500 text-2xl" />, title: "Bio & i Qëndrueshëm", desc: "Metodat tona të kultivimit respektojnë tokën dhe mjedisin." },
  { icon: <FaTruck className="text-green-500 text-2xl" />, title: "Dërgesa e Shpejtë", desc: "Nga ferma direkt tek dera juaj, sa më të freskëta të jetë e mundur." },
  { icon: <FaHeart className="text-green-500 text-2xl" />, title: "Me Dashuri", desc: "Çdo produkt është kultivuar me kujdes dhe përkushtim nga familja jonë." },
];

const ekipi = [
  { emri: "Artan Hoxha", roli: "Themelues & Fermer", iniciale: "AH" },
  { emri: "Blerina Koci", roli: "Menaxhere Cilësie", iniciale: "BK" },
  { emri: "Dritan Shehu", roli: "Logistikë & Dërgesa", iniciale: "DS" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 to-green-500 text-white py-20 px-6 text-center">
        <span className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest mb-4">
          🌿 Rreth Nesh
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Ferma Familjare <span className="text-yellow-300">Go Fresh</span>
        </h1>
        <p className="text-green-100 max-w-2xl mx-auto text-lg">
          Që nga viti 2010, sjellim produkte të freskëta, bio dhe të kultivuara me dashuri direkt nga ferma jonë tek tryeza juaj.
        </p>
      </section>

      {/* Historia */}
      <section className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Historia jonë</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Go Fresh filloi si një fermë e vogël familjare në periferi të Tiranës. Me punë të palodhur dhe dashuri për natyrën, sot kemi zgjeruar veprimtarinë tonë duke shërbyer qindra familje çdo ditë.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Misioni ynë është i thjeshtë: të sjellim ushqim të shëndetshëm, të freskët dhe të sigurt tek çdo familje shqiptare, me çmime të arsyeshme.
          </p>
          <Link
            href="/produktet"
            className="inline-block mt-6 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition font-semibold"
          >
            Shiko Produktet
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { num: "15+", label: "Vite Eksperiencë" },
            { num: "500+", label: "Klientë të Kënaqur" },
            { num: "50+", label: "Lloje Produktesh" },
            { num: "100%", label: "Bio & Natyrale" },
          ].map((stat) => (
            <div key={stat.label} className="bg-green-50 rounded-2xl p-6 text-center">
              <p className="text-3xl font-extrabold text-green-600">{stat.num}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vlerat */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Pse të zgjidhni ne?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {vlerat.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  {v.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ekipi */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Ekipi ynë</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {ekipi.map((person) => (
            <div key={person.emri} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-md transition">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 text-xl font-bold flex items-center justify-center mx-auto mb-4">
                {person.iniciale}
              </div>
              <h3 className="font-bold text-gray-800">{person.emri}</h3>
              <p className="text-sm text-gray-400 mt-1">{person.roli}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Kontakti */}
      <section className="bg-gradient-to-br from-green-700 to-green-500 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Na Kontaktoni</h2>
          <p className="text-green-100 mb-10">Jemi gjithmonë të gatshëm t&apos;ju ndihmojmë.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: <FaMapMarkerAlt className="text-2xl" />, label: "Adresa", value: "Tiranë, Shqipëri" },
              { icon: <FaPhone className="text-2xl" />, label: "Telefon", value: "+355 69 123 4567" },
              { icon: <FaEnvelope className="text-2xl" />, label: "Email", value: "info@gofresh.al" },
            ].map((c) => (
              <div key={c.label} className="bg-white/10 rounded-2xl p-6 hover:bg-white/20 transition">
                <div className="flex justify-center mb-3">{c.icon}</div>
                <p className="text-xs font-semibold uppercase tracking-wide text-green-200 mb-1">{c.label}</p>
                <p className="font-semibold">{c.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
