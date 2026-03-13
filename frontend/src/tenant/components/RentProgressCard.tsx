import { CalendarDays, Clock3 } from 'lucide-react';

interface RentProgressCardProps {
  amountPaid: number;
  totalRent: number;
  daysLeft: number;
  remainingAmount: number;
  currentMonth?: string;
}

export default function RentProgressCard({ 
  amountPaid, 
  totalRent, 
  daysLeft, 
  remainingAmount, 
  currentMonth = "June 2024" 
}: RentProgressCardProps) {
  
  const percentage = Math.min((amountPaid / totalRent) * 100, 100);

  return (
    <section className="bg-white border border-[#7f13ec]/5 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-900 font-bold">Rent Progress</h3>
        <span className="text-xs font-bold text-[#7f13ec] bg-[#7f13ec]/10 px-2 py-1 rounded">
          {currentMonth}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-end justify-between text-sm">
          <div className="flex flex-col">
            <span className="text-slate-500 text-xs">Paid so far</span>
            <span className="text-slate-900 font-bold text-lg">{amountPaid.toLocaleString()}/=</span>
          </div>
          <div className="text-right flex flex-col">
            <span className="text-slate-500 text-xs">Total Rent</span>
            <span className="text-slate-900 font-bold text-lg">{totalRent.toLocaleString()}/=</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#7f13ec]/10 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-[#7f13ec] h-full rounded-full transition-all duration-500" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        {/* Countdown / Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-[#f7f6f8] p-3 rounded-lg flex items-center gap-3">
            <div className="w-10 h-10 bg-[#7f13ec]/20 rounded-lg flex items-center justify-center text-[#7f13ec]">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Days Left</p>
              <p className="text-lg font-bold text-[#7f13ec]">
                {daysLeft < 10 ? `0${daysLeft}` : daysLeft} Days
              </p>
            </div>
          </div>

          <div className="bg-[#f7f6f8] p-3 rounded-lg flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
              <Clock3 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Remaining</p>
              <p className="text-lg font-bold text-orange-600">{remainingAmount.toLocaleString()}/=</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
