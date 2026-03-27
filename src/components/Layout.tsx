import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, Flag, Calendar, FileText, Users, 
  Info, HeartHandshake, Star, DollarSign, Menu, X, 
  LogOut, Bell, Search, ChevronRight, Tag 
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Hàm hỗ trợ gộp class CSS (Tailwind)
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Danh sách Menu - Đã cập nhật tiền tố /admin
const navItems = [
  { title: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { title: 'Campaigns', path: '/admin/campaigns', icon: Flag },
  { title: 'Events', path: '/admin/events', icon: Calendar },
  { title: 'Articles', path: '/admin/articles', icon: FileText },
  { title: 'Categories', path: '/admin/categories', icon: Tag },
  { title: 'Users', path: '/admin/users', icon: Users },
  { title: 'Organization Info', path: '/admin/organization', icon: Info },
  { title: 'Sponsors', path: '/admin/sponsors', icon: HeartHandshake },
  { title: 'Celebrities', path: '/admin/celebrities', icon: Star },
  { title: 'Donations', path: '/admin/donations', icon: DollarSign },
];

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans antialiased text-slate-900">
      {/* --- SIDEBAR --- */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-sm",
          !isSidebarOpen && "-translate-x-full lg:w-20"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="h-16 flex items-center px-6 border-b border-slate-100 bg-white">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex-shrink-0 flex items-center justify-center shadow-lg shadow-emerald-100">
              <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
            </div>
            {isSidebarOpen && (
              <span className="ml-3 font-bold text-xl tracking-tight text-slate-800">
                Green <span className="text-emerald-600">Earth</span>
              </span>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
            {navItems.map((item) => {
              // Kiểm tra xem path hiện tại có khớp với item không
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                    isActive 
                      ? "bg-emerald-50 text-emerald-700 shadow-sm" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110",
                    isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"
                  )} />
                  
                  {isSidebarOpen && (
                    <span className="text-sm font-medium flex-1 truncate">{item.title}</span>
                  )}
                  
                  {isActive && isSidebarOpen && (
                    <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer Sidebar (Logout) */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all group font-medium text-sm">
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              {isSidebarOpen && <span>Đăng xuất</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* HEADER */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="hidden md:flex items-center text-sm text-slate-400">
              <span className="hover:text-emerald-600 cursor-pointer">Admin</span>
              <ChevronRight className="w-4 h-4 mx-1" />
              <span className="font-medium text-slate-800 capitalize">
                {location.pathname.split('/').pop() || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Tìm kiếm..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-48 lg:w-64 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none"
              />
            </div>

            <button className="p-2 rounded-full hover:bg-slate-100 relative group">
              <Bell className="w-5 h-5 text-slate-600 group-hover:rotate-12 transition-transform" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none mb-1">Quản trị viên</p>
                <p className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider leading-none italic">Admin Mode</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-100">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50">
          <div className="max-w-[1600px] mx-auto min-h-full">
            {/* Outlet sẽ là nơi chứa nội dung các trang con 
                như Dashboard, Campaigns... được cấu hình trong App.tsx 
            */}
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlay cho Mobile khi Sidebar mở */}
      {!isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(true)}
        ></div>
      )}
    </div>
  );
}