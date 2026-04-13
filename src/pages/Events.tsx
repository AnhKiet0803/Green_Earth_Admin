<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Calendar, MapPin, X, Loader2, Users, Mail, Phone, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
=======
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Calendar as CalendarIcon, MapPin, Users, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { unwrapListData } from '../utils/unwrapListData';
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74

const API_URL = "http://localhost:8080/api/green_earth/event";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const [searchTerm, setSearchTerm] = useState(""); 
  const [isViewParticipantsOpen, setIsViewParticipantsOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<any>(null);

  // 1. THIẾT LẬP MẶC ĐỊNH LỌC TỪ ĐẦU NĂM ĐẾN CUỐI NĂM
  const [dateFilter, setDateFilter] = useState(() => {
    const now = new Date();
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
    const lastDayOfYear = new Date(now.getFullYear(), 11, 31);
    
    const formatDate = (date: Date) => {
      const offset = date.getTimezoneOffset();
      const localDate = new Date(date.getTime() - (offset * 60 * 1000));
      return localDate.toISOString().split('T')[0];
    };
    return { start: formatDate(firstDayOfYear), end: formatDate(lastDayOfYear) };
  });
  
  const navigate = useNavigate();
=======
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerm, 350);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    description: '',
    location: '',
    eventDate: '',
    image: '',
    searchKeywords: '',
    participants: 0,
    status: 'upcoming',
    createdBy: 1 
  });
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: '0', size: '500' });
      if (debouncedSearch.trim()) params.set('q', debouncedSearch.trim());
      const response = await fetch(`${API_URL}?${params}`);
      const result = await response.json();
      setEvents(unwrapListData(result.data));
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

