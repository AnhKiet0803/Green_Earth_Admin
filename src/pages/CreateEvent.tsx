import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon, MapPin, Calendar, Type } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const API_URL = "http://localhost:8081/api/green_earth/event";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    eventDate: new Date().toISOString().split('T')[0],
    image: '',
    createdBy: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate('/admin/events'); // Quay lại trang danh sách
      } else {
        alert("Lỗi khi tạo sự kiện!");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden"
      >
        <div className="p-8 border-b border-slate-50 bg-slate-50/50">
          <h1 className="text-2xl font-bold text-slate-900">Create New Event</h1>
          <p className="text-slate-500 text-sm mt-1">Fill in the details below to launch a new community activity.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Title */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase ml-1">
              <Type className="w-3.5 h-3.5" /> Event Title
            </label>
            <input 
              required
              type="text" 
              placeholder="e.g. Community Garden Cleanup"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold text-lg"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase ml-1">Detailed Description</label>
            <div className="h-[300px] mb-12">
              <ReactQuill 
                theme="snow" 
                value={formData.description} 
                onChange={(val:string) => setFormData({...formData, description: val})}
                className="h-full bg-slate-50 rounded-2xl overflow-hidden border-slate-100"
              />
            </div>
          </div>

          {/* Grid: Location & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase ml-1">
                <MapPin className="w-3.5 h-3.5" /> Location
              </label>
              <input 
                type="text" 
                placeholder="City, Province or Online"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase ml-1">
                <Calendar className="w-3.5 h-3.5" /> Event Date
              </label>
              <input 
                type="date" 
                value={formData.eventDate}
                onChange={e => setFormData({...formData, eventDate: e.target.value})}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium"
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase ml-1">
              <ImageIcon className="w-3.5 h-3.5" /> Cover Image URL
            </label>
            <input 
              type="text" 
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={e => setFormData({...formData, image: e.target.value})}
              className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium"
            />
          </div>

          <div className="pt-6">
            <button 
              disabled={loading}
              type="submit" 
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? "Processing..." : <><Save className="w-4 h-4" /> Publish Event</>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}