import React, { useState } from 'react';
import { Plus, Search, Heart, Building2, MoreVertical, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

const initialSponsors = [
  { id: '1', name: 'EcoCorp Vietnam', type: 'company', contribution: 'Sponsored 50,000 trees', logo: 'EC' },
  { id: '2', name: 'Green Environment Fund', type: 'organization', contribution: 'Technical & expert support', logo: 'GE' },
  { id: '3', name: 'SolarTech Solutions', type: 'company', contribution: 'Sponsored solar power systems', logo: 'ST' },
];

export default function Sponsors() {
  const [sponsors] = useState(initialSponsors);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sponsor List</h1>
          <p className="text-slate-500">Manage partners and companies supporting green earth work.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 rounded-lg text-sm font-medium text-white hover:bg-emerald-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Sponsor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sponsors.map((sponsor, i) => (
          <motion.div
            key={sponsor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-xl font-bold text-slate-400">
                {sponsor.logo}
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

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-lg">{sponsor.name}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  sponsor.type === 'company' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {sponsor.type === 'company' ? 'Company' : 'Organization'}
                </span>
              </div>
              <p className="text-sm text-slate-500 flex items-center gap-2">
                <Heart className="w-4 h-4 text-emerald-500" />
                {sponsor.contribution}
              </p>
            </div>

            <button className="mt-auto w-full py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-600 flex items-center justify-center gap-2 transition-colors">
              <ExternalLink className="w-4 h-4" />
              View Partner Profile
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
