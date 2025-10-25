"use client";

import { useState, type ComponentType } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, GraduationCap, UserCog, BadgeCheck } from "lucide-react";

const DEPARTMENTS = ["MCA", "MSC", "OTHERS"] as const;
const GENDERS = ["MALE", "FEMALE"] as const;

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
      <div className="rounded-xl p-6">{children}</div>
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

export default function RegisterPage({ isDark = false }: { isDark?: boolean }) {
  const router = useRouter();
  const [role, setRole] = useState<Role>("STUDENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // common
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // admin/teacher
  const [email, setEmail] = useState("");

  // student
  const [rollNo, setRollNo] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState<(typeof DEPARTMENTS)[number]>("MCA");
  const [gender, setGender] = useState<(typeof GENDERS)[number]>("MALE");
  const [year, setYear] = useState(1);
  const [phone, setPhone] = useState("");
  const [adminCode, setAdminCode] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const body: any = { role, password };
      if (role === "STUDENT") {
        Object.assign(body, {
          rollNo: rollNo.trim(),
          name: name.trim(),
          department,
          gender,
          year: Number(year),
          phone: phone.trim() || undefined,
        });
      } else if (role === "TEACHER") {
        Object.assign(body, {
          email: email.trim(),
          name: name.trim(),
          department,
          phone: phone.trim() || undefined,
        });
      } else if (role === "ADMIN") {
        Object.assign(body, { email: email.trim(), adminCode: adminCode.trim() || undefined });
      }

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Registration failed");

      if (data?.redirect) router.push(data.redirect);
      else router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: isDark ? "#0f0f10" : "#f8fafc" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <ThemedCard isDark={isDark}>
          <div className="flex items-center gap-3 mb-6">
            <div
              className="p-2 rounded-2xl"
              style={{ background: "#0b0b0b", color: "#ffffff" }}
            >
              <UserPlus className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-semibold">Create an account</h1>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <RolePill isDark={isDark} active={role === "STUDENT"} label="Student" icon={GraduationCap} onClick={() => setRole("STUDENT")} />
            <RolePill isDark={isDark} active={role === "TEACHER"} label="Teacher" icon={BadgeCheck} onClick={() => setRole("TEACHER")} />
            <RolePill isDark={isDark} active={role === "ADMIN"} label="Admin" icon={UserCog} onClick={() => setRole("ADMIN")} />
          </div>

          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {role !== "ADMIN" && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Full name</label>
                <ThemedInput isDark={isDark} value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            )}

            {role === "STUDENT" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Roll number</label>
                  <ThemedInput isDark={isDark} value={rollNo} onChange={(e) => setRollNo(e.target.value)} placeholder="MCA001" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Year</label>
                  <ThemedInput
                    isDark={isDark}
                    type="number"
                    min={1}
                    max={6}
                    value={year as any}
                    onChange={(e) => setYear(parseInt(e.target.value || "1", 10))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Department</label>
                  <ThemedSelect isDark={isDark} value={department} onChange={(e) => setDepartment(e.target.value as any)}>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </ThemedSelect>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Gender</label>
                  <ThemedSelect isDark={isDark} value={gender} onChange={(e) => setGender(e.target.value as any)}>
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </ThemedSelect>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Phone (optional)</label>
                  <ThemedInput isDark={isDark} value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </>
            )}

            {role === "TEACHER" && (
              <>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <ThemedInput isDark={isDark} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teacher@example.com" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Department</label>
                  <ThemedSelect isDark={isDark} value={department} onChange={(e) => setDepartment(e.target.value as any)}>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </ThemedSelect>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone (optional)</label>
                  <ThemedInput isDark={isDark} value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </>
            )}

            {role === "ADMIN" && (
              <>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <ThemedInput isDark={isDark} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Admin code (ask superadmin)</label>
                  <ThemedInput isDark={isDark} value={adminCode} onChange={(e) => setAdminCode(e.target.value)} placeholder="SECRET-CODE" />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <ThemedInput isDark={isDark} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm password</label>
              <ThemedInput isDark={isDark} type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" required />
            </div>

            {error && (
              <div
                className="md:col-span-2 text-sm rounded-lg p-2 border"
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
              className="md:col-span-2 w-full rounded-lg py-2 font-medium transition"
              style={{
                background: "#0b0b0b",
                color: "#ffffff",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Creating account…" : `Create ${role.toLowerCase()} account`}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <p style={{ color: isDark ? "#aab4c3" : "#475569" }}>Already have an account?</p>
            <Link href="/login" className="font-medium underline">
              Sign in
            </Link>
          </div>
        </ThemedCard>
      </motion.div>
    </div>
  );
}
