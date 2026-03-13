import { PlusCircle, Wallet } from 'lucide-react';

interface FunderActionButtonsProps {
  onDeposit: () => void;
  onWithdraw: () => void;
}

export default function FunderActionButtons({ onDeposit, onWithdraw }: FunderActionButtonsProps) {
  return (
    <div className="flex justify-center px-4 mb-6">
      <div className="flex flex-1 gap-3 w-full">
        <button 
          onClick={onDeposit}
          className="flex-1 cursor-pointer items-center justify-center rounded-lg h-12 bg-[#7f13ec] hover:bg-[#6c10c9] text-white text-sm font-bold tracking-wide flex gap-2 shadow-md transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          Deposit
        </button>
        <button 
          onClick={onWithdraw}
          className="flex-1 cursor-pointer items-center justify-center rounded-lg h-12 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 text-sm font-bold tracking-wide flex gap-2 shadow-sm transition-colors"
        >
          <Wallet className="w-5 h-5" />
          Withdraw
        </button>
      </div>
    </div>
  );
}
