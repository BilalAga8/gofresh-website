"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Vendos ketu daten e mbarimit te ofertes
const OFFER_END = new Date("2026-04-20T23:59:59");

function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };

  const [time, setTime] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return time;
}

function Pad(n: number) {
  return String(n).padStart(2, "0");
}

function Hero() {
  const { days, hours, minutes, seconds } = useCountdown(OFFER_END);
  const offerEnded = days === 0 && hours === 0 && minutes === 0 && seconds === 0;

  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-center text-center py-14 overflow-hidden bg-gradient-to-br from-green-800 via-green-600 to-green-400"
    >
      {/* Rrathë dekorativë */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl" />

      {/* Badge */}
      <span className="relative z-10 bg-yellow-400 text-green-900 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest mb-4 shadow">
        🌿 Produkte 100% Natyrale
      </span>

      {/* Titulli */}
      <h1 className="relative z-10 text-4xl md:text-5xl font-extrabold text-white drop-shadow-xl leading-tight">
        Go <span className="text-yellow-300">Fresh</span>
      </h1>

      <p className="relative z-10 mt-3 text-sm text-green-100 max-w-xl">
        Produkte të freskëta dhe natyrale, direkt nga ferma tek ju — me çmimet më të mira.
      </p>

      {/* Countdown */}
      {!offerEnded ? (
        <div className="relative z-10 mt-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3 text-white">
          <p className="text-xs font-semibold uppercase tracking-widest text-yellow-300 mb-2">
            🔥 Oferta deri në 70% ulje mbaron në:
          </p>
          <div className="flex gap-4 justify-center">
            {[
              { label: "Ditë", val: days },
              { label: "Orë", val: hours },
              { label: "Min", val: minutes },
              { label: "Sek", val: seconds },
            ].map(({ label, val }) => (
              <div key={label} className="flex flex-col items-center">
                <span className="text-3xl font-extrabold text-white leading-none">
                  {Pad(val)}
                </span>
                <span className="text-xs text-green-200 mt-1 uppercase tracking-wide">{label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative z-10 mt-6 bg-white/10 rounded-2xl px-6 py-3 text-white text-sm">
          Oferta ka mbaruar.
        </div>
      )}

      {/* Butonat */}
      <div className="relative z-10 mt-6 flex flex-col sm:flex-row gap-3">
        <Link
          href="/produktet"
          className="px-8 py-3 bg-yellow-400 text-green-900 font-bold rounded-xl shadow-lg hover:bg-yellow-300 transition"
        >
          Shiko Produktet
        </Link>
        <Link
          href="/produktet?category=shporta"
          className="px-8 py-3 bg-white/10 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition"
        >
          Shiko Ofertat
        </Link>
      </div>
    </section>
  );
}

export default Hero;
