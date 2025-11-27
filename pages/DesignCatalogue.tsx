import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { CATALOGUE_DESIGNS, DesignModel } from "../services/catalogueData";

const DesignCatalogue = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDesigns = CATALOGUE_DESIGNS.filter((design) => {
    const matchesType = selectedType === "All" || design.type === selectedType;
    const matchesSearch =
      design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      design.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleSelectDesign = (design: DesignModel) => {
    // In a real app, this would save to the backend project context
    localStorage.setItem("selectedDesign", JSON.stringify(design));
    toast.success(`${design.name} added to your project plan!`);

    // Simulate a "Next Step" prompt
    setTimeout(() => {
      toast(
        (t) => (
          <span className="flex items-center gap-2">
            Ready to budget?
            <button
              onClick={() => {
                toast.dismiss(t.id);
                navigate("/finance");
              }}
              className="px-2 py-1 bg-indigo-600 text-slate text-xs font-bold rounded"
            >
              Go to Finance
            </button>
          </span>
        ),
        { duration: 5000 }
      );
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
          The Canadian Housing Catalogue
        </h1>
        <p className="text-lg text-slate-600">
          Browse pre-approved, architecturally designed ADUs and extensions.
          Accelerate your permitting process by choosing a compliant model for
          your property.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between sticky top-4 z-20">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
          {[
            "All",
            "Garden Suite",
            "Laneway House",
            "Basement Suite",
            "Second Story Addition",
          ].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                selectedType === type
                  ? "bg-slate-900 text-slate shadow-md"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            placeholder="Search designs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDesigns.map((design) => (
          <div
            key={design.id}
            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            {/* Image Area */}
            <div className="relative h-64 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
              <img
                src={design.image}
                alt={design.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-4 left-4 z-20 text-slate">
                <span className="px-2 py-1 bg-primary/90 backdrop-blur-sm text-xs font-bold rounded-md mb-2 inline-block">
                  {design.type}
                </span>
                <h3 className="text-xl font-bold leading-tight">
                  {design.name}
                </h3>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-sm text-slate-500 font-medium">
                    Estimated Cost
                  </p>
                  <p className="text-2xl font-black text-slate-900">
                    {new Intl.NumberFormat("en-CA", {
                      style: "currency",
                      currency: "CAD",
                      maximumSignificantDigits: 3,
                    }).format(design.estimatedCost)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 font-medium">Timeline</p>
                  <p className="font-bold text-slate-900">
                    {design.estimatedDuration}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mb-6 border-y border-slate-100 py-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400">
                    square_foot
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    {design.sqft} sqft
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400">
                    bed
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    {design.bedrooms} Bed
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400">
                    shower
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    {design.bathrooms} Bath
                  </span>
                </div>
              </div>

              <p className="text-slate-600 text-sm mb-6 line-clamp-3">
                {design.description}
              </p>

              <div className="mt-auto space-y-3">
                <button
                  onClick={() => handleSelectDesign(design)}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-200 transition-all transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">add_circle</span>
                  Select This Model
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button className="w-full py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                    <span className="material-symbols-outlined text-lg">
                      vrpo
                    </span>
                    3D View
                  </button>
                  <button
                    onClick={() => {
                      // In a real app, we'd load the specific template for this design
                      navigate("/editor");
                      toast("Opening Plan Editor...");
                    }}
                    className="w-full py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <span className="material-symbols-outlined text-lg">
                      edit_square
                    </span>
                    Customize
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DesignCatalogue;
