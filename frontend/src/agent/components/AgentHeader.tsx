import { Bell } from 'lucide-react';

interface AgentHeaderProps {
  user: {
    fullName: string;
    role: string;
    avatarUrl?: string;
  };
  onAvatarClick: () => void;
  onNotificationClick: () => void;
}

export default function AgentHeader({ user, onAvatarClick, onNotificationClick }: AgentHeaderProps) {
  // Extract initials if no avatar is provided
  const userInitials = user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';

  return (
    <header className="bg-white border-b border-[#7f13ec]/10 px-4 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <button 
          onClick={onAvatarClick}
          className="w-10 h-10 rounded-full bg-[#7f13ec]/10 flex items-center justify-center overflow-hidden border-2 border-[#7f13ec]/20 text-[#7f13ec] font-bold text-sm transition active:scale-95"
        >
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
          ) : (
             <span>{userInitials}</span>
          )}
        </button>
        <div className="flex flex-col">
          <h1 className="text-base font-bold leading-tight text-gray-900">{user.fullName}</h1>
          <p className="text-[10px] font-bold tracking-widest text-[#7f13ec] uppercase">
            {user.role}
          </p>
        </div>
      </div>
      
      <button 
        onClick={onNotificationClick}
        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#7f13ec]/10 text-gray-600 transition active:scale-95 relative"
      >
        <Bell size={20} strokeWidth={2} />
        {/* Mock Notification Dot */}
        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
      </button>
    </header>
  );
}
