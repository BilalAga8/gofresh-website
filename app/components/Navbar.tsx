"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { state } = useCart();
  const { isClientLoggedIn, logout } = useAuth();
  const totalItems = state.items.reduce(
    (sum: number, item) => sum + item.quantity,
    0
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => { logout(); };

  return (
    <nav className="sticky top-0 left-0 w-full bg-gray-800 text-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <div className="text-2xl font-bold text-green-400">🌱 Go Fresh</div>

        <ul className="hidden md:flex space-x-6 font-medium">
          <li>
            <Link href="/" className="hover:text-green-400">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-green-400">
              About
            </Link>
          </li>
          <li>
            <Link href="/produktet" className="hover:text-green-400">
              Produktet
            </Link>
          </li>
          <li className="relative">
            <Link href="/cart" className="hover:text-green-400">
              Shporta ime
            </Link>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {totalItems}
              </span>
            )}
          </li>

          {isClientLoggedIn ? (
            <>
              <li>
                <Link href="/client-profile" className="hover:text-green-400">
                  Llogaria ime
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link
                href="/login"
                className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
              >
                Login
              </Link>
            </li>
          )}
        </ul>

        <button
          className="md:hidden p-2 rounded hover:bg-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-700 px-4 py-2 space-y-2">
          <Link href="/" className="block hover:text-green-400">
            Home
          </Link>
          <Link href="/about" className="block hover:text-green-400">
            About
          </Link>
          <Link href="/produktet" className="block hover:text-green-400">
            Produktet
          </Link>
          <Link href="/cart" className="block hover:text-green-400">
            Shporta ime {totalItems > 0 && `(${totalItems})`}
          </Link>

          {isClientLoggedIn ? (
            <>
              <Link
                href="/client-profile"
                className="block hover:text-green-400"
              >
                Llogaria ime
              </Link>
              <button
                onClick={handleLogout}
                className="block bg-red-500 px-3 py-1 rounded hover:bg-red-600 w-full text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="block bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
