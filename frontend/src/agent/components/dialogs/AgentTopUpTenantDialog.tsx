import { useState } from 'react';
import { X, Search } from 'lucide-react';

interface AgentTopUpTenantDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AgentTopUpTenantDialog({ isOpen, onClose }: AgentTopUpTenantDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tenantFound, setTenantFound] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = () => {
    // Mock Search
    if (phoneNumber.length >= 10) {
      setTenantFound("John Doe (Tenant)");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // MOCK API CALL
    setTimeout(() => {
      alert(`Successfully transferred UGX ${amount} to ${tenantFound}!`);
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-gray-900/60 p-4 sm:p-0">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 fade-in duration-300">
        
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Transfer to Tenant</h2>
            <p className="text-sm text-gray-500">Send money directly from your agent wallet</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Search Tenant (Phone)</label>
            <div className="relative">
              <input 
                type="tel" 
                required
                placeholder="0770 000 000"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setTenantFound(null);
                }}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-[#7f13ec] transition"
              />
              <button 
                type="button"
                onClick={handleSearch}
                className="absolute right-2 top-2 bottom-2 w-10 flex items-center justify-center bg-[#7f13ec]/10 text-[#7f13ec] rounded-lg"
              >
                <Search size={18} />
              </button>
            </div>
            
            {tenantFound && (
              <div className="mt-2 text-sm text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 py-2 px-3 rounded-lg border border-emerald-100">
                 Found: {tenantFound}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Transfer Amount (UGX)</label>
            <input 
              type="number" 
              required
              min="500"
              placeholder="50,000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!tenantFound}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[#7f13ec] transition disabled:opacity-50"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || !tenantFound || !amount}
            className="w-full bg-[#7f13ec] hover:bg-[#6b0fcc] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#7f13ec]/30 transition active:scale-[0.98] mt-4 flex items-center justify-center"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Send Funds Instantly'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
