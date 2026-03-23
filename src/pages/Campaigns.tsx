import React, { useState } from 'react';
import { Plus, Search, MoreVertical, Edit2, Trash2, ExternalLink, MapPin, Calendar, Target } from 'lucide-react';
import { motion } from 'motion/react';

const initialCampaigns = [
  { id: '1', title: 'Green Cúc Phương Forest', description: 'Plant 10,000 trees in Cúc Phương National Park.', status: 'active', startDate: '2026-01-01', endDate: '2026-12-31', goal: 50000, raised: 32000 },
  { id: '2', title: 'Clean Đà Nẵng Beach', description: 'Plastic waste collection campaign along the coast.', status: 'completed', startDate: '2025-06-01', endDate: '2025-08-31', goal: 10000, raised: 12500 },
  { id: '3', title: 'Clean Energy for Schools', description: 'Install solar power systems for highland schools.', status: 'planned', startDate: '2026-06-01', endDate: '2026-12-31', goal: 100000, raised: 0 },
];

export default function Campaigns() {
  const [campaigns] = useState(initialCampaigns);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campaign Management</h1>
          <p className="text-slate-500">Track and manage environmental improvement campaigns.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 rounded-lg text-sm font-medium text-white hover:bg-emerald-700 transition-colors">
          <Plus className="w-4 h-4" />
          Create New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign, i) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
          >
            <div className="h-48 bg-slate-200 relative">
              <img 
                src={`https://picsum.photos/seed/${campaign.id}/800/600`} 
                alt={campaign.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm ${
                  campaign.status === 'active' ? 'bg-emerald-500 text-white' : 
                  campaign.status === 'completed' ? 'bg-blue-500 text-white' : 'bg-slate-500 text-white'
                }`}>
                  {campaign.status === 'active' ? 'Ongoing' : 
                   campaign.status === 'completed' ? 'Completed' : 'Planned'}
                </span>
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-900 text-lg leading-tight">{campaign.title}</h3>
                <button className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <p className="text-slate-500 text-sm mb-6 line-clamp-2">{campaign.description}</p>
              
              <div className="space-y-4 mt-auto">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Donation Progress</span>
                    <span className="font-bold text-slate-900">{Math.round((campaign.raised / campaign.goal) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-1000"
                      style={{ width: `${Math.min((campaign.raised / campaign.goal) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="text-slate-500">Raised: <span className="font-bold text-slate-900">${campaign.raised.toLocaleString()}</span></span>
                    <span className="text-slate-500">Goal: <span className="font-bold text-slate-900">${campaign.goal.toLocaleString()}</span></span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="w-4 h-4" />
                    {campaign.endDate}
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
