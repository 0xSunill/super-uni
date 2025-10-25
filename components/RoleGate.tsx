// components/RoleGate.tsx
"use client";
import React from "react";
import { useSession } from "next-auth/react";

type Role = "ADMIN" | "TEACHER" | "STUDENT";

export default function RoleGate({
  allowed,
  fallback = <p>Not allowed</p>,
  children,
}: {
  allowed: Role[]; 
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { status, data } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (!data?.user) return <p>Please login</p>;

  return allowed.includes(data.user.role as Role) ? <>{children}</> : <>{fallback}</>;
}
