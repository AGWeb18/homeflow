import React, { useState, useEffect } from "react";
import { api } from "../services/api";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: () => void;
  initialAddress?: string;
}

const CreateProjectModal = ({
  isOpen,
  onClose,
  onProjectCreated,
  initialAddress = "",
}: CreateProjectModalProps) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState(initialAddress);
  const [error, setError] = useState<string | null>(null);

  // Update address if initialAddress changes (e.g. passed from parent)
  useEffect(() => {
    if (initialAddress) setAddress(initialAddress);
  }, [initialAddress]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.createProject({
        name,
        address,
        status: "Planning",
        progress: 0,
      });
      onProjectCreated();
      onClose();
    } catch (err: any) {
      console.error("Failed to create project:", err);
      setError(err.message || "Failed to create project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Start New Project
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Project Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Backyard ADU"
              className="w-full h-12 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Property Address
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 123 Maple Street"
              className="w-full h-12 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 flex items-center justify-center bg-primary hover:bg-primary-hover text-black font-bold rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Create Project"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
