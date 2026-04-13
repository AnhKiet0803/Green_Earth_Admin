<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Calendar, MapPin, Loader2, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
=======
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit2, Trash2, Calendar, MapPin, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { unwrapListData } from '../utils/unwrapListData';
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74

const API_URL = "http://localhost:8080/api/green_earth/campaign";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 
<<<<<<< HEAD
  
  // 1. THIẾT LẬP MẶC ĐỊNH LỌC TỪ ĐẦU NĂM ĐẾN CUỐI NĂM HIỆN TẠI
  const [dateFilter, setDateFilter] = useState(() => {
    const now = new Date();
    // Ngày 1 tháng 1 của năm hiện tại
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
    // Ngày 31 tháng 12 của năm hiện tại
    const lastDayOfYear = new Date(now.getFullYear(), 11, 31);
    
    const formatDate = (date: Date) => {
      const offset = date.getTimezoneOffset();
      const localDate = new Date(date.getTime() - (offset * 60 * 1000));
      return localDate.toISOString().split('T')[0];
    };

    return { 
      start: formatDate(firstDayOfYear), 
      end: formatDate(lastDayOfYear) 
    };
  });

  const navigate = useNavigate();

  const stripHtml = (html: any) => { 
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };
=======
  const debouncedSearch = useDebouncedValue(searchTerm, 350);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    targetAmount: 0,
    image: '',
    searchKeywords: '',
    createdBy: 1
  });
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: '0', size: '500' });
      if (debouncedSearch.trim()) params.set('q', debouncedSearch.trim());
      const response = await fetch(`${API_URL}?${params}`);
      const result = await response.json();
      setCampaigns(unwrapListData(result.data));
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

<<<<<<< HEAD
  const handleGoToEdit = (id?: number) => {
    if (id) {
      navigate(`/admin/campaigns/edit/${id}`);
=======
  const handleOpenModal = (campaign = null) => {
    if (campaign) {
      setCurrentCampaign(campaign);
      setFormData({
        title: campaign.title,
        description: campaign.description,
        location: campaign.location || '',
        startDate: campaign.startDate ? campaign.startDate.split('T')[0] : '',
        endDate: campaign.endDate ? campaign.endDate.split('T')[0] : '',
        targetAmount: campaign.targetAmount,
        image: campaign.image || '',
        searchKeywords: campaign.searchKeywords || '',
        createdBy: 1
      });
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
    } else {
      setCurrentCampaign(null);
      setFormData({ title: '', description: '', location: '', startDate: '', endDate: '', targetAmount: 0, image: '', searchKeywords: '', createdBy: 1 });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const isUpdate = !!currentCampaign;
    const url = isUpdate ? `${API_URL}/${currentCampaign.id}` : API_URL;
    const method = isUpdate ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchCampaigns();
        setIsModalOpen(false);
      }
    } catch (error) {
      alert("Action failed!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this campaign?")) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) fetchCampaigns();
    } catch (error) {
      alert("Delete failed");
    }
  };

<<<<<<< HEAD
  // 2. LOGIC LỌC TỔNG HỢP: Tên/Địa điểm + Khoảng ngày BẮT ĐẦU chiến dịch
  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = (c.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.location && c.location.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Lấy ngày bắt đầu của chiến dịch (startDate)
    const campaignStartDate = new Date(c.startDate);
    campaignStartDate.setHours(0, 0, 0, 0);

    const filterStart = new Date(dateFilter.start);
    filterStart.setHours(0, 0, 0, 0);

    const filterEnd = new Date(dateFilter.end);
    filterEnd.setHours(23, 59, 59, 999);

    const matchesDate = campaignStartDate >= filterStart && campaignStartDate <= filterEnd;

    return matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">Campaign Management</h1>
          <p className="text-slate-500 text-sm italic">
            Campaigns starting between {new Date(dateFilter.start).toLocaleDateString('vi-VN')} and {new Date(dateFilter.end).toLocaleDateString('vi-VN')}
          </p>
        </div>
        <button 
          onClick={() => handleGoToEdit()}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 rounded-xl text-sm font-bold text-white hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all active:scale-95"
=======
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campaign Management</h1>
          <p className="text-slate-500">Track and manage environmental improvement campaigns.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 rounded-lg text-sm font-medium text-white hover:bg-emerald-700 transition-all shadow-md active:scale-95"
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
        >
          <Plus className="w-4 h-4" /> Create New Campaign
        </button>
      </div>

<<<<<<< HEAD
      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Ô tìm kiếm */}
        <div className="lg:col-span-2 relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group focus-within:border-emerald-500 transition-all">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500" />
