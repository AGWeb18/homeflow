import React from 'react';

const Messages = () => {
  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-3 h-full gap-6">
        {/* Sidebar List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-900 text-lg">Messages</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
                {[1, 2].map((i) => (
                    <div key={i} className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${i === 1 ? 'bg-slate-50' : ''}`}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <p className="font-bold text-slate-900 text-sm truncate">BuildCo Construction</p>
                                    <span className="text-xs text-slate-400">2m ago</span>
                                </div>
                                <p className="text-xs text-slate-500 truncate">RE: Foundation inspection schedule</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                    <div>
                        <p className="font-bold text-slate-900">BuildCo Construction</p>
                        <p className="text-xs text-green-600 font-bold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
                        </p>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                    <span className="material-symbols-outlined">more_vert</span>
                </button>
            </div>
            
            <div className="flex-1 p-6 bg-slate-50 overflow-y-auto space-y-4">
                <div className="flex justify-end">
                    <div className="bg-primary text-white px-4 py-2 rounded-2xl rounded-tr-none max-w-md shadow-sm text-sm">
                        <p>Hi, just wanted to check when the foundation team is arriving?</p>
                    </div>
                </div>
                <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-2xl rounded-tl-none max-w-md shadow-sm text-sm">
                        <p>They are scheduled for Tuesday morning at 8 AM. Does that still work for you?</p>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
                        <span className="material-symbols-outlined">attach_file</span>
                    </button>
                    <input 
                        type="text" 
                        placeholder="Type a message..." 
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                    />
                    <button className="p-2 bg-primary hover:bg-primary-hover text-white rounded-xl transition-colors shadow-sm">
                        <span className="material-symbols-outlined">send</span>
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;