import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Home, Users } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#8155FF] sm:p-4 flex justify-center items-center relative overflow-hidden">
      {/* Decorative Wavy Background Lines */}
      <div className="absolute inset-0 opacity-20 pointer-events-none flex justify-center items-center">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="w-[150vw] h-[150vh]">
           <path d="M0,500 Q250,300 500,500 T1000,500" stroke="white" strokeWidth="2" fill="none"/>
           <path d="M0,700 Q250,500 500,700 T1000,700" stroke="white" strokeWidth="2" fill="none"/>
           <path d="M0,300 Q250,100 500,300 T1000,300" stroke="white" strokeWidth="2" fill="none"/>
        </svg>
      </div>

      <div className="w-full min-h-screen bg-gradient-to-b from-[#673AB7] to-[#512DA8] relative flex flex-col overflow-hidden z-10">

        <div className="flex-1 overflow-y-auto px-6 pt-20 pb-12 relative z-10 flex flex-col justify-between scrollbar-hide">
          
          <div>
            <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-[1.2rem] flex items-center justify-center mb-6 border border-white/20 shadow-xl">
              <ShieldCheck className="text-white" size={32} strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4 leading-[1.1]">
              Welile <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D8B4FE] to-[#FCA5A5]">
                Technologies.
              </span>
            </h1>
            <p className="text-purple-100/90 text-[15px] font-medium leading-relaxed mb-6">
              Our mission: Rent guarantee, rent facilitation, and financial inclusion across Africa.
            </p>
          </div>

          <div className="space-y-4 my-6">
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/20">
              <Users className="text-[#D8B4FE]" size={28} />
              <div>
                <p className="text-white font-bold text-lg">25M+ Tenants</p>
                <p className="text-purple-200 text-sm">Active pool</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/20">
              <Home className="text-[#FCA5A5]" size={28} />
              <div>
                <p className="text-white font-bold text-lg">50,000+ Landlords</p>
                <p className="text-purple-200 text-sm">Partnered properties</p>
              </div>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 italic text-purple-100/80 text-sm">
              "Welile changed how we secure housing. The daily repayment is so simple!" - Mary K.
            </div>
          </div>

          <div className="mt-auto">
            <button 
              onClick={() => navigate('/role-selection')}
              className="w-full bg-white text-[#512DA8] py-4 rounded-[1.2rem] font-bold text-[16px] shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] flex items-center justify-center gap-2 transition active:scale-[0.98] hover:bg-white/90"
            >
              Get Started <ArrowRight size={20} strokeWidth={2} />
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
