import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import {
  User,
  Project,
  Task,
  Milestone,
  Contractor,
  ProjectStage,
} from "../types";
import CreateProjectModal from "../components/CreateProjectModal";
import NextStep from "../components/NextStep";
import PlanPicker from "../components/PlanPicker";
import ProjectStageComponent from "../components/ProjectStage";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stageLoading, setStageLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [projectStage, setProjectStage] = useState<ProjectStage | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [team, setTeam] = useState<Contractor[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [initialAddress, setInitialAddress] = useState("");

  const fetchData = async () => {
    try {
      // Fetch user first
      const userData = await api.getUser();

      if (!userData) {
        navigate("/login");
        return;
      }

      setUser(userData);

      // Try to fetch project
      const projectData = await api.getProject(userData.id);
      setProject(projectData);

      if (projectData) {
        const [tasksData, milestonesData, teamData, stageData] =
          await Promise.all([
            api.getTasks(projectData.id),
            api.getMilestones(projectData.id),
            api.getTeam(projectData.id),
            api.getProjectStage(projectData.id),
          ]);
        setTasks(tasksData);
        setMilestones(milestonesData);
        setTeam(teamData);
        setProjectStage(stageData);
      } else {
        // Check for pending address from landing page
        const pendingAddress = localStorage.getItem("pendingProjectAddress");
        if (pendingAddress) {
          setInitialAddress(pendingAddress);
          setIsCreateModalOpen(true);
          localStorage.removeItem("pendingProjectAddress");
        }
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProjectCreated = () => {
    setLoading(true);
    fetchData();
  };

  const handleGeneratePlan = async () => {
    // Open the plan picker modal instead of immediately generating a plan
    if (!project) return;
    setShowPlanPicker(true);
  };

  const [showPlanPicker, setShowPlanPicker] = useState(false);

  const handlePlanSelected = async (
    planType: "standard" | "catalogue" | "custom"
  ) => {
    if (!project) return;
    setShowPlanPicker(false);
    setLoading(true);
    try {
      await api.generateProjectTemplate(project.id, planType);
      await fetchData();
    } catch (error) {
      console.error("Failed to generate plan", error);
      setLoading(false);
    }
  };

  const handleStageChange = async (stage: ProjectStage | null) => {
    if (!project) return;
    setStageLoading(true);
    try {
      await api.setProjectStage(project.id, stage);
      setProjectStage(stage || (await api.getProjectStage(project.id)));
    } catch (error) {
      console.error("Failed to update stage", error);
    } finally {
      setStageLoading(false);
    }
  };

  // Calculate Project Health
  const calculateHealth = () => {
    if (!tasks.length)
      return { score: 100, label: "Excellent", message: "No active tasks." };

    const today = new Date().toISOString().split("T")[0];
    const overdueTasks = tasks.filter(
      (t) => !t.completed && t.due_date < today
    ).length;

    let score = 100;
    let label = "Excellent";
    let message = "Your project is on track.";

    if (overdueTasks > 0) {
      score = Math.max(0, 100 - overdueTasks * 15);
      if (score < 90) {
        label = "Good";
        message = `${overdueTasks} task(s) overdue.`;
      }
      if (score < 70) {
        label = "At Risk";
        message = `Multiple tasks overdue (${overdueTasks}).`;
      }
      if (score < 50) {
        label = "Critical";
        message = "Significant delays detected.";
      }
    }

    return { score, label, message };
  };

  const health = calculateHealth();

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Loading your project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <span className="material-symbols-outlined text-3xl">add_home</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4">
            Welcome to HomeFlow, {user?.name}!
          </h1>
          <p className="text-lg text-slate-600 max-w-lg mx-auto mb-8">
            You haven't started a project yet. Create your first renovation
            project to start tracking tasks, budget, and contractors.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-8 py-4 bg-primary hover:bg-primary-hover text-black font-bold rounded-xl shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-1"
          >
            Create New Project
          </button>
        </div>
        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onProjectCreated={handleProjectCreated}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-slate-500">Project: {project.name}</p>
      </div>

      {/* Getting Started Hero (Only if no tasks) */}
      {tasks.length === 0 && (
        <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Let's get your project moving
            </h2>
            <p className="text-slate-300 max-w-lg">
              Your project is set up! Now, choose how you want to proceed. You
              can browse our catalogue of pre-approved designs or generate a
              standard renovation plan to get started immediately.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => navigate("/catalogue")}
              className="px-6 py-3 bg-transparent border border-slate-600 hover:bg-slate-800 text-slate font-bold rounded-xl transition-colors whitespace-nowrap"
            >
              Browse Designs
            </button>
            <button
              onClick={handleGeneratePlan}
              className="px-6 py-3 bg-primary hover:bg-primary-hover text-slate font-bold rounded-xl shadow-lg shadow-primary/20 transition-colors whitespace-nowrap flex items-center gap-2 justify-center"
            >
              <span className="material-symbols-outlined">auto_awesome</span>
              Generate Standard Plan
            </button>
          </div>
        </div>
      )}

      {/* Next Step card (concise, single action) */}
      <div className="mb-6">
        <NextStep
          project={project}
          tasks={tasks}
          onGeneratePlan={handleGeneratePlan}
          onViewTasks={() => navigate("/project/tasks")}
          onBrowseContractors={() => navigate("/contractors")}
        />
        <PlanPicker
          open={showPlanPicker}
          onClose={() => setShowPlanPicker(false)}
          onSelect={handlePlanSelected}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Stage */}
          <ProjectStageComponent
            currentStage={projectStage}
            onStageChange={handleStageChange}
            isLoading={stageLoading}
          />

          {/* Progress Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-sm text-slate-500 uppercase tracking-wider font-semibold">
                  Current Phase
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  {project.status}
                </h2>
              </div>
              <span className="text-primary font-bold text-2xl">
                {project.progress}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>Planning</span>
              <span>Permitting</span>
              <span>Construction</span>
            </div>
          </div>

          {/* Tasks */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-lg">
                Upcoming Tasks
              </h3>
              <button className="text-primary text-sm font-bold hover:underline">
                View all
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        readOnly
                        className="w-5 h-5 rounded border-2 border-slate-300 text-primary focus:ring-primary"
                      />
                      <div>
                        <p
                          className={`font-medium ${
                            task.completed
                              ? "text-slate-400 line-through"
                              : "text-slate-900"
                          }`}
                        >
                          {task.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {task.due_date}
                        </p>
                      </div>
                    </div>
                    <button className="text-sm text-primary font-medium hover:underline">
                      View Details
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500">
                  <p>No upcoming tasks</p>
                  <button className="text-primary text-sm font-bold hover:underline mt-2">
                    Add a task
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-lg mb-6">
              Key Milestones
            </h3>
            {milestones.length > 0 ? (
              <div className="relative pl-4 space-y-8 border-l-2 border-slate-100 ml-2">
                {milestones.map((m) => (
                  <div key={m.id} className="relative pl-6">
                    <div
                      className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white 
                    ${
                      m.status === "Completed"
                        ? "bg-primary"
                        : m.status === "Pending"
                        ? "bg-primary"
                        : "bg-slate-200"
                    }
                  `}
                    >
                      {m.status === "Completed" && (
                        <span className="material-symbols-outlined text-slate text-[10px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          check
                        </span>
                      )}
                    </div>
                    <h4
                      className={`font-medium ${
                        m.status === "Upcoming"
                          ? "text-slate-400"
                          : "text-slate-900"
                      }`}
                    >
                      {m.title}
                    </h4>
                    <p className="text-sm text-slate-500">{m.date}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-4">
                No milestones set
              </p>
            )}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Health Gauge - Simplified visualization */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <h3 className="font-bold text-slate-900 text-lg mb-4">
              Project Health
            </h3>
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#f1f5f9"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke={
                    health.score > 80
                      ? "#10b981"
                      : health.score > 60
                      ? "#f59e0b"
                      : "#ef4444"
                  }
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="351.86"
                  strokeDashoffset={351.86 - (351.86 * health.score) / 100}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-3xl font-black text-slate-900 block">
                  {health.score}
                </span>
                <span
                  className={`text-xs font-medium uppercase ${
                    health.score > 80
                      ? "text-emerald-500"
                      : health.score > 60
                      ? "text-amber-500"
                      : "text-red-500"
                  }`}
                >
                  {health.label}
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-4">{health.message}</p>
          </div>

          {/* Quick Links */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-lg mb-4">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "folder_open", label: "Documents", link: "#" },
                {
                  icon: "account_balance_wallet",
                  label: "Budget",
                  link: "/finance",
                },
                { icon: "chat", label: "Messages", link: "#" },
                { icon: "photo_library", label: "Photos", link: "#" },
              ].map((link, idx) => (
                <Link
                  key={idx}
                  to={link.link}
                  className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors gap-2"
                >
                  <span className="material-symbols-outlined text-primary text-3xl">
                    {link.icon}
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Project Team */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-lg mb-4">
              Project Team
            </h3>
            <div className="space-y-4">
              {team.length > 0 ? (
                team.map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${member.image})` }}
                    ></div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">
                        {member.name}
                      </p>
                      <p className="text-xs text-slate-500">{member.role}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-center text-sm">
                  No team members yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
