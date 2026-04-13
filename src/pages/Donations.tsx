<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Search, Download, DollarSign, ArrowUpRight, User, Loader2, Calendar, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; 
=======
import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Download, DollarSign, ArrowUpRight, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
import * as XLSX from 'xlsx';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { unwrapListData } from '../utils/unwrapListData';

const API_URL = "http://localhost:8080/api/green_earth/donation";

export default function Donations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerm, 350);

  const fetchDonations = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: '0', size: '500' });
      if (debouncedSearch.trim()) params.set('q', debouncedSearch.trim());
      const response = await fetch(`${API_URL}?${params}`);
      const result = await response.json();
      setDonations(unwrapListData(result.data));
    } catch (error) {
      console.error("Error fetching donations:", error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  // 1. THIẾT LẬP MẶC ĐỊNH LỌC THEO NĂM HIỆN TẠI
  const [dateFilter, setDateFilter] = useState(() => {
    const now = new Date();
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
    const lastDayOfYear = new Date(now.getFullYear(), 11, 31);
    
    const formatDate = (date: Date) => {
      const offset = date.getTimezoneOffset();
      const localDate = new Date(date.getTime() - (offset * 60 * 1000));
      return localDate.toISOString().split('T')[0];
    };
    return { start: formatDate(firstDayOfYear), end: formatDate(lastDayOfYear) };
  });

  useEffect(() => {
<<<<<<< HEAD
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        const result = await response.json();
        
        let rawData = [];
        if (Array.isArray(result)) {
          rawData = result;
        } else if (result && Array.isArray(result.data)) {
          rawData = result.data;
        }

        const mappedData = rawData.map(item => ({
          id: item.id,
          donorName: item.donorName || "Anonymous", 
          campaignName: item.campaignName || "General",
          amount: Number(item.amount) || 0,
          paymentMethod: item.paymentMethod || "N/A",
          donationDate: item.donationDate || item.createdAt
        }));

        setDonations(mappedData);
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false);
      }
    };
=======
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
    fetchDonations();
  }, [fetchDonations]);

<<<<<<< HEAD
  // 2. LOGIC LỌC TỔNG HỢP: Tên/Campaign + Khoảng ngày
  const filteredDonations = donations.filter(d => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = (
      d.donorName?.toLowerCase().includes(search) || 
      d.campaignName?.toLowerCase().includes(search)
    );

    const dDate = new Date(d.donationDate?.toString().replace(" ", "T"));
    const startDate = new Date(dateFilter.start);
    const endDate = new Date(dateFilter.end);
    endDate.setHours(23, 59, 59, 999);

    const matchesDate = dDate >= startDate && dDate <= endDate;

    return matchesSearch && matchesDate;
  });

  // Tính toán số liệu dựa trên danh sách ĐÃ LỌC
  const totalAmount = filteredDonations.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const count = filteredDonations.length;
  const largestDonation = filteredDonations.length > 0 
    ? Math.max(...filteredDonations.map(d => Number(d.amount) || 0)) 
