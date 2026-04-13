import React, { useState, useEffect } from 'react';
import { Plus, Star, Edit2, Trash2, X, Loader2, Link as LinkIcon, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = "http://localhost:8081/api/green_earth/celebrity";

// 1. Định nghĩa Interface để sửa lỗi "Property does not exist on type never"
interface Celebrity {
  id: number | null;
  name: string;
  description: string;
  image: string;
  socialLink: string;
}

export default function Celebrities() {
  // 2. Khai báo kiểu dữ liệu cho State
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<Celebrity>({
    id: null,
    name: '',
    description: '', 
    image: '',
    socialLink: ''
  });

  const fetchCelebrities = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const result = await response.json();
      // Giả sử API trả về { data: [...] }
      setCelebrities(result.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCelebrities();
  }, []);

  // 3. Định nghĩa kiểu cho sự kiện Form (e: React.FormEvent)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          image: formData.image,
          socialLink: formData.socialLink
        }),
      });

      if (response.ok) {
        fetchCelebrities();
        closeModal();
      }
    } catch (error) {
      alert("Error saving data!");
    }
  };

  // 4. Định nghĩa kiểu cho ID (id: number | null)
  const handleDelete = async (id: number | null) => {
    if (!id || !window.confirm("Are you sure you want to delete this celebrity?")) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setCelebrities(prev => prev.filter(c => c.id !== id));
      }
    } catch (error) {
      alert("Delete failed!");
    }
  };

  const openModal = (person: Celebrity | null = null) => {
    if (person) {
      setFormData({ ...person });
    } else {
      setFormData({ id: null, name: '', description: '', image: '', socialLink: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Celebrities</h1>
          <p className="text-slate-500">Manage ambassadors and influential figures.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 rounded-lg text-sm font-medium text-white hover:bg-emerald-700 transition-all active:scale-95 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Celebrity
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-500" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {celebrities.map((person, i) => (
            <motion.div
              key={person.id || i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center group relative overflow-hidden hover:shadow-md transition-all"
            >
              <div className="w-24 h-24 bg-emerald-50 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-emerald-600 border-4 border-white shadow-md overflow-hidden">
                {person.image && person.image.startsWith('http') ? (
                  <img 
                    src={person.image} 
                    alt={person.name} 
                    className="w-full h-full object-cover" 
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Error'; }}
                  />
                ) : (
                  <span>{person.name.substring(0, 2).toUpperCase()}</span>
                )}
              </div>
              
              <h3 className="font-bold text-slate-900 text-lg truncate">{person.name}</h3>
              <p className="text-sm text-slate-500 mb-4 h-10 line-clamp-2">{person.description}</p>
              
              <div className="flex justify-center gap-3 mb-6">
                {person.socialLink && (
                  <a 
                    href={person.socialLink} target="_blank" rel="noreferrer"
                    className="p-2 bg-slate-50 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                <div className="p-2 bg-slate-50 text-emerald-500 rounded-full">
                  <Star className="w-4 h-4 fill-current" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => openModal(person)}
                  className="flex items-center justify-center gap-2 py-2 bg-slate-50 hover:bg-blue-50 text-blue-600 rounded-lg text-xs font-bold transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(person.id)}
                  className="flex items-center justify-center gap-2 py-2 bg-slate-50 hover:bg-red-50 text-red-600 rounded-lg text-xs font-bold transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm text-left">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">{formData.id ? 'Edit Celebrity' : 'New Celebrity'}</h2>
                <button onClick={closeModal} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                  <input 
                    type="text" required 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                  <input 
                    type="text" required 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Image URL</label>
                  <input 
                    type="url" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Social Link</label>
                  <input 
                    type="url" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    value={formData.socialLink} onChange={e => setFormData({...formData, socialLink: e.target.value})} 
                  />
                </div>
                <button type="submit" className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 active:scale-[0.98] transition-all mt-2">
                  {formData.id ? 'Update Celebrity' : 'Save Celebrity'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}