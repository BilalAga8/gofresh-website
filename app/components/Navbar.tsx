"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import {
  checkRateLimit,
  recordFailedAttempt,
  clearRateLimit,
  formatBlockTime,
  getRateLimitKey,
} from "../lib/useRateLimit";
import { FaUser, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

type LoginFormProps = {
  compact?: boolean;
  email: string;
  password: string;
  loginError: string;
  loginLoading: boolean;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

function LoginForm({
  compact = false,
  email,
  password,
  loginError,
  loginLoading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onClose,
}: LoginFormProps) {
  return (
    <div
      className={`bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-100 ${compact ? "p-5" : "p-6"}`}
    >
      <h2
        className={`font-extrabold uppercase mb-1 tracking-wide ${compact ? "text-lg" : "text-xl"}`}
      >
        Hyrje
      </h2>
      <p className={`text-gray-500 mb-4 ${compact ? "text-xs" : "text-sm"}`}>
        Hyni me email dhe fjalëkalim.
      </p>
      {loginError && (
        <p className="text-red-600 text-xs mb-3 bg-red-50 px-3 py-2 rounded-lg">
          {loginError}
        </p>
      )}
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label
            htmlFor={compact ? "email-m" : "email-d"}
            className="block text-xs font-semibold text-gray-600 mb-1"
          >
            Email *
          </label>
          <input
            id={compact ? "email-m" : "email-d"}
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
            placeholder="email@shembull.com"
          />
        </div>
        <div>
          <label
            htmlFor={compact ? "pass-m" : "pass-d"}
            className="block text-xs font-semibold text-gray-600 mb-1"
          >
            Fjalëkalimi *
          </label>
          <input
            id={compact ? "pass-m" : "pass-d"}
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={loginLoading}
          className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2.5 rounded-lg uppercase tracking-wide transition disabled:opacity-50"
        >
          {loginLoading ? "Duke hyrë..." : "Hyrje"}
        </button>
      </form>
      <Link
        href="/login-client"
        className="block text-center text-green-600 text-xs mt-3 hover:underline"
        onClick={onClose}
      >
        Harrove fjalëkalimin?
      </Link>
      <div className="border-t border-gray-100 mt-4 pt-3 text-center">
        <p className="text-xs text-gray-400 mb-2">Nuk keni llogari?</p>
        <Link
          href="/register-client"
          className="text-green-600 text-sm font-semibold hover:underline"
          onClick={onClose}
        >
          Regjistrohu falas →
        </Link>
      </div>
    </div>
  );
}

function Navbar() {
  const { state } = useCart();
  const { isClientLoggedIn, logout, authLoading, setIsAdmin } = useAuth();
  const totalItems = state.items.reduce(
    (sum: number, item) => sum + item.quantity,
    0,
  );

  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const desktopDropdownRef = useRef<HTMLLIElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogoClick = () => {
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (!desktopDropdownRef.current?.contains(target)) setIsLoginOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError("");

    const rlKey = getRateLimitKey("navbar_login");
    const { blocked, remainingMs } = checkRateLimit(rlKey);
    if (blocked) {
      setLoginError(
        `Shumë përpjekje. Provo përsëri pas ${formatBlockTime(remainingMs)}.`,
      );
      return;
    }

    if (!email || !password) {
      setLoginError("Ju lutem plotësoni të gjitha fushat!");
      return;
    }
    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      const result = recordFailedAttempt(rlKey);
      if (result.blocked) {
        setLoginError(
          "Profili u bllokua për 15 minuta për shkak të shumë përpjekjeve.",
        );
      } else {
        setLoginError(
          `Email ose fjalëkalimi i pasaktë. Përpjekje të mbetura: ${result.attemptsLeft}.`,
        );
      }
    } else {
      clearRateLimit(rlKey);
      setIsAdmin(false);
      setIsLoginOpen(false);
      setEmail("");
      setPassword("");
    }
    setLoginLoading(false);
  };

  const loginFormProps: LoginFormProps = {
    email,
    password,
    loginError,
    loginLoading,
    onEmailChange: setEmail,
    onPasswordChange: setPassword,
    onSubmit: handleLoginSubmit,
    onClose: () => setIsLoginOpen(false),
  };

  return (
    <>
      <nav className="sticky top-0 left-0 w-full bg-gray-800 text-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          {/* Mobile: hamburger MAJTAS */}
          <button
            className="md:hidden p-2 rounded hover:bg-gray-700 text-xl"
            onClick={() => setIsOpen(true)}
            aria-label="Hap menunë"
          >
            <FaBars />
          </button>

          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="text-2xl font-bold text-green-400 hover:text-green-300 transition cursor-pointer"
          >
            🌱 Agro Fresh
          </button>

          {/* Desktop nav */}
          <ul className="hidden md:flex space-x-6 font-medium items-center">
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
            <li>
              <Link href="/faq" className="hover:text-green-400">
                FAQ
              </Link>
            </li>
            <li className="relative">
              <Link
                href="/cart"
                className="hover:text-green-400 flex items-center gap-1"
              >
                <FaShoppingCart />
                Shporta
              </Link>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {totalItems}
                </span>
              )}
            </li>

            {!authLoading && (
              <li className="relative" ref={desktopDropdownRef}>
                {isClientLoggedIn ? (
                  <div className="flex items-center gap-3">
                    <Link
                      href="/client-profile"
                      className="hover:text-green-400 flex items-center gap-1"
                    >
                      <FaUser />
                      Profili
                    </Link>
                    <button
                      onClick={() => logout()}
                      className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setIsLoginOpen((v) => !v)}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-3 py-1.5 rounded-lg transition"
                    >
                      <FaUser />
                      <span className="text-sm font-semibold">Hyrje</span>
                    </button>
                    {isLoginOpen && (
                      <div className="absolute right-0 top-12 w-80">
                        <LoginForm {...loginFormProps} />
                      </div>
                    )}
                  </>
                )}
              </li>
            )}
          </ul>

          {/* Mobile: user + cart (djathtas) */}
          <div className="flex md:hidden items-center gap-4">
            {!authLoading && isClientLoggedIn && (
              <Link
                href="/client-profile"
                className="text-xl hover:text-green-400"
                aria-label="Profili ime"
              >
                <FaUser />
              </Link>
            )}

            {!authLoading && !isClientLoggedIn && (
              <Link
                href="/login-client"
                className="text-xl hover:text-green-400"
                aria-label="Hyrje"
              >
                <FaUser />
              </Link>
            )}

            <Link
              href="/cart"
              className="relative text-xl"
              aria-label="Shporta"
            >
              <FaShoppingCart />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Sidebar overlay */}
      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar nga e majta */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white text-gray-800 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-lg font-extrabold text-green-600">
            🌱 Agro Fresh
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-700 text-xl p-1"
            aria-label="Mbyll"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="flex flex-col">
          {[
            { href: "/", label: "HOME" },
            { href: "/about", label: "RRETH NESH" },
            { href: "/produktet", label: "PRODUKTET" },
            { href: "/faq", label: "FAQ" },
            {
              href: "/cart",
              label: totalItems > 0 ? `SHPORTA (${totalItems})` : "SHPORTA",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="px-6 py-4 text-sm font-bold tracking-widest border-b border-gray-100 hover:bg-green-50 hover:text-green-700 transition"
            >
              {item.label}
            </Link>
          ))}

          {!authLoading && isClientLoggedIn && (
            <>
              <Link
                href="/client-profile"
                onClick={() => setIsOpen(false)}
                className="px-6 py-4 text-sm font-bold tracking-widest border-b border-gray-100 hover:bg-green-50 hover:text-green-700 transition"
              >
                LLOGARIA IME
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="px-6 py-4 text-sm font-bold tracking-widest border-b border-gray-100 hover:bg-red-50 text-red-500 hover:text-red-600 transition text-left"
              >
                LOGOUT
              </button>
            </>
          )}
        </nav>
      </div>
    </>
  );
}

export default Navbar;
