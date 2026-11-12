import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Search, 
  Trash2, 
  Calendar, 
  PieChart, 
  X,
  CreditCard,
  DollarSign
} from 'lucide-react';
import { addItem, deleteItem } from '../firebase/firestoreService';
import { useAuth } from '../firebase/auth';

const CATEGORY_COLORS = {
  Technology: 'from-blue-500 to-indigo-500',
  Health: 'from-emerald-500 to-teal-500',
  Living: 'from-amber-500 to-orange-500',
  Education: 'from-purple-500 to-pink-500',
  Investments: 'from-cyan-500 to-blue-600',
  Income: 'from-emerald-400 to-green-600',
  Other: 'from-slate-500 to-slate-600'
};

export default function FinanceView({ expenses = [] }) {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'expense', 'income'

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Technology');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Calculations
  const incomeTotal = expenses.filter(e => e.type === 'income').reduce((sum, e) => sum + (e.amount || 0), 0);
  const expenseTotal = expenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + (e.amount || 0), 0);
  const netBalance = incomeTotal - expenseTotal;
  const savingsRate = incomeTotal > 0 ? Math.round(((incomeTotal - expenseTotal) / incomeTotal) * 100) : 0;

  // Category breakdown for expenses
  const categoryTotals = expenses.filter(e => e.type === 'expense').reduce((acc, curr) => {
    const cat = curr.category || 'Other';
    acc[cat] = (acc[cat] || 0) + (curr.amount || 0);
    return acc;
  }, {});

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!user || !desc.trim() || !amount) return;

    await addItem(user.uid, 'expenses', {
      description: desc.trim(),
      amount: parseFloat(amount) || 0,
      type,
      category,
      date
    });

    setDesc('');
    setAmount('');
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (!user) return;
    if (confirm('Delete this transaction?')) {
      await deleteItem(user.uid, 'expenses', id);
    }
  };

  const filteredTransactions = expenses.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(search.toLowerCase()) || 
                          (item.category || '').toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-400" />
            <span>Personal Finance & Cash Flow</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track income sources, optimize recurring burn rate, and monitor savings velocity.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition transform active:scale-95 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Transaction</span>
        </button>
      </div>

      {/* 4 Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Net Surplus / Balance</span>
          <div className="mt-2 text-2xl font-bold text-white">
            ${netBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className={`text-[11px] font-semibold mt-1 inline-flex items-center ${netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {netBalance >= 0 ? 'Positive Cash Flow' : 'Deficit'}
          </span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Total Inflow (Income)</span>
          <div className="mt-2 text-2xl font-bold text-emerald-400">
            +${incomeTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">Active revenue & retainers</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Total Outflow (Expenses)</span>
          <div className="mt-2 text-2xl font-bold text-rose-400">
            -${expenseTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">Subscriptions & living costs</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Savings Rate</span>
          <div className="mt-2 text-2xl font-bold text-indigo-400">
            {savingsRate}%
          </div>
          <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-500 h-full rounded-full transition-all"
              style={{ width: `${Math.max(0, Math.min(100, savingsRate))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Expense Category Breakdown & Visual Progress */}
      {expenseTotal > 0 && (
        <div className="glass-card p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-400" />
              <span>Expenditure Breakdown</span>
            </h3>
            <span className="text-xs text-slate-400">Total: ${expenseTotal.toFixed(2)}</span>
          </div>

          <div className="space-y-3">
            {Object.entries(categoryTotals).map(([cat, val]) => {
              const pct = Math.round((val / expenseTotal) * 100);
              const gradient = CATEGORY_COLORS[cat] || 'from-indigo-500 to-purple-500';
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">{cat}</span>
                    <span className="font-mono text-slate-400">${val.toFixed(2)} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-850">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Transaction Ledger Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        {/* Search & Filter Header */}
        <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/60">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Filter transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${typeFilter === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${typeFilter === 'income' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Income
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${typeFilter === 'expense' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Expense
            </button>
          </div>
        </div>

        {/* Ledger Entries */}
        <div className="divide-y divide-slate-850">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No transactions recorded.</div>
          ) : (
            filteredTransactions.map((tx) => (
              <div 
                key={tx.id}
                className="p-4 flex items-center justify-between hover:bg-slate-900/40 transition group"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                    tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{tx.description}</p>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-[10px] text-slate-400">{tx.category}</span>
                      <span className="text-[10px] text-slate-500 font-mono">• {tx.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className={`text-xs font-mono font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {tx.type === 'income' ? '+' : '-'}${Math.abs(tx.amount || 0).toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleDelete(tx.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 rounded transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Log Financial Entry</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`py-1.5 text-xs font-bold rounded-lg ${type === 'expense' ? 'bg-rose-500 text-white' : 'text-slate-400'}`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`py-1.5 text-xs font-bold rounded-lg ${type === 'income' ? 'bg-emerald-500 text-white' : 'text-slate-400'}`}
                >
                  Income
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Server hosting, Book purchase..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Health">Health</option>
                    <option value="Living">Living & Food</option>
                    <option value="Education">Education</option>
                    <option value="Investments">Investments</option>
                    <option value="Income">Income / Retainer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30"
                >
                  Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
