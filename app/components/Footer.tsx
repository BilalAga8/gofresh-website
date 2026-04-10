import Link from "next/link";
import { FaFacebook, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brandi */}
        <div>
          <h2 className="text-2xl font-bold text-green-400 mb-3">🌱 Go Fresh</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Produkte të freskëta direkt nga ferma te dera juaj. Cilësi e garantuar, çmime të arsyeshme.
          </p>
          <div className="flex gap-4 mt-5">
            <a href="#" className="w-9 h-9 rounded-full bg-gray-700 hover:bg-blue-600 flex items-center justify-center transition">
              <FaFacebook />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-gray-700 hover:bg-pink-500 flex items-center justify-center transition">
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Linqet */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Navigim</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-green-400 transition">Home</Link></li>
            <li><Link href="/produktet" className="hover:text-green-400 transition">Produktet</Link></li>
            <li><Link href="/about" className="hover:text-green-400 transition">Rreth Nesh</Link></li>
            <li><Link href="/cart" className="hover:text-green-400 transition">Shporta</Link></li>
            <li><Link href="/login-client" className="hover:text-green-400 transition">Login</Link></li>
          </ul>
        </div>

        {/* Kontakti */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Kontakt</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-green-400 shrink-0" />
              <span>Tiranë, Shqipëri</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhone className="text-green-400 shrink-0" />
              <span>+355 69 123 4567</span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-green-400 shrink-0" />
              <span>info@gofresh.al</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700 py-4 text-center text-xs text-gray-500">
        © 2026 Go Fresh. Të gjitha të drejtat e rezervuara.
      </div>
    </footer>
  );
}

export default Footer;
