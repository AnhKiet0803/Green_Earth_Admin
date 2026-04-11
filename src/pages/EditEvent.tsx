import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const API_URL = "http://localhost:8081/api/green_earth/event";

export default function EditEvent() {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    eventDate: '',
    image: '',
    createdBy: 1
  });

  // Fetch dữ liệu cũ nếu là chế độ Sửa (có ID)
  useEffect(() => {
    if (id) {
      fetch(`${API_URL}/${id}`)
        .then(res => res.json())
        .then(result => {
          const data = result.data;
          setFormData({
            ...data,
            eventDate: data.eventDate ? data.eventDate.split('T')[0] : ''
          });
          setIsFetching(false);
        })
        .catch(() => setIsFetching(false));
    }
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Success!");
        navigate('/admin/events'); // Lưu xong quay về trang danh sách
      }
    } catch (error) {
      alert("Error saving data!");
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-600" /></div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/admin/events')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to List
        </button>
        <h1 className="text-2xl font-bold text-slate-900">{id ? 'Edit Event' : 'Create New Event'}</h1>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 space-y-6">
        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-slate-400 uppercase ml-1">Event Title</label>
          <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} 
            className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium" />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-slate-400 uppercase ml-1">Detailed Description</label>
          <div className="h-[350px] mb-14">
            <ReactQuill theme="snow" value={formData.description} onChange={(val: string) => setFormData({...formData, description: val})} className="h-full bg-slate-50 rounded-2xl overflow-hidden border-slate-100" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-400 uppercase ml-1">Location</label>
            <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-400 uppercase ml-1">Event Date</label>
            <input type="date" value={formData.eventDate} onChange={e => setFormData({...formData, eventDate: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-slate-400 uppercase ml-1">Cover Image URL</label>
          <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium" />
        </div>

        <button type="submit" disabled={loading} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
          {loading ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />}
          {id ? 'Save Changes' : 'Publish Event'}
        </button>
      </form>
    </div>
  );
}