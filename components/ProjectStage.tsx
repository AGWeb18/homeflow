import React, { useState } from "react";
import { ProjectStage } from "../types";

type Props = {
  currentStage: ProjectStage | null;
  onStageChange?: (stage: ProjectStage | null) => Promise<void>;
  isLoading?: boolean;
};

const STAGE_LABELS: Record<
  ProjectStage,
  { label: string; description: string; icon: string }
> = {
  idea: {
    label: "Idea",
    description: "Exploring your ADU concept",
    icon: "lightbulb",
  },
  feasibility: {
    label: "Feasibility",
    description: "Assessing site & zoning",
    icon: "assessment",
  },
  design: {
    label: "Design",
    description: "Creating architectural plans",
    icon: "architecture",
  },
  permitting: {
    label: "Permitting",
    description: "Applying for permits",
    icon: "description",
  },
  procurement: {
    label: "Procurement",
    description: "Selecting contractors",
    icon: "groups",
  },
  construction: {
    label: "Construction",
    description: "Building underway",
    icon: "engineering",
  },
  closeout: {
    label: "Closeout",
    description: "Final inspections & handover",
    icon: "done_all",
  },
};

const STAGE_ORDER: ProjectStage[] = [
  "idea",
  "feasibility",
  "design",
  "permitting",
  "procurement",
  "construction",
  "closeout",
];

const ProjectStageComponent: React.FC<Props> = ({
  currentStage,
  onStageChange,
  isLoading = false,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleStageSelect = async (stage: ProjectStage | null) => {
    if (onStageChange) {
      await onStageChange(stage);
    }
    setShowMenu(false);
  };

  const currentStageInfo = currentStage ? STAGE_LABELS[currentStage] : null;
  const currentIndex = currentStage ? STAGE_ORDER.indexOf(currentStage) : -1;

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 text-lg">Project Stage</h3>
        {onStageChange && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/5 rounded"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Override"}
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => handleStageSelect(null)}
                  className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50"
                >
                  Auto-detect from tasks
                </button>
                <div className="border-t border-slate-100"></div>
                {STAGE_ORDER.map((stage) => (
                  <button
                    key={stage}
                    onClick={() => handleStageSelect(stage)}
                    className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-50 ${
                      currentStage === stage
                        ? "bg-primary/10 text-primary"
                        : "text-slate-700"
                    }`}
                  >
                    {STAGE_LABELS[stage].label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {currentStageInfo ? (
        <>
          {/* Visual progress bar */}
          <div className="mb-6">
            <div className="flex gap-1 mb-2">
              {STAGE_ORDER.map((stage, idx) => (
                <div
                  key={stage}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    idx <= currentIndex ? "bg-primary" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
            <div className="text-xs text-slate-500">
              Stage {currentIndex + 1} of {STAGE_ORDER.length}
            </div>
          </div>

          {/* Current stage card */}
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary text-2xl">
                {currentStageInfo.icon}
              </span>
              <div>
                <div className="font-bold text-slate-900">
                  {currentStageInfo.label}
                </div>
                <div className="text-xs text-slate-500">
                  {currentStageInfo.description}
                </div>
              </div>
            </div>
          </div>

          {/* Next stage hint */}
          {currentIndex < STAGE_ORDER.length - 1 && (
            <div className="mt-4 text-xs text-slate-600">
              <span className="font-semibold">Next:</span>{" "}
              {STAGE_LABELS[STAGE_ORDER[currentIndex + 1]].label}
            </div>
          )}
        </>
      ) : (
        <div className="text-slate-500 text-sm text-center py-4">
          No stage data — create a project and pick a plan to get started.
        </div>
      )}
    </div>
  );
};

export default ProjectStageComponent;