=======
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
          <input 
            type="text" 
            placeholder="Tìm theo tiêu đề, địa điểm hoặc từ khóa..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 text-sm outline-none bg-transparent"
          />
        </div>

        {/* Ô lọc ngày */}
        <div className="lg:col-span-2 flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 border-r pr-3">
            <Filter className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Starts</span>
          </div>
          <div className="flex items-center gap-2 flex-1 justify-around">
            <input 
              type="date" 
              className="text-xs font-bold text-slate-600 outline-none cursor-pointer hover:text-emerald-600 transition-colors"
              value={dateFilter.start}
              onChange={(e) => setDateFilter({...dateFilter, start: e.target.value})}
            />
            <span className="text-slate-300">→</span>
            <input 
              type="date" 
              className="text-xs font-bold text-slate-600 outline-none cursor-pointer hover:text-emerald-600 transition-colors"
              value={dateFilter.end}
              onChange={(e) => setDateFilter({...dateFilter, end: e.target.value})}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 className="w-12 h-12 animate-spin text-emerald-600" /></div>
      ) : (
<<<<<<< HEAD
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode='popLayout'>
            {filteredCampaigns.map((campaign) => {
              const totalRaised = donations
                .filter(d => 
                  String(d.campaignId) === String(campaign.id) || 
                  d.campaignName?.trim() === campaign.title?.trim()
                )
                .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

              const goal = Number(campaign.targetAmount) || 0;
              const progress = goal > 0 ? Math.min(Math.round((totalRaised / goal) * 100), 100) : 0;

              const now = new Date();
              now.setHours(0, 0, 0, 0); 
              const end = campaign.endDate ? new Date(campaign.endDate) : null;
              const isExpired = end && now > end;
              const status = (progress >= 100 || isExpired) ? 'COMPLETED' : (campaign.status || 'ONGOING');

=======
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AnimatePresence mode='popLayout'>
            {campaigns.map((campaign, i) => {
              const progress = campaign.progressPercentage || 0;
              const status = campaign.status || 'PLANNED';
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
              return (
                <motion.div
                  key={campaign.id}
                  layout
<<<<<<< HEAD
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
                    status === 'COMPLETED' ? 'grayscale-[0.5]' : ''
                  }`}
                >
                  <div className="h-52 bg-slate-200 relative overflow-hidden font-sans">
                    <img 
                      src={campaign.image || `https://picsum.photos/seed/${campaign.id}/800/600`} 
                      className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110`}
                    />
                    <div className="absolute top-4 right-4 z-10">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-lg border backdrop-blur-md ${
                        status === 'COMPLETED' ? 'bg-blue-500/90 text-white border-blue-400' : 'bg-emerald-500/90 text-white border-emerald-400'
=======
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all"
                >
                  <div className="h-48 bg-slate-200 relative">
                    <img 
                      src={campaign.image || `https://picsum.photos/seed/${campaign.id}/800/600`} 
                      alt={campaign.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm ${
                        status === 'ONGOING' ? 'bg-emerald-500 text-white' : 
                        status === 'COMPLETED' ? 'bg-blue-500 text-white' : 'bg-slate-500 text-white'
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
                      }`}>
                        {status}
                      </span>
                    </div>
                  </div>

<<<<<<< HEAD
                  <div className="p-7 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-black text-xl leading-tight line-clamp-1 text-slate-900 group-hover:text-emerald-600 transition-colors pr-2">
                        {campaign.title}
                      </h3>
                      <div className="flex gap-2 shrink-0">
                         <button onClick={() => handleGoToEdit(campaign.id)} className="p-2 bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-xl transition-all shadow-sm">
                           <Edit2 className="w-4 h-4" />
                         </button>
                         <button onClick={() => handleDelete(campaign.id)} className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-all shadow-sm">
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                    </div>

                    <p className="text-slate-500 text-sm mb-6 line-clamp-2 italic leading-relaxed">
                        {stripHtml(campaign.description)}
                    </p>
=======
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-emerald-600 transition-colors">{campaign.title}</h3>
                      <div className="flex gap-1">
                         <button onClick={() => handleOpenModal(campaign)} className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                         </button>
                         <button onClick={() => handleDelete(campaign.id)} className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                    </div>
                    <p className="text-slate-500 text-sm mb-6 line-clamp-2">{campaign.description}</p>
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
                    
                    <div className="space-y-5 mt-auto">
                      <div>
<<<<<<< HEAD
                        <div className="flex justify-between text-xs mb-2 font-black uppercase tracking-tighter">
                          <span className="text-slate-400">Progress: {progress}%</span>
                          <span className={status === 'COMPLETED' ? 'text-blue-600' : 'text-emerald-600'}>
                            ${totalRaised.toLocaleString()} / ${goal.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
=======
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-500">Donation Progress</span>
                          <span className="font-bold text-slate-900">{progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
                          <motion.div 
                            key={`${campaign.id}-${totalRaised}`}
                            initial={{ width: 0 }}
<<<<<<< HEAD
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className={`h-full rounded-full ${status === 'COMPLETED' ? 'bg-blue-500' : 'bg-emerald-600'}`}
                          />
                        </div>
                      </div>

                      <div className="pt-5 border-t border-slate-50 flex items-center justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                          <Calendar className={`w-4 h-4 ${isExpired ? 'text-red-500' : 'text-emerald-500'}`} />
                          {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString('en-GB') : 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 text-right">
                          <MapPin className="w-4 h-4 text-emerald-500" />
                          <span className="truncate max-w-[120px]">{campaign.location || 'Global'}</span>
=======
                            animate={{ width: `${Math.min(progress, 100)}%` }}
                            transition={{ duration: 1 }}
                            className="h-full bg-emerald-500"
                          ></motion.div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs">
                          <span className="text-slate-500 text-[11px]">Raised: <span className="font-bold text-slate-900">${campaign.raisedAmount?.toLocaleString()}</span></span>
                          <span className="text-slate-500 text-[11px]">Goal: <span className="font-bold text-slate-900">${campaign.targetAmount?.toLocaleString()}</span></span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                          {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString('en-GB') : 'N/A'}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="truncate max-w-[80px] font-medium">{campaign.location || 'Global'}</span>
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
<<<<<<< HEAD
      
      {!loading && filteredCampaigns.length === 0 && (
        <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 text-slate-300 flex flex-col items-center gap-4">
          <Filter className="w-12 h-12 opacity-20" />
          <p className="font-serif text-lg">No campaigns found starting in this period.</p>
        </div>
      )}
=======
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">{currentCampaign ? 'Update Campaign' : 'Create Campaign'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Campaign Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Description</label>
                  <textarea rows="3" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Từ khóa tìm kiếm</label>
                  <p className="text-xs text-slate-500">Gợi ý thêm cho thanh tìm (có thể phân cách bằng dấu phẩy).</p>
                  <textarea rows="2" value={formData.searchKeywords} onChange={e => setFormData({...formData, searchKeywords: e.target.value})}
                  className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none" placeholder="ví dụ: gây quỹ, tái chế, Hà Nội" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">Location</label>
                    <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">Goal ($)</label>
                    <input type="number" required value={formData.targetAmount} onChange={e => setFormData({...formData, targetAmount: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">Start Date</label>
                    <input type="date" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">End Date</label>
                    <input type="date" required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Image Link</label>
                  <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="https://..." />
                </div>
                <button type="submit" className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all active:scale-[0.98] mt-2">
                  Save Campaign
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
    </div>
  );
}