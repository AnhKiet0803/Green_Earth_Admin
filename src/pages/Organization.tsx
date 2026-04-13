import React, { useState, useEffect } from 'react';
import { Save, Globe, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Organization() {
  const [orgInfo, setOrgInfo] = useState({
    id: null,
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    description: '',
    logo: '',
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); 

  const API = "http://localhost:8080/api/green_earth/organization_info";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API);
        const result = await res.json();
        const data = result.data;

        setOrgInfo({
          id: data.id,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          website: data.website || '',
          description: data.description || '',
          logo: data.logo || '',
          facebook: data.facebook || '',
          twitter: data.twitter || '',
          instagram: data.instagram || '',
          youtube: data.youtube || '',
        });
      } catch (err) {
        // Intentionally no-op: page will render with empty fields if API fails.
      } finally {
        setInitialLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (field, value) => {
    setOrgInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await fetch(`${API}/${orgInfo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orgInfo)
      });
      alert("Updated successfully");
    } catch (err) {
      alert("Update error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Organization Info</h1>
          <p className="text-slate-500">Update contact information and introduction about Green Earth.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-emerald-600 rounded-lg text-sm font-medium text-white hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-100 disabled:bg-slate-400"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center"
          >
            <div className="w-32 h-32 bg-emerald-50 rounded-2xl mx-auto mb-4 flex items-center justify-center overflow-hidden border border-emerald-100">
              {orgInfo.logo ? (
                <img src={orgInfo.logo} alt="logo" className="w-full h-full object-cover" />
              ) : (
                <Globe className="w-12 h-12 text-emerald-600" />
              )}
            </div>
            <h3 className="font-bold text-slate-900">Organization Logo</h3>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">URL Link preferred</p>
            <input 
              value={orgInfo.logo} 
              onChange={(e) => handleChange("logo", e.target.value)} 
              className="mt-4 w-full text-xs p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
              placeholder="Paste Logo URL here..."
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
          >
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" /> Social Presence
            </h3>
            <div className="space-y-4">
              {[
                { icon: Facebook, color: "text-blue-600", field: "facebook" },
                { icon: Twitter, color: "text-sky-500", field: "twitter" },
                { icon: Instagram, color: "text-pink-600", field: "instagram" },
                { icon: Youtube, color: "text-red-600", field: "youtube" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 group">
                  <item.icon className={`w-5 h-5 ${item.color} group-hover:scale-110 transition-transform`} />
                  <input 
                    value={orgInfo[item.field]} 
                    onChange={(e) => handleChange(item.field, e.target.value)} 
                    placeholder={`${item.field} url`}
                    className="flex-1 text-sm bg-slate-50 border border-transparent rounded-lg p-2 outline-none focus:bg-white focus:border-emerald-200 transition-all" 
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        <div className="md:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6"
          >
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700 ml-1">Organization Name</label>
              <input 
                value={orgInfo.name} 
                onChange={(e) => handleChange("name", e.target.value)} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                placeholder="Green Earth Vietnam..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    value={orgInfo.email} 
                    onChange={(e) => handleChange("email", e.target.value)} 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition-all"
                    placeholder="contact@greenearth.com"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-sm font-semibold text-slate-700 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    value={orgInfo.phone} 
                    onChange={(e) => handleChange("phone", e.target.value)} 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition-all"
                    placeholder="+84..."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700 ml-1">Headquarters Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input 
                  value={orgInfo.address} 
                  onChange={(e) => handleChange("address", e.target.value)} 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition-all"
                  placeholder="123 Green Street, Hanoi..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700 ml-1">About Organization</label>
              <textarea 
                value={orgInfo.description} 
                onChange={(e) => handleChange("description", e.target.value)} 
                rows={6} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition-all resize-none"
                placeholder="Tell us about your mission..."
              ></textarea>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}