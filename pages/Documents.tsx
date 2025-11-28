import React, { useEffect, useState, useRef } from 'react';
import { api } from '../services/api';
import { Project, ProjectDocument } from '../types';

const Documents = () => {
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState('All');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      const p = await api.getProject();
      setProject(p);
      if (p) {
        const docs = await api.getDocuments(p.id);
        setDocuments(docs);
      }
    } catch (err) {
      console.error('Failed to fetch documents', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !project) return;

    setUploading(true);
    try {
      await api.uploadDocument(project.id, file);
      // Refresh list
      const docs = await api.getDocuments(project.id);
      setDocuments(docs);
    } catch (err) {
      console.error('Upload failed', err);
      alert('Failed to upload document.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (path: string) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      await api.deleteDocument(path);
      setDocuments(documents.filter(d => d.path !== path));
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete document.');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString();
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return 'picture_as_pdf';
    if (type.includes('image')) return 'image';
    return 'description';
  };

  if (loading) return <div className="p-6">Loading documents...</div>;
  if (!project) return <div className="p-6">No project found.</div>;

  // Simple client-side filtering based on name/type or eventually metadata
  // For now, "All" shows everything. We can categorize by file type or manual tagging later.
  const filteredDocuments = documents; // Implement filter logic if we add categories

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Project Documents</h1>
          <p className="text-slate-500 mt-2">Centralize your blueprints, permits, contracts, and receipts.</p>
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={handleUploadClick}
            disabled={uploading}
            className={`flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-bold shadow-sm transition-colors ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span className="material-symbols-outlined text-lg">upload_file</span>
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>
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
            {filteredDocuments.map(doc => (
                <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <span className="material-symbols-outlined">{getFileIcon(doc.type)}</span>
                        </div>
                        <div>
                            <a 
                                href={doc.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="font-bold text-slate-900 text-sm hover:text-primary hover:underline"
                            >
                                {doc.name}
                            </a>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="uppercase">{doc.type.split('/')[1] || 'file'}</span>
                                <span>•</span>
                                <span>{formatDate(doc.created_at)}</span>
                                <span>•</span>
                                <span>{formatSize(doc.size)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a 
                            href={doc.url}
                            download={doc.name} // 'download' attribute only works for same-origin, but useful hint
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 flex items-center justify-center" 
                            title="Download"
                        >
                            <span className="material-symbols-outlined">download</span>
                        </a>
                        <button 
                            onClick={() => handleDelete(doc.path)}
                            className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full text-slate-500 flex items-center justify-center" 
                            title="Delete"
                        >
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </div>
            ))}
            {filteredDocuments.length === 0 && (
                <div className="p-12 text-center text-slate-500">
                    <span className="material-symbols-outlined text-4xl mb-2">folder_open</span>
                    <p>No documents found. Upload one to get started.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Documents;
