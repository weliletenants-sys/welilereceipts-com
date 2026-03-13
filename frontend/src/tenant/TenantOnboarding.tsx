import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Check, ArrowRight, ArrowLeft, Upload, File, Camera } from 'lucide-react';

export default function TenantOnboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Form State
  const [formData, setFormData] = useState({
    occupation: '', workAddress: '', homeAddress: '',
    village: '', parish: '', subCounty: '', district: '',
    rentAmount: '', rentPeriod: '', rentPerMonth: '',
    landlordName: '', landlordPhone: '', landlordAddress: '', houseNumber: '',
    nextOfKinName: '', nextOfKinPhone: '', relationship: '',
    idFront: null as File | null, idBack: null as File | null, selfie: null as File | null,
    lc1Letter: null as File | null,
    consented: false
  });

  const handleNext = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const calculateFees = () => {
    const rent = parseFloat(formData.rentAmount) || 0;
    const durationMonths = parseFloat(formData.rentPeriod) || 1;
    const paybackPeriodDays = durationMonths * 30; // standard 30 days per month
    
    // Request Fee: 10k if <= 200k, else 20k
    const requestFee = rent > 200000 ? 20000 : 10000;
    
    // Access Fee (Interest): 33% monthly compounding
    // Formula: accessFee = rentAmount × ((1 + monthlyRate)^(durationDays / 30) − 1)
    const monthlyRate = 0.33;
    const accessFee = rent * (Math.pow(1 + monthlyRate, paybackPeriodDays / 30) - 1);
    
    const totalRepayment = rent + accessFee + requestFee;
    const dailyRepayment = Math.ceil(totalRepayment / paybackPeriodDays);
    
    return { 
      accessFee: Math.ceil(accessFee), 
      requestFee, 
      totalRepayment: Math.ceil(totalRepayment), 
      paybackPeriodDays, 
      dailyRepayment 
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, [fieldName]: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consented) {
      alert("You must consent to complete the application.");
      return;
    }
    // API Integration would go here using fetch on /applications/start and /applications/:id/step...
    navigate('/application-status');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] sm:p-4 flex justify-center items-center relative">
      <div className="w-full min-h-screen bg-white relative flex flex-col shadow-2xl overflow-hidden z-10">

        {/* Header */}
        <div className="pt-14 px-6 pb-4 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
          <button onClick={step === 1 ? () => navigate('/tenant-agreement') : handleBack} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-900">
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col items-center">
            <h1 className="font-bold text-gray-900">Rent Financing</h1>
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
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6">
            
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-purple-50 p-4 rounded-2xl">
                  <h3 className="text-sm font-bold text-purple-900 mb-1">Personal Info (Auto-filled)</h3>
                  <p className="text-xs text-purple-700">Name: {user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-purple-700">Phone: Verified (+256...)</p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900">Location & Work</h3>
                  <input type="text" name="occupation" placeholder="Occupation" value={formData.occupation} onChange={handleChange} className="w-full bg-[#EFF4FA] border border-[#DEE7F5] rounded-xl p-3 text-sm focus:outline-[#512DA8]" required />
                  <input type="text" name="workAddress" placeholder="Work Address" value={formData.workAddress} onChange={handleChange} className="w-full bg-[#EFF4FA] border border-[#DEE7F5] rounded-xl p-3 text-sm focus:outline-[#512DA8]" required />
                  <input type="text" name="homeAddress" placeholder="Home Address" value={formData.homeAddress} onChange={handleChange} className="w-full bg-[#EFF4FA] border border-[#DEE7F5] rounded-xl p-3 text-sm focus:outline-[#512DA8]" required />
                  <input type="text" name="district" placeholder="District" value={formData.district} onChange={handleChange} className="w-full bg-[#EFF4FA] border border-[#DEE7F5] rounded-xl p-3 text-sm focus:outline-[#512DA8]" required />
                  <div className="flex gap-2">
                    <input type="text" name="subCounty" placeholder="Sub-County" value={formData.subCounty} onChange={handleChange} className="w-full bg-[#EFF4FA] border border-[#DEE7F5] rounded-xl p-3 text-sm focus:outline-[#512DA8]" required />
                    <input type="text" name="parish" placeholder="Parish" value={formData.parish} onChange={handleChange} className="w-full bg-[#EFF4FA] border border-[#DEE7F5] rounded-xl p-3 text-sm focus:outline-[#512DA8]" required />
                  </div>
                  <input type="text" name="village" placeholder="Village / Cell" value={formData.village} onChange={handleChange} className="w-full bg-[#EFF4FA] border border-[#DEE7F5] rounded-xl p-3 text-sm focus:outline-[#512DA8]" required />
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900">Rent Details</h3>
                  <input type="number" name="rentAmount" placeholder="Amount Required (UGX)" value={formData.rentAmount} onChange={handleChange} className="w-full bg-[#EFF4FA] border border-[#DEE7F5] rounded-xl p-3 text-sm focus:outline-[#512DA8]" required />
                  <input type="number" name="rentPeriod" placeholder="Rent Period (Months)" value={formData.rentPeriod} onChange={handleChange} className="w-full bg-[#EFF4FA] border border-[#DEE7F5] rounded-xl p-3 text-sm focus:outline-[#512DA8]" required />
                  <input type="number" name="rentPerMonth" placeholder="Rent Per Month (UGX)" value={formData.rentPerMonth} onChange={handleChange} className="w-full bg-[#EFF4FA] border border-[#DEE7F5] rounded-xl p-3 text-sm focus:outline-[#512DA8]" required />
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900">Landlord Details</h3>
                  <input type="text" name="landlordName" placeholder="Landlord Full Name" value={formData.landlordName} onChange={handleChange} className="w-full bg-[#EFF4FA] border border-[#DEE7F5] rounded-xl p-3 text-sm focus:outline-[#512DA8]" required />
                  <input type="tel" name="landlordPhone" placeholder="Landlord Phone" value={formData.landlordPhone} onChange={handleChange} className="w-full bg-[#EFF4FA] border border-[#DEE7F5] rounded-xl p-3 text-sm focus:outline-[#512DA8]" required />
                  <input type="text" name="landlordAddress" placeholder="Landlord Address" value={formData.landlordAddress} onChange={handleChange} className="w-full bg-[#EFF4FA] border border-[#DEE7F5] rounded-xl p-3 text-sm focus:outline-[#512DA8]" required />
                  <input type="text" name="houseNumber" placeholder="House / Unit Number" value={formData.houseNumber} onChange={handleChange} className="w-full bg-[#EFF4FA] border border-[#DEE7F5] rounded-xl p-3 text-sm focus:outline-[#512DA8]" required />
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-white border-2 border-purple-100 rounded-2xl p-5 shadow-sm">
                  <h3 className="text-purple-900 font-black text-lg mb-4 text-center">Payback Calculation</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Rent Financed:</span>
                      <span className="font-bold text-gray-900">UGX {parseFloat(formData.rentAmount || '0').toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Marketplace Access Fee (33%):</span>
                      <span className="font-bold text-gray-900">UGX {calculateFees().accessFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Processing Fee:</span>
                      <span className="font-bold text-gray-900">UGX {calculateFees().requestFee.toLocaleString()}</span>
                    </div>
                    <div className="h-px w-full bg-gray-100 my-2"></div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-900 font-bold">Total Amount to Repay:</span>
                      <span className="font-black text-[#512DA8] text-lg">UGX {calculateFees().totalRepayment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <span className="text-gray-600 font-medium">Daily Repayment:</span>
                      <span className="font-bold text-gray-900">UGX {calculateFees().dailyRepayment.toLocaleString()} / day</span>
                    </div>
                    <p className="text-[11px] text-gray-400 text-center mt-2">Repayments start automatically the day after rent is paid.</p>
                  </div>
                </div>

                <div className="space-y-4 mt-6">
                  <h3 className="font-bold text-gray-900">Next of Kin (Landlord Verification)</h3>
                  <input type="text" name="nextOfKinName" placeholder="Next of Kin Name" value={formData.nextOfKinName} onChange={handleChange} className="w-full bg-[#EFF4FA] border border-[#DEE7F5] rounded-xl p-3 text-sm focus:outline-[#512DA8]" required />
                  <input type="tel" name="nextOfKinPhone" placeholder="Next of Kin Phone Number" value={formData.nextOfKinPhone} onChange={handleChange} className="w-full bg-[#EFF4FA] border border-[#DEE7F5] rounded-xl p-3 text-sm focus:outline-[#512DA8]" required />
                  <input type="text" name="relationship" placeholder="Relationship to Landlord" value={formData.relationship} onChange={handleChange} className="w-full bg-[#EFF4FA] border border-[#DEE7F5] rounded-xl p-3 text-sm focus:outline-[#512DA8]" required />
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="font-bold text-gray-900 text-lg">Identity Verification</h3>
                <p className="text-sm text-gray-500 mb-4">Please upload clear photos of your National ID and a selfie.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">National ID (Front)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-purple-50 hover:border-purple-300 transition cursor-pointer relative overflow-hidden">
                      <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'idFront')} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                      {formData.idFront ? <div className="flex items-center gap-2 text-[#512DA8] font-bold"><Check size={20}/> Uploaded</div> : <><Upload className="text-gray-400 mb-2" size={24} /><p className="text-sm text-gray-500">Take photo or upload PDF</p></>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">National ID (Back)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-purple-50 hover:border-purple-300 transition cursor-pointer relative overflow-hidden">
                      <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'idBack')} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                      {formData.idBack ? <div className="flex items-center gap-2 text-[#512DA8] font-bold"><Check size={20}/> Uploaded</div> : <><Upload className="text-gray-400 mb-2" size={24} /><p className="text-sm text-gray-500">Take photo or upload PDF</p></>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Selfie Photo</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-purple-50 hover:border-purple-300 transition cursor-pointer relative overflow-hidden">
                      <input type="file" accept="image/*" capture="user" onChange={(e) => handleFileChange(e, 'selfie')} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                      {formData.selfie ? <div className="flex items-center gap-2 text-[#512DA8] font-bold"><Check size={20}/> Uploaded</div> : <><Camera className="text-gray-400 mb-2" size={24} /><p className="text-sm text-gray-500">Take a selfie</p></>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col h-full">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Local Verification</h3>
                  <p className="text-sm text-gray-500 mb-6">We need an introductory letter from your LC1 Chairperson.</p>
                  
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">LC1 Letter (PDF or Image)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-purple-50 hover:border-purple-300 transition cursor-pointer relative overflow-hidden mb-8">
                    <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'lc1Letter')} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                    {formData.lc1Letter ? <div className="flex items-center gap-2 text-[#512DA8] font-bold"><Check size={20}/> Uploaded</div> : <><File className="text-gray-400 mb-2" size={32} /><p className="text-sm text-gray-500">Upload LC1 Document</p></>}
                  </div>

                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 mt-4">
                    <input 
                      type="checkbox" 
                      name="consented"
                      id="consent"
                      checked={formData.consented}
                      onChange={handleChange}
                      className="mt-1 w-5 h-5 text-[#512DA8] border-gray-300 rounded focus:ring-[#512DA8]"
                    />
                    <label htmlFor="consent" className="text-[13px] text-gray-700 font-medium cursor-pointer leading-tight">
                      I consent to Welile Technologies storing and processing my personal information for verification and rent financing purposes.
                    </label>
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
              className="w-full bg-[#512DA8] text-white py-4 rounded-2xl font-bold text-[16px] shadow-lg flex items-center justify-center gap-2 transition active:scale-[0.98] hover:bg-[#412387]"
            >
              Next Step <ArrowRight size={20} strokeWidth={2} />
            </button>
          ) : (
            <button 
              onClick={handleSubmit} 
              disabled={!formData.consented}
              className={`w-full py-4 rounded-2xl font-bold text-[16px] shadow-lg flex items-center justify-center gap-2 transition ${formData.consented ? 'bg-[#10B981] hover:bg-[#059669] text-white active:scale-[0.98]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              Complete Application <Check size={20} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
