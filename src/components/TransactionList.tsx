'use client';

import { useEffect, useState } from 'react';

type Transaction = {
  _id: string;
  description: string;
  amount: number;
  date: string;
};

interface TransactionListProps {
  refresh: boolean;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

export default function TransactionList({ refresh, onEdit, onDelete }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch('/api/transactions');
      const data: Transaction[] = await res.json();
      setTransactions(data);
      setLoading(false);
    }

    load();
  }, [refresh]);

  return (
    <div className="mt-6 space-y-2">
      {loading && <p>Loading...</p>}
      {transactions.map((tx) => (
        <div key={tx._id} className="border rounded p-2 flex justify-between items-center">
          <div>
            <p className="font-semibold">{tx.description}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(tx.date).toDateString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span>₹{tx.amount}</span>
            <button className="text-blue-600 hover:underline" onClick={() => onEdit(tx)}>
              Edit
            </button>
            <button className="text-red-600 hover:underline" onClick={() => onDelete(tx._id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
