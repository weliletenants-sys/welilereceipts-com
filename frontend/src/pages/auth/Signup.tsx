import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, Mail, User, Phone, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rentAmount, setRentAmount] = useState('');  
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  
  const { login, intendedRole } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = () => {
    if (!phone) return alert('Enter phone number first');
    setOtpSent(true);
    alert('Mock OTP sent to ' + phone);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName || !lastName || !phone || !password || !confirmPassword) {
      setError("Please fill out all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (!otpSent || !otpCode) {
      setError("Please verify your phone number first!");
      return;
    }

    login({
      id: 'mock-uuid-' + Date.now(),
      email: email || 'user@welile.com',
      firstName: firstName || 'New',
      lastName: lastName || 'User',
      role: intendedRole, 
    });
    
    // According to onboarding flow, tenants go to Agreement next
    if (intendedRole === 'TENANT') {
      navigate('/tenant-agreement');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#8155FF] sm:p-4 flex justify-center items-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none flex justify-center items-center">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="w-[150vw] h-[150vh]">
           <path d="M0,500 Q250,300 500,500 T1000,500" stroke="white" strokeWidth="2" fill="none"/>
           <path d="M0,700 Q250,500 500,700 T1000,700" stroke="white" strokeWidth="2" fill="none"/>
        </svg>
      </div>

      <div className="w-full min-h-screen bg-[#F8F9FA] relative flex flex-col overflow-hidden z-10">

        <div className="flex-1 flex flex-col pt-16 px-8 relative z-10 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          <div className="text-center mb-8 shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-[#915BFE] to-[#713BF0] rounded-[1.2rem] mx-auto mb-4 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <User className="text-white" size={30} strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Create Account</h1>
            <p className="text-gray-500 font-medium text-sm">Join Welile and transform your rent.</p>
          </div>

          <form onSubmit={handleSignup} className="flex flex-col gap-4 pb-8 shrink-0">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-[#EFF4FA] border border-[#DEE7F5] rounded-2xl py-3.5 px-4 text-gray-800 font-semibold text-sm focus:outline-none focus:border-[#51319E] focus:ring-4 focus:ring-purple-500/10 transition"
                />
              </div>
              
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-[#EFF4FA] border border-[#DEE7F5] rounded-2xl py-3.5 px-4 text-gray-800 font-semibold text-sm focus:outline-none focus:border-[#51319E] focus:ring-4 focus:ring-purple-500/10 transition"
                />
              </div>
            </div>

            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Phone size={18} strokeWidth={1.5} />
                </div>
                <input 
                  type="tel" 
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-10 pr-4 text-gray-800 font-medium text-sm focus:outline-none focus:border-[#51319E] focus:ring-4 focus:ring-purple-500/10 transition"
                />
              </div>
            </div>

            {/* OTP Verification Section */}
            {!otpSent ? (
              <button 
                type="button" 
                onClick={handleSendOtp}
                className="w-full bg-purple-100 text-purple-700 py-3 rounded-xl font-bold text-sm hover:bg-purple-200 transition"
              >
                Send OTP
              </button>
            ) : (
               <div className="relative">
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500">
                    <ShieldCheck size={18} strokeWidth={1.5} />
                 </div>
                 <input 
                    type="text" 
                    placeholder="Enter 4-digit OTP"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl py-3.5 pl-10 pr-4 text-gray-800 font-medium text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                 />
               </div>
            )}

            {intendedRole === 'TENANT' && (
              <div className="relative mt-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                  UGX
                </div>
                <input 
                  type="number" 
                  placeholder="How much rent do you want?"
                  value={rentAmount}
                  onChange={(e) => setRentAmount(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 text-gray-800 font-medium text-sm focus:outline-none focus:border-[#51319E] focus:ring-4 focus:ring-purple-500/10 transition"
                />
              </div>
            )}

            <div className="relative mt-2">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={18} strokeWidth={1.5} />
              </div>
              <input 
                type="email" 
                placeholder="Email Address (Optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-10 pr-4 text-gray-800 font-medium text-sm focus:outline-none focus:border-[#51319E] focus:ring-4 focus:ring-purple-500/10 transition"
              />
            </div>
            
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={18} strokeWidth={1.5} />
              </div>
              <input 
                type="password" 
                placeholder="Secure Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-10 pr-4 text-gray-800 font-medium text-sm focus:outline-none focus:border-[#51319E] focus:ring-4 focus:ring-purple-500/10 transition"
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={18} strokeWidth={1.5} />
              </div>
              <input 
                type="password" 
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-10 pr-4 text-gray-800 font-medium text-sm focus:outline-none focus:border-[#51319E] focus:ring-4 focus:ring-purple-500/10 transition"
              />
            </div>

            {error && <p className="text-red-500 text-center font-bold text-sm bg-red-50 py-2 rounded-xl border border-red-100">{error}</p>}
            
            <button type="submit" className="w-full bg-[#51319E] hover:bg-[#412780] text-white py-4 rounded-2xl font-bold text-[15px] shadow-lg flex items-center justify-center gap-2 transition active:scale-[0.98] mt-2">
              Continue <ArrowRight size={18} />
            </button>
            
            <p className="text-center text-gray-500 font-medium mt-4 text-[13px]">
              Already have an account? <button type="button" onClick={() => navigate('/login')} className="text-[#51319E] font-bold hover:text-purple-800 transition">Sign In</button>
            </p>
          </form>

        </div>
      </div>
    </div>
  );
}
