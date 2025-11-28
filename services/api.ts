import { User, Project, Task, Milestone, Contractor, ProjectStage, ProjectDocument, BudgetItem, Expense, Quote } from '../types';
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

  getTask: async (taskId: string): Promise<Task | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user && taskId) {
         const { data: task, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('id', taskId)
            .single();
            
         if (error) {
             console.error('Error fetching task:', error);
             return null;
         }
         return (task as Task) || null;
    }

    return null;
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

  addToTeam: async (projectId: string, contractorId: string, role: string): Promise<void> => {
     const { error } = await supabase
        .from('project_team')
        .insert([{ project_id: projectId, contractor_id: contractorId, role }]);
     
     if (error) {
         // Ignore duplicate violations
         if (error.code === '23505') return; 
         throw error;
     }
  },

  removeFromTeam: async (projectId: string, contractorId: string): Promise<void> => {
     const { error } = await supabase
        .from('project_team')
        .delete()
        .eq('project_id', projectId)
        .eq('contractor_id', contractorId);

     if (error) throw error;
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
    // Fetch template from DB
    const { data: tasksData, error: taskError } = await supabase
      .from('template_tasks')
      .select('*')
      .eq('template_id', planType);

    const { data: milestonesData, error: milestoneError } = await supabase
      .from('template_milestones')
      .select('*')
      .eq('template_id', planType);

    if (taskError || milestoneError) {
        console.error("Error fetching template", taskError, milestoneError);
        throw new Error("Failed to load template");
    }

    const addDays = (d: Date, days: number) => {
      const copy = new Date(d);
      copy.setDate(copy.getDate() + days);
      return copy;
    };

    const today = new Date();

    const tasks = (tasksData || []).map((t: any) => ({
      project_id: projectId,
      title: t.title,
      description: t.description || null,
      diy_guidance: t.diy_guidance || null,
      cost_savings: t.cost_savings || null,
      resources: t.resources || [], // Now supported in SQL
      due_date: addDays(today, t.offset_days || 0).toISOString().split('T')[0],
      completed: false
    }));

    const milestones = (milestonesData || []).map((m: any) => ({
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
  },

  getProjectStage: async (projectId: string): Promise<ProjectStage | null> => {
    // Fetch project and tasks
    const { data: project } = await supabase
      .from('projects')
      .select('stage')
      .eq('id', projectId)
      .maybeSingle();

    // If explicit stage set, return it
    if (project?.stage) {
      return project.stage as ProjectStage;
    }

    // Compute stage from tasks
    const tasks = await api.getTasks(projectId);

    if (tasks.length === 0) return 'idea';

    // Check for incomplete tasks by common stage keywords
    const stageKeywords: Record<ProjectStage, string[]> = {
      'feasibility': ['feasibility', 'survey', 'assessment', 'zoning'],
      'design': ['design', 'schematic', 'development', 'construction documents'],
      'permitting': ['permit', 'application', 'review', 'approval'],
      'procurement': ['tender', 'procurement', 'contractor', 'quote', 'rfc'],
      'construction': ['construction', 'foundation', 'framing', 'inspection', 'rough-in'],
      'closeout': ['closeout', 'final', 'occupancy', 'handover'],
      'idea': [], // catch-all
    };

    // Determine highest priority incomplete stage
    const stageOrder: ProjectStage[] = ['feasibility', 'design', 'permitting', 'procurement', 'construction', 'closeout'];

    for (const stage of stageOrder) {
      const keywords = stageKeywords[stage];
      const stageTasksIncomplete = tasks.filter((t) => {
        if (t.completed) return false;
        return keywords.some((kw) => t.title.toLowerCase().includes(kw));
      });

      if (stageTasksIncomplete.length > 0) {
        return stage;
      }
    }

    // If all tasks complete, return closeout
    if (tasks.every((t) => t.completed)) {
      return 'closeout';
    }

    return 'idea';
  },

  setProjectStage: async (projectId: string, stage: ProjectStage | null): Promise<void> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('projects')
      .update({ stage })
      .eq('id', projectId);

    if (error) throw error;
  },

  resetProject: async (projectId: string): Promise<void> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('User not authenticated');

    // Delete all tasks
    const { error: taskError } = await supabase.from('tasks').delete().eq('project_id', projectId);
    if (taskError) throw taskError;
    
    // Delete all milestones
    const { error: milestoneError } = await supabase.from('milestones').delete().eq('project_id', projectId);
    if (milestoneError) throw milestoneError;

    // Reset project stage and status
    const { error: projectError } = await supabase
      .from('projects')
      .update({ stage: null, status: 'Planning', progress: 0 })
      .eq('id', projectId);
    
    if (projectError) throw projectError;
  },

  // Quotes
  getQuotes: async (projectId: string): Promise<Quote[]> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user && projectId) {
         const { data, error } = await supabase
            .from('quotes')
            .select('*, contractor:contractors(*)')
            .eq('project_id', projectId)
            .order('received_date', { ascending: false });
            
         if (error) {
             console.error('Error fetching quotes:', error);
             return [];
         }
         return (data as Quote[]) || [];
    }
    return [];
  },

  createQuote: async (quote: Omit<Quote, 'id' | 'contractor'>): Promise<Quote> => {
     const { data, error } = await supabase
        .from('quotes')
        .insert([quote])
        .select('*, contractor:contractors(*)')
        .single();

     if (error) throw error;
     return data as Quote;
  },

  updateQuoteStatus: async (id: string, status: 'pending' | 'accepted' | 'rejected'): Promise<void> => {
     const { error } = await supabase
        .from('quotes')
        .update({ status })
        .eq('id', id);
        
     if (error) throw error;
  },

  deleteQuote: async (id: string): Promise<void> => {
     const { error } = await supabase.from('quotes').delete().eq('id', id);
     if (error) throw error;
  },

  // Financials
  getBudgetItems: async (projectId: string): Promise<BudgetItem[]> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user && projectId) {
         const { data, error } = await supabase
            .from('budget_items')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: true });
            
         if (error) {
             console.error('Error fetching budget items:', error);
             return [];
         }
         return (data as BudgetItem[]) || [];
    }
    return [];
  },

  createBudgetItem: async (item: Omit<BudgetItem, 'id'>): Promise<BudgetItem> => {
     const { data, error } = await supabase
        .from('budget_items')
        .insert([item])
        .select()
        .single();

     if (error) throw error;
     return data as BudgetItem;
  },

  deleteBudgetItem: async (id: string): Promise<void> => {
     const { error } = await supabase.from('budget_items').delete().eq('id', id);
     if (error) throw error;
  },

  getExpenses: async (projectId: string): Promise<Expense[]> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user && projectId) {
         const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .eq('project_id', projectId)
            .order('date', { ascending: false });
            
         if (error) {
             console.error('Error fetching expenses:', error);
             return [];
         }
         return (data as Expense[]) || [];
    }
    return [];
  },

  createExpense: async (expense: Omit<Expense, 'id'>): Promise<Expense> => {
     const { data, error } = await supabase
        .from('expenses')
        .insert([expense])
        .select()
        .single();

     if (error) throw error;
     return data as Expense;
  },

  deleteExpense: async (id: string): Promise<void> => {
     const { error } = await supabase.from('expenses').delete().eq('id', id);
     if (error) throw error;
  },

  // Documents
  uploadDocument: async (projectId: string, file: File): Promise<ProjectDocument | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('User not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${projectId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('project-files')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw uploadError;
    }

    return {
      id: filePath,
      name: file.name,
      type: file.type,
      url: '', // Generated on fetch
      size: file.size,
      created_at: new Date().toISOString(),
      path: filePath
    };
  },

  getDocuments: async (projectId: string): Promise<ProjectDocument[]> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('User not authenticated');

    const { data, error } = await supabase.storage
      .from('project-files')
      .list(projectId, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) {
      console.error('Error listing files:', error);
      return [];
    }

    const documents: ProjectDocument[] = await Promise.all(
      data.map(async (file) => {
        const path = `${projectId}/${file.name}`;
        const { data: signedUrl } = await supabase.storage
          .from('project-files')
          .createSignedUrl(path, 3600);

        return {
          id: file.id,
          name: file.name,
          type: file.metadata?.mimetype || 'application/octet-stream',
          url: signedUrl?.signedUrl || '',
          size: file.metadata?.size || 0,
          created_at: file.created_at,
          path: path
        };
      })
    );

    return documents;
  },

  deleteDocument: async (path: string): Promise<void> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('User not authenticated');

    const { error } = await supabase.storage
      .from('project-files')
      .remove([path]);

    if (error) throw error;
  }
};
