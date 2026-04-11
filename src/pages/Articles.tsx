import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Calendar, Tag, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const API_URL = "http://localhost:8081/api/green_earth/article";

// Interface khớp hoàn toàn với ArticleRes bên Java của bạn
interface Article {
  id: number;
  title: string;
  content: string;
  image: string;
  authorId: number;
  categoryId: number;
  categoryName?: string; // Trường này rất quan trọng để hiển thị tên
  createdAt: string;    // Dạng chuỗi ISO từ Timestamp Java
}

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Hàm lấy dữ liệu từ API
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const result = await response.json();
      // result.data là mảng Articles nếu bạn dùng ResponseHandler chuẩn
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

  // Hàm xử lý xóa bài viết
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { 
        method: 'DELETE' 
      });
      if (response.ok) {
        fetchArticles(); // Tải lại danh sách sau khi xóa thành công
      } else {
        alert("Delete failed! Maybe this article is being referenced elsewhere.");
      }
    } catch (error) {
      alert("Error connecting to server.");
    }
  };

  // Lọc bài viết theo ô tìm kiếm (Tìm theo Title hoặc Category Name)
  const filteredArticles = articles.filter((article) => {
    const searchLower = searchTerm.toLowerCase();
    const titleMatch = article.title?.toLowerCase().includes(searchLower);
    const categoryMatch = article.categoryName?.toLowerCase().includes(searchLower);
    return titleMatch || categoryMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Article Management</h1>
          <p className="text-slate-500">View and manage your environmental news posts.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/articles/create')}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 rounded-lg text-sm font-medium text-white hover:bg-emerald-700 shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Write New Article
        </button>
      </div>

      {/* Search Section */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by title or category..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Date Created</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
                  </td>
                </tr>
              ) : filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-slate-50 transition-colors">
                  {/* Title Column */}
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">
                    <div className="max-w-[300px] truncate" title={article.title}>
                      {article.title}
                    </div>
                  </td>

                  {/* Date Created Column */}
                  <td className="px-6 py-4 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      {article.createdAt 
                        ? new Date(article.createdAt).toLocaleDateString('en-GB') 
                        : "No Date"}
                    </div>
                  </td>

                  {/* Category Badge Column */}
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold flex items-center gap-1 w-fit">
                      <Tag className="w-3 h-3" /> 
                      {/* Hiển thị categoryName từ ArticleRes Java */}
                      {article.categoryName || "General"}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => navigate(`/admin/articles/edit/${article.id}`)} 
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(article.id)} 
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {/* Empty State */}
              {!loading && filteredArticles.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-400 italic">
                    No articles found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}