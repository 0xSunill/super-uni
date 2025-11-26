"use client";

import React, { useEffect, useState } from "react";
import { Connection, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
import { Copy, RefreshCw, ArrowUpRight, Coins, Wallet as WalletIcon, Check } from "lucide-react";

type WalletProps = {
  address: string; // The public key from your DB
  studentId: string;
  studentName: string;
};

export default function WalletCard({ address, studentId, studentName }: WalletProps) {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [airdropping, setAirdropping] = useState(false);
  const [copied, setCopied] = useState(false);

  // Initialize Connection (Use Devnet for testing)
  // You can switch 'devnet' to 'mainnet-beta' later
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // Fetch Balance Function
  const fetchBalance = async () => {
    try {
      setLoading(true);
      const publicKey = new PublicKey(address);
      const bal = await connection.getBalance(publicKey);
      setBalance(bal / LAMPORTS_PER_SOL);
    } catch (err) {
      console.error("Error fetching balance:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial Fetch
  useEffect(() => {
    if (address) fetchBalance();
  }, [address]);

  // Handle Copy Address
  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle Airdrop (Test Money)
  const handleAirdrop = async () => {
    try {
      setAirdropping(true);
      const publicKey = new PublicKey(address);
      const signature = await connection.requestAirdrop(publicKey, 1 * LAMPORTS_PER_SOL);
      await connection.confirmTransaction(signature);
      alert("Airdrop Successful! 1 SOL added.");
      fetchBalance(); // Refresh balance
    } catch (err) {
      console.error("Airdrop failed:", err);
      alert("Airdrop failed. You might have requested too many times. Try again later.");
    } finally {
      setAirdropping(false);
    }
  };

  // Handle Payment (Calls your API)
  const handlePayFee = async () => {
    const amount = 0.1;
    if (!confirm(`Confirm payment of ${amount} SOL to the University?`)) return;

    try {
      const res = await fetch("/api/wallet/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, amount }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Payment failed");

      alert(`Payment Successful!\nSignature: ${data.signature?.slice(0, 15)}...`);
      fetchBalance(); // Refresh balance
    } catch (err: any) {
      alert("Payment Error: " + err.message);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Main Wallet Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20"></div>

        {/* Header */}
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div>
            <h2 className="text-slate-400 text-sm font-medium mb-1">Total Balance</h2>
            <div className="text-4xl font-bold flex items-center gap-2">
              {balance !== null ? balance.toFixed(4) : "---"} 
              <span className="text-lg text-purple-400">SOL</span>
            </div>
          </div>
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
            <WalletIcon className="w-6 h-6 text-purple-300" />
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-black/20 rounded-xl p-3 mb-6 flex items-center justify-between border border-white/5 relative z-10">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 mb-1">Wallet Address</span>
            <span className="font-mono text-sm text-slate-200 break-all">{address}</span>
          </div>
          <button 
            onClick={handleCopy}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors ml-2"
            title="Copy Address"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
          </button>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4 relative z-10">
          <button 
            onClick={handlePayFee}
            disabled={balance === null || balance < 0.1}
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-all"
          >
            <ArrowUpRight className="w-5 h-5" />
            Pay Fee (0.1)
          </button>

          <button 
             onClick={handleAirdrop}
             disabled={airdropping}
             className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-all backdrop-blur-sm"
          >
            {airdropping ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Coins className="w-5 h-5 text-yellow-400" />
            )}
            {airdropping ? "Requesting..." : "Add Funds (Dev)"}
          </button>
        </div>
      </div>

      {/* Recent Activity Placeholder (Visual only for now) */}
      <div className="bg-white dark:bg-[#1c1c1c] rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-none">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-slate-800 dark:text-white">Quick Actions</h3>
          <button onClick={fetchBalance} className="text-slate-400 hover:text-purple-600 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
               <ArrowUpRight className="w-5 h-5" />
             </div>
             <div>
               <div className="font-medium text-slate-900 dark:text-white">University Tuition</div>
               <div className="text-xs text-slate-500">Instant Payment</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}