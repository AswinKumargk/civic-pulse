
export type Category = 'Road' | 'Water' | 'Garbage' | 'Streetlight' | 'Flood' | 'Other';
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type Status = 'Submitted' | 'Under Review' | 'In Progress' | 'Resolved';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: Category;
  state: string;
  district: string;
  city: string;
  landmark?: string;
  location: string; // Combined display location
  date: string;
  priority: Priority;
  status: Status;
  explanation: string[];
  daysOpen: number;
  recommendations: string[];
  department: string;
  departmentEmail: string;
  estimatedResolution: string;
  aiScore: number;
  aiConfidence: number;
  riskLevel: string;
  scoreBreakdown: {
    keyword: number;
    category: number;
    location: number;
    time: number;
  };
  decisionFactors: { label: string; icon: string; points?: number }[];
}

export interface DashboardStats {
  total: number;
  highPriority: number;
  resolved: number;
  pending: number;
}
