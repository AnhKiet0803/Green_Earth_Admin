import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Flag, Calendar, FileText, Users, Info, HeartHandshake, Star, DollarSign, Menu, X, LogOut, Search } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const API_ORG = "http://localhost:8081/api/green_earth/organization_info";

const navItems = [
  { title: 'Dashboard', path: '/', icon: LayoutDashboard },
  { title: 'Campaigns', path: '/campaigns', icon: Flag },
  { title: 'Events', path: '/events', icon: Calendar },
  { title: 'Articles', path: '/articles', icon: FileText },
  { title: 'Users', path: '/users', icon: Users },
  { title: 'Organization Info', path: '/organization', icon: Info },
  { title: 'Sponsors', path: '/sponsors', icon: HeartHandshake },
  { title: 'Celebrities', path: '/celebrities', icon: Star },
  { title: 'Donations', path: '/donations', icon: DollarSign },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [orgInfo, setOrgInfo] = useState<{ name: string; logo: string } | null>(null);
  const location = useLocation();

  useEffect(() => {
    fetch(API_ORG)
      .then(res => res.json())
      .then(result => {
        if (result.data) setOrgInfo(result.data);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  return (
    <div className="h-screen w-full flex overflow-hidden bg-slate-50 text-slate-900 relative">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[40] lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-[50] w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 shrink-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between min-h-[80px]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 shrink-0 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                {orgInfo?.logo ? (
                  <img src={orgInfo.logo} alt="Logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <div className="w-full h-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs">GE</div>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                 <span className="font-bold text-[14px] leading-tight text-emerald-700 truncate">
                  {orgInfo?.name || "Green Earth"}
                </span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Management</span>
              </div>
            </div>
            <button className="lg:hidden p-1 text-slate-400" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                    isActive 
                      ? "bg-emerald-50 text-emerald-600 font-bold shadow-sm" 
                      : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-emerald-600" : "text-slate-400")} />
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all text-sm font-medium">
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
        <div className="flex items-center gap-4 min-w-0 overflow-hidden">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 shrink-0 lg:hidden" 
          >
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden xs:block">
            <p className="text-sm font-bold text-slate-900 leading-none">Admin</p>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Administrator</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md shrink-0">
            AD
          </div>
        </div>
      </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50">
          <div className="w-full max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}