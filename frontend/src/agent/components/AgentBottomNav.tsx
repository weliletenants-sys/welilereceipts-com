import { Home, Users, Search, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AgentBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: <Home size={24} />, label: 'Home', path: '/dashboard' },
    { icon: <Users size={24} />, label: 'Clients', path: '/clients' },
    { icon: <Search size={24} />, label: 'Tracking', path: '/tracking' },
    { icon: <Settings size={24} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#7f13ec]/10 px-4 pb-6 pt-2 flex justify-between items-center z-40">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex flex-1 flex-col items-center gap-1 transition-colors ${
              isActive ? 'text-[#7f13ec]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className={`${isActive ? 'fill-current stroke-2' : 'stroke-2'}`}>
              {item.icon}
            </div>
            <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
