import { Bell, User } from 'lucide-react';

interface FunderDashboardHeaderProps {
  user: {
    fullName: string;
    role: string;
    avatarUrl?: string;
  };
  onNotificationClick?: () => void;
  onAvatarClick?: () => void;
}

export default function FunderDashboardHeader({ user, onNotificationClick, onAvatarClick }: FunderDashboardHeaderProps) {
  return (
    <div className="flex items-center bg-white p-4 pb-2 justify-between border-b border-gray-100">
      <div className="flex w-12 shrink-0 items-center cursor-pointer" onClick={onAvatarClick}>
        {user.avatarUrl ? (
          <div 
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10 border-2 border-[#7f13ec]/20" 
            style={{ backgroundImage: `url(${user.avatarUrl})` }}
          ></div>
        ) : (
          <div className="bg-[#7f13ec]/10 aspect-square rounded-full w-10 h-10 border-2 border-[#7f13ec]/20 flex items-center justify-center overflow-hidden">
             <User className="text-[#7f13ec] w-5 h-5" />
          </div>
        )}
      </div>
      <div className="flex-1 px-3">
        <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-tight">{user.fullName}</h2>
        <p className="text-[#7f13ec] text-xs font-bold leading-none tracking-wider uppercase">{user.role}</p>
      </div>
      <div className="flex w-12 items-center justify-end">
        <button 
          onClick={onNotificationClick}
          className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-50 text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Bell className="w-6 h-6" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
