import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, Phone, ArrowRight, ShieldCheck, UserCircle, CheckCircle2 } from 'lucide-react';

export default function AgentSignup() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleVerifyContact = () => {
    if (!phone) return alert('Enter phone number first');
    setOtpSent(true);
    alert('Mock OTP "1234" sent to ' + phone);
  };

  const handleValidateOtp = () => {
    if (otpCode === '1234') {
      setIsVerified(true);
    } else {
      alert("Invalid OTP code. Please try '1234'.");
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) return; // double check

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Register user locally 
    login({
      id: 'mock-agent-' + Date.now(),
      email: email || `${phone}@welile.com`,
      firstName: fullName.split(' ')[0] || 'Agent',
      lastName: fullName.split(' ')[1] || '',
      role: 'AGENT', 
    });
    
    // Strict navigation to Agent Agreement
    navigate('/agent-agreement');
  };

  return (
    <div className="min-h-screen bg-[#4A3AFF] sm:p-4 flex justify-center items-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none flex justify-center items-center">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="w-[150vw] h-[150vh]">
           <path d="M0,500 Q250,300 500,500 T1000,500" stroke="white" strokeWidth="2" fill="none"/>
           <path d="M0,700 Q250,500 500,700 T1000,700" stroke="white" strokeWidth="2" fill="none"/>
        </svg>
      </div>

      <div className="w-full min-h-screen bg-[#F8F9FA] relative flex flex-col shadow-2xl overflow-hidden z-10">

        <div className="flex-1 flex flex-col pt-16 px-8 relative z-10 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          <div className="text-center mb-8 shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-[#4A3AFF] to-[#2B1B99] rounded-[1.2rem] mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <UserCircle className="text-white" size={30} strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Agent Sign Up</h1>
            <p className="text-gray-500 font-medium text-sm">Join the Welile Agent Network.</p>
          </div>

          <form onSubmit={handleSignup} className="flex flex-col gap-4 pb-8 shrink-0">
            <div className="relative">
              <input 
                type="text" 
                required
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#EFF4FA] border border-[#DEE7F5] rounded-2xl py-3.5 px-4 text-gray-800 font-semibold text-sm focus:outline-none focus:border-[#4A3AFF] focus:ring-4 focus:ring-blue-500/10 transition"
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={18} strokeWidth={1.5} />
              </div>
              <input 
                type="email" 
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-10 pr-4 text-gray-800 font-medium text-sm focus:outline-none focus:border-[#4A3AFF] focus:ring-4 focus:ring-blue-500/10 transition"
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Phone size={18} strokeWidth={1.5} />
              </div>
              <input 
                type="tel" 
                required
                placeholder="Contact Number"
                value={phone}
                readOnly={isVerified}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-10 pr-4 text-gray-800 font-medium text-sm focus:outline-none focus:border-[#4A3AFF] focus:ring-4 focus:ring-blue-500/10 transition ${isVerified ? 'bg-gray-50 text-gray-500' : ''}`}
              />
            </div>

            {/* Strict OTP Verification Logic */}
            {!isVerified ? (
              !otpSent ? (
                <button 
                  type="button" 
                  onClick={handleVerifyContact}
                  className="w-full bg-blue-50 text-[#4A3AFF] border border-blue-100 py-3 rounded-xl font-bold text-sm transition"
                >
                  Verify Contact
                </button>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500">
                        <ShieldCheck size={18} strokeWidth={1.5} />
                    </div>
                    <input 
                        type="text" 
                        required
                        placeholder="Enter OTP"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full bg-emerald-50 border border-emerald-200 rounded-xl py-3 pl-9 pr-3 text-gray-800 font-medium text-sm focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={handleValidateOtp}
                    className="bg-emerald-500 text-white px-4 rounded-xl font-bold text-sm hover:bg-emerald-600 transition"
                  >
                    Validate
                  </button>
                </div>
              )
            ) : (
               <div className="flex items-center justify-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 font-medium text-sm">
                 <CheckCircle2 size={18} /> Contact Verified
               </div>
            )}

            <div className="relative mt-2">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={18} strokeWidth={1.5} />
              </div>
              <input 
                type="password" 
                required
                placeholder="Secure Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-10 pr-4 text-gray-800 font-medium text-sm focus:outline-none focus:border-[#4A3AFF] focus:ring-4 focus:ring-blue-500/10 transition"
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={18} strokeWidth={1.5} />
              </div>
              <input 
                type="password" 
                required
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-10 pr-4 text-gray-800 font-medium text-sm focus:outline-none focus:border-[#4A3AFF] focus:ring-4 focus:ring-blue-500/10 transition"
              />
            </div>

            <button 
              type="submit" 
              disabled={!isVerified}
              className={`w-full py-4 rounded-2xl font-bold text-[15px] shadow-lg flex items-center justify-center gap-2 transition active:scale-[0.98] mt-2 ${
                isVerified 
                  ? 'bg-[#4A3AFF] hover:bg-[#3427AC] text-white shadow-blue-500/25' 
                  : 'bg-gray-200 text-gray-400 shadow-none cursor-not-allowed'
              }`}
            >
              Continue <ArrowRight size={18} />
            </button>
            
            <p className="text-center text-gray-500 font-medium mt-4 text-[13px]">
              Already an agent? <button type="button" onClick={() => navigate('/login')} className="text-[#4A3AFF] font-bold transition">Sign In</button>
            </p>
          </form>

        </div>
      </div>
    </div>
  );
}
