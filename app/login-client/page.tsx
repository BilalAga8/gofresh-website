"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { supabase } from "../lib/supabase";

function ClientLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Ju lutem plotësoni të gjitha fushat!");
      return;
    }

    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError("Email ose fjalëkalimi është i pasaktë!");
      setLoading(false);
      return;
    }

    setLoading(false);
    router.replace(redirect);
  };

  return (
    <section className="pt-24 px-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
        Login Klient
      </h1>
      {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}
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
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Duke hyrë..." : "Hyr"}
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
