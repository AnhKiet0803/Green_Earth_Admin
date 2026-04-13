<<<<<<< HEAD
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
=======
import React, { useState, useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Plus, Search, Filter, Edit2, Trash2, Eye, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { unwrapListData } from '../utils/unwrapListData';

const API_URL = "http://localhost:8080/api/green_earth/article";
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerm, 350);
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(1); 
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [searchKeywords, setSearchKeywords] = useState('');

<<<<<<< HEAD
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
=======
  const fetchArticles = useCallback(async () => {
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: '0', size: '500' });
      if (debouncedSearch.trim()) params.set('q', debouncedSearch.trim());
      const response = await fetch(`${API_URL}?${params}`);
      const result = await response.json();
<<<<<<< HEAD
      setArticles(result.data || []); 
=======
      setArticles(unwrapListData(result.data));
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleOpenModal = (article = null) => {
    if (article) {
      setCurrentArticle(article);
      setTitle(article.title);
      setContent(article.content);
      setImage(article.image || '');
      setSearchKeywords(article.searchKeywords || '');
    } else {
      setCurrentArticle(null);
      setTitle('');
      setContent('');
      setImage('');
      setSearchKeywords('');
    }
    setIsModalOpen(true);
  };


  const handleSave = async () => {
    const isUpdate = !!currentArticle;
    const url = isUpdate ? `${API_URL}/${currentArticle.id}` : API_URL;
    const method = isUpdate ? 'PUT' : 'POST';

    const payload = {
      title,
      content,
      image,
      searchKeywords,
      authorId: 1,
      categoryId: parseInt(categoryId)
    };

<<<<<<< HEAD
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) fetchArticles();
=======
    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        fetchArticles();
        setIsModalOpen(false);
      } else {
        alert("Failed to save article. Please check your data.");
      }
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
    } catch (error) {
      alert("Error connection to server.");
    }
  };

<<<<<<< HEAD
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
=======
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Article Management</h1>
          <p className="text-slate-500">Write environmental assessments and warnings.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 rounded-lg text-sm font-medium text-white hover:bg-emerald-700 transition-all active:scale-95"
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
        >
          <Plus className="w-4 h-4" />
          Write New Article
        </button>
      </div>
<<<<<<< HEAD

      {/* 3. FILTER BAR: Search + Date Range */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group focus-within:border-emerald-500">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500" />
=======
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
          <input 
            type="text" 
            placeholder="Tìm theo tiêu đề, danh mục hoặc từ khóa..." 
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
<<<<<<< HEAD

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
=======
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Creation Date</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Actions</th>
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
<<<<<<< HEAD
                  <td colSpan={4} className="py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600 opacity-20" />
=======
                  <td colSpan={4} className="py-10 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600" />
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
                  </td>

                </tr>
<<<<<<< HEAD
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
=======
              ) : articles.length > 0 ? (
                articles.map((article) => (
                  <tr key={article.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{article.title}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {article.createdAt ? new Date(article.createdAt).toLocaleDateString('en-GB') : "No Date"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium">
                        {article.categoryName || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(article)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-400 text-sm">
                    No articles found matching "{searchTerm}"
                  </td>
                </tr>
              )}
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
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
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <h2 className="text-xl font-bold text-slate-900">
                  {currentArticle ? 'Edit Article' : 'Write New Article'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Article Title</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter title..." 
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Category</label>
                    <select 
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    >
                      <option value="1">Environment</option>
                      <option value="2">Climate Change</option>
                      <option value="3">Recycling</option>
                      <option value="3">Community</option>
                      <option value="3">Education</option>
                      <option value="3">Sustainability</option>
                      <option value="3">Ocean Protection</option>
                      <option value="3">Forestation</option>
                      <option value="3">Green Energy</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Thumbnail Image URL</label>
                  <input 
                    type="text" 
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://..." 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Từ khóa tìm kiếm</label>
                  <p className="text-xs text-slate-500">Gợi ý thêm cho thanh tìm (có thể phân cách bằng dấu phẩy).</p>
                  <textarea
                    rows={2}
                    value={searchKeywords}
                    onChange={(e) => setSearchKeywords(e.target.value)}
                    placeholder="ví dụ: khí hậu, tái chế, cảnh báo"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Article Content</label>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <ReactQuill 
                      theme="snow" 
                      value={content} 
                      onChange={setContent}
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, false] }],
                          ['bold', 'italic', 'underline'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          ['link', 'image'],
                          ['clean']
                        ],
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="px-6 py-2 bg-emerald-600 rounded-lg text-sm font-medium text-white hover:bg-emerald-700 transition-all active:scale-95"
                >
                  Save Article
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}