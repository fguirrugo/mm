import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Modal } from '../components/Modal';
import { Activity, Province, ActivityStatus } from '../types';
import { Calendar, Plus, Trash2 } from 'lucide-react';

export const Activities: React.FC = () => {
    const { activities, addActivity, deleteActivity } = useData();
    const [filter, setFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [newActivity, setNewActivity] = useState<Partial<Activity>>({
        name: '',
        province: 'Maputo',
        plannedDate: '',
        status: 'Planned',
        completionPercentage: 0
    });

    const handleSave = () => {
        if (!newActivity.name || !newActivity.plannedDate) return;
        
        addActivity({
            id: Date.now().toString(),
            name: newActivity.name,
            province: newActivity.province as Province,
            plannedDate: newActivity.plannedDate,
            status: newActivity.status as ActivityStatus,
            completionPercentage: newActivity.completionPercentage || 0,
            notes: newActivity.notes || ''
        });
        setIsModalOpen(false);
        setNewActivity({ name: '', province: 'Maputo', plannedDate: '', status: 'Planned', completionPercentage: 0 });
    };

    const filteredActivities = filter === 'All' 
        ? activities 
        : activities.filter(a => a.status === filter);

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'Ongoing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Planned': return 'bg-slate-100 text-slate-600 border-slate-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-slate-900">Activities Tracker</h1>
                <div className="flex gap-2">
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
                        <Plus className="w-4 h-4" />
                        Add Activity
                    </button>
                </div>
            </div>

            <div className="flex gap-2 border-b border-slate-200 pb-2">
                 <button onClick={() => setFilter('All')} className={`px-3 py-1 text-xs font-medium rounded-full transition ${filter === 'All' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>All</button>
                 <button onClick={() => setFilter('Ongoing')} className={`px-3 py-1 text-xs font-medium rounded-full transition ${filter === 'Ongoing' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>Ongoing</button>
                 <button onClick={() => setFilter('Completed')} className={`px-3 py-1 text-xs font-medium rounded-full transition ${filter === 'Completed' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>Completed</button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {filteredActivities.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">
                        No activities found. Click "Add Activity" to create one.
                    </div>
                ) : (
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Activity Name</th>
                            <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Province</th>
                            <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Date</th>
                            <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Status</th>
                            <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Progress</th>
                            <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredActivities.map((activity) => (
                            <tr key={activity.id} className="hover:bg-slate-50 transition group">
                                <td className="py-4 px-6">
                                    <p className="text-sm font-medium text-slate-900">{activity.name}</p>
                                    <p className="text-xs text-slate-500">{activity.notes || 'No notes added.'}</p>
                                </td>
                                <td className="py-4 px-6 text-sm text-slate-600">{activity.province}</td>
                                <td className="py-4 px-6 text-sm text-slate-600 flex items-center gap-2">
                                    <Calendar className="w-3 h-3 text-slate-400" />
                                    {activity.actualDate || activity.plannedDate}
                                </td>
                                <td className="py-4 px-6">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(activity.status)}`}>
                                        {activity.status}
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 bg-slate-200 rounded-full h-1.5">
                                            <div 
                                                className={`h-1.5 rounded-full ${activity.completionPercentage === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`} 
                                                style={{ width: `${activity.completionPercentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs font-medium text-slate-600">{activity.completionPercentage}%</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <button 
                                        onClick={() => deleteActivity(activity.id)}
                                        className="text-slate-400 hover:text-rose-500 transition-colors"
                                        title="Delete Activity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Activity">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Activity Name</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                            placeholder="E.g. Workshop in Beira"
                            value={newActivity.name}
                            onChange={(e) => setNewActivity({...newActivity, name: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Province</label>
                            <select 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newActivity.province}
                                onChange={(e) => setNewActivity({...newActivity, province: e.target.value as Province})}
                            >
                                <option>Maputo</option>
                                <option>Sofala</option>
                                <option>Cabo Delgado</option>
                                <option>Nampula</option>
                                <option>Gaza</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                            <input 
                                type="date" 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newActivity.plannedDate}
                                onChange={(e) => setNewActivity({...newActivity, plannedDate: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Initial Status</label>
                         <div className="flex gap-2">
                             {['Planned', 'Ongoing', 'Completed'].map(status => (
                                 <button 
                                    key={status}
                                    type="button"
                                    onClick={() => setNewActivity({...newActivity, status: status as ActivityStatus, completionPercentage: status === 'Completed' ? 100 : status === 'Planned' ? 0 : 50})}
                                    className={`px-3 py-1 text-sm rounded-lg border ${newActivity.status === status ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium' : 'bg-white border-slate-200 text-slate-600'}`}
                                 >
                                     {status}
                                 </button>
                             ))}
                         </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                        <textarea 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            rows={3}
                            placeholder="Additional details..."
                            value={newActivity.notes}
                            onChange={(e) => setNewActivity({...newActivity, notes: e.target.value})}
                        />
                    </div>
                    <div className="pt-2 flex justify-end gap-2">
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium">Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Save Activity</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};