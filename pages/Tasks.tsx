import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { Task, Project } from "../types";
import PlanPicker from "../components/PlanPicker";

const TasksPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showPlanPicker, setShowPlanPicker] = useState(false);

  const fetch = async () => {
    setLoading(true);
    const p = await api.getProject();
    setProject(p);
    if (p) {
      const t = await api.getTasks(p.id);
      setTasks(t);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleGeneratePlan = async (planType: "standard" | "catalogue" | "custom") => {
    if (!project) return;
    setShowPlanPicker(false);
    setLoading(true);
    try {
      await api.generateProjectTemplate(project.id, planType);
      await fetch();
    } catch (error) {
      console.error("Failed to generate plan", error);
      setLoading(false);
    }
  };

  const handleResetProject = async () => {
    if (!project) return;
    if (window.confirm("Are you sure you want to reset your project? This will delete all tasks and milestones. This action cannot be undone.")) {
        try {
            setLoading(true);
            await api.resetProject(project.id);
            await fetch();
        } catch (error) {
            console.error("Failed to reset project", error);
            setLoading(false);
        }
    }
  };

  const toggleComplete = async (e: React.MouseEvent, task: Task) => {
    e.stopPropagation(); // Prevent navigation when clicking button
    try {
      await api.toggleTaskComplete(task.id, !task.completed);
      fetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-6">Loading tasks...</div>;
  if (!project) return <div className="p-6">No project found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Tasks for {project.name}</h1>
        {tasks.length > 0 && (
            <button 
                onClick={handleResetProject}
                className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
            >
                <span className="material-symbols-outlined text-lg">restart_alt</span>
                Reset Project Plan
            </button>
        )}
      </div>
      <div className="space-y-3">
        {tasks.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <p className="text-slate-500 mb-4">No tasks found for this project.</p>
            <button 
                onClick={() => setShowPlanPicker(true)}
                className="px-6 py-2 bg-primary hover:bg-primary-hover text-slate-900 font-bold rounded-lg shadow-sm transition-colors"
            >
                Generate Project Plan
            </button>
          </div>
        )}
        {tasks.map((t) => (
          <div
            key={t.id}
            onClick={() => navigate(`/project/tasks/${t.id}`)}
            className="group bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-start justify-between gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between sm:justify-start sm:gap-3 mb-1">
                <div
                  className={`font-bold text-lg ${
                    t.completed ? "text-slate-400 line-through" : "text-slate-900"
                  }`}
                >
                  {t.title}
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-primary text-sm sm:hidden">
                  arrow_forward_ios
                </span>
              </div>
              
              {t.description && (
                <p className={`text-sm mb-3 line-clamp-2 ${t.completed ? "text-slate-400" : "text-slate-600"}`}>
                  {t.description}
                </p>
              )}

              {t.diy_guidance && !t.completed && (
                <div className="mt-2 mb-3 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <span className="material-symbols-outlined text-emerald-600 text-sm">savings</span>
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">DIY Option Available</span>
                    {t.cost_savings && (
                        <span className="text-xs text-emerald-700 border-l border-emerald-200 pl-2 ml-1">
                            Save {t.cost_savings}
                        </span>
                    )}
                </div>
              )}

              <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                    {t.due_date || "No Date"}
                </span>
                {t.completed && <span className="text-emerald-600">Completed</span>}
              </div>
            </div>

            <div className="shrink-0 flex sm:flex-col items-end justify-between gap-2">
               {/* Desktop Arrow */}
               <span className="material-symbols-outlined text-slate-300 group-hover:text-primary text-lg hidden sm:block mb-2">
                  arrow_forward
               </span>

              <button
                onClick={(e) => toggleComplete(e, t)}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors z-10 ${
                    t.completed 
                    ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    : "bg-primary hover:bg-primary-hover text-white shadow-sm"
                }`}
              >
                {t.completed ? (
                    <>
                        <span className="material-symbols-outlined text-lg">undo</span>
                        Undo
                    </>
                ) : (
                    <>
                        <span className="material-symbols-outlined text-lg">check</span>
                        Mark Complete
                    </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
      <PlanPicker 
        open={showPlanPicker} 
        onClose={() => setShowPlanPicker(false)} 
        onSelect={handleGeneratePlan} 
      />
    </div>
  );
};

export default TasksPage;
