import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { DesignModel } from "../services/catalogueData";
import { api } from "../services/api";
import { Project, BudgetItem, Expense } from "../types";

const FinancialPlanning = () => {
  const [activeTab, setActiveTab] = useState("estimator");
  const [project, setProject] = useState<Project | null>(null);
  
  // Estimator State
  const [selectedDesign, setSelectedDesign] = useState<DesignModel | null>(null);
  const [sqft, setSqft] = useState(750);
  const [bedrooms, setBedrooms] = useState(2);
  const [estimatedCost, setEstimatedCost] = useState(187500);

  // Tracker State
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loadingTracker, setLoadingTracker] = useState(false);

  useEffect(() => {
    // Load project
    api.getProject().then(p => {
      setProject(p);
      if (p) fetchTrackerData(p.id);
    });

    // Load design for estimator
    const storedDesign = localStorage.getItem("selectedDesign");
    if (storedDesign) {
      const design: DesignModel = JSON.parse(storedDesign);
      setSelectedDesign(design);
      setSqft(design.sqft);
      setBedrooms(design.bedrooms);
      setEstimatedCost(design.estimatedCost);
    }
  }, []);

  const fetchTrackerData = async (projectId: string) => {
    setLoadingTracker(true);
    try {
      const [b, e] = await Promise.all([
        api.getBudgetItems(projectId),
        api.getExpenses(projectId)
      ]);
      setBudgetItems(b);
      setExpenses(e);
    } catch (err) {
      console.error("Failed to load tracker data", err);
    } finally {
      setLoadingTracker(false);
    }
  };

  // Estimator Handlers
  const handleClearDesign = () => {
    localStorage.removeItem("selectedDesign");
    setSelectedDesign(null);
    setSqft(750);
    setBedrooms(2);
    setEstimatedCost(187500);
    toast("Design selection cleared");
  };

  const handleUpdateEstimate = () => {
    if (!selectedDesign) {
      const newCost = sqft * 250; // Mock $250/sqft
      setEstimatedCost(newCost);
    }
    toast.success("Estimate updated!");
  };

  const handleSaveEstimateToBudget = async () => {
    if (!project) return;
    try {
      // Save standard categories based on estimate
      await api.createBudgetItem({ project_id: project.id, category: 'Labor', name: 'General Labor', estimated_amount: estimatedCost * 0.5 });
      await api.createBudgetItem({ project_id: project.id, category: 'Materials', name: 'Building Materials', estimated_amount: estimatedCost * 0.35 });
      await api.createBudgetItem({ project_id: project.id, category: 'Permits', name: 'Permits & Fees', estimated_amount: estimatedCost * 0.1 });
      await api.createBudgetItem({ project_id: project.id, category: 'Contingency', name: 'Contingency Fund', estimated_amount: estimatedCost * 0.05 });
      
      toast.success("Estimate saved to Budget Tracker!");
      fetchTrackerData(project.id);
      setActiveTab("tracker");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save to budget");
    }
  };

  // Tracker Handlers
  const handleAddBudgetItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    try {
        await api.createBudgetItem({
            project_id: project.id,
            name: formData.get('name') as string,
            category: formData.get('category') as string,
            estimated_amount: Number(formData.get('amount')),
        });
        fetchTrackerData(project.id);
        form.reset();
        toast.success("Budget item added");
    } catch (err) {
        toast.error("Failed to add item");
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    try {
        await api.createExpense({
            project_id: project.id,
            name: formData.get('name') as string,
            amount: Number(formData.get('amount')),
            date: new Date().toISOString(),
            category: 'General'
        });
        fetchTrackerData(project.id);
        form.reset();
        toast.success("Expense recorded");
    } catch (err) {
        toast.error("Failed to add expense");
    }
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumSignificantDigits: 6,
    }).format(amount);
  };

  // Calculations
  const totalBudget = budgetItems.reduce((sum, item) => sum + item.estimated_amount, 0);
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remaining = totalBudget - totalSpent;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Plan & Fund Your ADU Project
          </h1>
          <p className="text-slate-500 mt-2">
            Use our tools to estimate costs, track your real budget, and explore financing.
          </p>
        </div>
      </div>

      <div className="border-b border-slate-200 mb-8">
        <div className="flex gap-8">
          {["Cost Estimator", "Budget Tracker", "Financing Options"].map((tab) => {
            const id = tab.toLowerCase().replace(" ", "-");
            const isActive =
              activeTab === id ||
              (id === "cost-estimator" && activeTab === "estimator") ||
              (id === "budget-tracker" && activeTab === "tracker");
            
            // Map ID to simple key
            const key = id === "cost-estimator" ? "estimator" : id === "budget-tracker" ? "tracker" : "financing";

            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`pb-3 pt-2 text-sm font-bold border-b-[3px] transition-colors ${
                  activeTab === key
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

      {/* ESTIMATOR TAB */}
      {activeTab === "estimator" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Square Footage</label>
                      <input type="number" value={sqft} onChange={(e) => setSqft(Number(e.target.value))} className="w-full rounded-lg border-slate-300 bg-slate-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Bedrooms</label>
                      <select value={bedrooms} onChange={(e) => setBedrooms(Number(e.target.value))} className="w-full rounded-lg border-slate-300 bg-slate-50">
                        <option value={0}>Studio</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </select>
                    </div>
                </div>
                <button onClick={handleUpdateEstimate} className="px-6 py-2 bg-primary hover:bg-primary-hover text-slate text-sm font-bold rounded-lg shadow-sm">
                  Update Estimate
                </button>
            </div>

            {/* Breakdown */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
              <div className="mb-6">
                <h3 className="font-bold text-slate-900">Estimated Cost</h3>
                <p className="text-4xl font-black text-slate-900 mt-1 tracking-tight">{formatMoney(estimatedCost)}</p>
              </div>
              <button onClick={handleSaveEstimateToBudget} className="w-full mt-6 py-2.5 border border-primary text-primary font-bold rounded-lg hover:bg-primary/5 flex items-center justify-center gap-2 text-sm">
                Create Budget from Estimate
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
      )}

      {/* TRACKER TAB */}
      {activeTab === "tracker" && (
          <div className="space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <p className="text-slate-500 text-sm font-bold uppercase">Total Budget</p>
                      <p className="text-3xl font-black text-slate-900">{formatMoney(totalBudget)}</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <p className="text-slate-500 text-sm font-bold uppercase">Total Spent</p>
                      <p className="text-3xl font-black text-red-600">{formatMoney(totalSpent)}</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <p className="text-slate-500 text-sm font-bold uppercase">Remaining</p>
                      <p className={`text-3xl font-black ${remaining < 0 ? 'text-red-600' : 'text-emerald-600'}`}>{formatMoney(remaining)}</p>
                  </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Budget Items List */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                          <h3 className="font-bold text-slate-900">Budget Allocation</h3>
                      </div>
                      <div className="p-4 space-y-4">
                          {budgetItems.map(item => (
                              <div key={item.id} className="flex justify-between items-center border-b border-slate-50 pb-2 last:border-0">
                                  <div>
                                      <p className="font-bold text-slate-900">{item.name}</p>
                                      <p className="text-xs text-slate-500">{item.category}</p>
                                  </div>
                                  <p className="font-bold text-slate-700">{formatMoney(item.estimated_amount)}</p>
                              </div>
                          ))}
                          {budgetItems.length === 0 && <p className="text-slate-400 text-center text-sm">No budget items yet.</p>}
                          
                          {/* Add Item Form */}
                          <form onSubmit={handleAddBudgetItem} className="mt-4 pt-4 border-t border-slate-100">
                              <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Add Budget Item</h4>
                              <div className="grid grid-cols-3 gap-2">
                                  <input name="name" placeholder="Item Name" required className="text-sm rounded border-slate-300" />
                                  <select name="category" className="text-sm rounded border-slate-300">
                                      <option>Materials</option>
                                      <option>Labor</option>
                                      <option>Permits</option>
                                      <option>Other</option>
                                  </select>
                                  <input name="amount" type="number" placeholder="Amount" required className="text-sm rounded border-slate-300" />
                              </div>
                              <button type="submit" className="mt-2 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded text-sm">Add Item</button>
                          </form>
                      </div>
                  </div>

                  {/* Expenses List */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                          <h3 className="font-bold text-slate-900">Expenses</h3>
                      </div>
                      <div className="p-4 space-y-4">
                          {expenses.map(exp => (
                              <div key={exp.id} className="flex justify-between items-center border-b border-slate-50 pb-2 last:border-0">
                                  <div>
                                      <p className="font-bold text-slate-900">{exp.name}</p>
                                      <p className="text-xs text-slate-500">{new Date(exp.date!).toLocaleDateString()}</p>
                                  </div>
                                  <p className="font-bold text-red-600">-{formatMoney(exp.amount)}</p>
                              </div>
                          ))}
                           {expenses.length === 0 && <p className="text-slate-400 text-center text-sm">No expenses recorded.</p>}

                           {/* Add Expense Form */}
                          <form onSubmit={handleAddExpense} className="mt-4 pt-4 border-t border-slate-100">
                              <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Log Expense</h4>
                              <div className="grid grid-cols-2 gap-2">
                                  <input name="name" placeholder="Description" required className="text-sm rounded border-slate-300 col-span-2" />
                                  <input name="amount" type="number" placeholder="Amount" required className="text-sm rounded border-slate-300 col-span-2" />
                              </div>
                              <button type="submit" className="mt-2 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded text-sm">Log Expense</button>
                          </form>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* FINANCING TAB */}
      {activeTab === "financing" && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 text-lg mb-4">Financing Options</h3>
              <p className="text-slate-500">Loan calculator and lender options coming soon.</p>
          </div>
      )}
    </div>
  );
};

export default FinancialPlanning;