=======
  const totalAmount = donations.reduce((sum, item) => sum + (item.amount || 0), 0);
  const count = donations.length;
  const largestDonation = donations.length > 0 
    ? Math.max(...donations.map(d => d.amount || 0)) 
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
    : 0;

  const exportToExcel = () => {
    const excelData = donations.map(d => ({
      "Donor Name": d.donorName || "Anonymous",
      "Campaign": d.campaignName || "General Donation",
      "Amount ($)": d.amount,
<<<<<<< HEAD
      "Payment Method": d.paymentMethod,
      "Date": d.donationDate ? new Date(d.donationDate).toLocaleDateString('en-GB') : "N/A"
=======
      "Payment Method": d.paymentMethod || "N/A",
      "Date": d.donationDate ? new Date(d.donationDate).toLocaleDateString() : "N/A"
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Donations");
<<<<<<< HEAD
    XLSX.writeFile(workbook, `Donations_Report_${dateFilter.start}_to_${dateFilter.end}.xlsx`);
=======
    
    const fileName = `GreenEarth_Donations_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
  };
  return (
    <div className="space-y-6 text-left">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">Donation Management</h1>
          <p className="text-slate-500 text-sm">
            Showing records from {new Date(dateFilter.start).toLocaleDateString('vi-VN')} to {new Date(dateFilter.end).toLocaleDateString('vi-VN')}
          </p>
        </div>
        <button 
          onClick={exportToExcel}
<<<<<<< HEAD
          disabled={filteredDonations.length === 0}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
=======
          disabled={donations.length === 0}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
        >
          <Download className="w-4 h-4 text-emerald-600" />
          Export Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
<<<<<<< HEAD
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-600 p-6 rounded-[2rem] text-white shadow-lg shadow-emerald-100 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-white/20 rounded-lg"><DollarSign className="w-6 h-6" /></div>
              <span className="text-[10px] font-black bg-white/20 px-2 py-1 rounded-full uppercase tracking-widest">Period Total</span>
            </div>
            <p className="text-emerald-100 text-xs font-bold uppercase tracking-tighter">Total Collected</p>
            <h3 className="text-3xl font-black mt-1">${totalAmount.toLocaleString()}</h3>
=======
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-600 p-6 rounded-2xl text-white shadow-lg shadow-emerald-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg"><DollarSign className="w-6 h-6" /></div>
            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full uppercase">Lifetime</span>
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10 text-white"><DollarSign size={120} /></div>
        </motion.div>

<<<<<<< HEAD
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
=======
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
        >
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><User className="w-6 h-6" /></div>
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Quantity</span>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter">Number of Donations</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">{count}</h3>
        </motion.div>

<<<<<<< HEAD
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
=======
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
        >
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><ArrowUpRight className="w-6 h-6" /></div>
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Record</span>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter">Largest Donation</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">${largestDonation.toLocaleString()}</h3>
        </motion.div>
      </div>

<<<<<<< HEAD
      {/* Filter Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group focus-within:border-emerald-500 transition-all">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500" />
          <input 
            type="text" 
            placeholder="Search by donor or campaign name..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 text-sm outline-none bg-transparent"
          />
        </div>

        <div className="lg:col-span-2 flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 border-r pr-3">
            <Filter className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Period</span>
          </div>
          <div className="flex items-center gap-2 flex-1 justify-around">
            <input 
              type="date" 
              className="text-xs font-bold text-slate-600 outline-none cursor-pointer hover:text-emerald-600 transition-colors"
              value={dateFilter.start}
              onChange={(e) => setDateFilter({...dateFilter, start: e.target.value})}
            />
            <span className="text-slate-300">→</span>
            <input 
              type="date" 
              className="text-xs font-bold text-slate-600 outline-none cursor-pointer hover:text-emerald-600 transition-colors"
              value={dateFilter.end}
              onChange={(e) => setDateFilter({...dateFilter, end: e.target.value})}
=======
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input  type="text"  placeholder="Search by donor or campaign..."  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black border-b border-slate-100">
                <th className="px-8 py-5">Donor Information</th>
                <th className="px-8 py-5">Target Campaign</th>
                <th className="px-8 py-5 text-center">Amount</th>
                <th className="px-8 py-5 text-center">Method</th>
                <th className="px-8 py-5 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
<<<<<<< HEAD
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto text-emerald-600 opacity-20" />
                  </td>
                </tr>
              ) : filteredDonations.length > 0 ? (
                <AnimatePresence mode="popLayout">
                  {[...filteredDonations].reverse().map((donation, idx) => (
                    <motion.tr 
                      key={donation.id || idx} 
                      layout
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-50/80 transition-all group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                                {donation.donorName.substring(0, 1)}
                            </div>
                            <span className="text-sm font-bold text-slate-700">{donation.donorName}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-500 font-medium italic">
                        {donation.campaignName}
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-black">
                          ${Number(donation.amount).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="text-[10px] font-black uppercase px-2 py-1 bg-slate-100 text-slate-500 rounded-md tracking-widest border border-slate-200">
                          {donation.paymentMethod}
=======
                  <td colSpan="5" className="px-6 py-10 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600" />
                  </td>
                </tr>
              ) : donations.length > 0 ? (
                <AnimatePresence>
                  {donations.map((donation, idx) => (
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
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 text-sm text-slate-400 font-medium">
                            <Calendar className="w-3.5 h-3.5 opacity-40" />
                            {donation.donationDate ? new Date(donation.donationDate.toString().replace(" ", "T")).toLocaleDateString('en-GB') : 'N/A'}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              ) : (
                <tr>
<<<<<<< HEAD
                  <td colSpan={5} className="px-6 py-32 text-center text-slate-300 italic flex flex-col items-center gap-3">
                    <Search className="w-10 h-10 opacity-10" />
                    <p className="font-serif">No donation records found for this period.</p>
                  </td>
=======
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-400 text-sm">No donation records found.</td>
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}