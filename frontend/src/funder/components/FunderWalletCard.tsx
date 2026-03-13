interface FunderWalletCardProps {
  balance: number;
  principal: number;
  expectedAmount: number;
}

export default function FunderWalletCard({ balance, principal, expectedAmount }: FunderWalletCardProps) {
  return (
    <div className="p-4">
      <div className="flex flex-col items-stretch justify-start rounded-xl shadow-lg bg-[#7f13ec] text-white p-6 relative overflow-hidden">
        {/* Decorative background circles */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full pointer-events-none"></div>
        <div className="absolute -left-5 -bottom-5 w-20 h-20 bg-white/5 rounded-full pointer-events-none"></div>
        
        <div className="relative z-10">
          <p className="text-white/80 text-sm font-medium mb-1">Wallet Balance</p>
          <p className="text-white text-3xl font-bold leading-tight mb-6">UGX {balance.toLocaleString()}</p>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
            <div className="flex flex-col">
              <p className="text-white/70 text-xs">Principal</p>
              <p className="text-white text-lg font-semibold">UGX {(principal / 1000000).toFixed(1)}M</p>
            </div>
            <div className="flex flex-col">
              <p className="text-white/70 text-xs">Expected Amount</p>
              <p className="text-white text-lg font-semibold">UGX {(expectedAmount / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
