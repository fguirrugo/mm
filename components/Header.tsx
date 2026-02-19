import React from 'react';
import { Bell, User, Globe, Search } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-20 no-print">
      <div className="flex items-center space-x-4">
        <h2 className="text-slate-800 font-semibold text-sm hidden md:block">
          CFLI-2025-MPUTO-MZ-0001
        </h2>
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
          Active
        </span>
      </div>

      <div className="flex items-center space-x-4 lg:space-x-6">
        <div className="hidden md:flex items-center bg-slate-100 rounded-md px-3 py-1.5">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search activities..." 
            className="bg-transparent border-none outline-none text-sm text-slate-600 placeholder-slate-400 w-48"
          />
        </div>

        <button className="relative text-slate-500 hover:text-slate-700 transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-rose-500"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-2"></div>

        <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-800">Admin User</p>
                <p className="text-xs text-slate-500">Project Manager</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-white">
                <User className="w-5 h-5" />
            </div>
        </div>
      </div>
    </header>
  );
};