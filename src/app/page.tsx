'use client';

import { useEffect, useState } from 'react';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import MonthlyBarChart from '@/components/MonthlyBarChart';
import CategoryPieChart from '../components/ui/CategoryPieChart';
import { Transaction } from '@/types/Transaction';




export default function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [editData, setEditData] = useState<Transaction | null>(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/transactions');
      const data = await res.json();
      setTransactions(data);
    }
    fetchData();
  }, [refresh]);

  function handleRefresh() {
    setRefresh(!refresh);
    setEditData(null);
  }

  function handleEdit(tx: Transaction) {
    setEditData(tx);
  }

  async function handleDelete(id: string) {
    const confirmDelete = confirm('Are you sure you want to delete this transaction?');
    if (!confirmDelete) return;

    await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
    handleRefresh();
  }

  const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  const categoryData = transactions.reduce((acc: any[], tx) => {
    const existing = acc.find((c) => c.category === tx.category);
    if (existing) {
      existing.amount += tx.amount;
    } else {
      acc.push({ category: tx.category, amount: tx.amount });
    }
    return acc;
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Personal Finance Visualizer</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-100 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Total Expenses</h2>
          <p className="text-xl font-bold text-red-600">₹{totalAmount}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Transactions</h2>
          <p className="text-xl font-bold">{transactions.length}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Categories</h2>
          <p className="text-xl font-bold">{categoryData.length}</p>
        </div>
      </div>

      <TransactionForm
        onAdd={handleRefresh}
        initialData={editData}
        onCancelEdit={() => setEditData(null)}
      />

      <TransactionList
        refresh={refresh}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <MonthlyBarChart />

      {/* Category-wise Pie Chart */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2">Category Breakdown</h2>
        <CategoryPieChart data={categoryData} />
      </div>
    </div>
  );
}
