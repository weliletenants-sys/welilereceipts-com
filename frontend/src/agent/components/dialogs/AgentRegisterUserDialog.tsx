import { useState } from 'react';
import { X, UserPlus } from 'lucide-react';

interface AgentRegisterUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AgentRegisterUserDialog({ isOpen, onClose }: AgentRegisterUserDialogProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('TENANT');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // MOCK API CALL
    setTimeout(() => {
      alert(`Successfully registered ${firstName} ${lastName} as a ${role}! An invite SMS has been sent.`);
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-gray-900/60 p-4 sm:p-0">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 fade-in duration-300">
        
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Register New Client</h2>
            <p className="text-sm text-gray-500">Quickly onboard a user in the field</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">First Name</label>
              <input 
                type="text" 
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7f13ec] transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Last Name</label>
              <input 
                type="text" 
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7f13ec] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Phone Number</label>
            <input 
              type="tel" 
              required
              placeholder="e.g. +256 700 000 000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 font-mono focus:outline-none focus:ring-2 focus:ring-[#7f13ec] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Assign App Role</label>
            <div className="grid grid-cols-3 gap-2">
               {['TENANT', 'LANDLORD', 'SUPPORTER'].map(r => (
                 <button
                   key={r}
                   type="button"
                   onClick={() => setRole(r)}
                   className={`py-2 rounded-xl border-2 font-bold text-xs transition ${role === r ? 'border-[#7f13ec] bg-[#7f13ec]/10 text-[#7f13ec]' : 'border-gray-200 text-gray-500'}`}
                 >
                   {r}
                 </button>
               ))}
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex gap-3 items-start mt-2">
            <div className="text-purple-600 mt-0.5"><UserPlus size={16} /></div>
            <p className="text-xs text-purple-800 leading-relaxed font-medium">
              You will automatically earn a UGX 500 referral bonus once they log in.
            </p>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || !firstName || !lastName || !phone}
            className="w-full bg-[#7f13ec] hover:bg-[#6b0fcc] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#7f13ec]/30 transition active:scale-[0.98] mt-2 flex items-center justify-center"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Send Invite Link'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
