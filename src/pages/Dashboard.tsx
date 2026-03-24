import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingUp, 
  Wallet, 
  History, 
  LogOut, 
  Zap, 
  Shield, 
  AlertTriangle,
  ArrowUpCircle,
  ArrowDownCircle
} from "lucide-react";
import HistoryTable from "../components/HistoryTable";
import YieldChart from "../components/YieldChart";

interface UserStats {
  address: string;
  balance: number;
  staked_amount: number;
  multiplier: number;
  rank: string;
  totalElapsed: number;
}

interface DashboardProps {
  address: string;
  onLogout: () => void;
}

export default function Dashboard({ address, onLogout }: DashboardProps) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "history">("overview");
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`/api/stats/${address}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [address]);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 1000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const handleStake = async () => {
    if (!stakeAmount || isNaN(Number(stakeAmount))) return;
    setLoading(true);
    try {
      await fetch("/api/stake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, amount: Number(stakeAmount) }),
      });
      setStakeAmount("");
      fetchStats();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnstake = async (panic = false) => {
    setLoading(true);
    try {
      const amount = panic ? stats?.staked_amount : Number(stakeAmount);
      if (!amount) return;
      
      await fetch("/api/unstake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, amount, panic }),
      });
      setStakeAmount("");
      fetchStats();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!stats) return <div className="flex items-center justify-center min-h-screen">Loading Protocol...</div>;

  return (
    <div className="max-w-6xl p-4 mx-auto md:p-8">
      {/* Header */}
      <header className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter text-white md:text-3xl">
            DASHBOARD <span className="text-cyan">CORE</span>
          </h1>
          <p className="text-sm text-white/40 font-mono truncate max-w-[200px] md:max-w-none">
            {address}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 glass rounded-xl border-emerald/20">
            <span className="text-xs font-bold tracking-widest uppercase text-emerald">
              Network Online
            </span>
          </div>
          <button 
            onClick={onLogout}
            className="p-3 transition-all rounded-xl glass hover:bg-white/10 text-white/60 hover:text-white"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
        <StatsCard 
          label="Available Balance" 
          value={stats.balance.toFixed(2)} 
          icon={<Wallet className="text-cyan" />} 
          subValue="Units"
        />
        <StatsCard 
          label="Total Staked" 
          value={stats.staked_amount.toFixed(2)} 
          icon={<Zap className="text-emerald" />} 
          subValue="Units"
        />
        <StatsCard 
          label="Loyalty Multiplier" 
          value={`${stats.multiplier.toFixed(1)}x`} 
          icon={<TrendingUp className="text-cyan" />} 
          subValue={stats.rank}
          highlight
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Actions & Chart */}
        <div className="space-y-8 lg:col-span-8">
          {/* Tabs */}
          <div className="flex gap-2 p-1 w-fit glass rounded-xl">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-cyan text-black' : 'text-white/60 hover:text-white'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab("history")}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-cyan text-black' : 'text-white/60 hover:text-white'}`}
            >
              History
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "overview" ? (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                {/* Chart */}
                <div className="p-6 glass rounded-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold tracking-tight">Live Yield Analytics</h3>
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <div className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
                      Real-time Feed
                    </div>
                  </div>
                  <YieldChart balance={stats.balance + stats.staked_amount} />
                </div>

                {/* Rank Progress */}
                <div className="p-6 glass rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold tracking-widest uppercase text-white/40">Loyalty Status</h3>
                    <span className="text-xs font-mono text-cyan">{Math.floor(stats.totalElapsed / 60)}m {stats.totalElapsed % 60}s Active</span>
                  </div>
                  <div className="relative h-2 mb-4 overflow-hidden rounded-full bg-white/5">
                    <motion.div 
                      className="absolute top-0 left-0 h-full bg-cyan"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((stats.totalElapsed / 300) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase text-white/20">
                    <span>Recruit</span>
                    <span className={stats.totalElapsed >= 120 ? "text-cyan" : ""}>Guardian (2m)</span>
                    <span className={stats.totalElapsed >= 300 ? "text-cyan" : ""}>Overlord (5m)</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="history"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <HistoryTable address={address} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Staking Actions */}
        <div className="lg:col-span-4">
          <div className="sticky top-8 space-y-6">
            <div className="p-6 glass rounded-2xl border-cyan/10">
              <h3 className="flex items-center gap-2 mb-6 text-lg font-bold">
                <Shield className="w-5 h-5 text-cyan" />
                Staking Terminal
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-white/40">
                    <span>Amount</span>
                    <span>Max: {stats.balance.toFixed(2)}</span>
                  </div>
                  <input 
                    type="number" 
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full p-4 text-lg font-mono border outline-none bg-white/5 border-white/10 rounded-xl focus:border-cyan/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleStake}
                    disabled={loading || !stakeAmount}
                    className="flex items-center justify-center gap-2 py-4 font-bold transition-all rounded-xl bg-cyan text-black hover:bg-cyan/80 disabled:opacity-50"
                  >
                    <ArrowUpCircle className="w-5 h-5" />
                    Stake
                  </button>
                  <button 
                    onClick={() => handleUnstake(false)}
                    disabled={loading || !stakeAmount}
                    className="flex items-center justify-center gap-2 py-4 font-bold transition-all border rounded-xl border-white/10 hover:bg-white/5 disabled:opacity-50"
                  >
                    <ArrowDownCircle className="w-5 h-5" />
                    Unstake
                  </button>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <button 
                    onClick={() => handleUnstake(true)}
                    disabled={loading || stats.staked_amount <= 0}
                    className="flex items-center justify-center w-full gap-2 py-4 font-bold text-red-400 transition-all border border-red-500/20 rounded-xl bg-red-500/5 hover:bg-red-500/10 disabled:opacity-50"
                  >
                    <AlertTriangle className="w-5 h-5" />
                    Panic Button (5% Tax)
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 glass rounded-2xl bg-emerald/5 border-emerald/10">
              <h4 className="flex items-center gap-2 mb-2 text-sm font-bold text-emerald">
                <TrendingUp className="w-4 h-4" />
                Reward Engine
              </h4>
              <p className="text-xs leading-relaxed text-white/60">
                Earning <span className="text-white font-mono">0.02 units/sec</span>. 
                Multipliers activate at 2m (1.5x) and 5m (2.0x) of continuous staking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ label, value, icon, subValue, highlight }: any) {
  return (
    <div className={`p-6 glass rounded-2xl transition-all hover:translate-y-[-2px] ${highlight ? 'border-cyan/20 bg-cyan/5' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold tracking-widest uppercase text-white/40">{label}</span>
        <div className="p-2 rounded-lg bg-white/5">{icon}</div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tighter">{value}</span>
        <span className="text-xs font-bold text-white/20 uppercase">{subValue}</span>
      </div>
    </div>
  );
}
