import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  time: string;
  balance: number;
}

export default function YieldChart({ balance }: { balance: number }) {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    setData(prev => {
      const newData = [...prev, { time: timeStr, balance }];
      if (newData.length > 20) return newData.slice(1);
      return newData;
    });
  }, [balance]);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#ffffff40" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
          />
          <YAxis 
            stroke="#ffffff40" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            domain={['auto', 'auto']}
            tickFormatter={(val) => val.toFixed(0)}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0A0E14', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            itemStyle={{ color: '#38BDF8' }}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#38BDF8"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorBalance)"
            animationDuration={500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
