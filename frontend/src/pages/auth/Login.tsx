import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, Phone, ArrowRight } from 'lucide-react';

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, intendedRole } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!phoneNumber || !password) {
      setError("Please enter your phone number and password.");
      return;
    }
    
    // Mock login action
    login({
      id: 'mock-uuid',
      email: phoneNumber + '@welile.com', // Mocked linking until actual Auth is wired
      firstName: 'Paul',
      lastName: 'Ndlovu',
      role: intendedRole, // Assign the role they clicked back at step 1
      isVerified: false,  // Force onboarding for demo
    });
    
    // Send directly to the Dashboard
    navigate('/dashboard');
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

      <div className="w-full min-h-screen bg-[#F8F9FA] relative flex flex-col overflow-hidden z-10">

        <div className="flex-1 flex flex-col justify-center px-8 relative z-10">
          
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-[#915BFE] to-[#713BF0] rounded-[1.5rem] mx-auto mb-6 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Lock className="text-white" size={36} strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Welcome Back</h1>
            <p className="text-gray-500 font-medium">Log in to access Welile.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Phone size={18} strokeWidth={1.5} />
              </div>
              <input 
                type="tel" 
                placeholder="0704825473"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-[#EFF4FA] border border-[#DEE7F5] rounded-2xl py-3.5 pl-10 pr-4 text-gray-800 font-semibold focus:outline-none focus:border-[#51319E] focus:ring-4 focus:ring-purple-500/10 transition"
              />
            </div>
            
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={18} strokeWidth={1.5} />
              </div>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#EFF4FA] border border-[#DEE7F5] rounded-2xl py-3.5 pl-10 pr-4 text-gray-800 font-semibold tracking-widest focus:outline-none focus:border-[#51319E] focus:ring-4 focus:ring-purple-500/10 transition"
              />
            </div>

            <div className="text-right">
              <button type="button" className="text-purple-600 font-semibold text-sm hover:text-purple-700">Forgot Password?</button>
            </div>

            {error && <p className="text-red-500 text-center font-bold text-sm bg-red-50 py-2 rounded-xl border border-red-100">{error}</p>}

            <button type="submit" className="w-full bg-[#51319E] hover:bg-[#412780] text-white py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition active:scale-[0.98] mt-2">
              Sign In <ArrowRight size={20} />
            </button>
          </form>

          <p className="text-center text-gray-500 font-medium mt-8 text-sm">
            Don't have an account? <button type="button" onClick={() => navigate('/signup')} className="text-purple-600 font-bold hover:text-purple-700">Sign Up</button>
          </p>
        </div>
      </div>
    </div>
  );
}
