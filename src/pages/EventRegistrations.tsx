import React, { useState, useEffect } from 'react';
import { Search, Download, Users, Calendar, Mail, Phone, Loader2, Filter, Ticket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; 
import * as XLSX from 'xlsx';

const API_PARTICIPANTS = "http://localhost:8081/api/green_earth/event/participants";
const API_EVENTS = "http://localhost:8081/api/green_earth/event";

export default function EventRegistrations() {
  const [participants, setParticipants] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("all");

  // 1. SET DEFAULT FILTER FROM START OF YEAR TO END OF YEAR
  const [dateFilter, setDateFilter] = useState(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), 0, 1);
    const lastDay = new Date(now.getFullYear(), 11, 31);
    
    const formatDate = (date: Date) => {
      const offset = date.getTimezoneOffset();
      const localDate = new Date(date.getTime() - (offset * 60 * 1000));
      return localDate.toISOString().split('T')[0];
    };
    return { start: formatDate(firstDay), end: formatDate(lastDay) };
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [partRes, eventRes] = await Promise.all([
        fetch(API_PARTICIPANTS).then(res => res.json()),
        fetch(API_EVENTS).then(res => res.json())
      ]);

      setParticipants(partRes?.data || partRes || []);
      setEvents(eventRes?.data || eventRes || []);
    } catch (error) {
      console.error("Error fetching registration data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. COMBINED LOGIC: Search + Event Selection + Date Range
  const filteredParticipants = participants.filter(p => {
    // Search by Name or Email
    const matchesSearch = 
      (p.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by Event ID
    const eventId = p.eventId || p.event?.id || p.event_id;
    const matchesEvent = selectedEventId === "all" || String(eventId) === String(selectedEventId);

    // Filter by Registration Date
    const regDate = new Date(p.registeredAt || p.createdAt);
    const startDate = new Date(dateFilter.start);
    const endDate = new Date(dateFilter.end);
    endDate.setHours(23, 59, 59, 999);
    const matchesDate = regDate >= startDate && regDate <= endDate;

    return matchesSearch && matchesEvent && matchesDate;
  });

  const exportToExcel = () => {
    const excelData = filteredParticipants.map(p => ({
      "Full Name": p.fullName,
      "Email": p.email,
      "Phone": p.phone,
      "Event": p.event?.title || p.eventName || "Unknown Event",
      "Registration Date": p.registeredAt ? new Date(p.registeredAt).toLocaleDateString('en-GB') : "N/A"
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
    XLSX.writeFile(workbook, `Event_Registrations_${dateFilter.start}_to_${dateFilter.end}.xlsx`);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-emerald-600 w-10 h-10" /></div>;

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">Event Registrations</h1>
          <p className="text-slate-500 text-sm">
            Managing registrations from {new Date(dateFilter.start).toLocaleDateString('en-GB')} to {new Date(dateFilter.end).toLocaleDateString('en-GB')}
          </p>
        </div>
        <button onClick={exportToExcel} className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
          <Download className="w-4 h-4 text-emerald-600" /> Export List
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
        {/* Search */}
        <div className="lg:col-span-2 relative border border-slate-200 rounded-2xl overflow-hidden group focus-within:border-emerald-500">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500" />
          <input type="text" placeholder="Search name/email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 text-sm outline-none bg-transparent" />
        </div>

        {/* Event Select */}
        <div className="lg:col-span-2 flex items-center gap-2 border border-slate-200 px-4 rounded-2xl">
          <Ticket className="w-4 h-4 text-slate-400" />
          <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)} className="w-full py-3 text-sm font-bold text-slate-600 outline-none bg-transparent cursor-pointer">
            <option value="all">All Active Events</option>
            {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
          </select>
        </div>

        {/* Date Filter */}
        <div className="lg:col-span-2 flex items-center gap-3 border border-slate-200 px-4 rounded-2xl">
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="flex items-center gap-1 flex-1">
            <input type="date" value={dateFilter.start} onChange={(e) => setDateFilter({...dateFilter, start: e.target.value})} className="text-xs font-bold text-slate-600 outline-none w-full bg-transparent cursor-pointer" />
            <span className="text-slate-300">→</span>
            <input type="date" value={dateFilter.end} onChange={(e) => setDateFilter({...dateFilter, end: e.target.value})} className="text-xs font-bold text-slate-600 outline-none w-full bg-transparent cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Participants Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black border-b">
                <th className="px-8 py-5">Participant</th>
                <th className="px-8 py-5">Event Name</th>
                <th className="px-8 py-5">Contact Details</th>
                <th className="px-8 py-5 text-right">Registration Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredParticipants.length > 0 ? (
                  [...filteredParticipants].reverse().map((p, idx) => (
                    <motion.tr key={p.id || idx} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-slate-50/80 transition-all group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">{p.fullName?.charAt(0).toUpperCase()}</div>
                          <div>
                            <p className="text-sm font-bold text-slate-700">{p.fullName}</p>
                            <p className="text-[10px] text-slate-400 font-medium">ID: #{p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                          {/* Logic mới: Tìm tên sự kiện thật từ danh sách events dựa trên eventId của người tham gia */}
                          {(() => {
                            const eventId = p.eventId || p.event?.id || p.event_id;
                            const foundEvent = events.find(ev => String(ev.id) === String(eventId));
                            return foundEvent ? foundEvent.title : (p.eventName || "Event not found");
                          })()}
                        </span>
                      </td>
                      <td className="px-8 py-5 space-y-1.5">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-medium"><Mail size={14} className="text-slate-300" /> {p.email}</div>
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-medium"><Phone size={14} className="text-slate-300" /> {p.phone}</div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 text-sm text-slate-400 font-medium">
                          <Calendar size={14} className="opacity-40" />
                          {new Date(p.registeredAt || p.createdAt).toLocaleDateString('en-GB')}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-32 text-center text-slate-300 italic flex flex-col items-center gap-3">
                      <Search className="w-10 h-10 opacity-10" />
                      <p className="font-serif">No registrations match your search for this period.</p>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}