// src/pages/admin/Campaigns.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Edit2, Trash2, Calendar, MapPin, 
  Loader2, Save, ArrowLeft, AlertCircle, Image as ImageIcon, Users, DollarSign, Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import ReactQuill from 'react-quill-new'; 
import 'react-quill-new/dist/quill.snow.css'; 

const emptyCampaign = {
  title: '',
  description: '',
  location: '',
  startDate: '',
  endDate: '',
  targetVolunteers: 0,
  targetAmount: 0,
  image: '',
  status: 'UPCOMING',
  createdBy: 1 
};

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); 
  const [editingData, setEditingData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto'; 
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`; 
    }
  }, [editingData?.title, isEditing]);

  const formatDateForInput = (dateString: any) => {
    if (!dateString) return "";
    return typeof dateString === 'string' ? dateString.split('T')[0] : "";
  };

  const formatDateDisplay = (dateString: any) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
  };

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8081/api/green_earth/campaign');
      if (response.data && response.data.data) {
        setCampaigns(response.data.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;
    try {
      await axios.delete(`http://localhost:8081/api/green_earth/campaign/${id}`);
      setCampaigns(prev => prev.filter(cp => cp && cp.id !== id));
      alert("Deleted successfully!");
    } catch (err) {
      alert("Error deleting campaign!");
    }
  };

  const handleSaveUpdate = async () => {
    if (!editingData || isSubmitting) return;
    try {
      setIsSubmitting(true); 
      let response;

      if (editingData.id) {
        response = await axios.put(`http://localhost:8081/api/green_earth/campaign/${editingData.id}`, editingData);
        if (response.data && response.data.data) {
          setCampaigns(prev => prev.map(cp => (cp && cp.id === editingData.id) ? response.data.data : cp));
          alert("Campaign updated successfully!");
        }
      } else {
        response = await axios.post(`http://localhost:8081/api/green_earth/campaign`, editingData);
        if (response.data && response.data.data) {
          setCampaigns(prev => [response.data.data, ...prev]);
          alert("Campaign created successfully!");
        }
      }

      if (response.data && response.data.data) {
        setIsEditing(false);
        setEditingData(null);
      }
    } catch (err: any) {
      const backendError = err.response?.data?.message || err.response?.data?.error || "Invalid data!";
      alert("Server error: " + backendError);
    } finally {
      setIsSubmitting(false); 
    }
  };

  if (loading) return (
    <div className="flex h-[400px] flex-col items-center justify-center">
      <Loader2 className="animate-spin text-emerald-500 w-10 h-10 mb-4" />
      <p className="text-slate-400 font-medium">Loading data from Spring Boot...</p>
    </div>
  );

  if (isEditing && editingData) return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100 sticky top-0 z-50">
        <button onClick={() => { setIsEditing(false); setEditingData(null); }} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors">
          <ArrowLeft className="w-5 h-5" /> Exit
        </button>
        <button disabled={isSubmitting} onClick={handleSaveUpdate} className={`bg-emerald-600 text-white px-8 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-700 active:scale-95'}`}>
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSubmitting ? 'Saving...' : 'Save Campaign'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 space-y-8">
        <textarea ref={titleRef} className="text-4xl md:text-5xl font-serif font-bold w-full border-none outline-none text-slate-900 bg-transparent resize-none overflow-hidden leading-tight py-2" placeholder="Campaign Title..." value={editingData.title || ''} onChange={(e) => setEditingData({...editingData, title: e.target.value})} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6 border-y border-slate-50">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><MapPin className="w-3 h-3"/> Location</label>
            <input type="text" className="w-full font-medium outline-none text-slate-700 focus:text-emerald-600 transition-colors border-b border-dashed border-slate-200 focus:border-emerald-400 pb-1" value={editingData.location || ''} placeholder="e.g. New York, Online..." onChange={(e) => setEditingData({...editingData, location: e.target.value})} />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Users className="w-3 h-3"/> Volunteers</label>
            <input type="number" className="w-full font-medium outline-none text-slate-700 focus:text-emerald-600 transition-colors border-b border-dashed border-slate-200 focus:border-emerald-400 pb-1" value={editingData.targetVolunteers || ''} placeholder="Goal qty..." onChange={(e) => setEditingData({...editingData, targetVolunteers: Number(e.target.value)})} />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-emerald-600">Funding Goal ($)</label>
            <input type="number" className="w-full font-medium outline-none text-slate-700 focus:text-emerald-600 transition-colors border-b border-dashed border-slate-200 focus:border-emerald-400 pb-1" value={editingData.targetAmount || ''} placeholder="0.00" onChange={(e) => setEditingData({...editingData, targetAmount: Number(e.target.value)})} />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Calendar className="w-3 h-3"/> Start Date</label>
            <input type="date" className="w-full font-medium outline-none text-slate-700 focus:text-emerald-600 transition-colors border-b border-dashed border-slate-200 focus:border-emerald-400 pb-1" value={formatDateForInput(editingData.startDate)} onChange={(e) => setEditingData({...editingData, startDate: e.target.value})} />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Calendar className="w-3 h-3"/> End Date</label>
            <input type="date" className="w-full font-medium outline-none text-slate-700 focus:text-emerald-600 transition-colors border-b border-dashed border-slate-200 focus:border-emerald-400 pb-1" value={formatDateForInput(editingData.endDate)} onChange={(e) => setEditingData({...editingData, endDate: e.target.value})} />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</label>
            <select className="w-full font-medium outline-none text-slate-700 focus:text-emerald-600 transition-colors border-b border-dashed border-slate-200 focus:border-emerald-400 pb-1 bg-transparent" value={editingData.status || 'UPCOMING'} onChange={(e) => setEditingData({...editingData, status: e.target.value})}>
              <option value="UPCOMING">Upcoming</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="space-y-1 md:col-span-2 lg:col-span-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><ImageIcon className="w-3 h-3"/> Cover Image (URL)</label>
            <input type="text" className="w-full font-medium outline-none text-slate-700 focus:text-emerald-600 transition-colors border-b border-dashed border-slate-200 focus:border-emerald-400 pb-1" value={editingData.image || ''} placeholder="https://example.com/image.jpg" onChange={(e) => setEditingData({...editingData, image: e.target.value})} />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-800">Campaign Details</label>
          <div className="min-h-[500px] mb-16">
            <ReactQuill theme="snow" value={editingData.description || ''} onChange={(content) => setEditingData(prev => ({ ...prev, description: content }))} className="h-[450px]" placeholder="Write content here..." />
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <h1 className="text-2xl font-bold text-slate-900">Campaign Management</h1>
        <button onClick={() => { setEditingData(emptyCampaign); setIsEditing(true); }} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95">
          <Plus className="w-5 h-5" /> New Campaign
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-400">
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest">Campaign Info</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest">Location</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-center">Resources</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest">Timeline</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {campaigns && campaigns.map((cp) => (
              <tr key={cp.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-emerald-600 flex-shrink-0 flex items-center justify-center text-white font-bold shadow-sm overflow-hidden">
                      {cp.image ? <img src={cp.image} alt="cover" className="w-full h-full object-cover" /> : (cp.title ? cp.title.charAt(0) : 'C')}
                    </div>
                    <span className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 max-w-[200px]">
                      {cp.title || 'Untitled'}
                    </span>
                  </div>
                </td>
                
                <td className="px-6 py-5">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {cp.location || 'N/A'}
                  </div>
                </td>

                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1 items-center">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <Users className="w-3 h-3" /> {cp.targetVolunteers || 0} Vols
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                      <DollarSign className="w-3 h-3" /> ${cp.targetAmount?.toLocaleString() || 0}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5">
                   <div className="text-[11px] font-medium text-slate-500 space-y-0.5">
                      <div className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-emerald-400"/> {formatDateDisplay(cp.startDate)}</div>
                      <div className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-slate-300"/> {formatDateDisplay(cp.endDate)}</div>
                   </div>
                </td>

                <td className="px-6 py-5">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                    cp.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    cp.status === 'COMPLETED' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                    'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    {cp.status}
                  </span>
                </td>

                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => { setEditingData(cp); setIsEditing(true); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => cp.id && handleDelete(cp.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!campaigns || campaigns.length === 0) && (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 italic">
            <AlertCircle className="w-8 h-8 mb-2 opacity-20" />
            <p>No campaigns found.</p>
          </div>
        )}
      </div>
    </div>
  );
}