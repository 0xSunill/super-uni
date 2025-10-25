// app/login/page.tsx
"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    setLoading(false);
    if (!res) return setError("Unexpected error");
    if (res.error) return setError(res.error);
    router.push("/admin");
  }

  return (
    <div style={{ maxWidth: 520, margin: "40px auto" }}>
      <h1>Sign in</h1>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8 }}>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>

        <label>
          Password
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>

        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </div>
  );
}
