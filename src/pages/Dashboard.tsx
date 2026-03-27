import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Flag, DollarSign, Loader2, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

const API_DONATIONS = "http://localhost:8080/api/green_earth/donation";
const API_CAMPAIGNS = "http://localhost:8080/api/green_earth/campaign";

export default function Dashboard() {
  const [allDonations, setAllDonations] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewAll, setViewAll] = useState(false);

  const processMonthlyGrowth = (donations) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyValues = months.map(m => ({ name: m, value: 0 }));

    donations.forEach(d => {
      let rawDate = d.donationDate; 
      
      if (rawDate) {
        const formattedDateStr = rawDate.replace(" ", "T");
        const dateObj = new Date(formattedDateStr);

        if (!isNaN(dateObj.getTime())) {
          const monthIndex = dateObj.getMonth();
          const year = dateObj.getFullYear();

          if (year === 2026) {
            monthlyValues[monthIndex].value += parseFloat(d.amount || 0);
          }
        }
      }
    });

    const currentMonth = new Date().getMonth();
    return monthlyValues.slice(0, currentMonth + 1);
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [resDonations, resCampaigns] = await Promise.all([
        fetch(API_DONATIONS).then(res => res.json()),
        fetch(API_CAMPAIGNS).then(res => res.json())
      ]);

      const donations = resDonations.data || [];
      const campaigns = resCampaigns.data || [];

      setAllDonations(donations);
      setChartData(processMonthlyGrowth(donations));

      const totalRaised = donations.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);
      const activeCount = campaigns.filter(c => c.status === 'ONGOING' || c.status === 'active').length;

      setStats([
        { title: 'Total Collected', value: `$${totalRaised.toLocaleString()}`, icon: DollarSign, color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-600' },
        { title: 'Active Campaigns', value: activeCount, icon: Flag, color: 'amber', bg: 'bg-amber-50', text: 'text-amber-600' },
        { title: 'Total Donors', value: donations.length, icon: Users, color: 'blue', bg: 'bg-blue-50', text: 'text-blue-600' },
      ]);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-emerald-600 w-10 h-10" /></div>
  );

  return (
    <div className="space-y-8 p-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Display actual data of the organization.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4"
          >
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.text}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
          Donation Growth (2026)
        </h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(v) => `$${v}`} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Raised']}
              />
              <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorReal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Recent Transactions</h3>
          <button onClick={() => setViewAll(!viewAll)} className="text-emerald-600 text-sm font-bold hover:underline">
            {viewAll ? 'Show Less' : 'View All'}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Donor Name</th>
                <th className="px-6 py-4">Campaign</th>
                <th className="px-6 py-4 text-center">Amount</th>
                <th className="px-6 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {(viewAll ? allDonations : allDonations.slice(0, 5)).map((d, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{d.donorName || "Anonymous"}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{d.campaignName}</td>
                  <td className="px-6 py-4 text-sm font-bold text-emerald-600 text-center">${d.amount?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-400 text-right flex items-center justify-end gap-2">
                    <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                    {d.donationDate ? new Date(d.donationDate.replace(" ", "T")).toLocaleDateString('en-GB') : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}