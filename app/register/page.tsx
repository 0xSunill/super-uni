// app/register/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { postJson } from "@/lib/fetcher";

type Role = "TEACHER" | "STUDENT";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("STUDENT");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await postJson("/api/auth/register", {
        email,
        username,
        password,
        role,
        profile,
      });
      // after register, redirect to login
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "40px auto" }}>
      <h1>Register</h1>
      <form onSubmit={submit} style={{ display: "grid", gap: 8 }}>
        <label>
          Role
          <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
            <option value="STUDENT">Student</option>
            <option value="TEACHER">Teacher</option>
          </select>
        </label>

        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>

        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>

        <label>
          Password
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </label>

        {/* Role-specific fields */}
        {role === "STUDENT" ? (
          <>
            <label>
              Roll No
              <input onChange={(e) => setProfile((p: any) => ({ ...p, rollNo: e.target.value }))} required />
            </label>
            <label>
              Name
              <input onChange={(e) => setProfile((p: any) => ({ ...p, name: e.target.value }))} required />
            </label>
            <label>
              Department
              <input onChange={(e) => setProfile((p: any) => ({ ...p, department: e.target.value }))} required />
            </label>
            <label>
              YearId (select existing year id)
              <input onChange={(e) => setProfile((p: any) => ({ ...p, yearId: e.target.value }))} required />
            </label>
          </>
        ) : (
          <>
            <label>
              Name
              <input onChange={(e) => setProfile((p: any) => ({ ...p, name: e.target.value }))} required />
            </label>
            <label>
              Department
              <input onChange={(e) => setProfile((p: any) => ({ ...p, department: e.target.value }))} required />
            </label>
            <label>
              Phone
              <input onChange={(e) => setProfile((p: any) => ({ ...p, phone: e.target.value }))} />
            </label>
          </>
        )}

        <button type="submit" disabled={loading}>{loading ? "Creating..." : "Register"}</button>

        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </div>
  );
}
