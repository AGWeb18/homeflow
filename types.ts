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
  stage?: ProjectStage | null;
  project_type?: string;
  selected_design_id?: string | null;
  permit_number?: string | null;
  inspection_phone?: string | null;
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
  resources?: { name: string; url: string }[];
  due_date: string;
  completed: boolean;
  stage?: string; // Optional: tag task with stage ('permitting', 'design', etc.)
}

export interface BudgetItem {
  id: string;
  project_id: string;
  category: string;
  name: string;
  estimated_amount: number;
}

export interface Expense {
  id: string;
  project_id: string;
  budget_item_id?: string | null;
  name: string;
  amount: number;
  date?: string; // ISO Date
  category?: string;
  payee?: string;
  receipt_url?: string;
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: string; // MIME type or category
  url: string;
  size: number;
  created_at: string;
  path: string; // Storage path
}

export interface Quote {
  id: string;
  project_id: string;
  contractor_id: string;
  title: string;
  amount: number;
  status: 'pending' | 'accepted' | 'rejected';
  received_date: string;
  file_url?: string;
  contractor?: Contractor; // Joined
}

export interface Message {
  id: string;
  project_id: string;
  sender_id: string;
  contractor_id?: string | null;
  content: string;
  created_at: string;
  read: boolean;
  sender_role?: 'user' | 'contractor'; // For UI logic (inferred)
}

export interface Design {
  id: string;
  name: string;
  type: string;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  estimated_cost: number;
  estimated_duration: string;
  description: string;
  image_url: string;
  gallery_urls?: string[];
  features: string[];
  compatibility: string[];
}

// Re-defining Project here to avoid partial update issues, or just adding the field if I can target it well. 
// I will just add the Design interface and let the Project interface be updated in full context if needed, 
// but let's try to update Project interface in place.

// Wait, I can't easily "update" an interface in place with search/replace if I don't have the full context or a unique hook.
// Let's verify Project definition in types.ts