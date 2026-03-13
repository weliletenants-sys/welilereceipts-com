import { PlusCircle, ArrowDown, ArrowRightLeft } from 'lucide-react';

interface CommissionWalletCardProps {
  balance: number;
  onDeposit: () => void;
  onWithdraw: () => void;
  onTransfer: () => void;
}

export default function CommissionWalletCard({ balance, onDeposit, onWithdraw, onTransfer }: CommissionWalletCardProps) {
  return (
    <section className="p-4">
      <div className="relative overflow-hidden bg-[#7f13ec] rounded-xl p-6 text-white shadow-lg shadow-[#7f13ec]/20">
        
        {/* Abstract Background Patterns */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 blur-xl"></div>
        
        <div className="relative z-10">
          <p className="text-purple-200 text-sm font-medium">Available Commission</p>
          <div className="flex items-center justify-between mt-1">
            <h2 className="text-3xl font-bold tracking-tight">UGX {balance.toLocaleString()}</h2>
          </div>
        </div>
        
        {/* Action Buttons Grid */}
        <div className="grid grid-cols-3 gap-3 mt-6 relative z-10">
          <button 
            onClick={onDeposit}
            className="flex flex-col items-center justify-center gap-2 py-3 bg-white/15 hover:bg-white/25 active:bg-white/30 rounded-lg transition-colors"
          >
            <PlusCircle size={24} strokeWidth={1.5} />
            <span className="text-xs font-medium">Deposit</span>
          </button>
          
          <button 
            onClick={onWithdraw}
            className="flex flex-col items-center justify-center gap-2 py-3 bg-white/15 hover:bg-white/25 active:bg-white/30 rounded-lg transition-colors"
          >
            <ArrowDown size={24} strokeWidth={1.5} />
            <span className="text-xs font-medium">Withdraw</span>
          </button>
          
          <button 
            onClick={onTransfer}
            className="flex flex-col items-center justify-center gap-2 py-3 bg-white/15 hover:bg-white/25 active:bg-white/30 rounded-lg transition-colors"
          >
            <ArrowRightLeft size={24} strokeWidth={1.5} />
            <span className="text-xs font-medium">Transfer</span>
          </button>
        </div>

      </div>
    </section>
  );
}
