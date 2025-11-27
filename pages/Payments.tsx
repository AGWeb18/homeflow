import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "../services/api";
import { Project, Milestone } from "../types";

const Payments = () => {
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await api.getUser();
        if (!user) return;

        const projectData = await api.getProject(user.id);
        setProject(projectData);

        if (projectData) {
          const milestonesData = await api.getMilestones(projectData.id);
          setMilestones(milestonesData);
        }
      } catch (error) {
        console.error("Failed to fetch payment data", error);
        toast.error("Failed to load payment information.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate Financials
  const totalBudget = milestones.reduce((acc, m) => acc + (m.amount || 0), 0);
  const paidAmount = milestones
    .filter((m) => m.status === "Paid" || m.status === "Completed")
    .reduce((acc, m) => acc + (m.amount || 0), 0);
  const remainingAmount = totalBudget - paidAmount;
  const percentPaid = totalBudget > 0 ? (paidAmount / totalBudget) * 100 : 0;

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Loading payments...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="bg-white rounded-2xl border border-slate-200 p-12 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            No Project Found
          </h2>
          <p className="text-slate-600 mb-8">
            Create a project in the Dashboard to track payments.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Project Payments
          </h1>
          <p className="text-slate-500 mt-2">
            Manage milestone-based payments for{" "}
            <span className="font-semibold">{project.name}</span>.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-slate rounded-lg text-sm font-bold shadow-sm transition-colors">
          <span className="material-symbols-outlined text-lg">add</span>
          Add Milestone
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">
            Total Committed
          </p>
          <p className="text-3xl font-black text-slate-900 tracking-tight">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(totalBudget)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">
            Paid to Date
          </p>
          <p className="text-3xl font-black text-emerald-600 tracking-tight">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(paidAmount)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">
            Remaining Balance
          </p>
          <p className="text-3xl font-black text-slate-900 tracking-tight">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(remainingAmount)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-slate-900">Payment Progress</h3>
          <span className="text-sm text-slate-500 font-medium">
            {Math.round(percentPaid)}% Paid
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${percentPaid}%` }}
          ></div>
        </div>
      </div>

      {/* Milestones Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="font-bold text-slate-900 text-lg">
            Payment Milestones
          </h3>
          {/* Search placeholder - functional search can be added later */}
          <div className="flex items-center gap-4 w-full sm:w-auto opacity-50 pointer-events-none">
            {/* Disabled for MVP polish */}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
              <tr>
                <th className="px-6 py-4">Milestone</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {milestones.length > 0 ? (
                milestones.map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {m.title}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{m.date}</td>
                    <td className="px-6 py-4 text-slate-900">
                      {m.amount
                        ? new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(m.amount)
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          m.status === "Paid" || m.status === "Completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : m.status === "Due Soon"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary hover:text-primary-hover font-bold text-xs hover:underline">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No milestones found. Add milestones to track payments.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
