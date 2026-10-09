import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Phone, Mail, Lock, Eye, EyeOff, ArrowRight, User, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import OtpVerificationDeck from '../../components/OtpVerificationDeck';
import PurpleBubbles from '../../components/PurpleBubbles';

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [rentAmount, setRentAmount] = useState('');  
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  
  const { login, intendedRole } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get('ref');

  const handleSendOtp = () => {
    if (!phone) return toast.error('Enter phone number first');
    setOtpSent(true);
    toast('Mock OTP sent to ' + phone);
  };

  // Mock validation until the SMS OTP API is wired up: any 4-digit code passes.
  const handleValidateOtp = async (code: string) => {
    await new Promise((r) => setTimeout(r, 800));
    return /^\d{4}$/.test(code);
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
    if (!isVerified) {
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
    <div className="bg-[#fdfcff] min-h-screen flex flex-col antialiased text-slate-900 relative z-0">
      <style>{`
        .bg-mesh {
            background-color: #fdfcff;
            background-image: 
                radial-gradient(at 0% 0%, rgba(109, 40, 217, 0.05) 0px, transparent 50%),
                radial-gradient(at 100% 100%, rgba(109, 40, 217, 0.08) 0px, transparent 50%),
                radial-gradient(at 50% 50%, rgba(236, 91, 19, 0.02) 0px, transparent 50%);
        }
      `}</style>
      
      {/* Background Mesh */}
      <div className="absolute inset-0 bg-mesh pointer-events-none z-0"></div>

      {/* Animated Purple Bubbles */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <PurpleBubbles />
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-[#6c11d4]/5 border border-slate-100 overflow-hidden shrink-0 my-4">
          
          <div className="p-1.5 bg-slate-50 flex m-6 rounded-2xl">
            <button 
              onClick={() => navigate('/login')}
              className="flex-1 py-2.5 px-4 text-sm font-semibold rounded-xl transition-all duration-200 text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            >
                Sign In
            </button>
            <button className="flex-1 py-2.5 px-4 text-sm font-semibold rounded-xl transition-all duration-200 bg-white shadow-sm text-[#6c11d4]">
                Sign Up
            </button>
          </div>

          <div className="px-8 pb-10">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Create Account</h1>
              <p className="text-slate-500 text-sm">Join Welile and transform your rent</p>
            </div>
            
            {refCode && (
              <div className="mb-6 p-3 bg-purple-50 border border-purple-100 rounded-xl text-center">
                <p className="text-sm font-medium text-purple-700">You were invited by Agent <span className="font-bold">{refCode}</span></p>
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              
              <div className="flex gap-3">
                <div className="space-y-2 flex-1">
                  <label className="text-sm font-semibold text-slate-700 ml-1">First Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#6c11d4] transition-colors">
                      <User size={18} strokeWidth={2} />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Jane"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent focus:border-[#6c11d4]/30 focus:bg-white focus:ring-4 focus:ring-[#6c11d4]/10 rounded-xl transition-all outline-none text-slate-900 font-medium" 
                    />
                  </div>
                </div>

                <div className="space-y-2 flex-1">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Last Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#6c11d4] transition-colors">
                      <User size={18} strokeWidth={2} />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent focus:border-[#6c11d4]/30 focus:bg-white focus:ring-4 focus:ring-[#6c11d4]/10 rounded-xl transition-all outline-none text-slate-900 font-medium" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Phone Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#6c11d4] transition-colors">
                    <Phone size={18} strokeWidth={2} />
                  </div>
                  <input 
                    type="tel" 
                    placeholder="0704825473"
                    value={phone}
                    readOnly={otpSent || isVerified}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent focus:border-[#6c11d4]/30 focus:bg-white focus:ring-4 focus:ring-[#6c11d4]/10 rounded-xl transition-all outline-none text-slate-900 font-medium" 
                  />
                </div>
              </div>

              {isVerified ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 font-semibold text-sm"
                >
                  <CheckCircle2 size={18} /> Phone Verified
                </motion.div>
              ) : !otpSent ? (
                <button 
                  type="button" 
                  onClick={handleSendOtp}
                  className="w-full bg-[#f5f3ff] text-[#6c11d4] py-3 rounded-xl font-bold text-sm hover:bg-purple-100 transition"
                >
                  Send OTP Verification
                </button>
              ) : (
                <OtpVerificationDeck
                  phone={phone}
                  accent="#6c11d4"
                  onValidate={handleValidateOtp}
                  onVerified={() => setIsVerified(true)}
                  onResend={() => toast('Mock OTP re-sent to ' + phone)}
                  onChangeNumber={() => setOtpSent(false)}
                />
              )}

              {intendedRole === 'TENANT' && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Desired Rent Support</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-bold group-focus-within:text-[#6c11d4] transition-colors">
                      UGX
                    </div>
                    <input 
                      type="number" 
                      placeholder="Monthly Rent Amount"
                      value={rentAmount}
                      onChange={(e) => setRentAmount(e.target.value)}
                      className="w-full pl-14 pr-4 py-3 bg-slate-50 border-transparent focus:border-[#6c11d4]/30 focus:bg-white focus:ring-4 focus:ring-[#6c11d4]/10 rounded-xl transition-all outline-none text-slate-900 font-medium" 
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Email (Optional)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#6c11d4] transition-colors">
                    <Mail size={18} strokeWidth={2} />
                  </div>
                  <input 
                    type="email" 
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent focus:border-[#6c11d4]/30 focus:bg-white focus:ring-4 focus:ring-[#6c11d4]/10 rounded-xl transition-all outline-none text-slate-900 font-medium" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#6c11d4] transition-colors">
                    <Lock size={18} strokeWidth={2} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 bg-slate-50 border-transparent focus:border-[#6c11d4]/30 focus:bg-white focus:ring-4 focus:ring-[#6c11d4]/10 rounded-xl transition-all outline-none text-slate-900 font-medium tracking-wide" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#6c11d4] transition-colors">
                    <Lock size={18} strokeWidth={2} />
                  </div>
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 bg-slate-50 border-transparent focus:border-[#6c11d4]/30 focus:bg-white focus:ring-4 focus:ring-[#6c11d4]/10 rounded-xl transition-all outline-none text-slate-900 font-medium tracking-wide" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-500 text-center font-bold text-sm bg-red-50 py-2 rounded-xl border border-red-100">{error}</p>}

              <button 
                type="submit" 
                className="w-full bg-[#6c11d4] hover:bg-[#5b21b6] text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-[#6c11d4]/20 flex items-center justify-center gap-2 group mt-4"
              >
                <span>Complete Sign Up</span>
                <ArrowRight size={18} strokeWidth={2} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>



          </div>
        </div>
      </main>

      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-slate-400 font-medium">© 2024 Welile Technologies Limited. All rights reserved.</p>
        <div className="flex gap-6">
          <a className="text-xs text-slate-400 hover:text-[#6c11d4] transition-colors" href="#">Privacy Policy</a>
          <a className="text-xs text-slate-400 hover:text-[#6c11d4] transition-colors" href="#">Terms of Service</a>
          <a className="text-xs text-slate-400 hover:text-[#6c11d4] transition-colors" href="#">Cookies</a>
        </div>
      </footer>

      {/* Floating Colored Blurs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-[#6c11d4]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#6c11d4]/10 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
}
