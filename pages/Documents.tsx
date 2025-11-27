import React, { useState } from 'react';

const Documents = () => {
  const [filter, setFilter] = useState('All');

  const documents = [
    // Placeholder data - eventually fetch from Supabase 'documents' table
    { id: 1, name: 'Project Blueprints_v2.pdf', type: 'Plan', date: '2024-02-10', size: '4.2 MB' },
    { id: 2, name: 'Municipal Permit Application.pdf', type: 'Permit', date: '2024-02-15', size: '1.8 MB' },
    { id: 3, name: 'Contractor Agreement.docx', type: 'Contract', date: '2024-01-20', size: '500 KB' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Project Documents</h1>
          <p className="text-slate-500 mt-2">Centralize your blueprints, permits, contracts, and receipts.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-bold shadow-sm transition-colors">
          <span className="material-symbols-outlined text-lg">upload_file</span>
          Upload Document
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4 overflow-x-auto">
            {['All', 'Plans', 'Permits', 'Contracts', 'Invoices'].map(cat => (
                <button 
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                        filter === cat 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>

        <div className="divide-y divide-slate-100">
            {documents.map(doc => (
                <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <span className="material-symbols-outlined">description</span>
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-sm">{doc.name}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span>{doc.type}</span>
                                <span>•</span>
                                <span>{doc.date}</span>
                                <span>•</span>
                                <span>{doc.size}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500" title="Download">
                            <span className="material-symbols-outlined">download</span>
                        </button>
                        <button className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full text-slate-500" title="Delete">
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </div>
            ))}
            {documents.length === 0 && (
                <div className="p-12 text-center text-slate-500">
                    <span className="material-symbols-outlined text-4xl mb-2">folder_open</span>
                    <p>No documents found.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Documents;