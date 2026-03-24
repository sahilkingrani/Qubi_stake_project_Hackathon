import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";

interface HistoryItem {
  id: number;
  type: string;
  amount: number;
  timestamp: number;
  status: string;
}

export default function HistoryTable({ address }: { address: string }) {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/user-history/${address}`);
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, [address]);

  return (
    <div className="overflow-hidden glass rounded-2xl">
      <div className="p-6 border-b border-white/5">
        <h3 className="flex items-center gap-2 text-lg font-bold">
          <Clock className="w-5 h-5 text-cyan" />
          Transaction History
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-bold tracking-widest uppercase text-white/30 border-b border-white/5">
              <th className="px-6 py-4">Action Type</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {history.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-white/20">
                  No transactions recorded yet.
                </td>
              </tr>
            ) : (
              history.map((item) => (
                <motion.tr 
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="transition-all hover:bg-white/5 group"
                >
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold ${
                      item.type === 'Stake' ? 'text-emerald' : 
                      item.type === 'Panic Unstake' ? 'text-red-400' : 'text-cyan'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono font-bold">{item.amount.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-white/40">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {item.status === 'Completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span className="text-xs font-medium text-white/60">{item.status}</span>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
