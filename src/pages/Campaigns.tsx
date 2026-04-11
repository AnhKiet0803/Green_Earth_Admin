import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Calendar, MapPin, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const API_URL = "http://localhost:8081/api/green_earth/campaign";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredCampaigns = campaigns.filter(c =>
    (c.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.location && c.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campaign Management</h1>
          <p className="text-slate-500 text-sm">Track and manage environmental campaigns.</p>
        </div>
        <button
          onClick={() => handleGoToEdit()}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 rounded-lg text-sm text-white"
        >
          <Plus className="w-4 h-4" /> Create
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 py-2 border rounded-lg"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredCampaigns.map((campaign) => {
              const goal = Number(campaign.targetAmount) || 0;
              const progress = goal > 0 ? Math.min(Math.round((campaign.raisedAmount || 0) / goal * 100), 100) : 0;

              return (
                <motion.div key={campaign.id} layout className="bg-white rounded-xl shadow p-4">
                  <img src={campaign.image} className="h-40 w-full object-cover rounded" />

                  <h3 className="font-bold mt-2">{campaign.title}</h3>
                  <p className="text-sm text-gray-500">{stripHtml(campaign.description)}</p>

                  <div className="flex justify-between mt-2 text-sm">
                    <span>{progress}%</span>
                    <span>${goal}</span>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button onClick={() => handleGoToEdit(campaign.id)}>
                      <Edit2 />
                    </button>
                    <button onClick={() => handleDelete(campaign.id)}>
                      <Trash2 />
                    </button>
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