import React, { useState } from 'react';
import { Search, Filter, Download, DollarSign, Calendar, ArrowUpRight, User, MoreVertical } from 'lucide-react';
import { motion } from 'motion/react';

const initialDonations = [
  { id: '1', donorName: 'John Doe', amount: 500, date: '2026-03-22', campaign: 'Green Cúc Phương Forest', method: 'Bank Transfer' },
  { id: '2', donorName: 'Jane Smith', amount: 1000, date: '2026-03-21', campaign: 'Clean Đà Nẵng Beach', method: 'Credit Card' },
  { id: '3', donorName: 'Mike Johnson', amount: 200, date: '2026-03-20', campaign: 'Green Cúc Phương Forest', method: 'E-wallet' },
  { id: '4', donorName: 'Sarah Williams', amount: 5000, date: '2026-03-19', campaign: 'Clean Energy for Schools', method: 'Bank Transfer' },
  { id: '5', donorName: 'Robert Brown', amount: 300, date: '2026-03-18', campaign: 'Clean Đà Nẵng Beach', method: 'Bank Transfer' },
];

export default function Donations() {
  const [donations] = useState(initialDonations);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Donation Management</h1>
          <p className="text-slate-500">Track contributions from the community and partners.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          <Download className="w-4 h-4" />
          Export to Excel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-600 p-6 rounded-2xl text-white shadow-lg shadow-emerald-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full uppercase">This Month</span>
          </div>
          <p className="text-emerald-100 text-sm font-medium">Total Donations (March)</p>
          <h3 className="text-3xl font-bold mt-1">$12,450.00</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <User className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-600">+15% vs last month</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Number of Donations</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-1">156</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-500">Avg: $80</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Largest Donation</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-1">$5,000.00</h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or campaign..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-100">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-100">
              <Calendar className="w-4 h-4" />
              Time
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Donor</th>
                <th className="px-6 py-4">Campaign</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {donations.map((donation) => (
                <tr key={donation.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-900">{donation.donorName}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{donation.campaign}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-emerald-600">${donation.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
