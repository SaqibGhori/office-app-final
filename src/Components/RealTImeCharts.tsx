import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface DataPoint {
  time: string;
  value: number;
}

export default function RealTimeCharts() {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newPoint: DataPoint = {
        time: now.toLocaleTimeString(),
        value: Math.round(Math.random() * 100),
      };
      setData(prev => [...prev.slice(-49), newPoint]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, bottom: 5, left: 0 }}>
        <CartesianGrid stroke="#333" strokeDasharray="5 5" />
        <XAxis dataKey="time" tick={{ fill: '#aaa' }} />
        <YAxis domain={[0, 'auto']} tick={{ fill: '#aaa' }} />
        <Tooltip contentStyle={{ backgroundColor: '#222' }} />
        <Legend verticalAlign="top" align="center" />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#00f"
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}