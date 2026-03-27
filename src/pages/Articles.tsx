// src/pages/admin/Articles.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Edit2, Trash2, Tag, User, 
  Loader2, Save, ArrowLeft, AlertCircle, Image as ImageIcon, Calendar 
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import ReactQuill from 'react-quill-new'; 
import 'react-quill-new/dist/quill.snow.css'; 

// Initial empty state for a new article
const emptyArticle = {
  title: '',
  content: '', 
  categoryId: '', 
  authorId: 1,    
  image: ''
};

export default function Articles() {
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false); 
  const [editingData, setEditingData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize title textarea
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto'; 
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`; 
    }
  }, [editingData?.title, isEditing]);

  // Fetch Articles & Categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const articleRes = await axios.get('http://localhost:8081/api/green_earth/article');
        if (articleRes.data && articleRes.data.data) {
          setArticles(articleRes.data.data);
        }
        
        const categoryRes = await axios.get('http://localhost:8081/api/green_earth/article_categories');
        if (categoryRes.data && categoryRes.data.data) {
          setCategories(categoryRes.data.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle Delete
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      await axios.delete(`http://localhost:8081/api/green_earth/article/${id}`);
      setArticles(prev => prev.filter(ar => ar && ar.id !== id));
      alert("Deleted successfully!");
    } catch (err) {
      alert("Error deleting article!");
    }
  };

  // Handle Save (Create & Update)
  const handleSaveUpdate = async () => {
    if (!editingData || isSubmitting) return;
    
    if (!editingData.title || !editingData.categoryId) {
      alert("Please enter a Title and select a Category!");
      return;
    }

    try {
      setIsSubmitting(true); 
      let response;

      const payload = {
        ...editingData,
        category: { id: Number(editingData.categoryId || editingData.category?.id) },
        author: { id: Number(editingData.authorId || editingData.author?.id || 1) }
      };

      if (editingData.id) {
        // Update (PUT)
        response = await axios.put(`http://localhost:8081/api/green_earth/article/${editingData.id}`, payload);
        if (response.data && response.data.data) {
          setArticles(prev => prev.map(ar => (ar && ar.id === editingData.id) ? response.data.data : ar));
          alert("Article updated successfully!");
        }
      } else {
        // Create (POST)
        response = await axios.post(`http://localhost:8081/api/green_earth/article`, payload);
        if (response.data && response.data.data) {
          setArticles(prev => [response.data.data, ...prev]);
          alert("Article created successfully!");
        }
      }

      if (response.data && response.data.data) {
        setIsEditing(false);
        setEditingData(null);
      }
      
    } catch (err: any) {
      console.error("Save Error:", err);
      const backendError = err.response?.data?.message || err.response?.data?.error || "Error saving data!";
      alert("Server error: " + backendError);
    } finally {
      setIsSubmitting(false); 
    }
  };

  // SUPER DATE FORMATTER - Catches all types of dates from Java
  const formatDate = (dateValue: any) => {
    if (!dateValue) return "Not updated";

    // 1. If Java sends an Array (e.g., [2026, 3, 27, 16...])
    if (Array.isArray(dateValue) && dateValue.length >= 3) {
      const [year, month, day] = dateValue;
      return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
      });
    }

    // 2. If it's a standard String or Timestamp
    const date = new Date(dateValue);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) return "Not updated";

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) return (
    <div className="flex h-[400px] flex-col items-center justify-center">
      <Loader2 className="animate-spin text-emerald-500 w-10 h-10 mb-4" />
      <p className="text-slate-400 font-medium">Loading news data...</p>
    </div>
  );

  // --- FORM VIEW (EDIT/CREATE) ---
  if (isEditing && editingData) return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100 sticky top-0 z-50">
        <button onClick={() => { setIsEditing(false); setEditingData(null); }} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <button disabled={isSubmitting} onClick={handleSaveUpdate} className={`bg-emerald-600 text-white px-8 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-700 active:scale-95'}`}>
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSubmitting ? 'Saving...' : 'Save Article'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 space-y-8">
        
        <textarea 
          ref={titleRef}
          className="text-4xl md:text-5xl font-serif font-bold w-full border-none outline-none text-slate-900 bg-transparent resize-none overflow-hidden leading-tight py-2"
          placeholder="Enter article title..."
          rows={1}
          value={editingData.title || ''}
          onChange={(e) => setEditingData({...editingData, title: e.target.value})}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-y border-slate-50">
          
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Tag className="w-3 h-3"/> Category</label>
            <select 
              className="w-full font-medium outline-none text-slate-700 focus:text-emerald-600 transition-colors border-b border-dashed border-slate-200 focus:border-emerald-400 pb-1 bg-transparent cursor-pointer"
              value={editingData.categoryId || editingData.category?.id || ''} 
              onChange={(e) => setEditingData({...editingData, categoryId: e.target.value})}
            >
              <option value="" disabled>-- Select category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><User className="w-3 h-3"/> Author ID</label>
            <input 
              type="number" 
              className="w-full font-medium outline-none text-slate-700 focus:text-emerald-600 transition-colors border-b border-dashed border-slate-200 focus:border-emerald-400 pb-1" 
              value={editingData.authorId || editingData.author?.id || 1} 
              onChange={(e) => setEditingData({...editingData, authorId: e.target.value})} 
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><ImageIcon className="w-3 h-3"/> Cover Image URL</label>
            <input 
              type="text" 
              className="w-full font-medium outline-none text-slate-700 focus:text-emerald-600 transition-colors border-b border-dashed border-slate-200 focus:border-emerald-400 pb-1" 
              value={editingData.image || ''} 
              placeholder="https://example.com/image.jpg"
              onChange={(e) => setEditingData({...editingData, image: e.target.value})} 
            />
          </div>

        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-800">Article Content</label>
          <div className="min-h-[500px] mb-16">
            <ReactQuill 
              theme="snow" 
              value={editingData.content || ''} 
              onChange={(value) => setEditingData(prev => ({ ...prev, content: value }))}
              className="h-[450px]"
              placeholder="Write news content here..."
            />
          </div>
        </div>
      </div>
    </motion.div>
  );

  // --- LIST VIEW ---
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <h1 className="text-2xl font-bold text-slate-900">News Management</h1>
        <button 
          onClick={() => { setEditingData(emptyArticle); setIsEditing(true); }}
          className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" /> New Article
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-400">
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest">Article Title</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest">Category</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest">Author</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest">Created Date</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {articles && articles.map((ar) => {
              if (!ar) return null; 

              return (
                <tr key={ar.id} className="hover:bg-slate-50/50 transition-colors group">
                  
                  {/* COLUMN 1: IMAGE & TITLE */}
                  <td className="px-6 py-5 flex items-center gap-4">
                    <div className="w-12 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shadow-sm overflow-hidden shrink-0">
                      {ar.image ? <img src={ar.image} alt="cover" className="w-full h-full object-cover" /> : (ar.title ? ar.title.charAt(0) : 'N')}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors block line-clamp-1 max-w-md">
                        {ar.title || 'Untitled'}
                      </span>
                    </div>
                  </td>

                  {/* COLUMN 2: CATEGORY */}
                  <td className="px-6 py-5">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
                      <Tag className="w-3 h-3" />
                      {
                        ar.category?.name || 
                        categories.find(c => 
                          c.id === ar.categoryId || 
                          c.id === ar.category_id || 
                          c.id === ar.category?.id
                        )?.name || 
                        'Uncategorized'
                      }
                    </span>
                  </td>

                  {/* COLUMN 3: AUTHOR */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                        <User className="w-3 h-3 text-slate-400" />
                      </div>
                      {ar.author?.username || ar.author?.name || ar.author?.email || 'Admin'}
                    </div>
                  </td>

                  {/* COLUMN 4: CREATED DATE (With fallback fields) */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                      <Calendar className="w-4 h-4 text-emerald-500" />
                      {formatDate(ar.createdAt || ar.created_at || ar.createdDate || ar.date)}
                    </div>
                  </td>

                  {/* COLUMN 5: ACTIONS */}
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setEditingData(ar); setIsEditing(true); }} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => ar.id && handleDelete(ar.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
        {(!articles || articles.length === 0) && (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 italic">
            <AlertCircle className="w-8 h-8 mb-2 opacity-20" />
            <p>No news articles found in the system.</p>
          </div>
        )}
      </div>
    </div>
  );
}