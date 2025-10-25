"use client";

import { useState, type ComponentType } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, GraduationCap, UserCog, BadgeCheck } from "lucide-react";

// Reusable themed components (no global CSS changes)
function ThemedCard({
  isDark,
  children,
}: {
  isDark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl shadow-md p-2"
      style={{
        background: isDark ? "#1c1c1c" : "#ffffff",
        color: isDark ? "#e6eef8" : "#0f172a",
      }}
    >
      <div className="rounded-xl p-6">
        {children}
      </div>
    </div>
  );
}

function ThemedInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & { isDark?: boolean }
) {
  const { isDark, className, ...rest } = props;
  return (
    <input
      {...rest}
      className={[
        "w-full rounded-lg px-3 py-2 outline-none transition",
        isDark
          ? "bg-[#111213] text-[#e6eef8] placeholder:text-[#8a94a6] border border-[#2a2a2a] focus:ring-2 focus:ring-[#3b82f6]/50"
          : "bg-white text-[#0f172a] placeholder:text-[#64748b] border border-[#e5e7eb] focus:ring-2 focus:ring-[#3b82f6]/40",
        className || "",
      ].join(" ")}
    />
  );
}

function ThemedSelect(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & { isDark?: boolean }
) {
  const { isDark, className, ...rest } = props;
  return (
    <select
      {...rest}
      className={[
        "w-full rounded-lg px-3 py-2 outline-none transition",
        isDark
          ? "bg-[#111213] text-[#e6eef8] border border-[#2a2a2a] focus:ring-2 focus:ring-[#3b82f6]/50"
          : "bg-white text-[#0f172a] border border-[#e5e7eb] focus:ring-2 focus:ring-[#3b82f6]/40",
        className || "",
      ].join(" ")}
    />
  );
}

type Role = "ADMIN" | "STUDENT" | "TEACHER";

function RolePill({
  active,
  label,
  icon: Icon,
  onClick,
  isDark,
}: {
  active: boolean;
  label: string;
  icon: ComponentType<{ className?: string }>;
  onClick: () => void;
  isDark?: boolean;
}) {
  const inactiveBg = isDark ? "#111213" : "#ffffff";
  const inactiveText = isDark ? "#e6eef8" : "#0f172a";
  const inactiveBorder = isDark ? "#2a2a2a" : "#e5e7eb";
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-full transition border"
      style={
        active
          ? { background: "#0b0b0b", color: "#ffffff", borderColor: "#0b0b0b" }
          : { background: inactiveBg, color: inactiveText, borderColor: inactiveBorder }
      }
    >
      <Icon className="h-4 w-4" />
      <span className="font-medium">{label}</span>
    </button>
  );
}

export default function LoginPage({ isDark = false }: { isDark?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [role, setRole] = useState<Role>("STUDENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [email, setEmail] = useState(""); // for admin/teacher
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

      const redirect = searchParams.get("redirect");
      if (redirect) body.redirect = redirect;

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Login failed");

      if (data?.redirect) router.push(data.redirect);
      else throw new Error("No redirect returned by server");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isStudent = role === "STUDENT";

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: isDark ? "#0f0f10" : "#f8fafc" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl"
      >
        <ThemedCard isDark={isDark}>
          <div className="flex items-center gap-3 mb-6">
            <div
              className="p-2 rounded-2xl"
              style={{ background: "#0b0b0b", color: "#ffffff" }}
            >
              <LogIn className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-semibold">Sign in</h1>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <RolePill
              isDark={isDark}
              active={role === "STUDENT"}
              label="Student"
              icon={GraduationCap}
              onClick={() => setRole("STUDENT")}
            />
            <RolePill
              isDark={isDark}
              active={role === "TEACHER"}
              label="Teacher"
              icon={BadgeCheck}
              onClick={() => setRole("TEACHER")}
            />
            <RolePill
              isDark={isDark}
              active={role === "ADMIN"}
              label="Admin"
              icon={UserCog}
              onClick={() => setRole("ADMIN")}
            />
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {isStudent ? (
              <div>
                <label className="block text-sm font-medium mb-1">Roll number</label>
                <ThemedInput
                  isDark={isDark}
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  placeholder="e.g. MCA001"
                  required
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <ThemedInput
                  isDark={isDark}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  type="email"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <ThemedInput
                isDark={isDark}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                required
              />
            </div>

            {error && (
              <div
                className="text-sm rounded-lg p-2 border"
                style={{
                  background: isDark ? "#2a1a1a" : "#fef2f2",
                  borderColor: isDark ? "#5a2a2a" : "#fecaca",
                  color: isDark ? "#fecaca" : "#7f1d1d",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg py-2 font-medium transition"
              style={{
                background: "#0b0b0b",
                color: "#ffffff",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Signing in…" : `Sign in as ${role.toLowerCase()}`}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <p style={{ color: isDark ? "#aab4c3" : "#475569" }}>No account?</p>
            <Link href="/register" className="font-medium underline">
              Create one
            </Link>
          </div>
        </ThemedCard>
      </motion.div>
    </div>
  );
}
