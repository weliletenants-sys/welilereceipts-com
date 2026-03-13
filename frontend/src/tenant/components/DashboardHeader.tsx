import { Bell, User } from 'lucide-react';

interface DashboardHeaderProps {
  user: {
    fullName: string;
    role: string;
    isVerified: boolean;
    avatarUrl?: string;
  };
  onAvatarClick: () => void;
  onNotificationClick?: () => void;
}

export default function DashboardHeader({ user, onAvatarClick, onNotificationClick }: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b border-[#7f13ec]/10">
      <div className="flex items-center gap-3">
        <div className="relative cursor-pointer" onClick={onAvatarClick}>
          {user.avatarUrl ? (
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-12 h-12 border-2 border-[#7f13ec]/20" 
              style={{ backgroundImage: `url(${user.avatarUrl})` }}
            ></div>
          ) : (
            <div className="bg-[#7f13ec]/10 aspect-square rounded-full w-12 h-12 border-2 border-[#7f13ec]/20 flex items-center justify-center overflow-hidden">
               <User className="text-[#7f13ec] w-6 h-6" />
            </div>
          )}
          {/* Online/Verified indicator matching the green dot in template */}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        
        <div>
          <h1 className="text-slate-900 text-lg font-bold leading-tight">{user.fullName || 'Tenant Name'}</h1>
          <p className="text-[#7f13ec] text-xs font-semibold uppercase tracking-wider">{user.role || 'Tenant'}</p>
        </div>
      </div>
      
      <button 
        onClick={onNotificationClick}
        className="relative p-2 text-slate-600 hover:bg-[#7f13ec]/5 rounded-full transition-colors"
      >
        <Bell className="w-6 h-6" />
        {/* Unread indicator */}
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
      </button>
    </header>
  );
}
