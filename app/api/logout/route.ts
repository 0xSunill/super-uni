import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  // Delete cookies
  res.cookies.set("session", "", { path: "/", expires: new Date(0) });
  res.cookies.set("role", "", { path: "/", expires: new Date(0) });
  res.cookies.set("studentRollNo", "", { path: "/", expires: new Date(0) });
  res.cookies.set("teacherId", "", { path: "/", expires: new Date(0) });

  return res;
}
