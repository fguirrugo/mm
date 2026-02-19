import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Modal } from '../components/Modal';
import { Beneficiary, Gender, Province, Role } from '../types';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip, CartesianGrid, YAxis } from 'recharts';

export const Beneficiaries: React.FC = () => {
    const { beneficiaries, addBeneficiary, deleteBeneficiary } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [newBen, setNewBen] = useState<Partial<Beneficiary>>({
        name: '',
        gender: 'Female',
        age: 25,
        province: 'Maputo',
        role: 'Peacebuilder',
        activityAttended: ''
    });

    const handleSave = () => {
        if (!newBen.name) return;
        addBeneficiary({
            id: Date.now().toString(),
            name: newBen.name,
            gender: newBen.gender as Gender,
            age: Number(newBen.age),
            province: newBen.province as Province,
            role: newBen.role as Role,
            activityAttended: newBen.activityAttended || 'N/A'
        });
        setIsModalOpen(false);
        setNewBen({ name: '', gender: 'Female', age: 25, province: 'Maputo', role: 'Peacebuilder', activityAttended: '' });
    };

    // Analytics
    const byGender = [
        { name: 'Female', value: beneficiaries.filter(b => b.gender === 'Female').length },
        { name: 'Male', value: beneficiaries.filter(b => b.gender === 'Male').length },
    ];
    const COLORS = ['#ec4899', '#3b82f6'];

    const byAge = [
        { name: '<18', value: beneficiaries.filter(b => b.age < 18).length },
        { name: '18-35', value: beneficiaries.filter(b => b.age >= 18 && b.age <= 35).length },
        { name: '36-50', value: beneficiaries.filter(b => b.age > 35 && b.age <= 50).length },
        { name: '50+', value: beneficiaries.filter(b => b.age > 50).length },
    ];

    const byProvince = beneficiaries.reduce((acc: any, curr) => {
        acc[curr.province] = (acc[curr.province] || 0) + 1;
        return acc;
    }, {});
    const provinceData = Object.keys(byProvince).map(key => ({ name: key, value: byProvince[key] }));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-slate-900">Beneficiary Management</h1>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
                    <Plus className="w-4 h-4" />
                    Register Beneficiary
                </button>
            </div>

            {/* Visualizations */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase mb-4">Gender Disaggregation</h3>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={byGender} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                                    {byGender.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                     <div className="flex justify-center gap-4 text-xs font-medium text-slate-600">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-pink-500"></div>Female</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div>Male</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase mb-4">Age Distribution</h3>
                    <div className="h-48">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={byAge}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{fontSize: 10}} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#64748b" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase mb-4">Province Heatmap</h3>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={provinceData}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={90} tick={{fontSize: 11}} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#0f172a" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-semibold text-slate-700">Recent Registrations</h3>
                </div>
                <div className="overflow-x-auto">
                    {beneficiaries.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 text-sm">
                            No beneficiaries registered.
                        </div>
                    ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium uppercase">Name</th>
                                <th className="px-6 py-3 text-xs font-medium uppercase">Role</th>
                                <th className="px-6 py-3 text-xs font-medium uppercase">Province</th>
                                <th className="px-6 py-3 text-xs font-medium uppercase">Age</th>
                                <th className="px-6 py-3 text-xs font-medium uppercase">Gender</th>
                                <th className="px-6 py-3 text-xs font-medium uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {beneficiaries.map((person) => (
                                <tr key={person.id} className="hover:bg-slate-50 group">
                                    <td className="px-6 py-3 text-sm font-medium text-slate-900 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-600">
                                            {person.name.charAt(0)}
                                        </div>
                                        {person.name}
                                    </td>
                                    <td className="px-6 py-3 text-sm text-slate-600">{person.role}</td>
                                    <td className="px-6 py-3 text-sm text-slate-600 flex items-center gap-1">
                                        <MapPin className="w-3 h-3 text-slate-400" />
                                        {person.province}
                                    </td>
                                    <td className="px-6 py-3 text-sm text-slate-600">{person.age}</td>
                                    <td className="px-6 py-3 text-sm text-slate-600">
                                        <span className={`px-2 py-0.5 rounded text-xs border ${person.gender === 'Female' ? 'bg-pink-50 border-pink-100 text-pink-600' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                                            {person.gender}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <button 
                                            onClick={() => deleteBeneficiary(person.id)}
                                            className="text-slate-400 hover:text-rose-500 transition-colors"
                                            title="Delete Beneficiary"
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
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Beneficiary">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={newBen.name}
                            onChange={(e) => setNewBen({...newBen, name: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                            <input 
                                type="number" 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newBen.age}
                                onChange={(e) => setNewBen({...newBen, age: Number(e.target.value)})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                            <select 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newBen.gender}
                                onChange={(e) => setNewBen({...newBen, gender: e.target.value as Gender})}
                            >
                                <option>Female</option>
                                <option>Male</option>
                                <option>Non-binary</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Province</label>
                            <select 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newBen.province}
                                onChange={(e) => setNewBen({...newBen, province: e.target.value as Province})}
                            >
                                <option>Maputo</option>
                                <option>Sofala</option>
                                <option>Cabo Delgado</option>
                                <option>Nampula</option>
                                <option>Gaza</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                             <select 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newBen.role}
                                onChange={(e) => setNewBen({...newBen, role: e.target.value as Role})}
                            >
                                <option>Peacebuilder</option>
                                <option>Enumerator</option>
                                <option>Civil Society</option>
                                <option>Government</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Activity Attended</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. Training 101"
                            value={newBen.activityAttended}
                            onChange={(e) => setNewBen({...newBen, activityAttended: e.target.value})}
                        />
                    </div>
                    <div className="pt-2 flex justify-end gap-2">
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium">Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Register</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};