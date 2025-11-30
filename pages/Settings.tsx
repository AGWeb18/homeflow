import React, { useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import { toast } from "react-hot-toast";

const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      toast.error("Please type DELETE to confirm.");
      return;
    }

    if (
      !window.confirm(
        "Are you absolutely sure? This action cannot be undone and will delete all your projects, tasks, and data."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await api.deleteAccount();
      toast.success("Account deleted successfully.");
      navigate("/");
    } catch (error) {
      console.error("Failed to delete account", error);
      toast.error("Failed to delete account. Please try again or contact support.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
        Settings
      </h1>
      <p className="text-slate-500 mb-8">Manage your account and preferences.</p>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Profile Information</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="text-slate-900">{user?.email}</div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              User ID
            </label>
            <div className="text-slate-500 text-sm font-mono">{user?.id}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-red-100 bg-red-50">
          <h2 className="text-lg font-bold text-red-900">Danger Zone</h2>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 mb-2">Delete Account</h3>
            <p className="text-sm text-slate-600 mb-4">
              Permanently remove your account and all associated data (Projects,
              Tasks, Files). This action is not reversible.
            </p>
            
            <div className="max-w-sm space-y-3">
                <label className="block text-sm text-slate-700">
                    Type <strong>DELETE</strong> to confirm:
                </label>
                <input 
                    type="text" 
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
                <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || deleteConfirmation !== "DELETE"}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
                >
                {isDeleting ? "Deleting..." : "Delete Account"}
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
