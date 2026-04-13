import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Calendar, MapPin, Loader2, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const API_URL = "http://localhost:8081/api/green_earth/campaign";
const DONATION_API = "http://localhost:8081/api/green_earth/donation";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 
  
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

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [campRes, donRes] = await Promise.all([
        fetch(API_URL),
        fetch(DONATION_API)
      ]);
      
      const campResult = await campRes.json();
      const donResult = await donRes.json();

      setCampaigns(campResult.data || []);
      setDonations(donResult.data || donResult || []); 
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleGoToEdit = (id?: number) => {
    if (id) {
      navigate(`/admin/campaigns/edit/${id}`);
    } else {
      navigate(`/admin/campaigns/create`);
    }
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa chiến dịch này?")) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) fetchAllData();
    } catch (error) {
      alert("Xóa thất bại");
    }
  };

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
        >
          <Plus className="w-4 h-4" /> Create New Campaign
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Ô tìm kiếm */}
        <div className="lg:col-span-2 relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group focus-within:border-emerald-500 transition-all">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500" />
          <input 
            type="text" 
            placeholder="Search campaigns by title or location..." 
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

      {/* Grid List */}
      {loading ? (
        <div className="flex justify-center py-24"><Loader2 className="w-12 h-12 animate-spin text-emerald-600" /></div>
      ) : (
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

              return (
                <motion.div
                  key={campaign.id}
                  layout
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
                      }`}>
                        {status}
                      </span>
                    </div>
                  </div>

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
                    
                    <div className="space-y-5 mt-auto">
                      <div>
                        <div className="flex justify-between text-xs mb-2 font-black uppercase tracking-tighter">
                          <span className="text-slate-400">Progress: {progress}%</span>
                          <span className={status === 'COMPLETED' ? 'text-blue-600' : 'text-emerald-600'}>
                            ${totalRaised.toLocaleString()} / ${goal.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                          <motion.div 
                            key={`${campaign.id}-${totalRaised}`}
                            initial={{ width: 0 }}
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
      
      {!loading && filteredCampaigns.length === 0 && (
        <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 text-slate-300 flex flex-col items-center gap-4">
          <Filter className="w-12 h-12 opacity-20" />
          <p className="font-serif text-lg">No campaigns found starting in this period.</p>
        </div>
      )}
    </div>
  );
}