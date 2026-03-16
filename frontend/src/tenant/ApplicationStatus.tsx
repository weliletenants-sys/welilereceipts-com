import { Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ApplicationStatus() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F8F9FA] sm:p-4 flex justify-center items-center relative overflow-hidden">
      <div className="w-full min-h-screen bg-white relative flex flex-col shadow-2xl overflow-hidden z-10">

        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-12 text-center">
          
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-100 rounded-full blur-2xl opacity-60"></div>
            <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mb-6 border border-yellow-200 shadow-xl shadow-yellow-500/20 relative z-10 mx-auto">
              <Clock className="text-yellow-600" size={40} />
            </div>
          </div>
          
          <h1 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Application Received</h1>
          <div className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-6 border border-yellow-200">
            Pending Approval
          </div>

          <p className="text-gray-500 font-medium leading-relaxed max-w-[280px] mb-8">
            Your application is pending approval. Our verification team is reviewing your information and will contact you shortly if we need anything else.
          </p>

          <div className="mt-auto w-full text-center pb-8">
             <p className="text-sm text-gray-400 font-medium mb-6">Please wait for notification before proceeding.</p>
             
             {/* Developer/Debug Button to simulate approval */}
             <button 
               onClick={() => navigate('/dashboard')}
               className="text-xs text-purple-600 bg-purple-50 px-4 py-2 rounded-full font-bold hover:bg-purple-100 transition"
             >
               (Dev) Simulate Approval &rarr; Go to Dashboard
             </button>
          </div>

        </div>
      </div>
    </div>
  );
}
