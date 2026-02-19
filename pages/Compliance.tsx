import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Modal } from '../components/Modal';
import { ComplianceItem } from '../types';
import { CheckCircle, Clock, AlertTriangle, Calendar, Plus, Trash2 } from 'lucide-react';

export const Compliance: React.FC = () => {
    const { compliance, updateComplianceStatus, addComplianceItem, deleteComplianceItem } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItem, setNewItem] = useState<{item: string; dueDate: string}>({ item: '', dueDate: '' });

    const cycleStatus = (id: string, currentStatus: string) => {
        const nextStatus = currentStatus === 'Pending' ? 'Complete' : currentStatus === 'Complete' ? 'Delayed' : 'Pending';
        updateComplianceStatus(id, nextStatus as any);
    };

    const handleAddItem = () => {
        if (!newItem.item || !newItem.dueDate) return;
        addComplianceItem({
            id: Date.now().toString(),
            item: newItem.item,
            status: 'Pending',
            dueDate: newItem.dueDate
        });
        setNewItem({ item: '', dueDate: '' });
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Donor Compliance</h1>
                    <p className="text-slate-500 text-sm mt-1">Tracking reporting requirements for CFLI Agreement.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
                    <Plus className="w-4 h-4" />
                    Add Requirement
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 rounded-full">
                        <CheckCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-emerald-800">Completed Items</p>
                        <p className="text-2xl font-bold text-emerald-900">{compliance.filter(c => c.status === 'Complete').length}</p>
                    </div>
                </div>
                <div className="bg-amber-50 border border-amber-100 p-6 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-amber-100 rounded-full">
                        <Clock className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-amber-800">Pending Items</p>
                        <p className="text-2xl font-bold text-amber-900">{compliance.filter(c => c.status === 'Pending').length}</p>
                    </div>
                </div>
                <div className="bg-rose-50 border border-rose-100 p-6 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-rose-100 rounded-full">
                        <AlertTriangle className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-rose-800">Delayed Items</p>
                        <p className="text-2xl font-bold text-rose-900">{compliance.filter(c => c.status === 'Delayed').length}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-semibold text-slate-700">Checklist & Deadlines</h3>
                </div>
                {compliance.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">
                        No compliance items found. Add requirements to track deadlines.
                    </div>
                ) : (
                <div className="divide-y divide-slate-100">
                    {compliance.map((item) => (
                        <div key={item.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition group">
                            <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => cycleStatus(item.id, item.status)}>
                                <div className={`w-2 h-2 rounded-full ${
                                    item.status === 'Complete' ? 'bg-emerald-500' : 
                                    item.status === 'Delayed' ? 'bg-rose-500' : 'bg-amber-500'
                                }`}></div>
                                <div>
                                    <h4 className={`text-sm font-medium ${item.status === 'Complete' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{item.item}</h4>
                                    <div className="flex items-center gap-4 mt-1">
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                            <Calendar className="w-3 h-3" />
                                            Due: {item.dueDate}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border select-none cursor-pointer ${
                                    item.status === 'Complete' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 
                                    item.status === 'Delayed' ? 'bg-rose-100 text-rose-800 border-rose-200' : 
                                    'bg-amber-100 text-amber-800 border-amber-200'
                                }`} onClick={() => cycleStatus(item.id, item.status)}>
                                    {item.status}
                                </span>
                                <button 
                                    onClick={() => deleteComplianceItem(item.id)}
                                    className="text-slate-400 hover:text-rose-500 transition-colors p-2"
                                    title="Delete Item"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Compliance Requirement">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Requirement Name</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            placeholder="E.g. Submit Interim Report"
                            value={newItem.item}
                            onChange={(e) => setNewItem({...newItem, item: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                        <input 
                            type="date" 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            value={newItem.dueDate}
                            onChange={(e) => setNewItem({...newItem, dueDate: e.target.value})}
                        />
                    </div>
                    <div className="pt-2 flex justify-end gap-2">
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium">Cancel</button>
                        <button onClick={handleAddItem} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Add Requirement</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};