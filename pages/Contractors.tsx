import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "../services/api";
import { Contractor } from "../types";

const Contractors = () => {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getContractorsDirectory();
        setContractors(data);
      } catch (error) {
        console.error("Failed to fetch contractors", error);
        toast.error("Failed to load contractors directory. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
    <div className="max-w-7xl mx-auto space-y-8">
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
            placeholder="Search by name, trade, or location..."
            className="w-full h-12 pl-12 pr-4 rounded-lg bg-slate-50 border-transparent focus:bg-white focus:border-primary focus:ring-primary transition-all"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:border-primary text-slate-700">
            Service Needed
            <span className="material-symbols-outlined text-lg">
              arrow_drop_down
            </span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:border-primary text-slate-700">
            Location
            <span className="material-symbols-outlined text-lg">
              arrow_drop_down
            </span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:border-primary text-slate-700">
            Rating
            <span className="material-symbols-outlined text-lg">
              arrow_drop_down
            </span>
          </button>
          <label className="flex items-center gap-2 px-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-slate-700">
              ADU Specialist
            </span>
          </label>
          <div className="ml-auto flex items-center gap-2 text-sm text-slate-500">
            Sort by:
            <button className="flex items-center gap-1 font-medium text-slate-900">
              Best Match
              <span className="material-symbols-outlined text-lg">
                arrow_drop_down
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      {contractors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contractors.map((contractor) => (
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
                  <button className="text-slate-300 hover:text-red-500 transition-colors">
                    <span className="material-symbols-outlined filled">
                      favorite
                    </span>
                  </button>
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
                  {contractor.licensed && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                      Licensed & Insured
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0 mt-auto">
                <button className="w-full h-10 flex items-center justify-center bg-primary hover:bg-primary-hover text-slate font-bold rounded-lg transition-colors text-sm">
                  View Profile
                </button>
              </div>
            </div>
          ))}
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
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default Contractors;
