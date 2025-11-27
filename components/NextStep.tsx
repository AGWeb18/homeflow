import React from "react";
import { Project, Task } from "../types";

type Props = {
  project: Project | null;
  tasks: Task[];
  onGeneratePlan: () => void;
  onViewTasks: () => void;
  onBrowseContractors: () => void;
};

const NextStep: React.FC<Props> = ({
  project,
  tasks,
  onGeneratePlan,
  onViewTasks,
  onBrowseContractors,
}) => {
  // Determine highest-priority next step
  if (!project) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-900 text-lg mb-2">Next Step</h3>
        <p className="text-slate-600 mb-4">
          Create your first project to get started.
        </p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-900 text-lg mb-2">Next Step</h3>
        <p className="text-slate-600 mb-4">
          Generate a starter plan tailored to your project and municipality.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onGeneratePlan}
            className="px-4 py-2 bg-primary text-black font-bold rounded-xl shadow-sm"
          >
            Generate Standard Plan
          </button>
          <button
            onClick={onBrowseContractors}
            className="px-4 py-2 bg-transparent border border-slate-200 rounded-xl text-slate-700"
          >
            Browse Contractors
          </button>
        </div>
      </div>
    );
  }

  // Find next incomplete task (prefer permit-related)
  const nextPermitTask = tasks.find(
    (t) => !t.completed && /permit|application|zoning/i.test(t.title)
  );

  if (nextPermitTask) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-900 text-lg mb-2">Next Step</h3>
        <p className="text-slate-600 mb-2">
          Complete the permit task below to keep approvals moving.
        </p>
        <div className="mb-3">
          <p className="font-semibold text-slate-900">{nextPermitTask.title}</p>
          <p className="text-xs text-slate-500">
            Due {nextPermitTask.due_date}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onViewTasks}
            className="px-4 py-2 bg-primary text-black font-bold rounded-xl shadow-sm"
          >
            View Tasks
          </button>
        </div>
      </div>
    );
  }

  // Otherwise prompt to tackle the next incomplete task
  const nextTask = tasks.find((t) => !t.completed);
  if (nextTask) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-900 text-lg mb-2">Next Step</h3>
        <p className="text-slate-600 mb-2">
          Tackle your next task to keep progress steady.
        </p>
        <div className="mb-3">
          <p className="font-semibold text-slate-900">{nextTask.title}</p>
          <p className="text-xs text-slate-500">Due {nextTask.due_date}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onViewTasks}
            className="px-4 py-2 bg-primary text-black font-bold rounded-xl shadow-sm"
          >
            View Tasks
          </button>
        </div>
      </div>
    );
  }

  // Fallback: invite contractors
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="font-bold text-slate-900 text-lg mb-2">Next Step</h3>
      <p className="text-slate-600 mb-4">
        Invite or browse contractors to get quotes and move to construction.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onBrowseContractors}
          className="px-4 py-2 bg-primary text-black font-bold rounded-xl shadow-sm"
        >
          Browse Contractors
        </button>
      </div>
    </div>
  );
};

export default NextStep;
