import React, { useState, useEffect } from 'react';
import { Plus, Heart, Edit2, Trash2, X, Loader2, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // Đã sửa đường dẫn import chuẩn

const API_URL = "http://localhost:8081/api/green_earth/partner";

export default function Sponsors() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Thêm state khóa nút bấm
  
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    logo: '',
    website: ''
  });

  const fetchSponsors = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const result = await response.json();
      
      // Đảo ngược mảng để đối tác mới thêm lên đầu (giống Campaign)
      const data = result.data || result || [];
      setSponsors([...data].reverse());
    } catch (error) {
      console.error("Lỗi fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Chặn nếu đang lưu dở
    
    setIsSubmitting(true);
    const isUpdate = !!formData.id;
    const url = isUpdate ? `${API_URL}/${formData.id}` : API_URL;
    const method = isUpdate ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          logo: formData.logo,
          website: formData.website
        }),
      });

      if (response.ok) {
        fetchSponsors();
        closeModal();
      } else {
        alert("Lưu thất bại! Vui lòng kiểm tra lại dữ liệu.");
      }
    } catch (error) {
      alert("Lỗi kết nối đến Server!");
    } finally {
      setIsSubmitting(false); // Mở khóa nút bấm
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đối tác này?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setSponsors(prev => prev.filter(item => item.id !== id));
      } else {
        alert("Xóa thất bại!");
      }
    } catch (error) {
      alert("Lỗi khi xóa!");
    }
  };

  const openModal = (sponsor = null) => {
    if (sponsor) {
      setFormData({ ...sponsor });
    } else {
      setFormData({ id: null, name: '', description: '', logo: '', website: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sponsor List</h1>
          <p className="text-slate-500">Manage partners and companies supporting green earth work.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 rounded-lg text-sm font-medium text-white hover:bg-emerald-700 transition-all active:scale-95 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Sponsor
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-500 w-10 h-10" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsors.map((sponsor, i) => (
              <motion.div
                key={sponsor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col group hover:shadow-md transition-shadow relative"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center overflow-hidden">
                    {sponsor.logo && sponsor.logo.startsWith('http') ? (
                      <img 
                        src={sponsor.logo} 
                        alt={sponsor.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `<span class="text-xl font-bold text-emerald-600 uppercase">${sponsor.name.substring(0, 2)}</span>`;
                        }}
                      />
                    ) : (
                      <span className="text-xl font-bold text-emerald-600 uppercase">
                        {sponsor.logo || sponsor.name.substring(0, 2)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => openModal(sponsor)} 
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(sponsor.id)} 
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4 flex-1">
                  <h3 className="font-bold text-slate-900 text-lg truncate">{sponsor.name}</h3>
                  <p className="text-sm text-slate-500 flex items-start gap-2 min-h-[40px] line-clamp-3">
                    <Heart className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                    {sponsor.description}
                  </p>
                </div>

                {sponsor.website && (
                  <a 
                    href={sponsor.website} 
                    target="_blank" 
                    rel="noreferrer"
                    className="mt-auto flex items-center gap-1 text-xs font-medium text-emerald-600 hover:underline pt-4 border-t border-slate-100"
                  >
                    <Globe className="w-3 h-3" />
                    Visit Website
                  </a>
                )}
              </motion.div>
            ))}
        </div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">{formData.id ? 'Edit Partner' : 'New Partner'}</h2>
                <button onClick={closeModal} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Partner Name</label>
                  <input 
                    type="text" placeholder="e.g. Ocean Care" required 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                  <textarea 
                    placeholder="What does this partner support?" rows="3" required 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Logo URL</label>
                  <div className="flex gap-3 items-center">
                    <input 
                      type="url" placeholder="https://..." 
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      value={formData.logo} onChange={e => setFormData({...formData, logo: e.target.value})} 
                    />
                    <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                      {formData.logo ? (
                        <img src={formData.logo} alt="Logo preview" className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://placehold.co/100x100?text=Error'} />
                      ) : (
                        <span className="text-[10px] text-slate-400 text-center px-1">No Image</span>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Website URL</label>
                  <input 
                    type="url" placeholder="https://oceancare.org" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-md shadow-emerald-200 mt-2 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  {formData.id ? 'Update Partner' : 'Create Partner'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}