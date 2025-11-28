export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

export type ProjectStage = 'idea' | 'feasibility' | 'design' | 'permitting' | 'procurement' | 'construction' | 'closeout';

export interface Project {
  id: string;
  user_id: string;
  name: string;
  address: string;
  status: 'Planning' | 'Permitting' | 'Construction' | 'Completed';
  progress: number;
  stage?: ProjectStage | null; // ADU/extension project stage; null means computed from tasks
  project_type?: string; // 'adu', 'extension', 'renovation', etc.
}

export interface Contractor {
  id: string;
  name: string;
  role: string;
  rating: number;
  reviews: number;
  image: string;
  verified: boolean;
  specialist: boolean;
  licensed: boolean;
}

export type MilestoneStatus = 'Paid' | 'Due Soon' | 'Upcoming' | 'Approval Needed' | 'Completed' | 'Pending';

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  date: string;
  amount?: number;
  status: MilestoneStatus;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  diy_guidance?: string;
  cost_savings?: string;
  due_date: string;
  completed: boolean;
  stage?: string; // Optional: tag task with stage ('permitting', 'design', etc.)
}

export interface Expense {
  id: string;
  project_id: string;
  name: string;
  amount: number;
  date?: string;
  category?: string;
}