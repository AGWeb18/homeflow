import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { api } from '../services/api';
import { Project, Contractor, Message } from '../types';
import { useNavigate } from 'react-router-dom';

const Messages = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [team, setTeam] = useState<Contractor[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Selection state: null = General/Notes, otherwise Contractor ID
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetch = async () => {
    try {
      const p = await api.getProject();
      setProject(p);
      if (p) {
        const [t, m] = await Promise.all([
            api.getTeam(p.id),
            api.getMessages(p.id)
        ]);
        setTeam(t);
        setMessages(m);
      }
    } catch (error) {
      console.error("Failed to load messages", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeThreadId]);

  const handleSend = async () => {
    if (!inputText.trim() || !project) return;
    
    try {
        const newMsg = await api.sendMessage(project.id, inputText, activeThreadId || undefined);
        setMessages([...messages, newMsg]);
        setInputText("");
    } catch (err) {
        console.error(err);
        toast.error("Failed to send message");
    }
  };

  // Filter messages for the active thread
  const threadMessages = messages.filter(m => 
    (activeThreadId === null && !m.contractor_id) || 
    (activeThreadId !== null && m.contractor_id === activeThreadId)
  );

  const activeContractor = team.find(c => c.id === activeThreadId);

  if (loading) return <div className="p-6">Loading messages...</div>;
  if (!project) return <div className="p-6">No project found.</div>;

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-3 h-full gap-6">
        {/* Sidebar List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-900 text-lg">Conversations</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
                {/* General Thread */}
                <div 
                    onClick={() => setActiveThreadId(null)}
                    className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${activeThreadId === null ? 'bg-blue-50/50 border-l-4 border-l-primary' : ''}`}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                            <span className="material-symbols-outlined">assignment</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-900 text-sm">Project Notes</p>
                            <p className="text-xs text-slate-500">General Log</p>
                        </div>
                    </div>
                </div>

                {/* Team Members */}
                {team.map((member) => (
                    <div 
                        key={member.id} 
                        onClick={() => setActiveThreadId(member.id)}
                        className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${activeThreadId === member.id ? 'bg-blue-50/50 border-l-4 border-l-primary' : ''}`}
                    >
                        <div className="flex items-center gap-3">
                            <div 
                                className="w-10 h-10 rounded-full bg-cover bg-center border border-slate-200"
                                style={{ backgroundImage: `url(${member.image})` }}
                            ></div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <p className="font-bold text-slate-900 text-sm truncate">{member.name}</p>
                                </div>
                                <p className="text-xs text-slate-500 truncate">{member.role}</p>
                            </div>
                        </div>
                    </div>
                ))}

                {team.length === 0 && (
                    <div className="p-6 text-center">
                        <p className="text-sm text-slate-500 mb-2">No contractors on your team yet.</p>
                        <button 
                            onClick={() => navigate('/contractors')}
                            className="text-primary text-xs font-bold hover:underline"
                        >
                            Find Contractors
                        </button>
                    </div>
                )}
            </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                <div className="flex items-center gap-3">
                    {activeThreadId ? (
                        <>
                            <div 
                                className="w-10 h-10 rounded-full bg-cover bg-center"
                                style={{ backgroundImage: `url(${activeContractor?.image})` }}
                            ></div>
                            <div>
                                <p className="font-bold text-slate-900">{activeContractor?.name}</p>
                                <p className="text-xs text-slate-500">{activeContractor?.role}</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                <span className="material-symbols-outlined">assignment</span>
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">Project Notes</p>
                                <p className="text-xs text-slate-500">Keep track of calls, ideas, and updates.</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
            
            <div className="flex-1 p-6 bg-slate-50 overflow-y-auto space-y-4" ref={scrollRef}>
                {threadMessages.length === 0 && (
                    <div className="text-center py-12 text-slate-400 text-sm">
                        No messages yet. Start the conversation!
                    </div>
                )}
                {threadMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender_role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div 
                            className={`px-4 py-2 rounded-2xl max-w-md shadow-sm text-sm ${
                                msg.sender_role === 'user' 
                                ? 'bg-primary text-white rounded-tr-none' 
                                : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                            }`}
                        >
                            <p>{msg.content}</p>
                            <p className={`text-[10px] mt-1 text-right ${msg.sender_role === 'user' ? 'text-white/70' : 'text-slate-400'}`}>
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
                <form 
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex gap-2"
                >
                    <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={activeThreadId ? `Message ${activeContractor?.name}...` : "Log a note..."}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                    />
                    <button 
                        type="submit"
                        disabled={!inputText.trim()}
                        className="p-2 bg-primary hover:bg-primary-hover text-white rounded-xl transition-colors shadow-sm disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined">send</span>
                    </button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
