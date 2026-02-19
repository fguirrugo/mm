import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Modal } from '../components/Modal';
import { BudgetLine } from '../types';
import { AlertTriangle, DollarSign, Download, Edit2, Check, X, Plus, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export const Budget: React.FC = () => {
    const { budget, updateBudgetActual, addBudgetLine, deleteBudgetLine } = useData();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // New Budget Item State
    const [newItem, setNewItem] = useState<{category: string; plannedAmount: number}>({
        category: '',
        plannedAmount: 0
    });

    const totalPlannedCAD = budget.reduce((acc, curr) => acc + (curr.plannedAmount * curr.currencyRate), 0);
    const totalSpent = budget.reduce((acc, curr) => acc + curr.cadEquivalent, 0);
    const utilization = totalPlannedCAD > 0 ? Math.round((totalSpent / totalPlannedCAD) * 100) : 0;

    const chartData = budget.map(b => ({
        name: b.category.split(' ')[0], // Short name
        Planned: Math.round(b.plannedAmount * b.currencyRate),
        Actual: b.cadEquivalent
    }));

    const startEdit = (id: string, currentVal: number) => {
        setEditingId(id);
        setEditValue(currentVal);
    };

    const saveEdit = (id: string) => {
        updateBudgetActual(id, editValue);
        setEditingId(null);
    };

    const handleAddItem = () => {
        if (!newItem.category || newItem.plannedAmount <= 0) return;
        const rate = 0.022; // Hardcoded generic rate for now
        addBudgetLine({
            id: Date.now().toString(),
            category: newItem.category,
            plannedAmount: newItem.plannedAmount,
            actualAmount: 0,
            cadEquivalent: 0,
            currencyRate: rate
        });
        setNewItem({ category: '', plannedAmount: 0 });
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-slate-900">Financial Monitoring</h1>
                <div className="flex gap-2">
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
                        <Plus className="w-4 h-4" />
                        Add Line Item
                    </button>
                    <button className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 text-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-slate-800 rounded-lg"><DollarSign className="w-5 h-5 text-blue-400" /></div>
                        <h3 className="text-sm font-medium text-slate-300">Total Planned (CAD)</h3>
                    </div>
                    <p className="text-3xl font-bold">${totalPlannedCAD.toLocaleString()}</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 rounded-lg"><DollarSign className="w-5 h-5 text-blue-600" /></div>
                        <h3 className="text-sm font-medium text-slate-500">Total Spent</h3>
                    </div>
                    <p className="text-3xl font-bold text-slate-800">${totalSpent.toLocaleString()}</p>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${utilization}%` }}></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">{utilization}% utilized</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-50 rounded-lg"><DollarSign className="w-5 h-5 text-emerald-600" /></div>
                        <h3 className="text-sm font-medium text-slate-500">Remaining</h3>
                    </div>
                    <p className="text-3xl font-bold text-slate-800">${(totalPlannedCAD - totalSpent).toLocaleString()}</p>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Budget vs Actual (CAD)</h3>
                <div className="h-80 w-full">
                    {budget.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{fontSize: 12}} />
                                <YAxis tick={{fontSize: 12}} />
                                <Tooltip formatter={(value) => `$${value}`} />
                                <Legend />
                                <Bar dataKey="Planned" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Actual" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 text-sm">No budget data available</div>
                    )}
                </div>
            </div>

            {/* Detailed Table with Alerts */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {budget.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">
                        No budget lines found. Click "Add Line Item" to start.
                    </div>
                ) : (
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Category</th>
                            <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase text-right">Planned (MZN)</th>
                            <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase text-right">Actual (MZN)</th>
                            <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase text-right">CAD Equiv.</th>
                            <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase text-center">Variance</th>
                            <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {budget.map((line) => {
                            const variance = line.plannedAmount > 0 ? ((line.actualAmount - line.plannedAmount) / line.plannedAmount) * 100 : 0;
                            const isHighVariance = variance > 20;

                            return (
                                <tr key={line.id} className="hover:bg-slate-50 group">
                                    <td className="py-3 px-6 text-sm font-medium text-slate-800">{line.category}</td>
                                    <td className="py-3 px-6 text-sm text-slate-600 text-right">{line.plannedAmount.toLocaleString()}</td>
                                    <td className="py-3 px-6 text-sm text-slate-600 text-right group-hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => editingId !== line.id && startEdit(line.id, line.actualAmount)}>
                                        {editingId === line.id ? (
                                            <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                                <input 
                                                    type="number" 
                                                    className="w-24 px-1 py-0.5 border border-blue-400 rounded text-right outline-none text-sm"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(Number(e.target.value))}
                                                    autoFocus
                                                />
                                                <button onClick={() => saveEdit(line.id)} className="p-1 bg-green-100 text-green-700 rounded hover:bg-green-200"><Check className="w-3 h-3" /></button>
                                                <button onClick={() => setEditingId(null)} className="p-1 bg-red-100 text-red-700 rounded hover:bg-red-200"><X className="w-3 h-3" /></button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-end gap-2">
                                                {line.actualAmount.toLocaleString()}
                                                <Edit2 className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-3 px-6 text-sm font-medium text-slate-800 text-right">${line.cadEquivalent.toLocaleString()}</td>
                                    <td className="py-3 px-6 text-center">
                                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${isHighVariance ? 'bg-rose-100 text-rose-700' : variance > 0 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                            {isHighVariance && <AlertTriangle className="w-3 h-3" />}
                                            {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
                                        </div>
                                    </td>
                                    <td className="py-3 px-6 text-right">
                                        <button 
                                            onClick={() => deleteBudgetLine(line.id)}
                                            className="text-slate-400 hover:text-rose-500 transition-colors"
                                            title="Delete Budget Line"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Budget Line Item">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Category Name</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            placeholder="E.g. Travel Costs"
                            value={newItem.category}
                            onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Planned Amount (MZN)</label>
                        <input 
                            type="number" 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            placeholder="0.00"
                            value={newItem.plannedAmount}
                            onChange={(e) => setNewItem({...newItem, plannedAmount: Number(e.target.value)})}
                        />
                    </div>
                    <div className="pt-2 flex justify-end gap-2">
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium">Cancel</button>
                        <button onClick={handleAddItem} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Add Item</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};