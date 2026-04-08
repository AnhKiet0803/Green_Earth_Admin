import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Flag, DollarSign, Loader2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion'; 

const API_DONATIONS = "http://localhost:8081/api/green_earth/donation";
const API_CAMPAIGNS = "http://localhost:8081/api/green_earth/campaign";

export default function Dashboard() {
  const [allDonations, setAllDonations] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewAll, setViewAll] = useState(false);

  // Hàm xử lý biểu đồ: Quét dữ liệu thực tế để vẽ line tăng trưởng
  const processMonthlyGrowth = (donations) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyValues = months.map(m => ({ name: m, value: 0 }));

    donations.forEach(d => {
      // Bao quát các tên biến ngày tháng
      let rawDate = d.donationDate || d.createdAt || d.created_at; 
      
      if (rawDate) {
        // Fix lỗi định dạng ngày của Java (chuyển khoảng trắng thành T để JS hiểu)
        const formattedDateStr = rawDate.toString().replace(" ", "T");
        const dateObj = new Date(formattedDateStr);

        if (!isNaN(dateObj.getTime())) {
          const monthIndex = dateObj.getMonth();
          const year = dateObj.getFullYear();

          // Lọc dữ liệu cho năm hiện tại
          if (year === new Date().getFullYear()) {
            monthlyValues[monthIndex].value += Number(d.amount || 0);
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
      
      // Gọi API
      const [resDonations, resCampaigns] = await Promise.all([
        fetch(API_DONATIONS).then(res => res.json()),
        fetch(API_CAMPAIGNS).then(res => res.json())
      ]);

      // QUAN TRỌNG NHẤT LÀ CHỖ NÀY:
      // Kiểm tra xem Java trả về thẳng một Mảng [...] hay một Object { data: [...] }
      const donations = Array.isArray(resDonations) ? resDonations : (resDonations.data || []);
      const campaigns = Array.isArray(resCampaigns) ? resCampaigns : (resCampaigns.data || []);

      // In ra Console (F12) để bạn tận mắt nhìn thấy dữ liệu
      console.log("🚀 Kiểm tra Donations:", donations);
      console.log("🚀 Kiểm tra Campaigns:", campaigns);

      setAllDonations(donations);
      setChartData(processMonthlyGrowth(donations));

      // Tính toán
      const totalRaised = donations.reduce((sum, d) => sum + Number(d.amount || 0), 0);
      
      const activeCount = campaigns.filter(c => 
        c.status === 'ONGOING' || c.status === 'ACTIVE' || c.status === 'active'
      ).length;

      const uniqueDonors = new Set(donations.map(d => d.userId || d.donorName || d.id)).size;

      setStats([
        { title: 'Total Collected', value: `$${totalRaised.toLocaleString()}`, icon: DollarSign, color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-600' },
        { title: 'Active Campaigns', value: activeCount, icon: Flag, color: 'amber', bg: 'bg-amber-50', text: 'text-amber-600' },
        { title: 'Total Donors', value: uniqueDonors, icon: Users, color: 'blue', bg: 'bg-blue-50', text: 'text-blue-600' },
      ]);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu từ Backend:", error);
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
          Donation Growth ({new Date().getFullYear()})
        </h3>
        {/* FIX RECHARTS WARNING: Thêm absolute/relative và kiểm tra chartData */}
        <div className="h-[350px] w-full relative">
          {chartData && chartData.length > 0 ? (
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
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 italic text-sm">
              Đang tải dữ liệu biểu đồ...
            </div>
          )}
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
              {[...allDonations].reverse().slice(0, viewAll ? allDonations.length : 5).map((d, idx) => {
                
                // Trích xuất tên linh hoạt tùy theo Backend trả về
                const donorName = d.donorName || d.user?.username || d.userName || "Anonymous";
                const campName = d.campaignName || d.campaign?.title || `Campaign #${d.campaignId}`;
                const rawDate = d.donationDate || d.createdAt || d.created_at;

                return (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{donorName}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{campName}</td>
                    <td className="px-6 py-4 text-sm font-bold text-emerald-600 text-center">${Number(d.amount || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-400 text-right flex items-center justify-end gap-2">
                      <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                      {rawDate ? new Date(rawDate.replace(" ", "T")).toLocaleDateString('en-GB') : 'N/A'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {allDonations.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-sm italic">
              Chưa có dữ liệu giao dịch nào.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}