import { User, Project, Task, Milestone, Contractor } from '../types';
import { supabase } from '../lib/supabase';

export const api = {
  getUser: async (): Promise<User | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
        // Fetch profile if exists, otherwise return basic auth info
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
        
        if (profile) {
            return {
                id: session.user.id,
                name: profile.full_name || session.user.email?.split('@')[0] || 'User',
                email: session.user.email || '',
                avatar_url: profile.avatar_url
            };
        }
        
        return {
            id: session.user.id,
            name: session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            avatar_url: session.user.user_metadata?.avatar_url
        };
    }
    
    return null;
  },

  getProject: async (userId?: string): Promise<Project | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
        const { data: project } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false }) // Get the most recent project
            .maybeSingle();
            
        return (project as Project) || null;
    }

    return null; 
  },

  getTasks: async (projectId: string): Promise<Task[]> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user && projectId) {
         const { data: tasks, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('project_id', projectId)
            .order('due_date', { ascending: true });
            
         if (error) {
             console.error('Error fetching tasks:', error);
             return [];
         }
         return (tasks as Task[]) || [];
    }

    return [];
  },

  getMilestones: async (projectId: string): Promise<Milestone[]> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user && projectId) {
         const { data: milestones, error } = await supabase
            .from('milestones')
            .select('*')
            .eq('project_id', projectId)
            .order('date', { ascending: true });
            
         if (error) {
             console.error('Error fetching milestones:', error);
             return [];
         }
         return (milestones as Milestone[]) || [];
    }

    return [];
  },

  getTeam: async (projectId: string): Promise<Contractor[]> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user && projectId) {
         const { data: teamMembers, error } = await supabase
            .from('project_team')
            .select('*, contractor:contractors(*)')
            .eq('project_id', projectId);
            
         if (error) {
             console.error('Error fetching team:', error);
             return [];
         }

         if (teamMembers && teamMembers.length > 0) {
             return teamMembers.map((item: any) => ({
                 ...item.contractor,
                 role: item.role || item.contractor.role
             }));
         }
         return [];
    }

    return [];
  },

  getContractorsDirectory: async (): Promise<Contractor[]> => {
    const { data: contractors, error } = await supabase
        .from('contractors')
        .select('*')
        .order('rating', { ascending: false });

    if (error) {
        console.error('Error fetching contractors:', error);
        return [];
    }

    if (contractors && contractors.length > 0) {
        return contractors as Contractor[];
    }

    return [];
  },

  createProject: async (projectData: Omit<Project, 'id' | 'user_id'>): Promise<Project> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          ...projectData,
          user_id: session.user.id
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data as Project;
  },

  generateProjectTemplate: async (projectId: string, planType: string = 'standard'): Promise<void> => {
    // Load plan templates from repo data. This keeps templates editable.
    const plansModule = await import('../data/plans.json');
    const plans: any = plansModule.default || plansModule;
    const template = plans[planType] || plans['standard'];

    const addDays = (d: Date, days: number) => {
      const copy = new Date(d);
      copy.setDate(copy.getDate() + days);
      return copy;
    };

    const today = new Date();

    const tasks = (template.tasks || []).map((t: any) => ({
      project_id: projectId,
      title: t.title,
      due_date: addDays(today, t.offset_days || 0).toISOString().split('T')[0],
      completed: false
    }));

    const milestones = (template.milestones || []).map((m: any) => ({
      project_id: projectId,
      title: m.title,
      date: addDays(today, m.offset_days || 0).toISOString().split('T')[0],
      status: m.status || 'Pending'
    }));

    await Promise.all([
      supabase.from('tasks').insert(tasks),
      supabase.from('milestones').insert(milestones)
    ]);
  },

  createTask: async (projectId: string, title: string, dueDate: Date | null = null): Promise<void> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('User not authenticated');

    const record = {
      project_id: projectId,
      title,
      due_date: dueDate ? dueDate.toISOString().split('T')[0] : null,
      completed: false
    };

    const { error } = await supabase.from('tasks').insert([record]);
    if (error) throw error;
  }
  ,

  toggleTaskComplete: async (taskId: string, completed: boolean): Promise<void> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('User not authenticated');

    const { error } = await supabase.from('tasks').update({ completed }).eq('id', taskId);
    if (error) throw error;
  }
};
