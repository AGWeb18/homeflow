import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { DesignModel } from "../services/catalogueData";

const FinancialPlanning = () => {
  const [activeTab, setActiveTab] = useState("estimator");
  const [selectedDesign, setSelectedDesign] = useState<DesignModel | null>(
    null
  );

  const [sqft, setSqft] = useState(750);
  const [bedrooms, setBedrooms] = useState(2);
  const [cost, setCost] = useState(187500);

  useEffect(() => {
    const storedDesign = localStorage.getItem("selectedDesign");
    if (storedDesign) {
      const design: DesignModel = JSON.parse(storedDesign);
      setSelectedDesign(design);
      setSqft(design.sqft);
      setBedrooms(design.bedrooms);
      setCost(design.estimatedCost);
      toast.success(`Loaded specs for ${design.name}`);
    }
  }, []);

  const handleClearDesign = () => {
    localStorage.removeItem("selectedDesign");
    setSelectedDesign(null);
    setSqft(750);
    setBedrooms(2);
    setCost(187500);
    toast("Design selection cleared");
  };

  const handleUpdateEstimate = () => {
    // Simple mock calculation if no design is selected
    if (!selectedDesign) {
      const newCost = sqft * 250; // Mock $250/sqft
      setCost(newCost);
    }
    toast.success("Estimate updated successfully!");
  };

  const handleSavePlan = () => {
    toast.success("Plan saved to your dashboard!");
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumSignificantDigits: 6,
    }).format(amount);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Plan & Fund Your ADU Project
          </h1>
          <p className="text-slate-500 mt-2">
            Use our tools to estimate costs and explore financing options.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-slate rounded-lg text-sm font-bold shadow-sm">
          <span className="material-symbols-outlined text-lg">download</span>
          Download Guide
        </button>
      </div>

      <div className="border-b border-slate-200 mb-8">
        <div className="flex gap-8">
          {["Cost Estimator", "Financing Options", "My Plan"].map((tab) => {
            const id = tab.toLowerCase().replace(" ", "-");
            const isActive =
              activeTab === id ||
              (id === "cost-estimator" && activeTab === "estimator");
            return (
              <button
                key={id}
                onClick={() =>
                  setActiveTab(id === "cost-estimator" ? "estimator" : id)
                }
                className={`pb-3 pt-2 text-sm font-bold border-b-[3px] transition-colors ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Estimate Your Project Costs
          </h2>
          <p className="text-slate-500 mb-6">
            Tell us about your project to get a preliminary cost estimate.
          </p>

          {selectedDesign && (
            <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-lg bg-cover bg-center"
                  style={{ backgroundImage: `url(${selectedDesign.image})` }}
                ></div>
                <div>
                  <p className="text-xs text-indigo-600 font-bold uppercase">
                    Selected Model
                  </p>
                  <h3 className="font-bold text-indigo-900">
                    {selectedDesign.name}
                  </h3>
                </div>
              </div>
              <button
                onClick={handleClearDesign}
                className="text-sm text-indigo-600 font-bold hover:underline"
              >
                Change
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
              {activeTab === "estimator" ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        Square Footage
                      </label>
                      <input
                        type="number"
                        value={sqft}
                        onChange={(e) => setSqft(Number(e.target.value))}
                        className="w-full rounded-lg border-slate-300 bg-slate-50 focus:bg-white focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        Bedrooms
                      </label>
                      <select
                        value={bedrooms}
                        onChange={(e) => setBedrooms(Number(e.target.value))}
                        className="w-full rounded-lg border-slate-300 bg-slate-50 focus:bg-white focus:ring-primary focus:border-primary"
                      >
                        <option value={0}>Studio</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Finish Quality
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <button className="py-2 px-4 rounded-lg border border-slate-300 text-slate-600 font-medium text-sm hover:bg-slate-50">
                        Basic
                      </button>
                      <button className="py-2 px-4 rounded-lg border-2 border-primary bg-primary/10 text-primary font-bold text-sm">
                        Standard
                      </button>
                      <button className="py-2 px-4 rounded-lg border border-slate-300 text-slate-600 font-medium text-sm hover:bg-slate-50">
                        Premium
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Location (ZIP Code)
                    </label>
                    <input
                      type="text"
                      defaultValue="90210"
                      className="w-full rounded-lg border-slate-300 bg-slate-50 focus:bg-white focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg">
                      Reset
                    </button>
                    <button
                      onClick={handleUpdateEstimate}
                      className="px-6 py-2 bg-primary hover:bg-primary-hover text-slate text-sm font-bold rounded-lg shadow-sm"
                    >
                      Update Estimate
                    </button>
                  </div>
                </>
              ) : activeTab === "financing-options" ? (
                <div className="space-y-6">
                  <h3 className="font-bold text-slate-900 text-lg">
                    Loan Calculator
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        Loan Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                          $
                        </span>
                        <input
                          type="number"
                          value={cost}
                          readOnly
                          className="w-full pl-8 rounded-lg border-slate-300 bg-slate-100 text-slate-500 cursor-not-allowed"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        Interest Rate (%)
                      </label>
                      <input
                        type="number"
                        defaultValue={5.5}
                        step="0.1"
                        className="w-full rounded-lg border-slate-300 bg-slate-50 focus:bg-white focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        Loan Term (Years)
                      </label>
                      <select
                        defaultValue={25}
                        className="w-full rounded-lg border-slate-300 bg-slate-50 focus:bg-white focus:ring-primary focus:border-primary"
                      >
                        <option value={15}>15 Years</option>
                        <option value={20}>20 Years</option>
                        <option value={25}>25 Years</option>
                        <option value={30}>30 Years</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        Down Payment
                      </label>
                      <input
                        type="number"
                        defaultValue={20000}
                        className="w-full rounded-lg border-slate-300 bg-slate-50 focus:bg-white focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-blue-800 font-bold">
                        Estimated Monthly Payment
                      </span>
                      <span className="text-2xl font-black text-blue-900">
                        {formatMoney(
                          ((cost - 20000) *
                            (0.055 / 12) *
                            Math.pow(1 + 0.055 / 12, 300)) /
                            (Math.pow(1 + 0.055 / 12, 300) - 1)
                        )}
                      </span>
                    </div>
                    <p className="text-xs text-blue-600">
                      *Estimate based on 5.5% interest rate over 25 years. Does
                      not include taxes or insurance.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-3">
                      Featured Lenders
                    </h4>
                    <div className="space-y-3">
                      {[
                        "Maple Leaf Mortgages",
                        "CityHome Financial",
                        "BuildBetter Loans",
                      ].map((lender) => (
                        <div
                          key={lender}
                          className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-primary transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                              <span className="material-symbols-outlined text-sm">
                                account_balance
                              </span>
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">
                                {lender}
                              </p>
                              <p className="text-xs text-emerald-600 font-bold">
                                Rates from 4.99%
                              </p>
                            </div>
                          </div>
                          <span className="material-symbols-outlined text-slate-400">
                            chevron_right
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-4xl text-slate-300 mb-4">
                    engineering
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    My Plan Feature Coming Soon
                  </h3>
                  <p className="text-slate-500">
                    Save your estimates and loan options here.
                  </p>
                </div>
              )}
            </div>

            {/* Breakdown */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
              <div className="mb-6">
                <h3 className="font-bold text-slate-900">Estimated Cost</h3>
                <p className="text-4xl font-black text-slate-900 mt-1 tracking-tight">
                  {formatMoney(cost)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Based on{" "}
                  {selectedDesign ? "catalogue specs" : "standard finishes"}
                </p>
              </div>

              <div className="space-y-3 flex-1">
                {[
                  { label: "Labor", amount: cost * 0.5, color: "bg-blue-500" },
                  {
                    label: "Materials",
                    amount: cost * 0.35,
                    color: "bg-sky-400",
                  },
                  {
                    label: "Permits & Fees",
                    amount: cost * 0.1,
                    color: "bg-teal-400",
                  },
                  {
                    label: "Contingency",
                    amount: cost * 0.05,
                    color: "bg-slate-300",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${item.color}`}
                      ></div>
                      <span className="text-slate-600">{item.label}</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      {formatMoney(item.amount)}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSavePlan}
                className="w-full mt-6 py-2.5 border border-primary text-primary font-bold rounded-lg hover:bg-primary/5 flex items-center justify-center gap-2 text-sm"
              >
                Save to My Plan
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialPlanning;
