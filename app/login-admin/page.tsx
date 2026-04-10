"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setIsAdmin } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Ju lutem plotësoni të gjitha fushat!");
      return;
    }

    if (username === "admin" && password === "1234") {
      setIsAdmin(true);
      router.push("/admin");
    } else {
      alert("Kredencialet janë të pasakta!");
      setPassword("");
    }
  };

  return (
    <section className="pt-24 px-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
        Admin Login
      </h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700"
        >
          Hyr
        </button>
      </form>
    </section>
  );
}
