import React, { useState, useEffect } from 'react';
import { Save, Globe, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

// --- 1. IMPORT TRÌNH SOẠN THẢO WORD ---
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function Organization() {
  const [orgInfo, setOrgInfo] = useState({
    id: null,
    name: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    logo: '',
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); 

  const API = "http://localhost:8081/api/green_earth/organization_info";

  // --- 2. CẤU HÌNH TOOLBAR CHO TRÌNH SOẠN THẢO ---
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API);
        if (!res.ok) throw new Error("Không thể kết nối đến server");
        
        const result = await res.json();
        let data = result.data || result;

        if (Array.isArray(data)) data = data[0];

        if (data) {
          setOrgInfo({
            id: data.id || null,
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            description: data.description || '',
            logo: data.logo || '',
            facebook: data.facebook || '',
            twitter: data.twitter || '',
            instagram: data.instagram || '',
            youtube: data.youtube || '',
          });
        }
      } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
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
      const isUpdate = !!orgInfo.id;
      const url = isUpdate ? `${API}/${orgInfo.id}` : API; 
      const method = isUpdate ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orgInfo)
      });

      if (!res.ok) throw new Error(`Lỗi ${res.status}`);
      alert("Cập nhật thông tin tổ chức thành công!");
    } catch (err: any) {
      console.error("Chi tiết lỗi:", err);
      alert("Lỗi kết nối Server hoặc CORS!");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto space-y-8 p-4">
      {/* Header Section */}
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
        {/* Left Column: Logo & Socials */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="w-32 h-32 bg-emerald-50 rounded-2xl mx-auto mb-4 flex items-center justify-center overflow-hidden border border-emerald-100">
              {orgInfo.logo ? (
                <img src={orgInfo.logo} alt="logo" className="w-full h-full object-contain p-2" />
              ) : (
                <Globe className="w-12 h-12 text-emerald-600" />
              )}
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Logo URL</h3>
            <input 
              value={orgInfo.logo} 
              onChange={(e) => handleChange("logo", e.target.value)} 
              className="mt-2 w-full text-xs p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20" 
              placeholder="Paste Logo URL here..."
            />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 text-sm flex items-center gap-2">
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
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <input 
                    value={orgInfo[item.field]} 
                    onChange={(e) => handleChange(item.field, e.target.value)} 
                    placeholder={`${item.field} url`}
                    className="flex-1 text-xs bg-slate-50 border border-transparent rounded-lg p-2 outline-none focus:bg-white focus:border-emerald-200 transition-all" 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Main Info & Detailed Description */}
        <div className="md:col-span-2">
          <motion.div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Organization Name</label>
              <input 
                value={orgInfo.name} 
                onChange={(e) => handleChange("name", e.target.value)} 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    value={orgInfo.email} 
                    onChange={(e) => handleChange("email", e.target.value)} 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    value={orgInfo.phone} 
                    onChange={(e) => handleChange("phone", e.target.value)} 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Headquarters Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  value={orgInfo.address} 
                  onChange={(e) => handleChange("address", e.target.value)} 
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl"
                />
              </div>
            </div>

            {/* --- TRÌNH SOẠN THẢO CHI TIẾT --- */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">About Organization (Detailed Content)</label>
              <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                <ReactQuill 
                  theme="snow"
                  value={orgInfo.description}
                  onChange={(content) => handleChange("description", content)}
                  modules={quillModules}
                  placeholder="Tell us about your mission, history and impact..."
                  className="min-h-[300px]"
                />
              </div>
              {/* Custom CSS để Quill trông mượt hơn trong form */}
              <style>{`
                .ql-toolbar.ql-snow { border: none; border-bottom: 1px solid #f1f5f9; background: #f8fafc; }
                .ql-container.ql-snow { border: none; min-height: 250px; font-size: 0.875rem; }
              `}</style>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}