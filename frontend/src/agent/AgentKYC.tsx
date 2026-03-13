import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, ArrowRight, UploadCloud, Plus, Trash2, Camera, ShieldCheck } from 'lucide-react';

export default function AgentKYC() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1: Personal Profile
  const [profile, setProfile] = useState({
    occupation: '',
    residence: '',
    district: '',
    city: ''
  });

  // Step 2: Next of Kin (Must validate min 2)
  const [nextOfKin, setNextOfKin] = useState([
    { fullName: '', contactNumber: '', residence: '', relationship: '' },
    { fullName: '', contactNumber: '', residence: '', relationship: '' }
  ]);

  // Step 3: Identity Verification & Consent
  const [identity, setIdentity] = useState({
    idType: 'national_id',
    idNumber: '',
    frontImage: '',
    backImage: '',
    selfieImage: '',
    consented: false
  });

  const nextStep = () => {
    window.scrollTo(0, 0);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    window.scrollTo(0, 0);
    setStep((prev) => prev - 1);
  };

  const addNextOfKin = () => {
    setNextOfKin([...nextOfKin, { fullName: '', contactNumber: '', residence: '', relationship: '' }]);
  };

  const updateNextOfKin = (index: number, field: string, value: string) => {
    const updated = [...nextOfKin];
    updated[index] = { ...updated[index], [field]: value };
    setNextOfKin(updated);
  };

  const removeNextOfKin = (index: number) => {
    if (nextOfKin.length <= 2) {
      alert('You must provide at least 2 next of kin contacts.');
      return;
    }
    const updated = nextOfKin.filter((_, i) => i !== index);
    setNextOfKin(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity.consented) {
      alert("You must consent to data processing to submit KYC.");
      return;
    }
    // Mock submission to pending review state
    navigate('/agent-kyc-review');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] sm:p-4 flex justify-center mt-0 sm:mt-4 relative">
      <div className="w-full min-h-screen bg-white relative flex flex-col shadow-2xl overflow-hidden z-10">

        {/* Header */}
        <div className="pt-14 px-6 pb-4 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
          <button onClick={() => step > 1 ? prevStep() : navigate('/dashboard')} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft className="text-gray-900" size={24} />
          </button>
          <div className="font-bold text-gray-900">Step {step} of 3</div>
          <div className="w-8" />
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-1.5 shrink-0">
          <div 
            className="bg-[#4A3AFF] h-1.5 transition-all duration-300 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Form Container */}
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <form id="kyc-form" onSubmit={(e) => { e.preventDefault(); step === 3 ? handleSubmit(e) : nextStep() }}>
            
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Personal Details</h2>
                  <p className="text-sm text-gray-500 mt-1">Verify your basic information.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1 mb-1 block">Full Name</label>
                    <input type="text" value={user?.firstName + ' ' + (user?.lastName || '')} disabled className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 text-gray-500 font-medium text-sm cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1 mb-1 block">Email</label>
                    <input type="text" value={user?.email} disabled className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 text-gray-500 font-medium text-sm cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1 mb-1 block">Primary Occupation</label>
                    <input required type="text" placeholder="e.g. Sales, Business Owner" value={profile.occupation} onChange={(e) => setProfile({...profile, occupation: e.target.value})} className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 px-4 text-gray-900 font-semibold focus:outline-none focus:border-[#4A3AFF] focus:ring-4 focus:ring-blue-500/10 transition" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1 mb-1 block">City/Town</label>
                    <input required type="text" placeholder="e.g. Kampala" value={profile.city} onChange={(e) => setProfile({...profile, city: e.target.value})} className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 px-4 text-gray-900 font-semibold focus:outline-none focus:border-[#4A3AFF] focus:ring-4 focus:ring-blue-500/10 transition" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1 mb-1 block">District of Operation</label>
                    <input required type="text" placeholder="e.g. Wakiso" value={profile.district} onChange={(e) => setProfile({...profile, district: e.target.value})} className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 px-4 text-gray-900 font-semibold focus:outline-none focus:border-[#4A3AFF] focus:ring-4 focus:ring-blue-500/10 transition" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1 mb-1 block">Full Residential Address</label>
                    <input required type="text" placeholder="House number, Street, Sub-county" value={profile.residence} onChange={(e) => setProfile({...profile, residence: e.target.value})} className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 px-4 text-gray-900 font-semibold focus:outline-none focus:border-[#4A3AFF] focus:ring-4 focus:ring-blue-500/10 transition" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Next of Kin</h2>
                  <p className="text-sm text-gray-500 mt-1">Provide at least 2 emergency contacts.</p>
                </div>

                <div className="space-y-6">
                  {nextOfKin.map((kin, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 relative">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-sm text-[#4A3AFF]">Contact #{index + 1}</span>
                        {index >= 2 && (
                          <button type="button" onClick={() => removeNextOfKin(index)} className="text-red-500 p-1 hover:bg-red-50 rounded-lg">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <input required type="text" placeholder="Full Name" value={kin.fullName} onChange={(e) => updateNextOfKin(index, 'fullName', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl py-3 px-3 text-sm focus:outline-none focus:border-[#4A3AFF] transition" />
                        <input required type="tel" placeholder="Phone Number" value={kin.contactNumber} onChange={(e) => updateNextOfKin(index, 'contactNumber', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl py-3 px-3 text-sm focus:outline-none focus:border-[#4A3AFF] transition" />
                        <input required type="text" placeholder="Relationship (e.g. Brother, Spouse)" value={kin.relationship} onChange={(e) => updateNextOfKin(index, 'relationship', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl py-3 px-3 text-sm focus:outline-none focus:border-[#4A3AFF] transition" />
                        <input required type="text" placeholder="Residence Area" value={kin.residence} onChange={(e) => updateNextOfKin(index, 'residence', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl py-3 px-3 text-sm focus:outline-none focus:border-[#4A3AFF] transition" />
                      </div>
                    </div>
                  ))}
                  
                  <button type="button" onClick={addNextOfKin} className="w-full py-3.5 border-2 border-dashed border-[#4A3AFF]/30 text-[#4A3AFF] font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-[#4A3AFF]/5 transition">
                    <Plus size={18} /> Add Another Contact
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Identity Upload</h2>
                  <p className="text-sm text-gray-500 mt-1">Upload clear photos of your National ID.</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1 mb-1 block">National ID Number (NIN)</label>
                    <input required type="text" placeholder="CM90XXXXXXXXXX" value={identity.idNumber} onChange={(e) => setIdentity({...identity, idNumber: e.target.value})} className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 px-4 text-gray-900 font-semibold focus:outline-none focus:border-[#4A3AFF] focus:ring-4 focus:ring-blue-500/10 transition uppercase" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-blue-50 transition min-h-[120px]">
                      <UploadCloud className="text-[#4A3AFF]" size={28} />
                      <span className="text-xs font-medium text-[#4A3AFF] text-center">ID Front<br/>(Take Photo)</span>
                    </div>
                    <div className="bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-blue-50 transition min-h-[120px]">
                      <UploadCloud className="text-[#4A3AFF]" size={28} />
                      <span className="text-xs font-medium text-[#4A3AFF] text-center">ID Back<br/>(Take Photo)</span>
                    </div>
                  </div>

                  <div className="bg-[#4A3AFF]/5 border border-[#4A3AFF]/20 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#4A3AFF]/10 transition min-h-[140px]">
                    <div className="w-12 h-12 bg-[#4A3AFF]/10 rounded-full flex items-center justify-center mb-1">
                      <Camera className="text-[#4A3AFF]" size={24} />
                    </div>
                    <span className="text-sm font-bold text-[#4A3AFF]">Take a Selfie</span>
                    <span className="text-xs text-blue-800/60 text-center px-4">Ensure good lighting and remove glasses or hats.</span>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-6">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                        <input type="checkbox" required checked={identity.consented} onChange={(e) => setIdentity({...identity, consented: e.target.checked})} className="w-5 h-5 text-[#4A3AFF] border-gray-300 focus:ring-blue-500 rounded cursor-pointer accent-[#4A3AFF]" />
                      </div>
                      <span className="text-sm text-gray-600 leading-snug">
                        I consent to the collection and verification of my identity data via third-party agencies for the purpose of Welile KYC processing.
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}
            
          </form>
        </div>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 shrink-0 pb-8 sm:pb-4 z-20">
          <button 
            type="submit" 
            form="kyc-form"
            className="w-full bg-[#4A3AFF] hover:bg-[#3427AC] text-white py-4 rounded-2xl font-bold text-[16px] shadow-[0_8px_20px_-6px_rgba(74,58,255,0.4)] flex items-center justify-center gap-2 transition active:scale-[0.98]"
          >
            {step === 3 ? (
              <><ShieldCheck size={20} /> Submit for Review</>
            ) : (
              <>Continue <ArrowRight size={20} /></>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
