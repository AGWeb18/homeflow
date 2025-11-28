import React from "react";
import { Link } from "react-router-dom";

const Features = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-20 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold w-fit border border-primary/30 mb-6">
            <span className="material-symbols-outlined text-sm">star</span>
            Comprehensive Toolkit
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Everything you need to <span className="text-primary">build confident</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
            HomeFlow combines professional-grade tools with homeowner-friendly guidance to streamline your ADU or extension project.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/login?mode=signup"
              className="px-8 py-4 bg-primary hover:bg-primary-hover text-slate-900 font-bold rounded-xl shadow-lg shadow-primary/20 transition-all"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Feature 1: Feasibility */}
      <section className="py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm relative">
                {/* Mock UI */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <span className="material-symbols-outlined">check_circle</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Zoning Approved</p>
                      <p className="text-xs text-slate-500">Based on R2 Residential Zone</p>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full w-full">
                    <div className="h-2 bg-green-500 rounded-full w-3/4"></div>
                  </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-slate-600 border-b border-slate-200 pb-2">
                        <span>Max Height</span>
                        <span className="font-bold">8.5m</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 border-b border-slate-200 pb-2">
                        <span>Rear Setback</span>
                        <span className="font-bold">7.5m</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600">
                        <span>Lot Coverage</span>
                        <span className="font-bold">35%</span>
                    </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <span className="material-symbols-outlined text-2xl">location_on</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Instant Feasibility Analysis
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                Stop guessing. Our engine analyzes local zoning bylaws, lot geometry, and constraints to tell you exactly what you can build.
              </p>
              <ul className="space-y-3">
                {[
                  "Zoning Check: Instant pass/fail for ADUs",
                  "Setback Calculator: Know your buildable area",
                  "Interactive Map: Visual constraints overlay"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <span className="material-symbols-outlined text-green-500 text-lg">check</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2: Task Management */}
      <section className="py-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                <span className="material-symbols-outlined text-2xl">checklist</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Step-by-Step Project Roadmap
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                From "Idea" to "Occupancy," we break down the complex construction process into manageable, actionable tasks.
              </p>
              <ul className="space-y-3">
                {[
                  "Smart Timeline: Auto-adjusts based on progress",
                  "DIY Guidance: Save money with specific how-to guides",
                  "Resource Links: Direct access to permit forms and tools"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <span className="material-symbols-outlined text-green-500 text-lg">check</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
               <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-4">Upcoming Tasks</h3>
                  <div className="space-y-3">
                      {[
                          { title: "Submit Permit Application", due: "Due Today", status: "pending" },
                          { title: "Contact Structural Engineer", due: "Due in 3 days", status: "pending" },
                          { title: "Site Survey", due: "Completed", status: "done" }
                      ].map((t, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50">
                              <div className="flex items-center gap-3">
                                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${t.status === 'done' ? 'bg-primary border-primary text-white' : 'border-slate-300'}`}>
                                      {t.status === 'done' && <span className="material-symbols-outlined text-xs">check</span>}
                                  </div>
                                  <div>
                                      <p className={`font-medium ${t.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{t.title}</p>
                                      <p className="text-xs text-slate-500">{t.due}</p>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 3: Financials */}
      <section className="py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
               <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-end mb-6">
                      <div>
                          <p className="text-sm text-slate-500 font-bold uppercase">Total Budget</p>
                          <p className="text-3xl font-black text-slate-900">$185,000</p>
                      </div>
                      <div className="text-right">
                          <p className="text-sm text-emerald-600 font-bold">On Track</p>
                          <p className="text-xs text-slate-400">Updated 2h ago</p>
                      </div>
                  </div>
                  <div className="space-y-4">
                      {[
                          { label: "Materials", val: 65, color: "bg-blue-500" },
                          { label: "Labor", val: 45, color: "bg-indigo-500" },
                          { label: "Permits", val: 80, color: "bg-emerald-500" }
                      ].map((stat, i) => (
                          <div key={i}>
                              <div className="flex justify-between text-sm mb-1">
                                  <span className="font-bold text-slate-700">{stat.label}</span>
                                  <span className="text-slate-500">{stat.val}%</span>
                              </div>
                              <div className="h-2 bg-slate-100 rounded-full w-full">
                                  <div className={`h-2 rounded-full ${stat.color}`} style={{ width: `${stat.val}%`}}></div>
                              </div>
                          </div>
                      ))}
                  </div>
               </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                <span className="material-symbols-outlined text-2xl">payments</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Precise Budget Control
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                Construction costs can spiral. We help you estimate accurately, track every dollar, and stay within your means.
              </p>
              <ul className="space-y-3">
                {[
                  "Cost Estimator: Localized material & labor rates",
                  "Expense Tracking: Log receipts and invoices",
                  "ROI Calculator: See the value your project adds"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <span className="material-symbols-outlined text-green-500 text-lg">check</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start your project?</h2>
          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of homeowners who are building smarter, faster, and cheaper with HomeFlow.
          </p>
          <Link
            to="/login?mode=signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-hover text-slate-900 font-bold rounded-xl transition-all transform hover:-translate-y-1"
          >
            Create Your Free Project
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Features;
