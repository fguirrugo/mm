import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  Users, 
  Banknote, 
  BarChart3, 
  ClipboardCheck, 
  FileText, 
  Settings
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'activities', label: 'Activities', icon: Map },
    { id: 'beneficiaries', label: 'Beneficiaries', icon: Users },
    { id: 'budget', label: 'Budget', icon: Banknote },
    { id: 'analytics', label: 'GIS Analytics', icon: BarChart3 },
    { id: 'compliance', label: 'Compliance', icon: ClipboardCheck },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0 z-30 no-print transition-all duration-300">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white">
                M
            </div>
            <span className="font-bold text-lg tracking-tight">MozPeace GIS</span>
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activePage === item.id 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center space-x-3 px-3 py-2 text-slate-400 hover:text-white transition w-full">
            <Settings className="w-5 h-5" />
            <span className="text-sm">System Settings</span>
        </button>
      </div>
    </aside>
  );
};