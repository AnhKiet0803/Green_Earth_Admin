import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Flag, DollarSign, Loader2, Calendar, Filter } from 'lucide-react';
import { motion } from 'framer-motion'; 

const API_DONATIONS = "http://localhost:8081/api/green_earth/donation";
const API_CAMPAIGNS = "http://localhost:8081/api/green_earth/campaign";

export default function Dashboard() {
  const [allDonations, setAllDonations] = useState<any[]>([]);
  const [allCampaigns, setAllCampaigns] = useState<any[]>([]); 
  const [filteredDonations, setFilteredDonations] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewAll, setViewAll] = useState(false);

  // 1. SET DEFAULT DATE: TỪ ĐẦU THÁNG ĐẾN CUỐI THÁNG
  const [dateFilter, setDateFilter] = useState(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const formatDate = (date: Date) => {
      const offset = date.getTimezoneOffset();
      const localDate = new Date(date.getTime() - (offset * 60 * 1000));
      return localDate.toISOString().split('T')[0];
    };

    return { start: formatDate(firstDay), end: formatDate(lastDay) };
  });

  const processMonthlyGrowth = (donations: any[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyValues = months.map(m => ({ name: m, value: 0 }));

    donations.forEach(d => {
      let rawDate = d.donationDate || d.createdAt || d.created_at; 
      if (rawDate) {
        const dateObj = new Date(rawDate.toString().replace(" ", "T"));
        if (!isNaN(dateObj.getTime())) {
          const monthIndex = dateObj.getMonth();
          const year = dateObj.getFullYear();
          if (year === new Date().getFullYear()) {
            monthlyValues[monthIndex].value += Number(d.amount || 0);
          }
        }
      }
    });

    const currentMonth = new Date().getMonth();
    return monthlyValues.slice(0, currentMonth + 1);
  };

  // 2. FETCH DỮ LIỆU
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [resDonations, resCampaigns] = await Promise.all([
        fetch(API_DONATIONS).then(res => res.json()),
        fetch(API_CAMPAIGNS).then(res => res.json())
      ]);

      setAllDonations(resDonations?.data || resDonations || []);
      setAllCampaigns(resCampaigns?.data || resCampaigns || []); 
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 3. XỬ LÝ LỌC & THỐNG KÊ 
  useEffect(() => {
    let filtered = [...allDonations];
    
    // Lọc giao dịch quyên góp theo ngày
    if (dateFilter.start) {
      const startDate = new Date(dateFilter.start);
      startDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(d => {
        const dDate = new Date((d.donationDate || d.createdAt || d.created_at).toString().replace(" ", "T"));
        return dDate >= startDate;
      });
    }

    if (dateFilter.end) {
      const endDate = new Date(dateFilter.end);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(d => {
        const dDate = new Date((d.donationDate || d.createdAt || d.created_at).toString().replace(" ", "T"));
        return dDate <= endDate;
      });
    }

    setFilteredDonations(filtered);
    
    // BẢN FIX LỖI BIỂU ĐỒ NẰM Ở ĐÂY:
    // Dùng allDonations để biểu đồ luôn hiện chuẩn xu hướng cả năm (không bị gãy góc do mất tháng)
    setChartData(processMonthlyGrowth(allDonations));

    // Tổng tiền của các giao dịch trong mốc thời gian lọc (áp dụng cho thẻ Stats)
    const totalRaised = filtered.reduce((sum, d) => sum + Number(d.amount || 0), 0);
    
    const activeCount = allCampaigns.filter(c => {
      if (c.status && c.status !== "null") {
        const s = String(c.status).toLowerCase().trim();
        return s === 'ongoing' || s === 'active';
      }
      
      const now = new Date().getTime();
      const startStr = c.startDate || c.start_date;
      const endStr = c.endDate || c.end_date;

      if (!startStr) return false; 

      const start = new Date(startStr).getTime();
      const end = endStr ? new Date(endStr).getTime() : NaN; 
      
      if (!isNaN(start) && now >= start) {
        if (isNaN(end) || now <= end) {
          return true;
        }
      }
      return false;
    }).length;

    const uniqueDonors = new Set(filtered.map(d => d.userId || d.donorName || d.id)).size;

    setStats([
      { title: 'Total Collected', value: `$${totalRaised.toLocaleString()}`, icon: DollarSign, color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-600' },
      { title: 'Current Active Campaigns', value: activeCount, icon: Flag, color: 'amber', bg: 'bg-amber-50', text: 'text-amber-600' },
      { title: 'Total Donors', value: uniqueDonors, icon: Users, color: 'blue', bg: 'bg-blue-50', text: 'text-blue-600' },
    ]);
  }, [dateFilter, allDonations, allCampaigns]); 

  if (loading) return (
    <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-emerald-600 w-10 h-10" /></div>
  );

  return (
    <div className="space-y-8 p-4 text-left">
      {/* HEADER & DATE FILTER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm">
            Data from {new Date(dateFilter.start).toLocaleDateString('en-GB')} to {new Date(dateFilter.end).toLocaleDateString('en-GB')}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 px-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 border-r pr-3">
            <Filter className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Filter</span>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="date" 
              className="text-xs font-bold text-slate-600 bg-transparent outline-none cursor-pointer"
              value={dateFilter.start}
              onChange={(e) => setDateFilter({...dateFilter, start: e.target.value})}
            />
            <span className="text-slate-300">→</span>
            <input 
              type="date" 
              className="text-xs font-bold text-slate-600 bg-transparent outline-none cursor-pointer"
              value={dateFilter.end}
              onChange={(e) => setDateFilter({...dateFilter, end: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.text}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">{stat.title}</p>
              <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CHART */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-500" /> Donation Growth ({new Date().getFullYear()})
        </h3>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} tickFormatter={(v) => `$${v}`} />
              <Tooltip 
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => [`$${value.toLocaleString()}`, 'Raised']}
              />
              <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorReal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-900">Transactions in Selected Period</h3>
          <button onClick={() => setViewAll(!viewAll)} className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
            {viewAll ? 'Show Less' : 'View All'}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black border-b">
                <th className="px-8 py-5">Donor Name</th>
                <th className="px-8 py-5">Campaign</th>
                <th className="px-8 py-5 text-center">Amount</th>
                <th className="px-8 py-5 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[...filteredDonations].reverse().slice(0, viewAll ? filteredDonations.length : 5).map((d, idx) => {
                const donorName = d.donorName || d.user?.username || "Anonymous";
                const campName = d.campaignName || d.campaign?.title || `Campaign #${d.campaignId}`;
                const rawDate = d.donationDate || d.createdAt || d.created_at;

                return (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-8 py-5 text-sm font-bold text-slate-700">{donorName}</td>
                    <td className="px-8 py-5 text-sm text-slate-500 font-medium">{campName}</td>
                    <td className="px-8 py-5 text-sm font-black text-emerald-600 text-center">
                        <span className="bg-emerald-50 px-3 py-1 rounded-lg">${Number(d.amount || 0).toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-400 text-right">
                      <div className="flex items-center justify-end gap-2 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                        {rawDate ? new Date(rawDate.toString().replace(" ", "T")).toLocaleDateString('en-GB') : 'N/A'}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredDonations.length === 0 && (
            <div className="text-center py-16 text-slate-300 text-sm italic flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                <Filter className="w-5 h-5 text-slate-200" />
              </div>
              No transactions found for this period.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const TrendingUp = ({className}: {className?: string}) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);