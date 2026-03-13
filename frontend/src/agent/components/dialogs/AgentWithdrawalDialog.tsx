import { useState } from 'react';
import { X, Building2 } from 'lucide-react';

interface AgentWithdrawalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
}

export default function AgentWithdrawalDialog({ isOpen, onClose, availableBalance }: AgentWithdrawalDialogProps) {
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // MOCK API CALL
    setTimeout(() => {
      alert(`Withdrawal request of UGX ${amount} submitted! It will be sent to your registered Mobile Money number.`);
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-gray-900/60 p-4 sm:p-0">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 fade-in duration-300">
        
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Withdraw Earnings</h2>
            <p className="text-sm text-gray-500">Cash out your commission wallet</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          
          <div className="bg-green-50 rounded-xl p-4 border border-green-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-green-700 font-bold uppercase tracking-wider mb-1">Available to Withdraw</p>
              <p className="text-2xl font-black text-green-900">UGX {availableBalance.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <Building2 size={24} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Withdrawal Amount (UGX)</label>
            <input 
              type="number" 
              required
              min="5000"
              max={availableBalance}
              placeholder="Min 5,000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[#7f13ec] transition"
            />
            <p className="text-xs font-medium text-gray-400 mt-2 text-center">Funds will be sent to your registered MoMo line</p>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || !amount || Number(amount) < 5000 || Number(amount) > availableBalance}
            className="w-full bg-[#10b981] hover:bg-[#059669] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#10b981]/30 transition active:scale-[0.98] mt-2 flex items-center justify-center"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Confirm Withdrawal'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
