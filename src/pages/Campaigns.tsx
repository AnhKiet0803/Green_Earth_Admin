import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Calendar, MapPin, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';



const API_URL = "http://localhost:8081/api/green_earth/campaign";
const DONATION_API = "http://localhost:8081/api/green_earth/donation";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<any>(null);

  const [formData, setFormData] = useState<any>({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    targetAmount: 0,
    image: '',
    createdBy: 1
  });

  // Hàm helper: Chỉ dùng để cắt chữ hiển thị trên thẻ Card (không dùng cho Modal nữa)
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

  const filteredCampaigns = campaigns.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.location && c.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenModal = (campaign: any = null) => {
    if (campaign) {
      setCurrentCampaign(campaign);
      setFormData({
        title: campaign.title,
        // QUAN TRỌNG: Giữ nguyên HTML để ReactQuill hiển thị đúng định dạng và ảnh
        description: campaign.description || '', 
        location: campaign.location || '',
        startDate: campaign.startDate ? campaign.startDate.split('T')[0] : '',
        endDate: campaign.endDate ? campaign.endDate.split('T')[0] : '',
        targetAmount: campaign.targetAmount,
        image: campaign.image || '',
        createdBy: 1
      });
    } else {
      setCurrentCampaign(null);
      setFormData({ title: '', description: '', location: '', startDate: '', endDate: '', targetAmount: 0, image: '', createdBy: 1 });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e:any) => {
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
        fetchAllData();
        setIsModalOpen(false);
      } else {
          alert("Lưu thất bại! Vui lòng kiểm tra lại dữ liệu.");
      }
    } catch (error) {
      alert("Lỗi kết nối Server!");
    }
  };

  const handleDelete = async (id:any) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa chiến dịch này?")) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) fetchAllData();
    } catch (error) {
      alert("Xóa thất bại");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header và Thanh tìm kiếm */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campaign Management</h1>
          <p className="text-slate-500">Track and manage environmental improvement campaigns.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 rounded-lg text-sm font-medium text-white hover:bg-emerald-700 transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" /> Create New Campaign
        </button>
      </div>

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

      {/* Hiển thị danh sách Card */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-emerald-600" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AnimatePresence mode='popLayout'>
            {filteredCampaigns.map((campaign) => {
              const totalRaised = donations
                .filter(d => 
                  String(d.campaignId) === String(campaign.id) || 
                  d.campaignName?.trim() === campaign.title?.trim()
                )
                .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

              const goal = Number(campaign.targetAmount) || 0;
              let progress = 0;
              if (goal > 0) {
                const rawProgress = (totalRaised / goal) * 100;
                progress = totalRaised > 0 && rawProgress < 1 ? 1 : Math.min(Math.round(rawProgress), 100);
              }

              const status = (progress >= 100) ? 'COMPLETED' : (campaign.status || 'PLANNED');

              return (
                <motion.div
                  key={campaign.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
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
                      }`}>{status}</span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-emerald-600 transition-colors line-clamp-1">{campaign.title}</h3>
                      <div className="flex gap-1 shrink-0">
                         <button onClick={() => handleOpenModal(campaign)} className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                         <button onClick={() => handleDelete(campaign.id)} className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>

                    {/* Vẫn dùng stripHtml ở đây để hiển thị bản xem trước gọn gàng */}
                    <p className="text-slate-500 text-sm mb-6 line-clamp-2">
                        {stripHtml(campaign.description)}
                    </p>
                    
                    <div className="space-y-4 mt-auto">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-500">Donation Progress</span>
                          <span className="font-bold text-slate-900">{progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1 }}
                            className="h-full bg-emerald-500"
                          ></motion.div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs">
                          <span className="text-slate-500 text-[11px]">Raised: <span className="font-bold text-slate-900">${totalRaised.toLocaleString()}</span></span>
                          <span className="text-slate-500 text-[11px]">Goal: <span className="font-bold text-slate-900">${goal.toLocaleString()}</span></span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-slate-500">
                        <div className="flex items-center gap-2 text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                          {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString('en-GB') : 'N/A'}
                        </div>
                        <div className="flex items-center gap-1 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="truncate max-w-[80px] font-medium">{campaign.location || 'Global'}</span>
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

      {/* MODAL FORM TẠO/SỬA CHIẾN DỊCH */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            
            {/* Tăng chiều rộng Modal (max-w-4xl) để có không gian viết bài dài */}
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b flex items-center justify-between bg-slate-50">
                <h2 className="text-xl font-bold text-slate-900">{currentCampaign ? 'Update Campaign' : 'Create Campaign'}</h2>
                <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
              </div>

              <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-6">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Campaign Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>
                
                {/* --- TRÌNH SOẠN THẢO BÀI VIẾT --- */}
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Detailed Description (Supports formatting & images)</label>
                  
                  {/* Cấu hình chiều cao cho Quill để soạn bài dài dễ dàng */}
                  <div className="h-[300px] mb-12">
                    <ReactQuill 
                      theme="snow"
                      value={formData.description}
                      onChange={(content:any) => setFormData({...formData, description: content})}
                      className="h-full bg-white"
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          [{ 'color': [] }, { 'background': [] }],
                          ['link', 'image'],
                          ['clean']
                        ],
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">Location</label>
                    <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">Goal ($)</label>
                    <input type="number" required value={formData.targetAmount} onChange={e => setFormData({...formData, targetAmount: Number(e.target.value)})} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">Start Date</label>
                    <input type="date" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full px-4 py-2 border rounded-xl outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">End Date</label>
                    <input type="date" required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full px-4 py-2 border rounded-xl outline-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Thumbnail Image URL</label>
                  <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="https://..." />
                </div>

                <div className="pt-4 pb-2">
                    <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all active:scale-[0.98] shadow-lg shadow-emerald-200">
                    Save Campaign
                    </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}