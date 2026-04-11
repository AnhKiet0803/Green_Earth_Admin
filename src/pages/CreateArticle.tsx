import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Type, Image as ImageIcon, Tag } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { motion } from 'framer-motion';

const API_URL = "http://localhost:8081/api/green_earth/article";
// Thay đổi đường dẫn này cho khớp với API lấy danh mục của bạn
const CATEGORY_API_URL = "http://localhost:8081/api/green_earth/article_categories"; 

export default function CreateArticle() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]); // State lưu danh sách Category

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    categoryId: 0, // Tạm để 0, sẽ tự cập nhật khi tải xong danh mục
    authorId: 1 
  });

  // TỰ ĐỘNG LẤY DANH SÁCH DANH MỤC TỪ DATABASE KHI VÀO TRANG
  useEffect(() => {
    fetch(CATEGORY_API_URL)
      .then(res => res.json())
      .then(resData => {
        // Giả sử backend trả về dạng { data: [...] }
        const catList = resData.data || resData; 
        if (catList && catList.length > 0) {
          setCategories(catList);
          // Tự động chọn danh mục đầu tiên làm mặc định
          setFormData(prev => ({ ...prev, categoryId: catList[0].id })); 
        }
      })
      .catch(err => console.error("Chưa có API lấy danh mục hoặc lỗi:", err));
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.categoryId === 0) {
      alert("Vui lòng chọn danh mục trước khi lưu!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        alert("Article created successfully!");
        navigate('/admin/articles');
      } else {
        const errorData = await response.json();
        alert("Server từ chối dữ liệu:\n" + (errorData.message || JSON.stringify(errorData)));
      }
    } catch (error) {
      alert("Không thể kết nối đến Server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to List
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/50">
          <h1 className="text-2xl font-bold text-slate-900">Write New Article</h1>
        </div>

        <form onSubmit={handleSave} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase ml-1 flex items-center gap-2"><Type className="w-3 h-3" /> Title</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium" />
            </div>
            
            {/* ĐỔ DỮ LIỆU DANH MỤC THẬT TỪ DATABASE VÀO ĐÂY */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase ml-1 flex items-center gap-2"><Tag className="w-3 h-3" /> Category</label>
              <select 
                value={formData.categoryId} 
                onChange={e => setFormData({...formData, categoryId: Number(e.target.value)})} 
                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium"
              >
                {categories.length > 0 ? (
                  categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} {/* Hoặc cat.categoryName tùy cách đặt tên bên DB */}
                    </option>
                  ))
                ) : (
                  <option value={0}>Đang tải danh mục...</option>
                )}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase ml-1 flex items-center gap-2"><ImageIcon className="w-3 h-3" /> Image URL</label>
            <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium" />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase ml-1">Content</label>
            <div className="h-[400px] mb-12">
              <ReactQuill theme="snow" value={formData.content} onChange={(val: string) => setFormData({...formData, content: val})} className="h-full bg-slate-50 rounded-2xl overflow-hidden border-slate-100" />
            </div>
          </div>

          <button disabled={loading} type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <Save className="w-4 h-4" />} Publish Article
          </button>
        </form>
      </motion.div>
    </div>
  );
}