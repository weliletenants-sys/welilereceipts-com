import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function RentRequestForm() {
  const { rentAmount, setRentAmount } = useAuth();
  
  // Example states for the new form fields
  const [occupation, setOccupation] = useState('');
  const [workAddress, setWorkAddress] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [subCounty, setSubCounty] = useState('');
  const [parish, setParish] = useState('');
  const [village, setVillage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const navigate = useNavigate();

  const handleNextStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      console.log("Proceeding to signup...");
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] sm:p-4 flex justify-center items-center relative overflow-hidden font-sans">
      
      {/* Phone container */}
      <div className="w-full min-h-screen bg-white relative flex flex-col overflow-hidden z-10">
        
        {/* Header Section */}
        <div className="pt-12 pb-4 px-6 flex items-center justify-between bg-white relative z-20">
          <button 
            onClick={() => {
              if (currentStep > 1) {
                setCurrentStep(prev => prev - 1);
              } else {
                navigate(-1);
              }
            }}
            className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          
          <div className="text-center flex-1 pr-10"> {/* pr-10 to offset the back button visually */}
            <h1 className="text-lg font-bold text-[#0F172A] tracking-tight">Rent Financing</h1>
            <p className="text-[#64748B] text-sm">Step {currentStep} of 4</p>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full px-10 mb-8 mt-2">
          <div className="relative flex items-center justify-between">
            {/* Background Line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[3px] bg-gray-200 -z-10"></div>
            {/* Active Line */}
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-[3px] bg-[#51319E] -z-10 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            ></div>

            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center gap-1.5 bg-white relative">
                {currentStep === stepNumber && (
                  <div className="absolute -top-[14px] text-[#51319E]">
                    <svg width="12" height="8" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-[0_0_0_4px_white] transition-colors duration-300 ${
                  stepNumber <= currentStep 
                    ? 'bg-[#51319E] text-white' 
                    : 'border-[2px] border-gray-200 bg-white text-gray-400'
                }`}>
                  {stepNumber < currentStep ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : stepNumber}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-28 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {/* Mock Auto-filled Section */}
          <div className="bg-[#FAF8FF] border border-[#F1EAFC] rounded-2xl p-4 mb-8">
            <h3 className="text-[#2F1069] font-bold text-[15px] mb-1">Personal Info (Auto-filled)</h3>
            <p className="text-[#6A4EAA] text-sm leading-relaxed">
              Name: Kahunde Florence<br/>
              Phone: Verified (+256...)
            </p>
          </div>

          {currentStep === 1 && (
            <form onSubmit={handleNextStep}>
              
              {/* Location & Work Section */}
              <h2 className="text-lg font-black text-[#0F172A] mb-4">Location & Work</h2>
              
              <div className="space-y-4 mb-8">
                <input 
                  type="text" 
                  placeholder="Occupation"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full bg-[#F4F6F9] border border-transparent hover:border-gray-200 rounded-[14px] py-4 px-4 text-gray-800 text-sm focus:outline-none focus:border-[#51319E] focus:bg-white transition placeholder-[#94A3B8]"
                />
                <input 
                  type="text" 
                  placeholder="Work Address"
                  value={workAddress}
                  onChange={(e) => setWorkAddress(e.target.value)}
                  className="w-full bg-[#F4F6F9] border border-transparent hover:border-gray-200 rounded-[14px] py-4 px-4 text-gray-800 text-sm focus:outline-none focus:border-[#51319E] focus:bg-white transition placeholder-[#94A3B8]"
                />
                <input 
                  type="text" 
                  placeholder="Home Address"
                  value={homeAddress}
                  onChange={(e) => setHomeAddress(e.target.value)}
                  className="w-full bg-[#F4F6F9] border border-transparent hover:border-gray-200 rounded-[14px] py-4 px-4 text-gray-800 text-sm focus:outline-none focus:border-[#51319E] focus:bg-white transition placeholder-[#94A3B8]"
                />
                <input 
                  type="text" 
                  placeholder="District"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-[#F4F6F9] border border-transparent hover:border-gray-200 rounded-[14px] py-4 px-4 text-gray-800 text-sm focus:outline-none focus:border-[#51319E] focus:bg-white transition placeholder-[#94A3B8]"
                />
                
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    placeholder="Sub-County"
                    value={subCounty}
                    onChange={(e) => setSubCounty(e.target.value)}
                    className="w-1/2 bg-[#F4F6F9] border border-transparent hover:border-gray-200 rounded-[14px] py-4 px-4 text-gray-800 text-sm focus:outline-none focus:border-[#51319E] focus:bg-white transition placeholder-[#94A3B8]"
                  />
                  <input 
                    type="text" 
                    placeholder="Parish"
                    value={parish}
                    onChange={(e) => setParish(e.target.value)}
                    className="w-1/2 bg-[#F4F6F9] border border-transparent hover:border-gray-200 rounded-[14px] py-4 px-4 text-gray-800 text-sm focus:outline-none focus:border-[#51319E] focus:bg-white transition placeholder-[#94A3B8]"
                  />
                </div>

                <input 
                  type="text" 
                  placeholder="Village / Cell"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full bg-[#F4F6F9] border border-transparent hover:border-gray-200 rounded-[14px] py-4 px-4 text-gray-800 text-sm focus:outline-none focus:border-[#51319E] focus:bg-white transition placeholder-[#94A3B8]"
                />
              </div>

              {/* Rent Details Section */}
              <h2 className="text-lg font-black text-[#0F172A] mb-4">Rent Details</h2>
              <div className="space-y-4">
                 <input 
                    type="number" 
                    placeholder="Requested Rent Amount (UGX)"
                    value={rentAmount}
                    onChange={(e) => setRentAmount(e.target.value)}
                    className="w-full bg-[#F4F6F9] border border-transparent hover:border-gray-200 rounded-[14px] py-4 px-4 text-gray-800 text-sm focus:outline-none focus:border-[#51319E] focus:bg-white transition placeholder-[#94A3B8]"
                  />
              </div>

            </form>
          )}

          {currentStep === 2 && (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-2xl mb-4">2</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Financial Verification</h2>
              <p className="text-gray-500 max-w-[250px]">Placeholder for uploading income statements and bank records.</p>
            </div>
          )}

          {currentStep === 3 && (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-2xl mb-4">3</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Guarantor Information</h2>
              <p className="text-gray-500 max-w-[250px]">Placeholder for adding guarantor details and references.</p>
            </div>
          )}

          {currentStep === 4 && (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-2xl mb-4">4</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Review & Submit</h2>
              <p className="text-gray-500 max-w-[250px]">Review all the information provided before creating your account.</p>
            </div>
          )}
        </div>

        {/* Fixed Bottom Action Bar */}
        <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-sm pt-4 pb-8 px-6 border-t border-gray-50 flex justify-center z-30">
           <button 
             onClick={handleNextStep}
             className="w-[95%] bg-[#51319E] hover:bg-[#412780] text-white py-[18px] rounded-2xl font-bold text-[16px] shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 transition active:scale-[0.98]"
           >
             {currentStep < 4 ? 'Next Step' : 'Finish & Sign Up'} <ArrowRight size={20} strokeWidth={2.5} />
           </button>
        </div>

      </div>
    </div>
  );
}
