// ===============================
// app/(auth)/login/page.tsx
// Beautiful, role-based login page with redirects:
// - Admin  -> /admin
// - Student -> /{studentRollNo}
// - Teacher -> /teacher/{teacherId}
// Stack: Next.js App Router + Tailwind + framer-motion + lucide-react (optional)
// ===============================

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { LogIn, GraduationCap, UserCog, BadgeCheck } from "lucide-react";

/** Small pill for choosing a role */
function RolePill({ active, label, icon: Icon, onClick }: { active: boolean; label: string; icon: any; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition border ${
        active ? "bg-black text-white border-black" : "bg-white text-gray-800 border-gray-300 hover:border-black"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span className="font-medium">{label}</span>
    </button>
  );
}

export default function LoginPage() {
  const router = useRouter();
  type Role = "ADMIN" | "STUDENT" | "TEACHER";
  const [role, setRole] = useState<Role>("STUDENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [email, setEmail] = useState(""); // for admin/teacher (if you use email login)
  const [password, setPassword] = useState("");
  const [rollNo, setRollNo] = useState(""); // for students

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const body: any = { role, password };
      if (role === "STUDENT") body.rollNo = rollNo.trim();
      else body.email = email.trim();

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Login failed");
      }

      // Expecting { redirect: string }
      if (data?.redirect) {
        router.push(data.redirect);
      } else {
        throw new Error("No redirect returned by server");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isStudent = role === "STUDENT";

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-white to-zinc-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl"
      >
        <div className="bg-white shadow-xl rounded-3xl p-8 border border-zinc-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-2xl bg-black text-white"><LogIn className="h-5 w-5"/></div>
            <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
          </div>

          {/* Role selector */}
          <div className="flex flex-wrap gap-2 mb-8">
            <RolePill active={role === "STUDENT"} label="Student" icon={GraduationCap} onClick={() => setRole("STUDENT")} />
            <RolePill active={role === "TEACHER"} label="Teacher" icon={BadgeCheck} onClick={() => setRole("TEACHER")} />
            <RolePill active={role === "ADMIN"} label="Admin" icon={UserCog} onClick={() => setRole("ADMIN")} />
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {isStudent ? (
              <div>
                <label className="block text-sm font-medium mb-1">Roll number</label>
                <input
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  placeholder="e.g. MCA001"
                  className="w-full border border-zinc-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  type="email"
                  className="w-full border border-zinc-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                className="w-full border border-zinc-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-2">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black text-white py-2 font-medium hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Signing in…" : `Sign in as ${role.toLowerCase()}`}
            </button>
          </form>

          <p className="text-xs text-zinc-500 mt-6">
            Tip: Admin → <code>email+password</code>, Teacher → <code>email+password</code>, Student → <code>rollNo+password</code>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
