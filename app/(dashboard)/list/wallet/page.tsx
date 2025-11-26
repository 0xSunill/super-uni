import React from "react";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import WalletCard from "@/components/WalletCard";
// import WalletCard from "@/components/WalletCard";

export default async function WalletPage() {
  // 1. Get Session
  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get("session")?.value;
  const role = cookieStore.get("role")?.value;

  if (!sessionUserId) {
    redirect("/login");
  }

  // 2. Fetch User & Wallet Data based on Role
  let walletAddress = "";
  let studentId = "";
  let studentName = "";

  if (role === "STUDENT") {
    const user = await prisma.user.findUnique({
      where: { id: sessionUserId },
      include: {
        student: {
          include: {
            wallet: true, // Fetch the wallet relation
          },
        },
      },
    });

    if (user?.student) {
      studentId = user.student.id;
      studentName = user.student.name;
      walletAddress = user.student.wallet?.address || "";
    }
  } else if (role === "ADMIN") {
      // For Admin, maybe show the Treasury (optional)
      // For now, let's just handle students or show a message
      return (
          <div className="p-6">
              <h1 className="text-2xl font-bold">University Treasury</h1>
              <p className="text-gray-500">Admin wallet management coming soon...</p>
          </div>
      );
  }

  // 3. Handle case where wallet doesn't exist
  if (!walletAddress) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-[50vh]">
        <h1 className="text-xl font-bold text-red-500">No Wallet Found</h1>
        <p className="text-gray-600 mt-2">
          Your account does not have an active Cloud Wallet. 
          Please contact the administrator.
        </p>
      </div>
    );
  }

  // 4. Render the Client Component
  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">My Cloud Wallet</h1>
        <p className="text-slate-500 text-sm">Manage your funds and university payments</p>
      </div>
      
      <WalletCard
        address={walletAddress} 
        studentId={studentId} 
        studentName={studentName} 
      />
    </div>
  );
}