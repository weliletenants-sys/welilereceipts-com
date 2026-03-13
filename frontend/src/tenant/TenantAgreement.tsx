import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';

export default function TenantAgreement() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  const handleContinue = () => {
    if (!agreed) {
      alert("You must agree to the terms to continue.");
      return;
    }
    // Proceed to multi-step application form
    navigate('/tenant-onboarding');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] sm:p-4 flex justify-center items-center relative overflow-hidden">
      <div className="w-full min-h-screen bg-white relative flex flex-col shadow-2xl overflow-hidden z-10">

        <div className="flex-1 flex flex-col pt-16 px-6 pb-8 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <FileText className="text-purple-600" size={24} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Tenant Agreement</h1>
          </div>

          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl p-4 overflow-y-auto w-full text-sm text-gray-700 leading-relaxed space-y-4 shadow-inner mb-6">
            <h2 className="font-bold text-gray-900">1. Financing Terms</h2>
            <p>
              By proceeding, you acknowledge that Welile is financing your rent on a short-term basis. You agree to repay the advanced rent plus a marketplace access fee.
            </p>
            <h2 className="font-bold text-gray-900">2. Daily Repayment</h2>
            <p>
              Repayments are deducted daily starting the day after rent is disbursed. Failure to maintain sufficient wallet balance will trigger fallback deductions to your linked Agent.
            </p>
            <h2 className="font-bold text-gray-900">3. Privacy Policy</h2>
            <p>
              We collect identity information strictly for risk assessment and fraud prevention. We do not sell your data to third parties.
            </p>
            <p>
              Please read our full Terms of Service at welile.com/terms for complete details.
            </p>
          </div>

          <div className="mt-auto">
            <label className="flex items-start gap-3 mb-6 cursor-pointer group">
              <div className="relative flex items-center justify-center mt-0.5">
                <input 
                  type="radio" 
                  checked={agreed} 
                  onChange={() => setAgreed(!agreed)}
                  className="w-5 h-5 text-purple-600 border-gray-300 focus:ring-purple-500 rounded-full cursor-pointer accent-[#512DA8]" 
                />
              </div>
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition">
                I have read and agree to the Tenant Financing Terms and Privacy Policy.
              </span>
            </label>

            <button 
              onClick={handleContinue}
              disabled={!agreed}
              className={`w-full py-4 rounded-[1.2rem] font-bold text-[16px] shadow-lg flex items-center justify-center gap-2 transition ${agreed ? 'bg-[#512DA8] hover:bg-[#412387] text-white active:scale-[0.98]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              Continue to Application <ArrowRight size={20} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