<<<<<<< HEAD
  const handleGoToEdit = (id?: number) => {
    if (id) {
      navigate(`/admin/events/edit/${id}`);
    } else {
      navigate(`/admin/events/create`);
=======
  const openModal = (event = null) => {
    if (event) {
      const formattedDate = event.eventDate ? event.eventDate.split('T')[0] : "";
      setFormData({ 
        ...event, 
        eventDate: formattedDate, 
        createdBy: 1 
      });
    } else {
      setFormData({ 
        id: null, title: '', description: '', location: '', 
        eventDate: new Date().toISOString().split('T')[0], 
        image: '', searchKeywords: '', participants: 0, status: 'upcoming', createdBy: 1 
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const isUpdate = !!formData.id;
    const url = isUpdate ? `${API_URL}/${formData.id}` : API_URL;
    const method = isUpdate ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchEvents();
        setIsModalOpen(false);
      }
    } catch (error) {
      alert("Action failed!");
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) fetchEvents();
    } catch (error) {
      alert("Delete failed!");
    }
  };

<<<<<<< HEAD
  // 2. LOGIC LỌC TỔNG HỢP: Search + Khoảng ngày Event
  const filteredEvents = events.filter(e => {
    const matchesSearch = (e.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (e.location && e.location.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const eventDay = new Date(e.eventDate);
    const startDate = new Date(dateFilter.start);
    const endDate = new Date(dateFilter.end);
    endDate.setHours(23, 59, 59, 999);

    const matchesDate = eventDay >= startDate && eventDay <= endDate;

    return matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">Event Management</h1>
          <p className="text-slate-500 text-sm">
             Events from {new Date(dateFilter.start).toLocaleDateString('vi-VN')} to {new Date(dateFilter.end).toLocaleDateString('vi-VN')}
          </p>
        </div>
        <button 
          onClick={() => handleGoToEdit()} 
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 rounded-xl text-sm font-bold text-white hover:bg-emerald-700 shadow-lg transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Create Event
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search events by title or location..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-12 pr-4 py-3.5 text-sm outline-none bg-transparent" 
          />
        </div>

        <div className="lg:col-span-2 flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 border-r pr-3">
            <Filter className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Period</span>
          </div>
          <div className="flex items-center gap-2 flex-1 justify-around">
            <input 
              type="date" 
              className="text-xs font-bold text-slate-600 outline-none cursor-pointer"
              value={dateFilter.start}
              onChange={(e) => setDateFilter({...dateFilter, start: e.target.value})}
            />
            <span className="text-slate-300">→</span>
            <input 
              type="date" 
              className="text-xs font-bold text-slate-600 outline-none cursor-pointer"
              value={dateFilter.end}
              onChange={(e) => setDateFilter({...dateFilter, end: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="flex justify-center py-24"><Loader2 className="w-12 h-12 animate-spin text-emerald-600" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode='popLayout'>
            {filteredEvents.map((event) => {
              const eventRegs = participants.filter(p => 
                String(p.event?.id) === String(event.id) || String(p.eventId) === String(event.id) || String(p.event_id) === String(event.id)
              );

              return (
                <motion.div 
                    key={event.id} 
                    layout 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, scale: 0.95 }} 
                    className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300"
                >
                  <div className="h-52 bg-slate-200 relative overflow-hidden">
                    <img src={event.image || `https://picsum.photos/seed/${event.id}/800/600`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black text-emerald-700 flex items-center gap-1.5 shadow-md border border-emerald-50">
                        <Users className="w-3.5 h-3.5" /> {eventRegs.length} Joined
                      </span>
                    </div>
                  </div>

                  <div className="p-7 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-black text-slate-900 text-xl leading-tight line-clamp-1 group-hover:text-emerald-600 transition-colors pr-2">{event.title}</h3>
                      <div className="flex gap-2 shrink-0">
                         <button onClick={() => { setCurrentEvent(event); setIsViewParticipantsOpen(true); }} className="p-2 bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-xl transition-all" title="View Participants"><Users className="w-4 h-4" /></button>
                         <button onClick={() => handleGoToEdit(event.id)} className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all"><Edit2 className="w-4 h-4" /></button>
                         <button onClick={() => handleDelete(event.id)} className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>

                    <p className="text-slate-500 text-sm mb-6 line-clamp-2 italic leading-relaxed">{stripHtml(event.description)}</p>
                    
                    <div className="pt-5 border-t border-slate-50 flex items-center justify-between mt-auto text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-500" /> 
                        {event.eventDate ? new Date(event.eventDate).toLocaleDateString('en-GB') : 'TBD'}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-500" /> 
                        <span className="truncate max-w-[100px]">{event.location || 'Global'}</span>
                      </div>
=======
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Event Management</h1>
          <p className="text-slate-500">Organize and track community activities.</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 rounded-lg text-sm font-medium text-white hover:bg-emerald-700 transition-all shadow-md">
          <Plus className="w-4 h-4" /> Add New Event
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" placeholder="Tìm theo tiêu đề, địa điểm hoặc từ khóa..." value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
          />
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Event</th>
                <th className="px-6 py-4 text-center">Participants</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="4" className="py-10 text-center"><Loader2 className="animate-spin mx-auto text-emerald-600" /></td></tr>
              ) : events.map((event, idx) => (
                <motion.tr key={event.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={event.image || 'https://placehold.co/100'} className="w-12 h-10 rounded-lg object-cover" alt="" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">{event.title}</p>
                        <p className="text-xs text-slate-500">{new Date(event.eventDate).toLocaleDateString('en-GB')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-700">
                      <Users className="w-4 h-4 text-emerald-500" />
                      {event.participantNames ? event.participantNames.length : 0}
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      event.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 
                      event.status === 'ongoing' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openModal(event)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(event.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
<<<<<<< HEAD
      )}
      {!loading && filteredEvents.length === 0 && (
        <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 text-slate-300 flex flex-col items-center gap-4">
          <Filter className="w-12 h-12 opacity-20" />
          <p className="font-serif text-lg">No events found in this period.</p>
        </div>
      )}

      {/* MODAL DANH SÁCH NGƯỜI THAM GIA GIỮ NGUYÊN */}
=======
      </div>
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">{formData.id ? 'Update Event' : 'Create Event'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                  />
                </div>
<<<<<<< HEAD
                <button onClick={() => setIsViewParticipantsOpen(false)} className="p-3 hover:bg-white rounded-full transition-all shadow-sm"><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <div className="overflow-y-auto p-8">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-100">
                      <th className="pb-4 px-2">Participant Name</th>
                      <th className="pb-4 px-2">Contact Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {participants.filter(p => String(p.event?.id) === String(currentEvent.id) || String(p.eventId) === String(currentEvent.id) || String(p.event_id) === String(currentEvent.id)).length > 0 ? (
                      participants.filter(p => String(p.event?.id) === String(currentEvent.id) || String(p.eventId) === String(currentEvent.id) || String(p.event_id) === String(currentEvent.id)).map((p, i) => (
                        <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="py-5 px-2">
                            <p className="font-bold text-slate-800 text-sm">{p.fullName}</p>
                            <p className="text-[10px] text-slate-400 font-medium">Joined on {p.registeredAt ? new Date(p.registeredAt).toLocaleDateString() : 'N/A'}</p>
                          </td>
                          <td className="py-5 px-2 space-y-1.5">
                            <div className="flex items-center gap-2 text-slate-600 text-xs font-medium"><Mail className="w-3.5 h-3.5 text-emerald-500" /> {p.email}</div>
                            <div className="flex items-center gap-2 text-slate-600 text-xs font-medium"><Phone className="w-3.5 h-3.5 text-emerald-500" /> {p.phone}</div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={2} className="py-20 text-center">
                        <Users className="w-12 h-12 text-slate-100 mx-auto mb-3" />
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No registrations found yet</p>
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
=======

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">Location</label>
                    <input type="text" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} 
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">Event Date</label>
                    <input type="date" required value={formData.eventDate} onChange={e => setFormData({...formData, eventDate: e.target.value})} 
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="past">Completed</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Image URL</label>
                  <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Từ khóa tìm kiếm</label>
                  <p className="text-xs text-slate-500">Gợi ý thêm cho thanh tìm (có thể phân cách bằng dấu phẩy).</p>
                  <textarea rows={2} value={formData.searchKeywords ?? ''} onChange={e => setFormData({...formData, searchKeywords: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none" placeholder="ví dụ: workshop, cộng đồng, online"
                  />
                </div>

                <button type="submit" className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all active:scale-[0.98] mt-2">
                  Save Event Details
                </button>
              </form>
>>>>>>> 51465dcfd0a4717d1b767f41a594c24706da0a74
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}