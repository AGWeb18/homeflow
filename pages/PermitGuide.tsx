import React from "react";
import sourcesManifest from "../data/ontario/sources.json";
import { api } from "../services/api";
import { toast } from "react-hot-toast";

const PermitGuide: React.FC = () => {
  const [projectType, setProjectType] = React.useState("New ADU");
  const [municipality, setMunicipality] = React.useState("toronto");
  const [availableMunicipalities, setAvailableMunicipalities] = React.useState<
    string[]
  >([]);
  const [checklistData, setChecklistData] = React.useState<any | null>(null);
  const [showChecklist, setShowChecklist] = React.useState(false);
  const [project, setProject] = React.useState<any | null>(null);
  const [projectTasks, setProjectTasks] = React.useState<any[]>([]);
  
  // Permit Wallet State
  const [permitNumber, setPermitNumber] = React.useState("");
  const [inspectionLine, setInspectionLine] = React.useState("");
  const [isEditingWallet, setIsEditingWallet] = React.useState(false);

  // Eager-load all ADU checklist JSONs under data/ontario/permit_checklists/**/adu.json
  const files = import.meta.glob(
    "../data/ontario/permit_checklists/**/adu.json",
    { as: "json", eager: true }
  ) as Record<string, any>;

  React.useEffect(() => {
    const muniKeys: string[] = [];
    for (const path in files) {
      const json = (files as any)[path];
      if (json && json.municipality_key) {
        muniKeys.push(json.municipality_key);
      }
    }
    if (muniKeys.length && !muniKeys.includes(municipality)) {
      setMunicipality(muniKeys.includes("toronto") ? "toronto" : muniKeys[0]);
    }
    setAvailableMunicipalities(muniKeys);

    // Load project and tasks to allow contextual defaults and task creation
    (async () => {
      try {
        const p = await api.getProject();
        if (p) {
          setProject(p);
          // Load saved permit info from project record
          if (p.permit_number) setPermitNumber(p.permit_number);
          if (p.inspection_phone) setInspectionLine(p.inspection_phone);

          const t = await api.getTasks(p.id);
          setProjectTasks(t || []);
          // Try to resolve municipality from address using Google Maps Geocoding
          if (p.address) {
            const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
            if (key) {
              try {
                const encoded = encodeURIComponent(p.address);
                const res = await fetch(
                  `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${key}`
                );
                const geo = await res.json();
                if (geo.results && geo.results.length) {
                  const components = geo.results[0].address_components;
                  const locality = components
                    .find((c: any) => c.types.includes("locality"))
                    ?.long_name?.toLowerCase();
                  const admin2 = components
                    .find((c: any) =>
                      c.types.includes("administrative_area_level_2")
                    )
                    ?.long_name?.toLowerCase();
                  // match against available municipality keys
                  const match = muniKeys.find(
                    (k) => k === (locality || admin2)
                  );
                  if (match) setMunicipality(match);
                }
              } catch (e) {
                // ignore geocode errors
                console.warn("Geocode failed", e);
              }
            }
          }
        }
      } catch (e) {
        console.warn("Failed to load project for PermitGuide", e);
      }
    })();
  }, []);

  const handleSaveWallet = async () => {
      if (project) {
          try {
              await api.updateProject(project.id, { 
                  permit_number: permitNumber, 
                  inspection_phone: inspectionLine 
              });
              setIsEditingWallet(false);
              toast.success("Permit details saved to project!");
          } catch (err) {
              console.error(err);
              toast.error("Failed to save permit details.");
          }
      }
  };

  const generateChecklist = () => {
    // Find the loaded JSON for the selected municipality
    let found: any = null;
    for (const path in files) {
      const json = (files as any)[path];
      if (
        json &&
        json.municipality_key === municipality &&
        json.project_type === "adu"
      ) {
        found = json;
        break;
      }
    }

    setChecklistData(found);
    setShowChecklist(true);
  };

  const downloadChecklistPDF = () => {
    if (!checklistData) return;
    const printWindow = window.open("", "_blank", "width=800,height=900");
    if (!printWindow) return;
    const title = `${checklistData.title} - ${checklistData.municipality_name}`;
    const html = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            body{font-family: Arial, Helvetica, sans-serif; padding:24px; color:#0f172a}
            h1{font-size:20px}
            h2{font-size:16px;margin-top:12px}
            .item{margin-bottom:12px}
            .muted{color:#6b7280;font-size:13px}
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p class="muted">Generated by HomeFlow</p>
          ${checklistData.checklist_items
            .map(
              (it: any) => `
            <div class="item">
              <h2>${it.title}</h2>
              <div class="muted">${it.description || ""}</div>
              <div class="muted">Required: ${it.docs_required || "—"}</div>
            </div>
          `
            )
            .join("")}
        </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    // Delay print to allow render
    setTimeout(() => printWindow.print(), 500);
  };

  const addPermitsToProject = async () => {
    if (!project || !checklistData) return;
    // For each required checklist item, create a task if not already present
    const existingTitles = new Set(
      projectTasks.map((t) => t.title.toLowerCase())
    );
    const tasksToCreate: Array<{ title: string; due: Date | null }> = [];
    for (const item of checklistData.checklist_items) {
      const title = item.title;
      if (!existingTitles.has(title.toLowerCase())) {
        const days = item.typical_timeline_days || 7;
        const due = new Date();
        due.setDate(due.getDate() + days);
        tasksToCreate.push({ title, due });
      }
    }

    for (const t of tasksToCreate) {
      try {
        await api.createTask(project.id, t.title, t.due);
      } catch (e) {
        console.error("Failed to create task", e);
      }
    }

    // Set project stage to 'permitting' since user is now adding permit tasks
    try {
      await api.setProjectStage(project.id, "permitting");
    } catch (e) {
      console.warn("Failed to set project stage", e);
    }

    // Reload tasks
    const t = await api.getTasks(project.id);
    setProjectTasks(t || []);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-8">
      {/* Internal Sidebar for Guide */}
      <div className="lg:w-64 shrink-0">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden sticky top-4">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-900">Guide Sections</h3>
          </div>
          <nav className="flex flex-col p-2 gap-1">
            {[
              {
                label: "Eligibility Check",
                icon: "check_circle",
                active: false,
              },
              { label: "Local Regulations", icon: "gavel", active: false },
              {
                label: "Required Documents",
                icon: "description",
                active: true,
              },
              { label: "Application Submission", icon: "send", active: false },
              { label: "Next Steps", icon: "update", active: false },
            ].map((item, idx) => (
              <button
                key={idx}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span
                  className={`material-symbols-outlined ${
                    item.active ? "filled" : ""
                  } text-[20px]`}
                >
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Guide Content */}
      <div className="flex-1 max-w-4xl">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Your Permit Checklist
            </h1>
            <p className="text-slate-500 mt-1">
              Generate a custom list of required documents for your specific
              project.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50">
            <span className="material-symbols-outlined text-[18px]">
              edit_location_alt
            </span>
            Change Address
          </button>
        </div>

        {/* Permit Wallet Widget */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 shadow-sm mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-blue-600">
                <span className="material-symbols-outlined text-9xl">folder_shared</span>
            </div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="font-bold text-blue-900 text-lg flex items-center gap-2">
                            <span className="material-symbols-outlined">badge</span>
                            Permit Wallet
                        </h2>
                        <p className="text-sm text-blue-700 mt-1">Keep your official permit details handy for inspections.</p>
                    </div>
                    <button 
                        onClick={() => setIsEditingWallet(!isEditingWallet)}
                        className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        {isEditingWallet ? 'Cancel' : 'Edit Details'}
                    </button>
                </div>

                {isEditingWallet ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
                        <div>
                            <label className="block text-xs font-bold text-blue-800 mb-1 uppercase">Building Permit Number</label>
                            <input 
                                type="text" 
                                value={permitNumber}
                                onChange={(e) => setPermitNumber(e.target.value)}
                                placeholder="e.g. 2025-123456-RES"
                                className="w-full rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-blue-800 mb-1 uppercase">Inspection Request Line</label>
                            <input 
                                type="text" 
                                value={inspectionLine}
                                onChange={(e) => setInspectionLine(e.target.value)}
                                placeholder="e.g. 416-555-0123"
                                className="w-full rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                            />
                        </div>
                        <div className="md:col-span-2 flex justify-end">
                            <button 
                                onClick={handleSaveWallet}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors"
                            >
                                Save Details
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/60 p-3 rounded-lg border border-blue-100">
                            <p className="text-xs font-bold text-blue-400 uppercase mb-1">Permit Number</p>
                            <p className="font-mono font-bold text-slate-900 text-lg">{permitNumber || "—"}</p>
                        </div>
                        <div className="bg-white/60 p-3 rounded-lg border border-blue-100">
                            <p className="text-xs font-bold text-blue-400 uppercase mb-1">Inspection Line</p>
                            <p className="font-mono font-bold text-slate-900 text-lg">{inspectionLine || "—"}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-8">
          <h2 className="font-bold text-slate-900 text-lg mb-4">
            Project Configuration
          </h2>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Project Type
              </label>
              <select
                value={projectType}
                onChange={(e) => {
                  setProjectType(e.target.value);
                  setShowChecklist(false);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
              >
                <option>New ADU</option>
                <option>Extension</option>
                <option>Renovation</option>
              </select>
            </div>
            <div className="w-56">
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Municipality
              </label>
              <select
                value={municipality}
                onChange={(e) => setMunicipality(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
              >
                {availableMunicipalities.map((m) => (
                  <option key={m} value={m}>
                    {m
                      .replace("_", " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={generateChecklist}
              className="px-6 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg shadow-sm transition-colors h-10"
            >
              Generate Checklist
            </button>
          </div>
        </div>

        {showChecklist && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Permit Checklist
            </h2>

            {!checklistData ? (
              <div className="bg-yellow-50 border-l-4 border-yellow-300 p-4 rounded">
                <p className="text-yellow-800 text-sm">
                  No checklist found for the selected municipality and project
                  type.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {checklistData.checklist_items.map(
                    (item: any, idx: number) => {
                      const src = (sourcesManifest.sources || []).find(
                        (s: any) => s.key === item.source_key
                      );
                      return (
                        <div
                          key={item.id || idx}
                          className="p-4 hover:bg-slate-50"
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              className="w-5 h-5 mt-1 rounded border-slate-300 text-primary focus:ring-primary"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-4">
                                <div>
                                  <p className="font-medium text-slate-900">
                                    {item.title}
                                  </p>
                                  <p className="text-sm text-slate-500 mt-1">
                                    {item.description}
                                  </p>
                                </div>
                                {src && src.url && (
                                  <a
                                    href={src.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-primary text-sm font-medium hover:underline"
                                  >
                                    View source
                                  </a>
                                )}
                              </div>
                              <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
                                <div>
                                  {item.docs_required && (
                                    <span>Required: {item.docs_required}</span>
                                  )}
                                </div>
                                <div>
                                  {item.typical_timeline_days ? (
                                    <span>
                                      Typical review:{" "}
                                      {item.typical_timeline_days} days
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    Source manifest: {checklistData.sources?.join(", ")}
                  </div>
                  <div className="flex items-center gap-3">
                    {project && (
                      <button
                        onClick={addPermitsToProject}
                        className="px-3 py-2 bg-white border border-slate-200 rounded text-sm font-bold hover:bg-slate-50"
                      >
                        Add Required Permits to Project
                      </button>
                    )}
                    <button
                      onClick={downloadChecklistPDF}
                      className="text-primary font-bold text-sm hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">
                        download
                      </span>
                      Download Checklist PDF
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PermitGuide;
