import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Calendar, MapPin, X, Loader2, Users, Mail, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const API_URL = "http://localhost:8081/api/green_earth/event";
const PARTICIPANT_API = "http://localhost:8081/api/green_earth/event/participants";

export default function Events() {
  const [events, setEvents] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [isViewParticipantsOpen, setIsViewParticipantsOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  
  const navigate = useNavigate(); // Hook để điều hướng

  const stripHtml = (html: any) => { 
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [eventRes, partRes] = await Promise.all([
        fetch(API_URL),
        fetch(PARTICIPANT_API).catch(() => null)
      ]);
      
      const eventResult = await eventRes?.json();
      const partResult = partRes ? await partRes.json() : { data: [] };

      setEvents(eventResult?.data || []);
      setParticipants(partResult?.data || partResult || []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Thay vì mở Modal, ta điều hướng sang trang Create/Edit
  const handleGoToEdit = (id?: number) => {
    if (id) {
      navigate(`/admin/events/edit/${id}`); // Đường dẫn trang sửa
    } else {
      navigate(`/admin/events/create`); // Đường dẫn trang tạo mới
    }
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) fetchAllData();
    } catch (error) {
      alert("Xóa thất bại");
    }
  };

  const filteredEvents = events.filter(e => 
    (e.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.location && e.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Event Management</h1>
          <p className="text-slate-500 text-sm">Track registrations and manage community activities.</p>
        </div>
        {/* Nút Tạo mới điều hướng sang trang con */}
        <button 
          onClick={() => handleGoToEdit()} 
          className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 rounded-lg text-sm font-medium text-white hover:bg-emerald-700 shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Create Event
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-emerald-600" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode='popLayout'>
            {filteredEvents.map((event) => {
              const eventRegs = participants.filter(p => 
                String(p.event?.id) === String(event.id) || String(p.eventId) === String(event.id) || String(p.event_id) === String(event.id)
              );

              return (
                <motion.div key={event.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all">
                  <div className="h-48 bg-slate-200 relative">
                    <img src={event.image || `https://picsum.photos/seed/${event.id}/800/600`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-[11px] font-black text-emerald-700 flex items-center gap-1.5 shadow-sm border border-emerald-50">
                        <Users className="w-3.5 h-3.5" /> {eventRegs.length} Joined
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-slate-900 text-lg leading-tight line-clamp-1 group-hover:text-emerald-600 transition-colors">{event.title}</h3>
                      <div className="flex gap-1 shrink-0">
                         <button onClick={() => { setCurrentEvent(event); setIsViewParticipantsOpen(true); }} className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-xl transition-colors" title="View Participants"><Users className="w-4 h-4" /></button>
                         
                         {/* Nút Sửa điều hướng sang trang con */}
                         <button onClick={() => handleGoToEdit(event.id)} className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition-colors">
                           <Edit2 className="w-4 h-4" />
                         </button>

                         <button onClick={() => handleDelete(event.id)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>

                    <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">{stripHtml(event.description)}</p>
                    
                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <Calendar className="w-3.5 h-3.5 text-emerald-500" /> 
                        {event.eventDate ? new Date(event.eventDate).toLocaleDateString('en-GB') : 'TBD'}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500" /> 
                        <span className="truncate max-w-[100px]">{event.location || 'Global'}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* CHỈ GIỮ LẠI MODAL XEM DANH SÁCH NGƯỜI THAM GIA */}
      <AnimatePresence>
        {isViewParticipantsOpen && currentEvent && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-emerald-50/50">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Users className="text-emerald-600" /> Participants
                  </h2>
                  <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider mt-1">{currentEvent.title}</p>
                </div>
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}