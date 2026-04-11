import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Type, Tag, Image as ImageIcon } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { motion } from 'framer-motion';

const API_URL = "http://localhost:8081/api/green_earth/article";
const CATEGORY_API_URL = "http://localhost:8081/api/green_earth/article_categories"; // Thêm API lấy danh mục

export default function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]); // State lưu danh sách Category

  useEffect(() => {
    // 1. Tải danh sách Danh mục trước
    fetch(CATEGORY_API_URL)
      .then(res => res.json())
      .then(resData => {
        const catList = resData.data || resData;
        if (catList && catList.length > 0) setCategories(catList);
      })
      .catch(err => console.error("Lỗi tải danh mục:", err));

    // 2. Tải thông tin Bài viết
    const fetchDetail = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`);
        const result = await response.json();
        const data = result.data || result; // Phòng hờ API trả trực tiếp object
        
        // BẮT BUỘC MAP LẠI DATA ĐỂ LẤY ĐÚNG ID CỦA CATEGORY VÀ AUTHOR
        setFormData({
          title: data.title || '',
          content: data.content || '',
          image: data.image || '',
          // Lấy categoryId, nếu không có thì dò vào object category.id
          categoryId: data.categoryId || (data.category && data.category.id) || 1,
          authorId: data.authorId || (data.author && data.author.id) || 1
        });
      } catch (error) {
        alert("Lỗi tải thông tin bài viết");
        navigate('/admin/articles');
      } finally {
        setFetching(false);
      }
    };
    
    fetchDetail();
  }, [id, navigate]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        alert("Article updated successfully!");
        navigate('/admin/articles');
      } else {
        // Hiện lỗi chi tiết nếu server từ chối
        const errorData = await response.json();
        alert("Server từ chối dữ liệu:\n" + (errorData.message || JSON.stringify(errorData)));
      }
    } catch (error) {
      alert("Không thể kết nối đến Server!");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" /> Discard Changes
      </button>

      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-blue-50/30">
          <h1 className="text-2xl font-bold text-slate-900">Edit Article</h1>
        </div>

        <form onSubmit={handleUpdate} className="p-8 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase ml-1 flex items-center gap-2"><Type className="w-3 h-3" /> Title</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium" />
            </div>
            
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase ml-1 flex items-center gap-2"><Tag className="w-3 h-3" /> Category</label>
              {/* HIỂN THỊ DANH SÁCH DANH MỤC THẬT TỪ DATABASE */}
              <select 
                value={formData.categoryId || ""} 
                onChange={e => setFormData({...formData, categoryId: Number(e.target.value)})} 
                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
              >
                {categories.length > 0 ? (
                  categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} {/* Nhớ đổi cat.name thành cat.categoryName nếu Backend của bạn đặt tên thế nhé */}
                    </option>
                  ))
                ) : (
                  <option value="">Đang tải danh mục...</option>
                )}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase ml-1 flex items-center gap-2"><ImageIcon className="w-3 h-3" /> Image URL</label>
            <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium" />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase ml-1">Content</label>
            <div className="h-[400px] mb-12">
              <ReactQuill theme="snow" value={formData.content} onChange={(val: string) => setFormData({...formData, content: val})} className="h-full bg-slate-50 rounded-2xl overflow-hidden border-slate-100" />
            </div>
          </div>

          <button disabled={loading} type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
          </button>
        </form>
      </motion.div>
    </div>
  );
}