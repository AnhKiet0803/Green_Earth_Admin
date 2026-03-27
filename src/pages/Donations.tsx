import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, DollarSign, ArrowUpRight, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';

const API_URL = "http://localhost:8080/api/green_earth/donation";

export default function Donations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        const result = await response.json();
        setDonations(result.data || []);
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  const totalAmount = donations.reduce((sum, item) => sum + (item.amount || 0), 0);
  const count = donations.length;
  const largestDonation = donations.length > 0 
    ? Math.max(...donations.map(d => d.amount || 0)) 
    : 0;

  const filteredDonations = donations.filter(d => 
    d.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.campaignName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToExcel = () => {
    const excelData = filteredDonations.map(d => ({
      "Donor Name": d.donorName || "Anonymous",
      "Campaign": d.campaignName || "General Donation",
      "Amount ($)": d.amount,
      "Payment Method": d.paymentMethod || "N/A",
      "Date": d.donationDate ? new Date(d.donationDate).toLocaleDateString() : "N/A"
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Donations");
    
    const fileName = `GreenEarth_Donations_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Donation Management</h1>
          <p className="text-slate-500">Track contributions from the community and partners.</p>
        </div>
        <button 
          onClick={exportToExcel}
          disabled={filteredDonations.length === 0}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Export to Excel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-600 p-6 rounded-2xl text-white shadow-lg shadow-emerald-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg"><DollarSign className="w-6 h-6" /></div>
            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full uppercase">Lifetime</span>
          </div>
          <p className="text-emerald-100 text-sm font-medium">Total Amount</p>
          <h3 className="text-3xl font-bold mt-1">${totalAmount.toLocaleString()}</h3>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><User className="w-6 h-6" /></div>
            <span className="text-xs font-bold text-emerald-600">Active</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Number of Donations</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-1">{count}</h3>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><ArrowUpRight className="w-6 h-6" /></div>
          </div>
          <p className="text-slate-500 text-sm font-medium">Largest Donation</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-1">${largestDonation.toLocaleString()}</h3>
        </motion.div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input  type="text"  placeholder="Search by donor or campaign..."  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600" />
                  </td>
                </tr>
              ) : filteredDonations.length > 0 ? (
                <AnimatePresence>
                  {filteredDonations.map((donation, idx) => (
                    <motion.tr key={donation.id || idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-900">{donation.donorName || "Anonymous"}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {donation.campaignName || "General Donation"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-emerald-600">
                          ${Number(donation.amount).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold uppercase px-2 py-1 bg-slate-100 text-slate-500 rounded-md">
                          {donation.paymentMethod || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {donation.donationDate ? new Date(donation.donationDate).toLocaleDateString() : 'N/A'}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-400 text-sm">No donation records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}