import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Modal } from '../components/Modal';
import { Activity, Database, Globe, Layers, Map as MapIcon, MousePointer, Trash2, Plus, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { GISMetric, GISLayer, GISProvinceStat, Province } from '../types';

export const Analytics: React.FC = () => {
    const { 
        gisMetrics, addGISMetric, deleteGISMetric,
        gisLayers, addGISLayer, deleteGISLayer,
        gisProvinceStats, addGISProvinceStat, deleteGISProvinceStat
    } = useData();

    // Modals
    const [openMetricModal, setOpenMetricModal] = useState(false);
    const [openLayerModal, setOpenLayerModal] = useState(false);
    const [openProvModal, setOpenProvModal] = useState(false);

    // Form States
    const [newMetric, setNewMetric] = useState<Partial<GISMetric>>({ date: '', activeUsers: 0, sessions: 0, layersAccessed: 0, downloads: 0 });
    const [newLayer, setNewLayer] = useState<Partial<GISLayer>>({ name: '', type: 'Point Data', source: '', accessCount: 0 });
    const [newProv, setNewProv] = useState<Partial<GISProvinceStat>>({ province: 'Maputo', sessions: 0 });

    // Aggregate Stats for Top Cards
    const totalUsers = gisMetrics.length > 0 ? gisMetrics[gisMetrics.length - 1].activeUsers : 0; // Assuming cumulative or latest snapshot
    const totalSessions = gisMetrics.reduce((acc, curr) => acc + curr.sessions, 0);
    const totalLayersAccessed = gisMetrics.reduce((acc, curr) => acc + curr.layersAccessed, 0);
    const totalDownloads = gisMetrics.reduce((acc, curr) => acc + curr.downloads, 0);

    // Handlers
    const handleAddMetric = () => {
        if (!newMetric.date) return;
        addGISMetric({
            id: Date.now().toString(),
            date: newMetric.date,
            activeUsers: Number(newMetric.activeUsers),
            sessions: Number(newMetric.sessions),
            layersAccessed: Number(newMetric.layersAccessed),
            downloads: Number(newMetric.downloads)
        } as GISMetric);
        setNewMetric({ date: '', activeUsers: 0, sessions: 0, layersAccessed: 0, downloads: 0 });
        setOpenMetricModal(false);
    };

    const handleAddLayer = () => {
        if (!newLayer.name) return;
        addGISLayer({
            id: Date.now().toString(),
            name: newLayer.name,
            type: newLayer.type || 'Point Data',
            source: newLayer.source || 'Internal',
            accessCount: Number(newLayer.accessCount)
        } as GISLayer);
        setNewLayer({ name: '', type: 'Point Data', source: '', accessCount: 0 });
        setOpenLayerModal(false);
    };

    const handleAddProv = () => {
        addGISProvinceStat({
            id: Date.now().toString(),
            province: newProv.province as Province,
            sessions: Number(newProv.sessions)
        });
        setNewProv({ province: 'Maputo', sessions: 0 });
        setOpenProvModal(false);
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">GIS Platform Analytics</h1>
                    <p className="text-slate-500 text-sm mt-1">Usage statistics and data engagement metrics.</p>
                </div>
            </div>

            {/* Top Cards (Aggregated) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Activity className="w-5 h-5" /></div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase">Current Active Users</p>
                            <p className="text-2xl font-bold text-slate-900">{totalUsers}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><MousePointer className="w-5 h-5" /></div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase">Total Sessions</p>
                            <p className="text-2xl font-bold text-slate-900">{totalSessions}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Layers className="w-5 h-5" /></div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase">Layers Accessed</p>
                            <p className="text-2xl font-bold text-slate-900">{totalLayersAccessed}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Database className="w-5 h-5" /></div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase">Downloads</p>
                            <p className="text-2xl font-bold text-slate-900">{totalDownloads}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[350px]">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">User Growth (Time Series)</h3>
                    <div className="h-72">
                        {gisMetrics.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={gisMetrics}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" tick={{fontSize: 12}} />
                                <YAxis tick={{fontSize: 12}} />
                                <Tooltip />
                                <Area type="monotone" dataKey="activeUsers" stroke="#4f46e5" fillOpacity={1} fill="url(#colorUsers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                        ) : <div className="h-full flex items-center justify-center text-slate-400 text-sm">No metric data available. Add daily logs below.</div>}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[350px]">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Usage by Province</h3>
                    <div className="h-72">
                        {gisProvinceStats.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={gisProvinceStats} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="province" type="category" width={100} tick={{fontSize: 12}} />
                                <Tooltip />
                                <Bar dataKey="sessions" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                        ) : <div className="h-full flex items-center justify-center text-slate-400 text-sm">No province data available. Add data below.</div>}
                    </div>
                </div>
            </div>

            {/* Data Management Section */}
            <div className="border-t border-slate-200 pt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Data Management</h2>
                
                <div className="grid grid-cols-1 gap-8">
                    {/* 1. Daily Metrics Management */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                            <h3 className="font-semibold text-slate-700">Daily Logs & Metrics</h3>
                            <button onClick={() => setOpenMetricModal(true)} className="text-xs flex items-center gap-1 bg-white border border-slate-300 px-3 py-1.5 rounded hover:bg-slate-50 transition">
                                <Plus className="w-3 h-3" /> Add Log
                            </button>
                        </div>
                        <div className="overflow-x-auto max-h-64">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-500 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-2 text-xs font-medium uppercase">Date</th>
                                        <th className="px-6 py-2 text-xs font-medium uppercase text-right">Active Users</th>
                                        <th className="px-6 py-2 text-xs font-medium uppercase text-right">Sessions</th>
                                        <th className="px-6 py-2 text-xs font-medium uppercase text-right">Downloads</th>
                                        <th className="px-6 py-2 text-xs font-medium uppercase text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {gisMetrics.length === 0 && <tr><td colSpan={5} className="px-6 py-4 text-center text-xs text-slate-400">No logs found.</td></tr>}
                                    {gisMetrics.slice().reverse().map((m) => (
                                        <tr key={m.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-3 text-sm text-slate-900">{m.date}</td>
                                            <td className="px-6 py-3 text-sm text-slate-600 text-right">{m.activeUsers}</td>
                                            <td className="px-6 py-3 text-sm text-slate-600 text-right">{m.sessions}</td>
                                            <td className="px-6 py-3 text-sm text-slate-600 text-right">{m.downloads}</td>
                                            <td className="px-6 py-3 text-right">
                                                <button onClick={() => deleteGISMetric(m.id)} className="text-slate-400 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* 2. Province Data Management */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                                <h3 className="font-semibold text-slate-700">Province Data</h3>
                                <button onClick={() => setOpenProvModal(true)} className="text-xs flex items-center gap-1 bg-white border border-slate-300 px-3 py-1.5 rounded hover:bg-slate-50 transition">
                                    <Plus className="w-3 h-3" /> Add Region
                                </button>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-500">
                                    <tr>
                                        <th className="px-6 py-2 text-xs font-medium uppercase">Province</th>
                                        <th className="px-6 py-2 text-xs font-medium uppercase text-right">Sessions</th>
                                        <th className="px-6 py-2 text-xs font-medium uppercase text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {gisProvinceStats.length === 0 && <tr><td colSpan={3} className="px-6 py-4 text-center text-xs text-slate-400">No data found.</td></tr>}
                                    {gisProvinceStats.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-3 text-sm text-slate-900">{p.province}</td>
                                            <td className="px-6 py-3 text-sm text-slate-600 text-right">{p.sessions}</td>
                                            <td className="px-6 py-3 text-right">
                                                <button onClick={() => deleteGISProvinceStat(p.id)} className="text-slate-400 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* 3. Layer Data Management */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                                <h3 className="font-semibold text-slate-700">Map Layers</h3>
                                <button onClick={() => setOpenLayerModal(true)} className="text-xs flex items-center gap-1 bg-white border border-slate-300 px-3 py-1.5 rounded hover:bg-slate-50 transition">
                                    <Plus className="w-3 h-3" /> Add Layer
                                </button>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-500">
                                    <tr>
                                        <th className="px-6 py-2 text-xs font-medium uppercase">Name</th>
                                        <th className="px-6 py-2 text-xs font-medium uppercase">Access</th>
                                        <th className="px-6 py-2 text-xs font-medium uppercase text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {gisLayers.length === 0 && <tr><td colSpan={3} className="px-6 py-4 text-center text-xs text-slate-400">No layers found.</td></tr>}
                                    {gisLayers.map((l) => (
                                        <tr key={l.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-3 text-sm text-slate-900">
                                                {l.name}
                                                <div className="text-xs text-slate-500">{l.type}</div>
                                            </td>
                                            <td className="px-6 py-3 text-sm text-slate-600">{l.accessCount}</td>
                                            <td className="px-6 py-3 text-right">
                                                <button onClick={() => deleteGISLayer(l.id)} className="text-slate-400 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metric Modal */}
            <Modal isOpen={openMetricModal} onClose={() => setOpenMetricModal(false)} title="Add Daily Log">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                        <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500" value={newMetric.date} onChange={e => setNewMetric({...newMetric, date: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Active Users</label>
                            <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500" value={newMetric.activeUsers} onChange={e => setNewMetric({...newMetric, activeUsers: Number(e.target.value)})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Sessions</label>
                            <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500" value={newMetric.sessions} onChange={e => setNewMetric({...newMetric, sessions: Number(e.target.value)})} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Layers Accessed</label>
                            <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500" value={newMetric.layersAccessed} onChange={e => setNewMetric({...newMetric, layersAccessed: Number(e.target.value)})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Downloads</label>
                            <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500" value={newMetric.downloads} onChange={e => setNewMetric({...newMetric, downloads: Number(e.target.value)})} />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button onClick={() => setOpenMetricModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
                        <button onClick={handleAddMetric} className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Add Log</button>
                    </div>
                </div>
            </Modal>

            {/* Province Modal */}
            <Modal isOpen={openProvModal} onClose={() => setOpenProvModal(false)} title="Add Province Data">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Province</label>
                        <select className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500" value={newProv.province} onChange={e => setNewProv({...newProv, province: e.target.value as Province})}>
                            <option>Maputo</option>
                            <option>Sofala</option>
                            <option>Cabo Delgado</option>
                            <option>Nampula</option>
                            <option>Gaza</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Session Count</label>
                        <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500" value={newProv.sessions} onChange={e => setNewProv({...newProv, sessions: Number(e.target.value)})} />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button onClick={() => setOpenProvModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
                        <button onClick={handleAddProv} className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Add Data</button>
                    </div>
                </div>
            </Modal>

            {/* Layer Modal */}
            <Modal isOpen={openLayerModal} onClose={() => setOpenLayerModal(false)} title="Add Map Layer">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Layer Name</label>
                        <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500" placeholder="e.g. Conflict Heatmap" value={newLayer.name} onChange={e => setNewLayer({...newLayer, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                        <select className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500" value={newLayer.type} onChange={e => setNewLayer({...newLayer, type: e.target.value})}>
                            <option>Point Data</option>
                            <option>Polygon</option>
                            <option>Raster</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Access Count</label>
                        <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500" value={newLayer.accessCount} onChange={e => setNewLayer({...newLayer, accessCount: Number(e.target.value)})} />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button onClick={() => setOpenLayerModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
                        <button onClick={handleAddLayer} className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Add Layer</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};