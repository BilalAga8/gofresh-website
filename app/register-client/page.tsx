"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function ClientRegister() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nipt, setNipt] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");

    if (!firstName || !lastName || !nipt || !phone || !email || !password || !confirmPassword) {
      setError("Ju lutem plotësoni të gjitha fushat!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Fjalëkalimet nuk përputhen!");
      return;
    }

    if (!/^[A-Za-z]\d{8}[A-Za-z]$/.test(nipt)) {
      setError("NIPT-i duhet të jetë në formatin: 1 shkronjë + 8 numra + 1 shkronjë (p.sh. M12345678A)");
      return;
    }

    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        emri: firstName,
        mbiemri: lastName,
        telefon: phone,
        nipt,
      });

      await fetch("/api/send-welcome-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toEmail: email, emri: firstName, mbiemri: lastName }),
      });
    }

    setLoading(false);
    router.replace("/produktet");
  };

  return (
    <section className="pt-24 px-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
        Rregjistrim Klient
      </h1>
      {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}
      <form onSubmit={handleRegister} className="space-y-4">
        <input type="text" placeholder="Emri" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full border rounded px-3 py-2" />
        <input type="text" placeholder="Mbiemri" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full border rounded px-3 py-2" />
        <input type="text" placeholder="Numri NIPT (p.sh. M12345678A)" value={nipt} onChange={(e) => setNipt(e.target.value.toUpperCase())} className="w-full border rounded px-3 py-2" maxLength={10} />
        <input type="text" placeholder="Numri i Telefonit" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded px-3 py-2" />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" />
        <input type="password" placeholder="Konfirmo Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border rounded px-3 py-2" />
        <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700 disabled:opacity-50">
          {loading ? "Duke u regjistruar..." : "Rregjistrohu"}
        </button>
      </form>
    </section>
  );
}
