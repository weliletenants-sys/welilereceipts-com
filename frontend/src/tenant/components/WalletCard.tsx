import { Wallet, PlusCircle, ArrowDownCircle, ArrowRightLeft } from 'lucide-react';

interface WalletCardProps {
  balance: number;
  onDeposit?: () => void;
  onWithdraw?: () => void;
  onTransfer?: () => void;
}

export default function WalletCard({ balance, onDeposit, onWithdraw, onTransfer }: WalletCardProps) {
  return (
    <section className="bg-[#7f13ec] rounded-xl p-6 text-white shadow-lg shadow-[#7f13ec]/20 relative overflow-hidden">
      {/* Abstract Background Pattern */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/80 text-sm font-medium">Wallet Balance</span>
          <Wallet className="w-5 h-5 text-white/80" />
        </div>
        
        <div className="text-3xl font-bold mb-6">UGX {balance.toLocaleString()}</div>
        
        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={onDeposit}
            className="flex flex-col items-center justify-center gap-1 py-3 bg-white/15 hover:bg-white/25 rounded-lg transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Deposit</span>
          </button>
          
          <button 
            onClick={onWithdraw}
            className="flex flex-col items-center justify-center gap-1 py-3 bg-white/15 hover:bg-white/25 rounded-lg transition-colors"
          >
            <ArrowDownCircle className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Withdraw</span>
          </button>
          
          <button 
            onClick={onTransfer}
            className="flex flex-col items-center justify-center gap-1 py-3 bg-white/15 hover:bg-white/25 rounded-lg transition-colors"
          >
            <ArrowRightLeft className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Transfer</span>
          </button>
        </div>
      </div>
    </section>
  );
}
