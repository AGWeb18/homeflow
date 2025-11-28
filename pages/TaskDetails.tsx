import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { Task } from "../types";

const TaskDetails: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<Task | null>(null);

  const fetchTask = async () => {
    if (!taskId) return;
    setLoading(true);
    const t = await api.getTask(taskId);
    setTask(t);
    setLoading(false);
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const toggleComplete = async () => {
    if (!task) return;
    try {
      const newStatus = !task.completed;
      await api.toggleTaskComplete(task.id, newStatus);
      setTask({ ...task, completed: newStatus });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-6">Loading task details...</div>;
  if (!task) return <div className="p-6">Task not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Back to Tasks
      </button>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{task.title}</h1>
            <div className="text-sm text-slate-500 mt-1">
              Due Date: {task.due_date || "No due date set"}
            </div>
          </div>
          
          <button
            onClick={toggleComplete}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              task.completed
                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                : "bg-slate-900 text-white hover:bg-slate-800 shadow-md"
            }`}
          >
            {task.completed ? (
              <>
                <span className="material-symbols-outlined">check_circle</span>
                Completed
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">check_circle_outline</span>
                Mark as Complete
              </>
            )}
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Description */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">
              Description
            </h2>
            <p className="text-slate-700 leading-relaxed">
              {task.description || "No additional description provided."}
            </p>
          </div>

          {/* DIY Guidance Section */}
          {(task.diy_guidance || task.cost_savings) && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-5">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm uppercase tracking-wide mb-3">
                <span className="material-symbols-outlined">handyman</span>
                DIY Opportunity
              </div>
              
              {task.diy_guidance && (
                <div className="mb-4">
                  <p className="text-slate-800">{task.diy_guidance}</p>
                </div>
              )}

              {task.cost_savings && (
                <div className="flex items-center gap-2 bg-white/60 rounded-md px-3 py-2 inline-flex border border-emerald-200/50">
                   <span className="material-symbols-outlined text-emerald-600 text-lg">savings</span>
                   <span className="text-sm font-semibold text-emerald-800">
                     Estimated Savings: {task.cost_savings}
                   </span>
                </div>
              )}
            </div>
          )}

          {/* Additional Resources Placeholder */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">
              Resources
            </h2>
            <div className="flex flex-col gap-2">
                <button className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left group">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">article</span>
                    <span className="text-slate-700 font-medium text-sm">Read Guide: {task.title} (Coming Soon)</span>
                </button>
                <button className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left group">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">search</span>
                    <span className="text-slate-700 font-medium text-sm">Find Pros for {task.title}</span>
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
