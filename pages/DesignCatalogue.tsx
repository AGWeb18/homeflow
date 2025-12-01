import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "../services/api";
import { Design, Project } from "../types";

const DesignCatalogue = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [d, p] = await Promise.all([
            api.getDesigns(),
            api.getProject()
        ]);
        setDesigns(d);
        setProject(p);
      } catch (error) {
        console.error("Failed to fetch designs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSaveDesign = async (design: Design) => {
    if (!project) {
        toast.error("Create a project first to save a design.");
        return;
    }
    try {
        await api.saveDesignToProject(project.id, design.id);
        // Also save to local storage for the legacy/hybrid approach if needed
        localStorage.setItem("selectedDesign", JSON.stringify(design));
        toast.success(`${design.name} saved to your project!`);
        // Refresh project to update UI if needed
        const p = await api.getProject();
        setProject(p);
    } catch (err) {
        console.error(err);
        toast.error("Failed to save design.");
    }
  };

  const filteredDesigns = filter === "All" 
    ? designs 
    : designs.filter(d => d.type === filter);

  if (loading) return <div className="p-12 text-center">Loading catalogue...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Design Catalogue</h1>
        <p className="text-slate-500 mt-2">Browse pre-approved ADU designs to fast-track your project.</p>
      </div>

      {/* CMHC Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-2xl p-8 mb-10 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold mb-4">
                <span className="material-symbols-outlined text-sm">verified</span>
                Official Source
            </div>
            <h2 className="text-2xl font-bold mb-2">CMHC Housing Design Catalogue</h2>
            <p className="text-blue-100 mb-6 max-w-2xl">
                Access the official Government of Canada library of standardized housing designs, including ADUs and multiplexes, pre-approved for faster permitting in Ontario.
            </p>
            <a 
                href="https://www.housingcatalogue.cmhc-schl.gc.ca/designs?region=3d6ea929-1d42-463e-b3ca-c2fb6cf24f10&sortOrder=A-Z"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-900 font-bold rounded-lg hover:bg-blue-50 transition-colors"
            >
                Browse CMHC Catalogue
                <span className="material-symbols-outlined text-lg">open_in_new</span>
            </a>
        </div>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
        {["All", "Laneway House", "Garden Suite", "Basement Suite", "Second Story Addition", "Multiplex"].map(cat => (
            <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                    filter === cat 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
                {cat}
            </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDesigns.map((design) => (
          <div key={design.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all group">
            <div className="relative h-48 bg-slate-200 overflow-hidden">
              {/* Primary Image (Draw) */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 group-hover:opacity-0"
                style={{ backgroundImage: `url(${design.image_url})` }}
              />
              {/* Secondary Image (Render) - Reveal on Hover */}
              {design.gallery_urls && design.gallery_urls[1] && (
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ backgroundImage: `url(${design.gallery_urls[1]})` }}
                  />
              )}
              
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-bold z-10">
                {design.type}
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">{design.name}</h3>
              
              <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-lg">square_foot</span>
                    {design.sqft} sqft
                </div>
                <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-lg">bed</span>
                    {design.bedrooms} Bed
                </div>
                <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-lg">bathtub</span>
                    {design.bathrooms} Bath
                </div>
              </div>

              <p className="text-sm text-slate-500 line-clamp-2 mb-4 min-h-[2.5em]">
                {design.description}
              </p>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Est. Cost</p>
                    <p className="text-lg font-black text-slate-900">
                        ${design.estimated_cost.toLocaleString()}
                    </p>
                </div>
                
                {project?.selected_design_id === design.id ? (
                    <button 
                        disabled 
                        className="px-4 py-2 bg-green-100 text-green-700 font-bold rounded-lg text-sm flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">check</span>
                        Selected
                    </button>
                ) : (
                    <button 
                        onClick={() => handleSaveDesign(design)}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-sm transition-colors"
                    >
                        Select
                    </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DesignCatalogue;