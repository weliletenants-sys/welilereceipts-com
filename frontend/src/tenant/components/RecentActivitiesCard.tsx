import { ArrowDownToLine, Home } from 'lucide-react';

export default function RecentActivitiesCard() {
  return (
    <section className="space-y-3 px-1">
      <div className="flex items-center justify-between">
        <h3 className="text-slate-900 font-bold">Recent Activities</h3>
        <a className="text-[#7f13ec] text-xs font-bold hover:underline cursor-pointer">View All</a>
      </div>

      <div className="space-y-3">
        {/* Deposit Activity */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#7f13ec]/5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <ArrowDownToLine className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Deposit Confirmed</p>
              <p className="text-[10px] text-slate-500">Yesterday, 4:30 PM</p>
            </div>
          </div>
          <span className="text-sm font-bold text-green-600">+UGX 50,000</span>
        </div>

        {/* Rent Paid Activity */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#7f13ec]/5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#7f13ec]/10 text-[#7f13ec] rounded-full flex items-center justify-center">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Partial Rent Paid</p>
              <p className="text-[10px] text-slate-500">June 01, 2024</p>
            </div>
          </div>
          <span className="text-sm font-bold text-slate-900">-UGX 120,000</span>
        </div>
      </div>
    </section>
  );
}
