import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { Task, Project } from "../types";

const TasksPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

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

  const toggleComplete = async (task: Task) => {
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
      <h1 className="text-2xl font-bold mb-4">Tasks for {project.name}</h1>
      <div className="space-y-3">
        {tasks.length === 0 && (
          <div className="text-slate-500">No tasks yet</div>
        )}
        {tasks.map((t) => (
          <div
            key={t.id}
            className="bg-white p-4 rounded-lg border border-slate-100 flex items-center justify-between"
          >
            <div>
              <div
                className={`font-semibold ${
                  t.completed ? "line-through text-slate-400" : ""
                }`}
              >
                {t.title}
              </div>
              <div className="text-xs text-slate-500">
                Due: {t.due_date || "—"}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleComplete(t)}
                className="px-3 py-2 bg-primary text-black rounded-md"
              >
                {t.completed ? "Undo" : "Complete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksPage;
