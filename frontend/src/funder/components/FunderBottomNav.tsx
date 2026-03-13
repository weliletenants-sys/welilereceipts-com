import { Home, PieChart, Wallet, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function FunderBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Home', icon: Home, path: '/dashboard/funder' },
    { label: 'Portfolio', icon: PieChart, path: '/funder/portfolio' },
    { label: 'Wallet', icon: Wallet, path: '/funder/wallet' },
    { label: 'Profile', icon: User, path: '/settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50">
      <div className="flex gap-2 border-t border-slate-100 bg-white/90 backdrop-blur-md px-4 pb-6 pt-3 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button 
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors \${isActive ? 'text-[#7f13ec]' : 'text-slate-400 hover:text-slate-500'}`}
            >
              <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              <p className={`text-xs \${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
