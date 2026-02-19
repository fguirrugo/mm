import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Activity, Beneficiary, BudgetLine, ComplianceItem, GISMetric, GISLayer, GISProvinceStat } from '../types';
import { ACTIVITIES, BENEFICIARIES, BUDGET, COMPLIANCE, GIS_METRICS, GIS_LAYERS, GIS_PROVINCE_STATS } from '../services/mockData';

interface DataContextType {
  activities: Activity[];
  addActivity: (activity: Activity) => void;
  updateActivityStatus: (id: string, status: Activity['status'], progress: number) => void;
  deleteActivity: (id: string) => void;
  
  beneficiaries: Beneficiary[];
  addBeneficiary: (beneficiary: Beneficiary) => void;
  deleteBeneficiary: (id: string) => void;
  
  budget: BudgetLine[];
  addBudgetLine: (line: BudgetLine) => void;
  updateBudgetActual: (id: string, actualAmount: number) => void;
  deleteBudgetLine: (id: string) => void;
  
  compliance: ComplianceItem[];
  addComplianceItem: (item: ComplianceItem) => void;
  updateComplianceStatus: (id: string, status: ComplianceItem['status']) => void;
  deleteComplianceItem: (id: string) => void;
  
  gisMetrics: GISMetric[];
  addGISMetric: (metric: GISMetric) => void;
  deleteGISMetric: (id: string) => void;

  gisLayers: GISLayer[];
  addGISLayer: (layer: GISLayer) => void;
  deleteGISLayer: (id: string) => void;

  gisProvinceStats: GISProvinceStat[];
  addGISProvinceStat: (stat: GISProvinceStat) => void;
  deleteGISProvinceStat: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper function to load data from localStorage or fallback to default
const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.warn(`Error loading ${key} from localStorage`, error);
    return fallback;
  }
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage
  const [activities, setActivities] = useState<Activity[]>(() => loadFromStorage('activities', ACTIVITIES));
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(() => loadFromStorage('beneficiaries', BENEFICIARIES));
  const [budget, setBudget] = useState<BudgetLine[]>(() => loadFromStorage('budget', BUDGET));
  const [compliance, setCompliance] = useState<ComplianceItem[]>(() => loadFromStorage('compliance', COMPLIANCE));
  const [gisMetrics, setGisMetrics] = useState<GISMetric[]>(() => loadFromStorage('gisMetrics', GIS_METRICS));
  const [gisLayers, setGisLayers] = useState<GISLayer[]>(() => loadFromStorage('gisLayers', GIS_LAYERS));
  const [gisProvinceStats, setGisProvinceStats] = useState<GISProvinceStat[]>(() => loadFromStorage('gisProvinceStats', GIS_PROVINCE_STATS));

  // Persistence Effects: Save to localStorage whenever state changes
  useEffect(() => { localStorage.setItem('activities', JSON.stringify(activities)); }, [activities]);
  useEffect(() => { localStorage.setItem('beneficiaries', JSON.stringify(beneficiaries)); }, [beneficiaries]);
  useEffect(() => { localStorage.setItem('budget', JSON.stringify(budget)); }, [budget]);
  useEffect(() => { localStorage.setItem('compliance', JSON.stringify(compliance)); }, [compliance]);
  useEffect(() => { localStorage.setItem('gisMetrics', JSON.stringify(gisMetrics)); }, [gisMetrics]);
  useEffect(() => { localStorage.setItem('gisLayers', JSON.stringify(gisLayers)); }, [gisLayers]);
  useEffect(() => { localStorage.setItem('gisProvinceStats', JSON.stringify(gisProvinceStats)); }, [gisProvinceStats]);

  // Activities Logic
  const addActivity = (activity: Activity) => setActivities(prev => [...prev, activity]);
  const updateActivityStatus = (id: string, status: Activity['status'], progress: number) => setActivities(prev => prev.map(a => a.id === id ? { ...a, status, completionPercentage: progress } : a));
  const deleteActivity = (id: string) => setActivities(prev => prev.filter(a => a.id !== id));

  // Beneficiaries Logic
  const addBeneficiary = (beneficiary: Beneficiary) => setBeneficiaries(prev => [beneficiary, ...prev]);
  const deleteBeneficiary = (id: string) => setBeneficiaries(prev => prev.filter(b => b.id !== id));

  // Budget Logic
  const addBudgetLine = (line: BudgetLine) => setBudget(prev => [...prev, line]);
  const updateBudgetActual = (id: string, actualAmount: number) => setBudget(prev => prev.map(b => {
      if (b.id === id) {
        const cadEquivalent = Math.round(actualAmount * b.currencyRate); 
        return { ...b, actualAmount, cadEquivalent };
      }
      return b;
    }));
  const deleteBudgetLine = (id: string) => setBudget(prev => prev.filter(b => b.id !== id));

  // Compliance Logic
  const addComplianceItem = (item: ComplianceItem) => setCompliance(prev => [...prev, item]);
  const updateComplianceStatus = (id: string, status: ComplianceItem['status']) => setCompliance(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  const deleteComplianceItem = (id: string) => setCompliance(prev => prev.filter(c => c.id !== id));

  // GIS Metric Logic
  const addGISMetric = (metric: GISMetric) => setGisMetrics(prev => [...prev, metric].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  const deleteGISMetric = (id: string) => setGisMetrics(prev => prev.filter(m => m.id !== id));

  // GIS Layer Logic
  const addGISLayer = (layer: GISLayer) => setGisLayers(prev => [...prev, layer]);
  const deleteGISLayer = (id: string) => setGisLayers(prev => prev.filter(l => l.id !== id));

  // GIS Province Stat Logic
  const addGISProvinceStat = (stat: GISProvinceStat) => setGisProvinceStats(prev => [...prev, stat]);
  const deleteGISProvinceStat = (id: string) => setGisProvinceStats(prev => prev.filter(s => s.id !== id));

  return (
    <DataContext.Provider value={{
      activities, addActivity, updateActivityStatus, deleteActivity,
      beneficiaries, addBeneficiary, deleteBeneficiary,
      budget, addBudgetLine, updateBudgetActual, deleteBudgetLine,
      compliance, addComplianceItem, updateComplianceStatus, deleteComplianceItem,
      gisMetrics, addGISMetric, deleteGISMetric,
      gisLayers, addGISLayer, deleteGISLayer,
      gisProvinceStats, addGISProvinceStat, deleteGISProvinceStat
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};