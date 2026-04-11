import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Tag, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState<{ id?: number, name: string }>({ name: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8080/api/green_earth/article_categories');
      const data = res.data.data || res.data; 
      if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (err) {
      console.error("Lỗi tải danh mục:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("CẢNH BÁO: Xóa danh mục có thể ảnh hưởng đến các bài viết đang thuộc danh mục này. Bạn có chắc chắn xóa?")) return;
    try {
      await axios.delete(`http://localhost:8081/api/green_earth/article_categories/${id}`);
      setCategories(prev => prev.filter(cat => cat.id !== id));
      alert("Xóa danh mục thành công!");
    } catch (err: any) {
      alert("Không thể xóa! Có thể danh mục này đang chứa bài viết.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingData.name.trim()) {
      alert("Vui lòng nhập tên danh mục!");
      return;
    }

    try {
      setIsSubmitting(true);
      let res;
      if (editingData.id) {
        // Cập nhật (PUT)
        res = await axios.put(`http://localhost:8081/api/green_earth/article_categories/${editingData.id}`, { name: editingData.name });
        const updatedCat = res.data.data || res.data;
        setCategories(prev => prev.map(cat => cat.id === editingData.id ? updatedCat : cat));
        alert("Cập nhật thành công!");
      } else {
        // Thêm mới (POST)
        res = await axios.post(`http://localhost:8081/api/green_earth/article_categories`, { name: editingData.name });
        const newCat = res.data.data || res.data;
        setCategories(prev => [newCat, ...prev]);
        alert("Thêm danh mục mới thành công!");
      }
      
      // Reset form
      setIsEditing(false);
      setEditingData({ name: '' });
      
    } catch (err: any) {
      console.error("Lỗi khi lưu:", err);
      alert("Lỗi từ server: Không thể lưu danh mục!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex h-[400px] items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* HEADER */}
      <div className="flex justify-between items-center px-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Chuyên mục</h1>
          <p className="text-slate-500 text-sm mt-1">Thêm, sửa, xóa các danh mục cho phần Tin tức</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => { setEditingData({ name: '' }); setIsEditing(true); }}
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" /> Thêm Danh Mục Mới
          </button>
        )}
      </div>

      {isEditing && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-emerald-600" />
            {editingData.id ? 'Chỉnh sửa Danh mục' : 'Tạo Danh mục mới'}
          </h2>
          
          <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1 w-full">
              <input 
                type="text" 
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none font-medium text-slate-700" 
                placeholder="Ví dụ: Tin tức Xanh, Mẹo bảo vệ môi trường..."
                value={editingData.name} 
                onChange={(e) => setEditingData({...editingData, name: e.target.value})} 
              />
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <button 
                type="button"
                onClick={() => { setIsEditing(false); setEditingData({ name: '' }); }}
                className="px-6 py-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors flex-1 sm:flex-none flex justify-center items-center gap-2"
              >
                <X className="w-4 h-4" /> Hủy
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex-1 sm:flex-none flex justify-center items-center gap-2 ${isSubmitting ? 'opacity-50' : ''}`}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Lưu lại
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-400">
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest w-20">ID</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest">Tên danh mục</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-slate-400 font-medium">#{cat.id}</td>
                <td className="px-6 py-4">
                  <span className="font-bold text-slate-700 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-md">
                    {cat.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => { setEditingData(cat); setIsEditing(true); }} 
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Sửa"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => cat.id && handleDelete(cat.id)} 
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {categories.length === 0 && (
          <div className="py-16 flex flex-col items-center justify-center text-slate-400 italic">
            <AlertCircle className="w-8 h-8 mb-2 opacity-20" />
            <p>Chưa có danh mục nào. Hãy tạo mới nhé!</p>
          </div>
        )}
      </div>

    </div>
  );
}