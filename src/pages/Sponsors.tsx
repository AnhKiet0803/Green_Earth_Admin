import React, { useState, useEffect } from 'react';
import { Plus, Heart, Edit2, Trash2, X, Loader2, Globe, Search, Filter, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; 

const API_URL = "http://localhost:8081/api/green_earth/partner";

export default function Sponsors() {
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [searchTerm, setSearchTerm] = useState(""); 
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; 
    
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
      setIsSubmitting(false); 
    }
  };

  const handleDelete = async (id: number) => {
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

  const openModal = (sponsor: any = null) => {
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

  // 2. LOGIC LỌC TỔNG HỢP: Tên + Khoảng ngày (Dựa trên createdAt)
  const filteredSponsors = sponsors.filter(s => {
    const matchesSearch = (s.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    // Giả sử Backend có trả về createdAt hoặc updatedAt, nếu không có sẽ bỏ qua lọc ngày
    const rawDate = s.createdAt || s.updatedAt || s.created_at;
    if (!rawDate) return matchesSearch;

    const sponsorDate = new Date(rawDate);
    const startDate = new Date(dateFilter.start);
    const endDate = new Date(dateFilter.end);
    endDate.setHours(23, 59, 59, 999);

    const matchesDate = sponsorDate >= startDate && sponsorDate <= endDate;
    return matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">Sponsor List</h1>
          <p className="text-slate-500 text-sm">
             Managing partners for the year {new Date(dateFilter.start).getFullYear()}
          </p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 rounded-xl text-sm font-bold text-white hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Sponsor
        </button>
      </div>

      {/* 3. FILTER BAR BỔ SUNG: Search + Date Range */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search partners by name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 text-sm outline-none bg-transparent"
          />
        </div>

        <div className="lg:col-span-2 flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 border-r pr-3">
            <Filter className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Period</span>
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

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-500 w-10 h-10" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode='popLayout'>
            {filteredSponsors.map((sponsor, i) => (
                <motion.div
                  key={sponsor.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col group hover:shadow-xl transition-all relative"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner">
                      {sponsor.logo && sponsor.logo.startsWith('http') ? (
                        <img 
                          src={sponsor.logo} 
                          alt={sponsor.name} 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            if (target.parentElement) {
                                target.parentElement.innerHTML = `<span class="text-xl font-bold text-emerald-600 uppercase">${sponsor.name.substring(0, 2)}</span>`;
                            }
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
                        className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(sponsor.id)} 
                        className="p-2 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 flex-1">
                    <h3 className="font-black text-slate-900 text-lg truncate group-hover:text-emerald-600 transition-colors">{sponsor.name}</h3>
                    <p className="text-sm text-slate-500 flex items-start gap-2 min-h-[40px] line-clamp-3 leading-relaxed italic">
                      <Heart className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                      {sponsor.description}
                    </p>
                  </div>

                  {sponsor.website && (
                    <a 
                      href={sponsor.website} 
                      target="_blank" 
                      rel="noreferrer"
                      className="mt-auto flex items-center gap-2 text-xs font-bold text-emerald-600 hover:translate-x-1 transition-transform pt-4 border-t border-slate-50"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Visit Website
                    </a>
                  )}
                </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Hiển thị khi không tìm thấy */}
      {!loading && filteredSponsors.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 text-slate-300">
           <p className="font-serif text-lg">No sponsors found in this period.</p>
        </div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="flex justify-between items-center p-8 border-b border-slate-50 bg-slate-50/50">
                <h2 className="text-xl font-black text-slate-900">{formData.id ? 'Edit Partner' : 'New Partner'}</h2>
                <button onClick={closeModal} className="p-2 hover:bg-white rounded-full transition-all shadow-sm"><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Partner Name</label>
                  <input type="text" placeholder="e.g. Ocean Care" required className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Description</label>
                  <textarea placeholder="What does this partner support?" rows={3} required className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all resize-none font-medium" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Logo URL</label>
                  <div className="flex gap-4 items-center">
                    <input type="url" placeholder="https://..." className="flex-1 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium" value={formData.logo} onChange={e => setFormData({...formData, logo: e.target.value})} />
                    <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm">
                      {formData.logo ? (
                        <img src={formData.logo} alt="Preview" className="w-full h-full object-cover" onError={(e) => {(e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Error';}} />
                      ) : (
                        <span className="text-[10px] text-slate-300 text-center font-bold">No Image</span>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Website URL</label>
                  <input type="url" placeholder="https://oceancare.org" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-xl shadow-emerald-200 mt-4 disabled:opacity-50 flex justify-center items-center gap-2 uppercase tracking-widest">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  {formData.id ? 'Save Changes' : 'Create Partner'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}