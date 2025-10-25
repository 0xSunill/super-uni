import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      role: "ADMIN" | "TEACHER" | "STUDENT";
      studentId?: string | null;
      teacherId?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    role?: "ADMIN" | "TEACHER" | "STUDENT";
    studentId?: string | null;
    teacherId?: string | null;
  }
}
