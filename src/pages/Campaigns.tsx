import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Calendar, MapPin, X, Loader2, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const API_URL = "http://localhost:8081/api/green_earth/campaign";
const DONATION_API = "http://localhost:8081/api/green_earth/donation";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 
  
  const navigate = useNavigate(); // Hook để điều hướng

  // Hàm helper: Bóc tách HTML an toàn
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

  // Hàm điều hướng sang trang con
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

  const filteredCampaigns = campaigns.filter(c => 
    (c.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.location && c.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campaign Management</h1>
          <p className="text-slate-500 text-sm">Track and manage environmental improvement campaigns.</p>
        </div>
        <button 
          onClick={() => handleGoToEdit()}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 rounded-lg text-sm font-medium text-white hover:bg-emerald-700 shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Create New Campaign
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search campaigns by title or location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-emerald-600" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode='popLayout'>
            {filteredCampaigns.map((campaign) => {
              // 1. Tính toán số tiền đã quyên góp
              const totalRaised = donations
                .filter(d => 
                  String(d.campaignId) === String(campaign.id) || 
                  d.campaignName?.trim() === campaign.title?.trim()
                )
                .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

              const goal = Number(campaign.targetAmount) || 0;
              const progress = goal > 0 ? Math.min(Math.round((totalRaised / goal) * 100), 100) : 0;

              // 2. LOGIC TRẠNG THÁI
              const now = new Date();
              now.setHours(0, 0, 0, 0); 
              const end = campaign.endDate ? new Date(campaign.endDate) : null;
              const isExpired = end && now > end;
              const status = (progress >= 100 || isExpired) ? 'COMPLETED' : (campaign.status || 'ONGOING');

              return (
                <motion.div
                  key={campaign.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all ${
                    status === 'COMPLETED' ? 'opacity-90' : ''
                  }`}
                >
                  <div className="h-48 bg-slate-200 relative overflow-hidden">
                    <img 
                      src={campaign.image || `https://picsum.photos/seed/${campaign.id}/800/600`} 
                      alt={campaign.title}
                      className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${status === 'COMPLETED' ? 'grayscale opacity-80' : ''}`}
                    />
                    
                    <div className="absolute top-4 right-4 z-10">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm border backdrop-blur-sm ${
                        status === 'COMPLETED' 
                          ? 'bg-blue-500/90 text-white border-blue-600' 
                          : 'bg-emerald-500/90 text-white border-emerald-600'
                      }`}>
                        {status}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-bold text-lg leading-tight line-clamp-1 group-hover:text-emerald-600 transition-colors pr-2 ${status === 'COMPLETED' ? 'text-slate-500' : 'text-slate-900'}`}>
                        {campaign.title}
                      </h3>
                      <div className="flex gap-1 shrink-0">
                         {/* Nút Sửa điều hướng */}
                         <button 
                           onClick={() => handleGoToEdit(campaign.id)} 
                           className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                         >
                           <Edit2 className="w-4 h-4" />
                         </button>
                         <button 
                           onClick={() => handleDelete(campaign.id)} 
                           className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                    </div>

                    <p className="text-slate-500 text-xs mb-4 line-clamp-2">
                        {stripHtml(campaign.description)}
                    </p>
                    
                    <div className="space-y-4 mt-auto">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1 font-bold">
                          <span className="text-slate-400">Progress: {progress}%</span>
                          <span className={status === 'COMPLETED' ? 'text-blue-600' : 'text-emerald-600'}>
                            ${totalRaised.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className={`h-full ${status === 'COMPLETED' ? 'bg-blue-500' : 'bg-emerald-500'}`}
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <div className="flex items-center gap-1.5">
                          <Calendar className={`w-3 h-3 ${isExpired ? 'text-red-500' : 'text-emerald-500'}`} />
                          {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString('en-GB') : 'N/A'}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-emerald-500" />
                          <span className="truncate max-w-[80px]">{campaign.location || 'Global'}</span>
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
    </div>
  );
}