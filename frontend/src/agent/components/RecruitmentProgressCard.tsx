interface RecruitmentProgressCardProps {
  totalClients: number;
  pendingPayments: number;
  conversionRate: number; // percentage (0-100)
}

export default function RecruitmentProgressCard({ totalClients, pendingPayments, conversionRate }: RecruitmentProgressCardProps) {
  return (
    <section className="px-4 py-2">
      <div className="bg-white rounded-xl p-5 border border-[#7f13ec]/5 shadow-sm">
        
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-500">Client Recruitment</h3>
            <p className="text-lg font-bold text-gray-900">Payment Conversion</p>
          </div>
          <p className="text-[#7f13ec] font-bold text-lg">{conversionRate}%</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#7f13ec]/10 h-3 rounded-full overflow-hidden mb-6">
          <div 
            className="bg-[#7f13ec] h-full rounded-full transition-all duration-500" 
            style={{ width: `${conversionRate}%` }}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#f7f6f8] p-4 rounded-lg border border-[#7f13ec]/5">
            <p className="text-xs text-gray-500 font-medium">Total Clients</p>
            <p className="text-xl font-bold mt-1 text-[#7f13ec]">{totalClients.toLocaleString()}</p>
          </div>
          <div className="bg-[#f7f6f8] p-4 rounded-lg border border-[#7f13ec]/5">
            <p className="text-xs text-gray-500 font-medium">Pending Payments</p>
            <p className="text-xl font-bold mt-1 text-gray-900">{pendingPayments.toLocaleString()}</p>
          </div>
        </div>

      </div>
    </section>
  );
}
