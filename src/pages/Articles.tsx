import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Calendar, Tag, Loader2, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const API_URL = "http://localhost:8081/api/green_earth/article";

interface Article {
  id: number;
  title: string;
  content: string;
  image: string;
  authorId: number;
  categoryId: number;
  categoryName?: string;
  createdAt: string; 
}

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

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

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const result = await response.json();
      setArticles(result.data || []); 
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) fetchArticles();
    } catch (error) {
      alert("Error connecting to server.");
    }
  };

  // 2. LOGIC LỌC TỔNG HỢP: Search + Khoảng ngày CreatedAt
  const filteredArticles = articles.filter((article) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      article.title?.toLowerCase().includes(searchLower) ||
      article.categoryName?.toLowerCase().includes(searchLower);
    
    const articleDate = new Date(article.createdAt);
    const startDate = new Date(dateFilter.start);
    const endDate = new Date(dateFilter.end);
    endDate.setHours(23, 59, 59, 999);

    const matchesDate = articleDate >= startDate && articleDate <= endDate;

    return matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Article Management</h1>
          <p className="text-slate-500 text-sm">
            Showing news from {new Date(dateFilter.start).toLocaleDateString('vi-VN')} to {new Date(dateFilter.end).toLocaleDateString('vi-VN')}
          </p>
        </div>
        <button 
          onClick={() => navigate('/admin/articles/create')}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 rounded-xl text-sm font-bold text-white hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Write New Article
        </button>
      </div>

      {/* 3. FILTER BAR: Search + Date Range */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group focus-within:border-emerald-500">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500" />
          <input 
            type="text" 
            placeholder="Search by title or category..." 
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
              className="text-xs font-bold text-slate-600 outline-none cursor-pointer"
              value={dateFilter.start}
              onChange={(e) => setDateFilter({...dateFilter, start: e.target.value})}
            />
            <span className="text-slate-300">→</span>
            <input 
              type="date" 
              className="text-xs font-bold text-slate-600 outline-none cursor-pointer"
              value={dateFilter.end}
              onChange={(e) => setDateFilter({...dateFilter, end: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black border-b">
                <th className="px-8 py-5">Title</th>
                <th className="px-8 py-5">Date Created</th>
                <th className="px-8 py-5 text-center">Category</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600 opacity-20" />
                  </td>
                </tr>
              ) : filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 text-sm font-bold text-slate-700">
                    <div className="max-w-[300px] truncate" title={article.title}>
                      {article.title}
                    </div>
                  </td>

                  <td className="px-8 py-5 text-sm text-slate-400">
                    <div className="flex items-center gap-2 font-medium">
                      <Calendar className="w-3.5 h-3.5 opacity-40 group-hover:text-emerald-500 transition-colors" />
                      {article.createdAt 
                        ? new Date(article.createdAt).toLocaleDateString('en-GB') 
                        : "No Date"}
                    </div>
                  </td>

                  <td className="px-8 py-5 text-center">
                    <span className="inline-flex px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[11px] font-black uppercase tracking-wider items-center gap-1.5 mx-auto shadow-sm border border-blue-100">
                      <Tag className="w-3 h-3" /> 
                      {article.categoryName || "General"}
                    </span>
                  </td>

                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => navigate(`/admin/articles/edit/${article.id}`)} 
                        className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all shadow-sm"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(article.id)} 
                        className="p-2 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {!loading && filteredArticles.length === 0 && (
            <div className="text-center py-20 bg-white text-slate-300 italic flex flex-col items-center gap-3">
               <Search className="w-10 h-10 opacity-10" />
               <p className="font-serif">No articles found in this period.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}