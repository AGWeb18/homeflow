import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { api } from '../services/api';
import { Project, Quote, Contractor } from '../types';

const Quotes = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'received'>('received');
  const [project, setProject] = useState<Project | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Mock form state for new request
  const [newRequestTitle, setNewRequestTitle] = useState("");
  const [selectedContractor, setSelectedContractor] = useState("");
  const [team, setTeam] = useState<Contractor[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const p = await api.getProject();
        setProject(p);
        if (p) {
            const [q, t] = await Promise.all([
                api.getQuotes(p.id),
                api.getTeam(p.id)
            ]);
            setQuotes(q);
            setTeam(t);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateRequest = async () => {
    if (!project || !selectedContractor) return;
    
    try {
        // For now, we just create a 'pending' quote record to simulate the request
        await api.createQuote({
            project_id: project.id,
            contractor_id: selectedContractor,
            title: newRequestTitle || "New Project Request",
            amount: 0, // Placeholder until they bid
            status: 'pending',
            received_date: new Date().toISOString()
        });
        toast.success("Request sent successfully!");
        setIsCreateModalOpen(false);
        setNewRequestTitle("");
        // Refresh
        const q = await api.getQuotes(project.id);
        setQuotes(q);
        setActiveTab('requests');
    } catch (err) {
        toast.error("Failed to send request.");
        console.error(err);
    }
  };

  const handleAcceptQuote = async (quote: Quote) => {
    if (!project) return;
    if (!window.confirm(`Are you sure you want to accept the quote from ${quote.contractor?.name}?`)) return;

    try {
        await api.updateQuoteStatus(quote.id, 'accepted');
        // Add to team if not already there (though createRequest logic might imply they are already there, 
        // but in a real marketplace they might not be).
        // Our current Create Request UI requires them to be in the team, but let's be safe.
        if (quote.contractor) {
             await api.addToTeam(project.id, quote.contractor.id, quote.contractor.role);
        }
        
        toast.success("Quote accepted! Contractor added to your team.");
        
        // Refresh quotes
        const q = await api.getQuotes(project.id);
        setQuotes(q);
    } catch (err) {
        console.error(err);
        toast.error("Failed to accept quote.");
    }
  };

  if (loading) return <div className="p-6">Loading quotes...</div>;

  // Separate quotes into 'received' (have amount > 0) and 'requests' (amount 0 or status pending/sent)
  // Simplified logic for demo
  const receivedQuotes = quotes.filter(q => q.amount > 0);
  const sentRequests = quotes.filter(q => q.amount === 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Quote Management</h1>
          <p className="text-slate-500 mt-2">Track requests, compare bids, and award contracts.</p>
        </div>
        <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-slate-900 font-bold rounded-lg text-sm shadow-sm transition-colors flex items-center gap-2"
        >
            <span className="material-symbols-outlined text-lg">add</span>
            Create New Request
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100">
            <button 
                onClick={() => setActiveTab('received')}
                className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'received' ? 'border-primary text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                Received Quotes
            </button>
            <button 
                onClick={() => setActiveTab('requests')}
                className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'requests' ? 'border-primary text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                Sent Requests
            </button>
        </div>

        <div className="p-6 min-h-[300px]">
            {activeTab === 'received' && (
                <div className="space-y-4">
                    {receivedQuotes.map(q => (
                        <div key={q.id} className="p-4 border border-slate-200 rounded-lg hover:border-primary/50 transition-colors cursor-pointer group">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-slate-900">{q.title}</h3>
                                    <p className="text-sm text-slate-500">From: {q.contractor?.name || 'Unknown Contractor'}</p>
                                </div>
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase">
                                    {q.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-slate-400">Received: {new Date(q.received_date).toLocaleDateString()}</p>
                                    <p className="font-black text-lg text-slate-900">${q.amount.toLocaleString()}</p>
                                </div>
                                {q.status === 'pending' && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleAcceptQuote(q); }}
                                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg shadow-sm transition-colors"
                                    >
                                        Accept Quote
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    
                    {receivedQuotes.length === 0 && (
                        <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                            <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
                            <p>No quotes received yet.</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'requests' && (
                <div className="space-y-4">
                    {sentRequests.map(q => (
                        <div key={q.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                            <div>
                                <h3 className="font-bold text-slate-900">{q.title}</h3>
                                <p className="text-sm text-slate-500">Sent to: {q.contractor?.name}</p>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-500">
                                <span className="material-symbols-outlined text-lg">schedule</span>
                                Awaiting Bid
                            </div>
                        </div>
                    ))}

                    {sentRequests.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">send</span>
                            <p>You haven't sent any Request for Proposals (RFPs) yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>

      {/* Simple Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                <h3 className="font-bold text-lg text-slate-900 mb-4">Send Request for Quote</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Project Title</label>
                        <input 
                            type="text" 
                            className="w-full rounded-lg border-slate-300"
                            placeholder="e.g. Backyard ADU Foundation"
                            value={newRequestTitle}
                            onChange={e => setNewRequestTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Select Contractor</label>
                        {team.length > 0 ? (
                            <select 
                                className="w-full rounded-lg border-slate-300"
                                value={selectedContractor}
                                onChange={e => setSelectedContractor(e.target.value)}
                            >
                                <option value="">-- Choose from Team --</option>
                                {team.map(c => (
                                    <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
                                ))}
                            </select>
                        ) : (
                            <div className="text-sm text-red-500 bg-red-50 p-3 rounded">
                                You need to add contractors to your team first.
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button 
                        onClick={() => setIsCreateModalOpen(false)}
                        className="px-4 py-2 text-slate-600 font-bold text-sm hover:bg-slate-100 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleCreateRequest}
                        disabled={!selectedContractor || !newRequestTitle}
                        className="px-4 py-2 bg-primary hover:bg-primary-hover text-slate-900 font-bold text-sm rounded-lg disabled:opacity-50"
                    >
                        Send Request
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Quotes;