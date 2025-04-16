// components/MonthlyBarChart.tsx
'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useEffect, useState } from 'react';

// 👇 This should match your backend transaction structure
type Transaction = {
  _id: string;
  title: string;
  amount: number;
  date: string;
};

type ChartItem = {
  name: string;
  value: number;
};

// 🛠️ Properly typed grouping function
function groupByMonth(transactions: Transaction[]): ChartItem[] {
  const grouped: Record<string, number> = {};

  transactions.forEach((tx) => {
    const month = new Date(tx.date).toLocaleString('default', {
      month: 'short',
      year: 'numeric',
    });
    grouped[month] = (grouped[month] || 0) + tx.amount;
  });

  return Object.entries(grouped).map(([name, value]) => ({ name, value }));
}

export default function MonthlyBarChart() {
  const [data, setData] = useState<ChartItem[]>([]);

  useEffect(() => {
    async function fetchTxs() {
      const res = await fetch('/api/transactions');
      const txs: Transaction[] = await res.json();
      setData(groupByMonth(txs));
    }

    fetchTxs();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#0f172a" />
      </BarChart>
    </ResponsiveContainer>
  );
}
