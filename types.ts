export type Province = 'Maputo' | 'Sofala' | 'Cabo Delgado' | 'Nampula' | 'Gaza';
export type ActivityStatus = 'Planned' | 'Ongoing' | 'Completed';
export type Gender = 'Female' | 'Male' | 'Non-binary';
export type Role = 'Enumerator' | 'Peacebuilder' | 'Civil Society' | 'Government';

export interface Activity {
  id: string;
  name: string;
  plannedDate: string;
  actualDate?: string;
  province: Province;
  status: ActivityStatus;
  completionPercentage: number;
  notes?: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  province: Province;
  role: Role;
  activityAttended: string;
}

export interface BudgetLine {
  id: string;
  category: string;
  plannedAmount: number; // In Local Currency (MZN)
  actualAmount: number; // In Local Currency (MZN)
  cadEquivalent: number; // Converted
  currencyRate: number; // MZN to CAD
}

export interface GISMetric {
  id: string;
  date: string;
  activeUsers: number;
  sessions: number;
  layersAccessed: number;
  downloads: number;
}

export interface GISLayer {
  id: string;
  name: string;
  type: string;
  source: string;
  accessCount: number;
}

export interface GISProvinceStat {
  id: string;
  province: Province;
  sessions: number;
}

export interface ComplianceItem {
  id: string;
  item: string;
  status: 'Complete' | 'Pending' | 'Delayed';
  dueDate: string;
}

export const CAD_TOTAL_BUDGET = 39611;