import { useNavigate } from 'react-router-dom';
import { Clock, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AgentKYCReview() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F9FA] sm:p-4 flex justify-center items-center relative overflow-hidden">
      <div className="w-full min-h-screen bg-white relative flex flex-col shadow-2xl overflow-hidden z-10">

        <div className="flex-1 flex flex-col pt-24 px-6 pb-8 relative z-10 text-center">
          
          <div className="relative mx-auto mb-8">
            <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center animate-pulse absolute inset-0 scale-125" />
            <div className="w-24 h-24 bg-amber-100/80 rounded-full flex items-center justify-center relative z-10 shadow-inner">
              <Clock className="text-amber-500" size={48} strokeWidth={1.5} />
            </div>
            
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 z-20 shadow-sm border border-gray-100">
               <ShieldAlert className="text-amber-500" size={20} />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-3">
            Under Review
          </h1>
          
          <p className="text-gray-500 leading-relaxed mb-8">
            Your KYC verification is currently being reviewed by our compliance team. Expected review time is <span className="font-bold text-gray-700">24-48 hours</span>.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-left space-y-4 mb-auto">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">What happens next?</h3>
            <div className="flex gap-3">
              <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
              <p className="text-sm text-gray-700 font-medium">We verify your National ID and Selfie against the databases.</p>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
              <p className="text-sm text-gray-700 font-medium">Your designated operation areas and guarantor details are verified.</p>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="text-gray-300 shrink-0" size={20} />
              <p className="text-sm text-gray-700 font-medium">Once approved, your withdrawal locks are removed.</p>
            </div>
          </div>

          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full bg-[#4A3AFF] hover:bg-[#3427AC] text-white py-4 rounded-2xl font-bold text-[16px] shadow-[0_8px_20px_-6px_rgba(74,58,255,0.4)] flex items-center justify-center gap-2 transition active:scale-[0.98] mt-6"
          >
            Return to Dashboard <ArrowRight size={20} />
          </button>

        </div>
      </div>
    </div>
  );
}
