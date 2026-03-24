import React, { useState } from "react";
import { motion } from "motion/react";
import { Wallet, ShieldCheck, Zap } from "lucide-react";

interface LoginProps {
  onLogin: (address: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      if (res.ok) {
        onLogin(address);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-[#05070A] via-[#0A0E14] to-[#05070A]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 glass rounded-2xl glow-cyan"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 mb-4 rounded-full bg-cyan/10 animate-pulse-cyan">
            <Zap className="w-12 h-12 text-cyan" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter text-white">
            QUBISTAKE <span className="text-cyan">PRO</span>
          </h1>
          <p className="text-sm text-white/50">Next-Gen Staking Protocol</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-widest uppercase text-white/40">
              Public Wallet Address
            </label>
            <div className="relative">
              <Wallet className="absolute w-5 h-5 -translate-y-1/2 left-4 top-1/2 text-white/30" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. QUBIC-XXXX-XXXX"
                className="w-full py-4 pl-12 pr-4 text-sm transition-all border outline-none bg-white/5 border-white/10 rounded-xl focus:border-cyan/50 focus:bg-white/10"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !address}
            className="w-full py-4 font-bold tracking-widest uppercase transition-all rounded-xl bg-cyan text-black hover:bg-cyan/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
        </form>

        <div className="flex items-center justify-center gap-4 mt-8 text-xs text-white/30">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure Access</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <span>V1.0.4</span>
        </div>
      </motion.div>
    </div>
  );
}
