import { Home, Banknote, History, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function TenantBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/dashboard' },
    { id: 'payments', label: 'Payments', icon: Banknote, path: '/dashboard/payments' },
    { id: 'history', label: 'History', icon: History, path: '/dashboard/history' },
    { id: 'profile', label: 'Profile', icon: User, path: '/dashboard/profile' },
  ];

  return (
    <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 flex justify-between items-center px-6 py-3 pb-8 z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/dashboard/');
        const Icon = item.icon;
        
        return (
          <button 
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center gap-1 w-16 relative ${isActive ? 'text-[#8b31ff]' : 'text-gray-400'}`}
          >
            {/* Active Dot */}
            {isActive && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#8b31ff] rounded-full" />
            )}
            
            <Icon 
              size={24} 
              strokeWidth={isActive ? 2.5 : 2} 
            />
            
            <span className={`text-[10px] tracking-wide ${isActive ? 'font-bold uppercase' : 'font-medium'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
