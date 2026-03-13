import { Building2, Building, Factory, Plus } from 'lucide-react';

interface PortfolioItem {
  id: string;
  name: string;
  type: 'residential' | 'commercial' | 'industrial';
  apy: number;
  invested: number;
  expectedReturn: number;
  maturityDate: string;
}

interface FunderPortfolioListProps {
  portfolios: PortfolioItem[];
  onCashOut: (id: string) => void;
  onAddAsset: () => void;
}

export default function FunderPortfolioList({ portfolios, onCashOut, onAddAsset }: FunderPortfolioListProps) {
  
  const getIconForType = (type: string) => {
    switch(type) {
      case 'commercial': return <Building className="w-6 h-6" />;
      case 'industrial': return <Factory className="w-6 h-6" />;
      default: return <Building2 className="w-6 h-6" />;
    }
  };

  return (
    <div className="px-4 pb-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-900 text-lg font-bold">Investment Portfolios</h3>
        <button className="text-[#7f13ec] text-sm font-bold hover:underline">View All</button>
      </div>

      <div className="space-y-3 pb-24">
        {portfolios.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:border-[#7f13ec]/30 transition-colors">
            <div className="w-12 h-12 shrink-0 rounded-lg bg-[#7f13ec]/10 flex items-center justify-center text-[#7f13ec]">
              {getIconForType(item.type)}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <p className="text-slate-900 font-bold">{item.name}</p>
                <span className="text-emerald-500 text-xs font-bold px-2 py-1 bg-emerald-50 rounded-full">
                  {item.apy}% APY
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold">Invested</p>
                  <p className="text-slate-900 text-sm font-semibold">
                    UGX {(item.invested / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold">Expected Return</p>
                  <p className="text-emerald-600 text-sm font-semibold">
                    UGX {(item.expectedReturn / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>
              
              <p className="text-slate-500 text-xs mb-3 italic">Matures on {item.maturityDate}</p>
              
              <button 
                onClick={() => onCashOut(item.id)}
                className="w-full py-2 border border-[#7f13ec] text-[#7f13ec] text-xs font-bold rounded-lg hover:bg-[#7f13ec] hover:text-white transition-colors"
              >
                Cash out
              </button>
            </div>
          </div>
        ))}

        <button 
          onClick={onAddAsset}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-slate-200 bg-transparent text-slate-400 hover:text-[#7f13ec] hover:border-[#7f13ec]/50 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span className="font-bold text-sm">Add New Asset Class</span>
        </button>
      </div>
    </div>
  );
}
