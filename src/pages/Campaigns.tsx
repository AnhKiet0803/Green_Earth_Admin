import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Calendar, MapPin, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const API_URL = "http://localhost:8080/api/green_earth/campaign";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 
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
    createdBy: 1
  });

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const result = await response.json();
      setCampaigns(result.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        createdBy: 1
      });
    } else {
      setCurrentCampaign(null);
      setFormData({ title: '', description: '', location: '', startDate: '', endDate: '', targetAmount: 0, image: '', createdBy: 1 });
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

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-emerald-600" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AnimatePresence mode='popLayout'>
            {filteredCampaigns.map((campaign, i) => {
              const progress = campaign.progressPercentage || 0;
              const status = campaign.status || 'PLANNED';
              return (
                <motion.div
                  key={campaign.id}
                  layout
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
                      }`}>
                        {status}
                      </span>
                    </div>
                  </div>

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
                    
                    <div className="space-y-4 mt-auto">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-500">Donation Progress</span>
                          <span className="font-bold text-slate-900">{progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
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
    </div>
  );
}