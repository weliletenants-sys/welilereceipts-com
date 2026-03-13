import { useState } from 'react';
import { X } from 'lucide-react';

interface AgentDepositDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AgentDepositDialog({ isOpen, onClose }: AgentDepositDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [provider, setProvider] = useState('MTN');
  const [trxId, setTrxId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // MOCK API CALL
    setTimeout(() => {
      alert(`Deposit request for UGX ${amount} submitted for manager approval!`);
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-gray-900/60 p-4 sm:p-0">
      <div 
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 fade-in duration-300"
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Deposit for User</h2>
            <p className="text-sm text-gray-500">Log a deposit to top up a client's wallet</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">User Phone Number</label>
            <input 
              type="tel" 
              required
              placeholder="e.g. 0770 000 000"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7f13ec] focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Amount (UGX)</label>
            <input 
              type="number" 
              required
              min="500"
              placeholder="50,000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[#7f13ec] focus:border-transparent transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
             <button 
               type="button"
               onClick={() => setProvider('MTN')}
               className={`py-3 rounded-xl border-2 font-bold transition flex items-center justify-center gap-2 ${provider === 'MTN' ? 'border-yellow-400 bg-yellow-50 text-yellow-900' : 'border-gray-200 text-gray-500'}`}
             >
               <div className="w-4 h-4 rounded-full bg-yellow-400"></div> MTN MoMo
             </button>
             <button 
               type="button"
               onClick={() => setProvider('Airtel')}
               className={`py-3 rounded-xl border-2 font-bold transition flex items-center justify-center gap-2 ${provider === 'Airtel' ? 'border-red-500 bg-red-50 text-red-900' : 'border-gray-200 text-gray-500'}`}
             >
               <div className="w-4 h-4 rounded-full bg-red-500"></div> Airtel Money
             </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Transaction ID</label>
            <input 
              type="text" 
              required
              placeholder="e.g. 12938478473"
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#7f13ec] transition uppercase tracking-wider"
            />
          </div>

          <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex gap-3 items-start mt-2">
            <div className="text-purple-600 mt-0.5"><div className="w-2 h-2 rounded-full bg-purple-600"></div></div>
            <p className="text-xs text-purple-800 leading-relaxed font-medium">
              This deposit will require manager approval before the funds are credited to the user's wallet.
            </p>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || !phoneNumber || !amount || !trxId}
            className="w-full bg-[#7f13ec] hover:bg-[#6b0fcc] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#7f13ec]/30 transition active:scale-[0.98] mt-2 flex items-center justify-center"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Submit Deposit Request'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
