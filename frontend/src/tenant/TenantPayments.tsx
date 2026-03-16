import { ChevronDown, FileText, Banknote } from 'lucide-react';

export default function TenantPayments() {
  const transactions = [
    {
      id: 1,
      title: 'Rent Repayment - June 2024',
      status: 'COMPLETED',
      type: 'Auto-generated',
      date: 'JUNE 1, 2024 • 10:00 AM',
      amount: '-$1,200.00',
      icon: Banknote,
    },
    {
      id: 2,
      title: 'Rent Repayment - May 2024',
      status: 'COMPLETED',
      type: 'Auto-generated',
      date: 'MAY 1, 2024 • 09:30 AM',
      amount: '-$1,200.00',
      icon: Banknote,
    },
    {
      id: 3,
      title: 'Rent Repayment - April 2024',
      status: 'COMPLETED',
      type: 'Auto-generated',
      date: 'APRIL 1, 2024 • 10:15 AM',
      amount: '-$1,200.00',
      icon: Banknote,
    },
    {
      id: 4,
      title: 'Utility Surcharge - March',
      status: 'COMPLETED',
      type: 'Manual Entry',
      date: 'MARCH 15, 2024 • 02:45 PM',
      amount: '-$45.50',
      icon: FileText,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white pb-24 font-sans relative">
      <div className="px-6 pt-6 pb-2">
        <h1 className="text-[22px] font-bold text-[#1a1f36] tracking-tight leading-tight">Payments</h1>
        <p className="text-[13px] text-[#6b7280] mt-1 font-normal">Manage your rent and transaction history</p>
      </div>

      {/* Date Filters Slider */}
      <div className="flex overflow-x-auto gap-3 px-6 py-4 no-scrollbar">
        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#8b31ff] text-white rounded-xl font-semibold text-[13px] whitespace-nowrap shadow-sm">
          June 2024
          <ChevronDown size={14} strokeWidth={2.5} />
        </button>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#f8f9fa] text-[#6b7280] rounded-xl font-medium text-[13px] whitespace-nowrap">
          May 2024
          <ChevronDown size={14} strokeWidth={2} className="text-[#9ca3af]" />
        </button>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#f8f9fa] text-[#6b7280] rounded-xl font-medium text-[13px] whitespace-nowrap">
          April 2024
          <ChevronDown size={14} strokeWidth={2} className="text-[#9ca3af]" />
        </button>
      </div>
      
      {/* Separator Line */}
      <div className="w-full px-6">
        <div className="border-b-2 border-gray-100 rounded-full w-full"></div>
      </div>

      {/* Transactions Section */}
      <div className="px-6 mt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[16px] font-semibold text-[#1a1f36]">Recent Transactions</h2>
          <button className="text-[12px] font-semibold text-[#8b31ff]">See All</button>
        </div>

        <div className="space-y-4">
          {transactions.map((tx) => {
            const Icon = tx.icon;
            return (
              <div key={tx.id} className="bg-white border border-[#f3f4f6] rounded-[20px] p-4 flex items-center shadow-sm w-full">
                {/* Icon Container */}
                <div className="w-11 h-11 rounded-full bg-[#faf5ff] flex items-center justify-center shrink-0 mr-3.5">
                  <Icon className="w-[20px] h-[20px] text-[#8b31ff]" strokeWidth={1.5} />
                </div>
                  
                {/* Transaction Details */}
                <div className="flex flex-col flex-1 min-w-0 pr-2 space-y-0.5">
                  <h3 className="font-semibold text-[13.5px] text-[#1a1f36] truncate w-full tracking-tight">{tx.title}</h3>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="text-[8.5px] font-bold text-[#10b981] uppercase tracking-wider">
                      {tx.status}
                    </span>
                    <span className="text-[#d1d5db] text-[10px]">-</span>
                    <span className="text-[10.5px] text-[#6b7280] font-normal truncate">{tx.type}</span>
                  </div>
                  <div className="text-[9.5px] text-[#9ca3af] uppercase font-semibold tracking-widest pt-0.5">
                    {tx.date}
                  </div>
                </div>
                
                {/* Amount */}
                <div className="shrink-0 text-right">
                  <span className="text-[15px] font-bold text-[#1a1f36] tracking-tight">
                    {tx.amount}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
