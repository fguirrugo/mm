import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, Users, Calendar, AlertCircle } from 'lucide-react';

const KPICard = ({ title, value, subtext, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
        {subtext && <p className={`text-xs mt-1 ${subtext.includes('-') ? 'text-rose-500' : 'text-emerald-600'}`}>{subtext}</p>}
      </div>
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const { activities, beneficiaries, budget } = useData();

  const stats = useMemo(() => {
    const totalActivities = activities.length;
    const completed = activities.filter(a => a.status === 'Completed').length;
    const completionRate = totalActivities > 0 ? Math.round((completed / totalActivities) * 100) : 0;
    
    const totalBen = beneficiaries.length;
    const female = beneficiaries.filter(b => b.gender === 'Female').length;
    const femaleRate = totalBen > 0 ? Math.round((female / totalBen) * 100) : 0;
    
    // Calculate total planned budget dynamically
    const totalPlannedCAD = budget.reduce((acc, curr) => acc + (curr.plannedAmount * curr.currencyRate), 0);
    const spent = budget.reduce((acc, curr) => acc + curr.cadEquivalent, 0);
    const budgetRate = totalPlannedCAD > 0 ? Math.round((spent / totalPlannedCAD) * 100) : 0;

    return { totalActivities, completionRate, totalBen, femaleRate, spent, budgetRate };
  }, [activities, beneficiaries, budget]);

  const pieData = [
    { name: 'Female', value: stats.femaleRate },
    { name: 'Male', value: 100 - stats.femaleRate },
  ];
  const COLORS = ['#3b82f6', '#cbd5e1'];

  const activityData = activities.slice(0, 6).map(a => ({
    name: a.name.length > 15 ? a.name.substring(0, 15) + '...' : a.name,
    progress: a.completionPercentage,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Project Overview</h1>
            <p className="text-slate-500 text-sm mt-1">Integrating Local Peacebuilders: A GIS Platform for Inclusive Security (CFLI-2025-MPUTO-MZ-0001)</p>
        </div>
        <div className="flex space-x-2">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">Phase 2: Implementation</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Activities Completed" 
          value={`${stats.completionRate}%`} 
          subtext="On track"
          icon={TrendingUp} 
          color="bg-blue-600" 
        />
        <KPICard 
          title="Total Beneficiaries" 
          value={stats.totalBen} 
          subtext="Registered"
          icon={Users} 
          color="bg-emerald-500" 
        />
        <KPICard 
          title="Budget Utilization" 
          value={`${stats.budgetRate}%`} 
          subtext={`CAD ${stats.spent.toLocaleString()} spent`}
          icon={Calendar} 
          color="bg-amber-500" 
        />
        <KPICard 
          title="Women Participation" 
          value={`${stats.femaleRate}%`} 
          subtext="Target: 50%"
          icon={AlertCircle} 
          color="bg-rose-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Progress */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Activity Progress</h3>
            <div className="h-64 w-full">
                {activities.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis dataKey="name" type="category" width={150} tick={{fontSize: 12}} />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="progress" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-400">No activities recorded</div>
                )}
            </div>
        </div>

        {/* Demographics */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="text-lg font-bold text-slate-800 mb-4">Gender Distribution</h3>
             <div className="h-48 w-full flex items-center justify-center relative">
                {stats.totalBen > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center text-slate-400">No data</div>
                )}
                {stats.totalBen > 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-slate-700">{stats.femaleRate}%</span>
                </div>
                )}
             </div>
             <div className="mt-4 text-center">
                <p className="text-sm text-slate-500">Target for Women Participation.</p>
             </div>
        </div>
      </div>
    </div>
  );
};