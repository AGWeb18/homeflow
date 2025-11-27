import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (planType: "standard" | "catalogue" | "custom") => void;
};

const PlanPicker: React.FC<Props> = ({ open, onClose, onSelect }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <h3 className="text-lg font-bold mb-3">Pick a Plan</h3>
        <p className="text-sm text-slate-600 mb-4">
          Choose a starting plan to populate tasks and milestones for your
          project. You can tweak these later.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => onSelect("standard")}
            className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg"
          >
            <div className="font-semibold">Standard Plan</div>
            <div className="text-xs text-slate-500">
              Fast start with common tasks
            </div>
          </button>

          <button
            onClick={() => onSelect("catalogue")}
            className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg"
          >
            <div className="font-semibold">Catalogue Design</div>
            <div className="text-xs text-slate-500">
              Use a catalogue design workflow
            </div>
          </button>

          <button
            onClick={() => onSelect("custom")}
            className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg"
          >
            <div className="font-semibold">Custom Plan</div>
            <div className="text-xs text-slate-500">
              Start empty and add your own tasks
            </div>
          </button>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanPicker;
