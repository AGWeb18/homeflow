import React, { useState, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../services/api";
import { Project } from "../types";

interface PlanElement {
  id: string;
  type: "room" | "furniture" | "structural";
  subType: string; // e.g., 'bedroom', 'sofa', 'door'
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  zIndex: number;
}

const ELEMENT_TEMPLATES = {
  room: {
    width: 200,
    height: 150,
    color: "bg-white border-2 border-slate-800",
    zIndex: 1,
  },
  furniture: {
    width: 60,
    height: 60,
    color: "bg-indigo-100 border border-indigo-300",
    zIndex: 10,
  },
  structural: { width: 40, height: 10, color: "bg-slate-800", zIndex: 5 }, // Doors/Windows
  area: { width: 300, height: 200, color: "bg-indigo-50/50 border-2 border-dashed border-indigo-400", zIndex: 0 },
};

const PlanEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [elements, setElements] = useState<PlanElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [project, setProject] = useState<Project | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load initial state or template
  useEffect(() => {
    api.getProject().then(setProject);
    
    const savedPlan = localStorage.getItem("customPlan");
    if (savedPlan) {
      setElements(JSON.parse(savedPlan));
      toast.success("Loaded saved plan");
    } else {
      // Initial Demo Layout if empty
      setElements([
        {
          id: "1",
          type: "room",
          subType: "bedroom",
          label: "Master Bed",
          x: 50,
          y: 50,
          width: 300,
          height: 250,
          rotation: 0,
          color: "bg-white border-4 border-slate-800",
          zIndex: 1,
        },
        {
          id: "2",
          type: "structural",
          subType: "door",
          label: "",
          x: 180,
          y: 290,
          width: 40,
          height: 10,
          rotation: 0,
          color: "bg-white border-x-2 border-slate-800",
          zIndex: 20,
        },
      ]);
    }
  }, []);

  const addElement = (
    type: "room" | "furniture" | "structural" | "area",
    subType: string,
    label: string
  ) => {
    const template = ELEMENT_TEMPLATES[type as keyof typeof ELEMENT_TEMPLATES];
    const newElement: PlanElement = {
      id: Date.now().toString(),
      type: type as any,
      subType,
      label,
      x: 100 + elements.length * 10,
      y: 100 + elements.length * 10,
      width: template.width,
      height: template.height,
      rotation: 0,
      color: template.color,
      zIndex: template.zIndex,
    };
    setElements([...elements, newElement]);
    setSelectedId(newElement.id);
  };

  const updateElement = (id: string, changes: Partial<PlanElement>) => {
    setElements((els) =>
      els.map((el) => (el.id === id ? { ...el, ...changes } : el))
    );
  };

  const deleteElement = (id: string) => {
    setElements((els) => els.filter((el) => el.id !== id));
    setSelectedId(null);
  };

  const handleSave = async () => {
    // Save to localStorage for session persistence
    localStorage.setItem("customPlan", JSON.stringify(elements));
    
    if (!project) {
        toast.success("Plan saved locally (create a project to upload)");
        return;
    }

    setIsSaving(true);
    try {
        // Convert plan data to a Blob (JSON file for now, effectively a "save file")
        const planData = JSON.stringify(elements, null, 2);
        const blob = new Blob([planData], { type: 'application/json' });
        const file = new File([blob], `Site_Plan_${new Date().toISOString().split('T')[0]}.json`, { type: 'application/json' });

        // Upload to project documents
        await api.uploadDocument(project.id, file);
        toast.success("Plan saved and uploaded to Project Documents!");
    } catch (err) {
        console.error(err);
        toast.error("Failed to upload plan to project");
    } finally {
        setIsSaving(false);
    }
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear the plan?")) {
      setElements([]);
      localStorage.removeItem("customPlan");
      toast("Plan cleared");
    }
  };

  const selectedElement = elements.find((el) => el.id === selectedId);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50">
      {/* Toolbar */}
      <div className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between shadow-sm z-30">
        <div className="flex items-center gap-4">
          <h2 className="font-black text-slate-900 text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              architecture
            </span>
            Plan Editor
          </h2>
          <div className="h-8 w-px bg-slate-200 mx-2"></div>

          <div className="flex gap-2">
            <button
              onClick={() => addElement("room", "room", "Room")}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700"
            >
              <span className="material-symbols-outlined text-sm">
                crop_square
              </span>{" "}
              Room
            </button>
            <button
              onClick={() => addElement("area", "area", "Area")}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700"
            >
              <span className="material-symbols-outlined text-sm">
                check_box_outline_blank
              </span>{" "}
              Custom Area
            </button>
            <button
              onClick={() => addElement("structural", "door", "")}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700"
            >
              <span className="material-symbols-outlined text-sm">
                sensor_door
              </span>{" "}
              Door
            </button>
            <button
              onClick={() => addElement("structural", "window", "")}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700"
            >
              <span className="material-symbols-outlined text-sm">
                grid_view
              </span>{" "}
              Window
            </button>
            <button
              onClick={() => addElement("furniture", "bed", "Bed")}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700"
            >
              <span className="material-symbols-outlined text-sm">bed</span>{" "}
              Furniture
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleClear}
            className="text-slate-500 hover:text-red-600 text-sm font-medium px-3"
          >
            Clear
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-slate rounded-lg text-sm font-bold shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">save</span>
            Save Plan
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <div
          className="flex-1 relative bg-slate-50 overflow-auto p-8 cursor-crosshair"
          ref={containerRef}
          onClick={() => setSelectedId(null)}
          style={{
            backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        >
          <div className="w-[2000px] h-[2000px] relative">
            {elements.map((el) => (
              <Rnd
                key={el.id}
                size={{ width: el.width, height: el.height }}
                position={{ x: el.x, y: el.y }}
                onDragStop={(e, d) => {
                  updateElement(el.id, { x: d.x, y: d.y });
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                  updateElement(el.id, {
                    width: parseInt(ref.style.width),
                    height: parseInt(ref.style.height),
                    ...position,
                  });
                }}
                bounds="parent"
                className={`group ${
                  selectedId === el.id ? "z-50" : ""
                } cursor-move`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId(el.id);
                }}
                style={{ zIndex: el.zIndex }}
              >
                <div
                  className={`w-full h-full relative flex items-center justify-center text-xs font-bold text-slate-500 select-none transition-all
                      ${el.color}
                      ${
                        selectedId === el.id
                          ? "ring-2 ring-primary ring-offset-2 shadow-lg"
                          : "shadow-sm"
                      }
                    `}
                  style={{
                    transform: `rotate(${el.rotation}deg)`,
                  }}
                >
                  {el.label}
                  {/* Show dimensions for rooms/areas */}
                  {(el.type === 'room' || el.type === 'area') && (
                    <div className="absolute bottom-1 right-2 text-[10px] font-mono text-slate-400 pointer-events-none bg-white/50 px-1 rounded">
                        {Math.round(el.width / 10)}' x {Math.round(el.height / 10)}'
                    </div>
                  )}
                  
                  {/* Simple Rotate Handle Visual (not functional via drag, controlled by sidebar) */}
                  {selectedId === el.id && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full border border-slate-300 flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-xs text-slate-600">
                        rotate_right
                      </span>
                    </div>
                  )}
                </div>
              </Rnd>
            ))}
          </div>
        </div>

        {/* Properties Panel */}
        {selectedElement && (
          <div className="w-72 bg-white border-l border-slate-200 p-4 flex flex-col gap-4 shadow-xl z-40 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900">Properties</h3>
              <button
                onClick={() => deleteElement(selectedElement.id)}
                className="text-red-500 hover:bg-red-50 p-1 rounded"
              >
                <span className="material-symbols-outlined text-lg">
                  delete
                </span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                Label
              </label>
              <input
                type="text"
                value={selectedElement.label}
                onChange={(e) =>
                  updateElement(selectedElement.id, { label: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                Rotation ({selectedElement.rotation}°)
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={selectedElement.rotation}
                onChange={(e) =>
                  updateElement(selectedElement.id, {
                    rotation: parseInt(e.target.value),
                  })
                }
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>0°</span>
                <span>90°</span>
                <span>180°</span>
                <span>270°</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Width
                </label>
                <input
                  type="number"
                  value={selectedElement.width}
                  onChange={(e) =>
                    updateElement(selectedElement.id, {
                      width: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Height
                </label>
                <input
                  type="number"
                  value={selectedElement.height}
                  onChange={(e) =>
                    updateElement(selectedElement.id, {
                      height: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                Layer
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateElement(selectedElement.id, {
                      zIndex: selectedElement.zIndex - 1,
                    })
                  }
                  className="flex-1 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs font-bold text-slate-600"
                >
                  Send Back
                </button>
                <button
                  onClick={() =>
                    updateElement(selectedElement.id, {
                      zIndex: selectedElement.zIndex + 1,
                    })
                  }
                  className="flex-1 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs font-bold text-slate-600"
                >
                  Bring Front
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanEditor;
