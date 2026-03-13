import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Check, ArrowRight, ArrowLeft, Upload, Camera, ShieldCheck, AlertCircle } from 'lucide-react';

export default function FunderOnboarding() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    idFront: null as File | null,
    idBack: null as File | null,
    selfie: null as File | null,
    understoodRole: false,
    agreedToTerms: false,
    acknowledgedNotice: false,
  });

  const handleNext = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, [fieldName]: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreedToTerms || !formData.acknowledgedNotice || !formData.understoodRole) {
      alert("You must agree to all terms to proceed.");
      return;
    }
    
    if (user) {
      // Complete onboarding and verify user locally
      login({ ...user, isVerified: true });
    }
    navigate('/dashboard');
  };

  // Check if current step's requirements are met
  const isStepValid = () => {
    if (step === 1) return formData.understoodRole;
    if (step === 2) return formData.idFront && formData.idBack && formData.selfie;
    if (step === 3) return formData.agreedToTerms && formData.acknowledgedNotice;
    return true;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex justify-center items-center relative">
      <div className="w-full min-h-screen bg-white relative flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="pt-14 px-6 pb-4 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
          <button 
            onClick={step === 1 ? () => navigate('/login') : handleBack} 
            className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-100 transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col items-center">
            <h1 className="font-bold text-gray-900">Partner Setup</h1>
            <p className="text-xs text-gray-500 font-medium">Step {step} of {totalSteps}</p>
          </div>
          <div className="w-10"></div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-1 shrink-0">
          <div 
            className="bg-[#512DA8] h-1 transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6 h-full">
            
            {/* STEP 1: Role Education */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-[#512DA8] mb-2 mx-auto">
                  <ShieldCheck size={32} strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-black text-center text-gray-900 tracking-tight">How It Works</h2>
                <p className="text-gray-500 text-center text-sm leading-relaxed mb-6">
                  As a Welile Partner (Supporter), you are providing capital to our central Rent Management Pool to facilitate housing.
                </p>

                <div className="space-y-4">
                  <div className="bg-white border border-gray-100 shadow-sm p-4 rounded-2xl flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <span className="font-black text-lg">1</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Contribute Capital</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">Your funds are pooled to pay landlords upfront on behalf of verified tenants.</p>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 shadow-sm p-4 rounded-2xl flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <span className="font-black text-lg">2</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Earn 15% Monthly</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">Earn consistent, compounding returns on your active investments.</p>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 shadow-sm p-4 rounded-2xl flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <span className="font-black text-lg">3</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">We Manage Risk</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">Welile handles tenant collection, property verification, and guarantees.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 flex gap-3 mt-6">
                  <input 
                    type="checkbox" 
                    name="understoodRole"
                    id="understoodRole"
                    checked={formData.understoodRole}
                    onChange={handleChange}
                    className="mt-1 w-5 h-5 text-[#512DA8] border-gray-300 rounded focus:ring-[#512DA8]"
                  />
                  <label htmlFor="understoodRole" className="text-[13px] text-gray-700 font-medium cursor-pointer leading-tight">
                    I understand that I am a capital facilitator, not a direct lender to tenants.
                  </label>
                </div>
              </div>
            )}

            {/* STEP 2: Identity Verification */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="font-bold text-gray-900 text-lg">Identity Verification</h3>
                <p className="text-sm text-gray-500 mb-4">Please upload clear photos of your National ID and a selfie to secure your account.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">National ID (Front)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 flex flex-col items-center justify-center bg-gray-50 hover:bg-purple-50 hover:border-purple-300 transition cursor-pointer relative overflow-hidden">
                      <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'idFront')} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                      {formData.idFront ? <div className="flex items-center gap-2 text-[#512DA8] font-bold"><Check size={20}/> Uploaded</div> : <><Upload className="text-gray-400 mb-2" size={24} /><p className="text-sm text-gray-500 font-medium">Take photo or upload PDF</p></>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">National ID (Back)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 flex flex-col items-center justify-center bg-gray-50 hover:bg-purple-50 hover:border-purple-300 transition cursor-pointer relative overflow-hidden">
                      <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'idBack')} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                      {formData.idBack ? <div className="flex items-center gap-2 text-[#512DA8] font-bold"><Check size={20}/> Uploaded</div> : <><Upload className="text-gray-400 mb-2" size={24} /><p className="text-sm text-gray-500 font-medium">Take photo or upload PDF</p></>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Selfie Photo</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 flex flex-col items-center justify-center bg-gray-50 hover:bg-purple-50 hover:border-purple-300 transition cursor-pointer relative overflow-hidden">
                      <input type="file" accept="image/*" capture="user" onChange={(e) => handleFileChange(e, 'selfie')} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                      {formData.selfie ? <div className="flex items-center gap-2 text-[#512DA8] font-bold"><Check size={20}/> Uploaded</div> : <><Camera className="text-gray-400 mb-2" size={24} /><p className="text-sm text-gray-500 font-medium">Take a live selfie</p></>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Agreement & 90-Day Notice */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col h-full">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Partner Agreements</h3>
                  <p className="text-sm text-gray-500 mb-6">Review the terms of engagement regarding capital deployment and pool liquidity.</p>
                  
                  <div className="bg-orange-50 border border-orange-200 p-5 rounded-2xl mb-6 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 text-orange-200/50">
                      <AlertCircle size={80} />
                    </div>
                    <h4 className="font-black text-orange-900 mb-2 relative z-10">90-Day Withdrawal Notice</h4>
                    <p className="text-xs text-orange-800 leading-relaxed relative z-10 mb-4 font-medium">
                      To protect the Rent Management Pool from sudden liquidity shocks, all capital withdrawals require a strict 90-day notice period.
                    </p>
                    <p className="text-xs text-orange-800 leading-relaxed relative z-10 font-bold">
                      During this 90-day notice period, your portfolio will NOT earn the monthly 15% reward.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex gap-3">
                      <input 
                        type="checkbox" 
                        name="acknowledgedNotice"
                        id="acknowledgedNotice"
                        checked={formData.acknowledgedNotice}
                        onChange={handleChange}
                        className="mt-1 w-5 h-5 text-[#512DA8] border-gray-300 rounded focus:ring-[#512DA8]"
                      />
                      <label htmlFor="acknowledgedNotice" className="text-[13px] text-gray-700 font-medium cursor-pointer leading-tight">
                        I acknowledge the 90-day notice period for capital withdrawal and the pausing of rewards during this period.
                      </label>
                    </div>

                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 flex gap-3">
                      <input 
                        type="checkbox" 
                        name="agreedToTerms"
                        id="agreedToTerms"
                        checked={formData.agreedToTerms}
                        onChange={handleChange}
                        className="mt-1 w-5 h-5 text-[#512DA8] border-gray-300 rounded focus:ring-[#512DA8]"
                      />
                      <label htmlFor="agreedToTerms" className="text-[13px] text-gray-700 font-medium cursor-pointer leading-tight">
                        I consent to the Welile Partner Agreement and Terms of Service.
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white border-t border-gray-100 shrink-0">
          {step < totalSteps ? (
           <button 
             onClick={handleNext} 
             disabled={!isStepValid()}
             className={`w-full py-4 rounded-2xl font-bold text-[16px] shadow-lg flex items-center justify-center gap-2 transition ${isStepValid() ? 'bg-[#512DA8] text-white hover:bg-[#412387] active:scale-[0.98]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
           >
             Next Step <ArrowRight size={20} strokeWidth={2} />
           </button>
          ) : (
            <button 
              onClick={handleSubmit} 
              disabled={!isStepValid()}
              className={`w-full py-4 rounded-2xl font-bold text-[16px] shadow-lg flex items-center justify-center gap-2 transition ${isStepValid() ? 'bg-[#10B981] hover:bg-[#059669] text-white active:scale-[0.98]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              Complete Setup <Check size={20} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
