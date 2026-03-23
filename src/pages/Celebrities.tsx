import React, { useState } from 'react';
import { Plus, Search, Star, MoreVertical, Edit2, Trash2, Instagram, Twitter } from 'lucide-react';
import { motion } from 'motion/react';

const initialCelebrities = [
  { id: '1', name: 'Leonardo DiCaprio', role: 'UN Environmental Ambassador', image: 'LD' },
  { id: '2', name: 'Greta Thunberg', role: 'Climate Activist', image: 'GT' },
  { id: '3', name: 'David Attenborough', role: 'Naturalist', image: 'DA' },
];

export default function Celebrities() {
  const [celebrities] = useState(initialCelebrities);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Celebrities</h1>
          <p className="text-slate-500">Manage ambassadors and influential figures participating with the organization.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 rounded-lg text-sm font-medium text-white hover:bg-emerald-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Celebrity
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {celebrities.map((person, i) => (
          <motion.div
            key={person.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center group relative overflow-hidden"
          >
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1.5 hover:bg-slate-100 rounded-lg">
                <MoreVertical className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="w-24 h-24 bg-emerald-50 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-emerald-600 border-4 border-white shadow-md">
              {person.image}
            </div>
            
            <h3 className="font-bold text-slate-900 text-lg">{person.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{person.role}</p>
            
            <div className="flex justify-center gap-3 mb-6">
              <button className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                <Twitter className="w-4 h-4" />
              </button>
              <button className="p-2 bg-slate-50 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-colors">
                <Instagram className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center gap-2 py-2 bg-slate-50 hover:bg-blue-50 text-blue-600 rounded-lg text-xs font-bold transition-colors">
                <Edit2 className="w-3 h-3" />
                Edit
              </button>
              <button className="flex items-center justify-center gap-2 py-2 bg-slate-50 hover:bg-red-50 text-red-600 rounded-lg text-xs font-bold transition-colors">
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
