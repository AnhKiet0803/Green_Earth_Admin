import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, DollarSign, MapPin, Calendar, Type, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const API_URL = "http://localhost:8081/api/green_earth/campaign";

export default function EditCampaign() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`);
        const result = await response.json();
        const data = result.data || result; // Phòng trường hợp API bọc thêm object data
        
        setFormData({
          title: data.title || '',
          description: data.description || '',
          location: data.location || '',
          targetAmount: data.targetAmount || 0,
          startDate: data.startDate ? data.startDate.split('T')[0] : '',
          endDate: data.endDate ? data.endDate.split('T')[0] : '',
          image: data.image || '',
          createdBy: data.createdBy?.id || data.createdBy || 1
        });
      } catch (error) {
        alert("Lỗi tải thông tin chiến dịch");
        navigate('/admin/campaigns');
      } finally {
        setFetching(false);
      }
    };
    fetchCampaign();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validate ngày tháng (Tránh ngày kết thúc nhỏ hơn ngày bắt đầu)
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      alert("End date cannot be earlier than start date!");
      return;
    }

    setLoading(true);

    // 2. Tính toán lại Status phòng trường hợp User sửa ngày làm thay đổi trạng thái
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    let calculatedStatus = "ongoing"; 
    if (now < start) calculatedStatus = "upcoming";
    else if (now > end) calculatedStatus = "completed";

    // 3. Chuẩn bị dữ liệu gửi đi (Chỉ dùng CamelCase và thêm Status)
    const dataToSend = {
      ...formData,
      status: calculatedStatus 
      // Tuyệt đối không gửi raisedAmount hay progressPercentage ở đây để tránh reset tiền
    };

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        navigate('/admin/campaigns');
      } else {
        const errText = await response.text();
        alert("Lỗi khi cập nhật: " + errText);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Không thể kết nối đến server!");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Loading Campaign...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10 text-left">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Discard Changes
        </button>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-blue-50/30">
          <h1 className="text-2xl font-bold text-slate-900">Edit Campaign</h1>
          <p className="text-slate-500 text-sm mt-1">Adjusting goals or details for: <span className="text-blue-600 font-semibold">{formData.title}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase ml-1"><Type className="w-3.5 h-3.5 text-blue-500" /> Campaign Title</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-lg" />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase ml-1">Detailed Description</label>
            <div className="h-[300px] mb-12">
              <ReactQuill theme="snow" value={formData.description} onChange={(val:string) => setFormData({...formData, description: val})} className="h-full bg-slate-50 rounded-2xl overflow-hidden border-slate-100" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase ml-1"><DollarSign className="w-3.5 h-3.5 text-blue-500" /> Target Goal ($)</label>
              <input required type="number" value={formData.targetAmount} onChange={e => setFormData({...formData, targetAmount: Number(e.target.value)})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium" />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase ml-1"><MapPin className="w-3.5 h-3.5 text-blue-500" /> Location</label>
              <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase ml-1"><Calendar className="w-3.5 h-3.5 text-blue-500" /> Start Date</label>
              <input required type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium cursor-pointer" />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase ml-1"><Calendar className="w-3.5 h-3.5 text-blue-500" /> End Date</label>
              <input 
                required 
                type="date" 
                min={formData.startDate} // Ràng buộc không cho ngày kết thúc nhỏ hơn ngày bắt đầu
                value={formData.endDate} 
                onChange={e => setFormData({...formData, endDate: e.target.value})} 
                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium cursor-pointer" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase ml-1"><ImageIcon className="w-3.5 h-3.5 text-blue-500" /> Image URL</label>
            <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium" />
          </div>

          <div className="pt-6">
            <button disabled={loading} type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              {loading ? "Processing..." : <><Save className="w-4 h-4" /> Save Changes</>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}