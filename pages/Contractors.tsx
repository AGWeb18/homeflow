import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "../services/api";
import { Contractor, Project } from "../types";

const Contractors = () => {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [team, setTeam] = useState<Set<string>>(new Set());
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dirData, projData] = await Promise.all([
          api.getContractorsDirectory(),
          api.getProject()
        ]);
        setContractors(dirData);
        setProject(projData);

        if (projData) {
          const teamData = await api.getTeam(projData.id);
          setTeam(new Set(teamData.map(c => c.id)));
        }
      } catch (error) {
        console.error("Failed to fetch contractors", error);
        toast.error("Failed to load directory.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggleTeam = async (contractor: Contractor) => {
    if (!project) {
        toast.error("You need to create a project first.");
        return;
    }
    
    const isAdded = team.has(contractor.id);
    try {
        if (isAdded) {
            await api.removeFromTeam(project.id, contractor.id);
            team.delete(contractor.id);
            toast.success(`${contractor.name} removed from team.`);
        } else {
            await api.addToTeam(project.id, contractor.id, contractor.role);
            team.add(contractor.id);
            toast.success(`${contractor.name} added to team!`);
        }
        // Trigger re-render
        setTeam(new Set(team));
    } catch (err) {
        toast.error("Failed to update team.");
        console.error(err);
    }
  };

  const filteredContractors = contractors.filter(c => 
    c.name.toLowerCase().includes(filterText.toLowerCase()) || 
    c.role.toLowerCase().includes(filterText.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Loading contractors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Find Your Project Pro
        </h1>
        <p className="text-slate-500 mt-2">
          Search, compare, and connect with qualified contractors for your
          project.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky top-4 z-20">
        <div className="relative mb-4">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            placeholder="Search by name, trade, or location..."
            className="w-full h-12 pl-12 pr-4 rounded-lg bg-slate-50 border-transparent focus:bg-white focus:border-primary focus:ring-primary transition-all"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
           <span className="text-xs text-slate-400 font-bold uppercase tracking-wide">Filters</span>
           {/* Placeholder filters */}
          <button className="px-3 py-1 bg-slate-50 hover:bg-slate-100 rounded-md text-sm text-slate-600 border border-slate-200">
            Service Needed
          </button>
          <button className="px-3 py-1 bg-slate-50 hover:bg-slate-100 rounded-md text-sm text-slate-600 border border-slate-200">
            Location
          </button>
        </div>
      </div>

      {/* Grid */}
      {filteredContractors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContractors.map((contractor) => {
            const isAdded = team.has(contractor.id);
            return (
            <div
              key={contractor.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <div
                      className="w-16 h-16 rounded-lg bg-cover bg-center bg-slate-100"
                      style={{ backgroundImage: `url(${contractor.image})` }}
                    ></div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 leading-tight">
                        {contractor.name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {contractor.role}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-amber-400 filled text-xl">
                    star
                  </span>
                  <span className="font-bold text-slate-900">
                    {contractor.rating}
                  </span>
                  <span className="text-sm text-slate-500">
                    ({contractor.reviews} Reviews)
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {contractor.verified && (
                    <span className="px-2 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        verified
                      </span>{" "}
                      Verified
                    </span>
                  )}
                  {contractor.specialist && (
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        workspace_premium
                      </span>{" "}
                      ADU Certified
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0 mt-auto grid grid-cols-2 gap-3">
                <button className="h-10 flex items-center justify-center border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg transition-colors text-sm">
                  View Profile
                </button>
                <button 
                    onClick={() => handleToggleTeam(contractor)}
                    className={`h-10 flex items-center justify-center font-bold rounded-lg transition-colors text-sm gap-1 ${
                        isAdded 
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200" 
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                >
                   {isAdded ? (
                       <>
                         <span className="material-symbols-outlined text-lg">check</span>
                         Added
                       </>
                   ) : (
                       <>
                         <span className="material-symbols-outlined text-lg">person_add</span>
                         Add to Team
                       </>
                   )}
                </button>
              </div>
            </div>
          )})}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <span className="material-symbols-outlined text-3xl">
              search_off
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            No contractors found
          </h3>
          <p className="text-slate-500">
            Try adjusting your search.
          </p>
        </div>
      )}
    </div>
  );
};

export default Contractors;