"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { supabase } from "../lib/supabase";
import { checkRateLimit, recordFailedAttempt, clearRateLimit, formatBlockTime, getRateLimitKey } from "../lib/useRateLimit";

function ClientLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const rlKey = getRateLimitKey("login_client");
    const { blocked, remainingMs } = checkRateLimit(rlKey);
    if (blocked) {
      setError(`Shumë përpjekje. Provo përsëri pas ${formatBlockTime(remainingMs)}.`);
      return;
    }

    if (!email || !password) {
      setError("Ju lutem plotësoni të gjitha fushat!");
      return;
    }

    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      const result = recordFailedAttempt(rlKey);
      if (result.blocked) {
        setError("Llogaria u bllokua për 15 minuta për shkak të shumë përpjekjeve.");
      } else {
        setError(`Email ose fjalëkalimi i pasaktë. Përpjekje të mbetura: ${result.attemptsLeft}.`);
      }
      setLoading(false);
      return;
    }

    clearRateLimit(rlKey);
    setLoading(false);
    router.replace(redirect);
  };

  return (
    <section className="pt-24 px-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">Hyrje</h1>
      {error && <p className="text-red-600 text-sm mb-4 text-center bg-red-50 px-4 py-2 rounded-lg">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="password"
          placeholder="Fjalëkalimi"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Duke hyrë..." : "Hyrje"}
        </button>
      </form>
    </section>
  );
}

export default function ClientLogin() {
  return (
    <Suspense fallback={<div className="pt-24 text-center text-gray-400">Duke ngarkuar...</div>}>
      <ClientLoginForm />
    </Suspense>
  );
}
