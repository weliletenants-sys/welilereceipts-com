import { ArrowLeft, MoreVertical, Edit2, User, Bell, Shield, ShieldCheck, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TenantProfile() {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'edit', label: 'Edit Profile', icon: User },
    { id: 'notifications', label: 'Notification Settings', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
  ];

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] pb-24 font-sans relative flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex justify-between items-center px-6 py-5 bg-[#f8f9fa]">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} strokeWidth={2} />
        </button>
        <span className="text-[17px] font-bold text-gray-900 tracking-tight">Profile</span>
        <button className="p-2 -mr-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={20} strokeWidth={2} />
        </button>
      </div>

      {/* User Info Section */}
      <div className="w-full flex flex-col items-center pt-4 pb-8">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-[#111827] flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
            {/* Dark Silhouette placeholder */}
            <User size={64} className="text-[#374151] translate-y-3" />
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#8b31ff] rounded-full flex items-center justify-center border-2 border-[#f8f9fa] shadow-sm active:scale-95 transition-transform">
            <Edit2 size={13} strokeWidth={2.5} className="text-white ml-0.5" />
          </button>
        </div>
        
        <h2 className="text-[20px] font-bold text-[#1a1f36] tracking-tight mb-1">Alex Johnson</h2>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[14px] text-[#6b7280] font-medium">+1 (555) 000-1234</span>
          <span className="text-[14px] text-[#6b7280] font-medium">alex.johnson@example.com</span>
        </div>
      </div>

      {/* Settings Menu Card */}
      <div className="w-full px-6 mb-8 w-full max-w-md">
        <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-[#f3f4f6] overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="w-full">
                <button className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#faf5ff] flex items-center justify-center shrink-0">
                      <Icon size={18} strokeWidth={2.5} className="text-[#8b31ff]" />
                    </div>
                    <span className="text-[14.5px] font-semibold text-[#1a1f36]">{item.label}</span>
                  </div>
                  <ChevronRightIcon />
                </button>
                {/* Separator Line */}
                {index < menuItems.length - 1 && (
                  <div className="w-full px-4"><div className="w-full border-b border-gray-100"></div></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Logout Button */}
      <div className="w-full px-6 w-full max-w-md">
        <button className="w-full flex items-center justify-center gap-2 py-4 bg-[#faf5ff] border border-[#e9d5ff] rounded-[16px] active:scale-[0.98] transition-all">
          <LogOut size={18} strokeWidth={2.5} className="text-[#8b31ff] rotate-180" />
          <span className="text-[15px] font-bold text-[#8b31ff]">Logout</span>
        </button>
      </div>
    </div>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
