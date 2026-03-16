import { ArrowLeft, MoreVertical, Pencil, User, Bell, Shield, ShieldCheck, LogOut, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AgentSettings() {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-4 mb-24 max-w-md mx-auto h-full bg-white flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 mt-2">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-[#1a202c]">Settings</h1>
        <button className="p-2 -mr-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
          <MoreVertical size={24} />
        </button>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative mb-4">
          <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-br from-[#d6bcfa] to-[#e9d8fd]">
            <img 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=250&auto=format&fit=crop" 
              alt="Alex Johnson" 
              className="w-full h-full rounded-full object-cover border-4 border-white"
            />
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#7f13ec] rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-[#6c0fca] transition-colors shadow-sm">
            <Pencil size={14} fill="currentColor" />
          </button>
        </div>
        
        <h2 className="text-2xl font-bold text-[#1a202c] mb-1">Alex Johnson</h2>
        <p className="text-[13px] text-gray-500 mb-4 font-medium">
          +256 700 000 000 • alex.j@example.com
        </p>
        
        <div className="bg-[#f3e8ff] text-[#7f13ec] px-4 py-1.5 rounded-full flex items-center gap-2 border border-[#7f13ec]/10">
          <Star size={14} fill="currentColor" />
          <span className="text-xs font-bold tracking-wide">SILVER AGENT</span>
        </div>
      </div>

      {/* Settings Menu */}
      <div className="flex flex-col gap-4 mb-8 flex-1">
        <button className="flex items-center justify-between w-full p-2 group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-[14px] bg-[#f3e8ff] text-[#7f13ec] flex items-center justify-center group-hover:bg-[#e9d8fd] transition-colors">
              <User size={20} fill="currentColor" />
            </div>
            <span className="text-[15px] font-bold text-[#2d3748]">Edit Profile</span>
          </div>
          <div className="w-6 h-6 flex items-center justify-center text-gray-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </button>

        <button className="flex items-center justify-between w-full p-2 group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-[14px] bg-[#f3e8ff] text-[#7f13ec] flex items-center justify-center group-hover:bg-[#e9d8fd] transition-colors">
              <Bell size={20} fill="currentColor" />
            </div>
            <span className="text-[15px] font-bold text-[#2d3748]">Notification Settings</span>
          </div>
          <div className="w-6 h-6 flex items-center justify-center text-gray-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </button>

        <button className="flex items-center justify-between w-full p-2 group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-[14px] bg-[#f3e8ff] text-[#7f13ec] flex items-center justify-center group-hover:bg-[#e9d8fd] transition-colors">
              <Shield size={20} fill="currentColor" />
            </div>
            <span className="text-[15px] font-bold text-[#2d3748]">Security</span>
          </div>
          <div className="w-6 h-6 flex items-center justify-center text-gray-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </button>

        <button className="flex items-center justify-between w-full p-2 group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-[14px] bg-[#f3e8ff] text-[#7f13ec] flex items-center justify-center group-hover:bg-[#e9d8fd] transition-colors">
              <ShieldCheck size={20} className="stroke-[2.5px]" />
            </div>
            <span className="text-[15px] font-bold text-[#2d3748]">Privacy Policy</span>
          </div>
          <div className="w-6 h-6 flex items-center justify-center text-gray-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </button>
      </div>

      <div className="h-[1px] bg-gray-100 w-full mb-6"></div>

      {/* Logout */}
      <div className="pb-8">
        <button className="flex items-center gap-4 w-full p-2 group hover:bg-gray-50 rounded-xl transition-colors">
          <div className="w-10 h-10 rounded-[14px] bg-[#fee2e2] text-[#ef4444] flex items-center justify-center">
            <LogOut size={20} className="stroke-[2.5px]" />
          </div>
          <span className="text-[15px] font-bold text-[#ef4444]">Logout</span>
        </button>
      </div>
    </div>
  );
}
