import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { Role } from '../../contexts/AuthContext';
import { Home, Briefcase, Key, Layers, ArrowRight } from 'lucide-react';

export default function RoleSelection() {
  const { setIntendedRole } = useAuth();
  const navigate = useNavigate();

  const handleSelectRole = (role: Role) => {
    // 1. Save the intended role selection
    if (role) {
      setIntendedRole(role);
    }
    if (role === 'AGENT') {
      navigate('/agent-welcome');
    } else if (role === 'TENANT') {
      navigate('/welcome');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-[#8155FF] sm:p-4 flex justify-center items-center relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none flex justify-center items-center">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="w-[150vw] h-[150vh]">
           <path d="M0,500 Q250,300 500,500 T1000,500" stroke="white" strokeWidth="2" fill="none"/>
           <path d="M0,700 Q250,500 500,700 T1000,700" stroke="white" strokeWidth="2" fill="none"/>
        </svg>
      </div>

      <div className="w-full min-h-screen bg-[#F8F9FA] relative flex flex-col shadow-2xl overflow-hidden z-10">

        <div className="py-12 px-6 flex flex-col h-full bg-gradient-to-b from-[#E9DDFD] to-[#F8F9FA]">
          <div className="mt-8 mb-10 text-center">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">Choose Your Path</h1>
            <p className="text-gray-600 font-medium">Select how you want to use Welile today.</p>
          </div>

          <div className="flex flex-col gap-4">
            
            <button 
              onClick={() => handleSelectRole('TENANT')}
              className="bg-white p-5 rounded-[1.5rem] shadow-[0_4px_15px_-5px_rgba(0,0,0,0.05)] border border-white hover:border-purple-300 hover:shadow-purple-200 transition group flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition">
                  <Home size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Tenant</h3>
                  <p className="text-gray-500 text-sm font-medium">Access rent credit and housing</p>
                </div>
              </div>
              <ArrowRight className="text-gray-300 group-hover:text-purple-600 transition" />
            </button>

            <button 
              onClick={() => handleSelectRole('AGENT')}
              className="bg-white p-5 rounded-[1.5rem] shadow-[0_4px_15px_-5px_rgba(0,0,0,0.05)] border border-white hover:border-purple-300 hover:shadow-purple-200 transition group flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                  <Briefcase size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Agent</h3>
                  <p className="text-gray-500 text-sm font-medium">Manage collections and tenants</p>
                </div>
              </div>
              <ArrowRight className="text-gray-300 group-hover:text-blue-600 transition" />
            </button>

            <button 
              onClick={() => handleSelectRole('LANDLORD')}
              className="bg-white p-5 rounded-[1.5rem] shadow-[0_4px_15px_-5px_rgba(0,0,0,0.05)] border border-white hover:border-purple-300 hover:shadow-purple-200 transition group flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition">
                  <Key size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Landlord</h3>
                  <p className="text-gray-500 text-sm font-medium">Monitor properties & payouts</p>
                </div>
              </div>
              <ArrowRight className="text-gray-300 group-hover:text-orange-600 transition" />
            </button>

            <button 
              onClick={() => handleSelectRole('FUNDER')}
              className="bg-white p-5 rounded-[1.5rem] shadow-[0_4px_15px_-5px_rgba(0,0,0,0.05)] border border-white hover:border-purple-300 hover:shadow-purple-200 transition group flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
                  <Layers size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Supporter</h3>
                  <p className="text-gray-500 text-sm font-medium">Fund rent pools for ROI</p>
                </div>
              </div>
              <ArrowRight className="text-gray-300 group-hover:text-emerald-600 transition" />
            </button>

          </div>
          
          <div className="mt-8 text-center text-gray-500 font-medium text-[14px]">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/login')} 
              className="text-[#51319E] font-bold hover:text-purple-800 transition"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
