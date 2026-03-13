import { Home, Banknote, History, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function TenantBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Home', icon: Home, path: '/dashboard/tenant' },
    { label: 'Payments', icon: Banknote, path: '/tenant/payments' },
    { label: 'History', icon: History, path: '/tenant/history' },
    { label: 'Profile', icon: User, path: '/settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="flex gap-2 border-t border-slate-100 bg-white/90 backdrop-blur-md px-4 pb-6 pt-3 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <button 
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 transition-colors \${isActive ? 'text-[#7f13ec]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-[10px] \${isActive ? 'font-bold' : 'font-medium'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
      </div>
    </div>
  );
}
