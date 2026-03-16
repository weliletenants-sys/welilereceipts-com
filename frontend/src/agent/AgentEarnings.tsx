import { Star, User } from 'lucide-react';

interface Commission {
  id: string;
  name: string;
  property: string;
  amount: number;
  date: string;
}

const mockCommissions: Commission[] = [
  {
    id: '1',
    name: 'Sarah Miller',
    property: 'Maple Heights - Unit 402',
    amount: 50000,
    date: 'OCT 24, 2023'
  },
  {
    id: '2',
    name: 'David Chen',
    property: 'Oak Ridge Villas - B12',
    amount: 75000,
    date: 'OCT 22, 2023'
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    property: 'Skyline Apartments - 15C',
    amount: 45000,
    date: 'OCT 20, 2023'
  },
  {
    id: '4',
    name: 'James Wilson',
    property: 'The Atrium - Unit 104',
    amount: 60000,
    date: 'OCT 18, 2023'
  },
  {
    id: '5',
    name: 'Amara Okafor',
    property: 'Riverview Lofts - A02',
    amount: 55000,
    date: 'OCT 15, 2023'
  }
];

export default function AgentEarnings() {
  return (
    <div className="px-4 py-4 mb-24 max-w-md mx-auto h-full bg-white">
      
      {/* Header */}
      <div className="mb-6 mt-2 text-center">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Earnings</h1>
      </div>

      {/* Earnings Card */}
      <div className="bg-gradient-to-r from-[#8a2be2] to-[#7b1fa2] rounded-[24px] p-6 mb-8 text-white relative overflow-hidden shadow-lg shadow-[#7f13ec]/20">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-white/80 text-[13px] font-medium tracking-wide mb-1">Total Earnings</p>
            <p className="text-white/60 text-[10px] font-bold tracking-wider uppercase">SINCE OCT 2023</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5 border border-white/10">
            <div className="bg-white rounded-full p-0.5">
              <Star className="w-2.5 h-2.5 text-[#7f13ec]" fill="currentColor" />
            </div>
            <span className="text-[10px] font-bold tracking-wider">SILVER AGENT</span>
          </div>
        </div>
        
        <h2 className="text-3xl font-extrabold tracking-tight">2,500,000 UGX</h2>
      </div>

      {/* Commission List Header */}
      <div className="flex justify-between items-end mb-6">
        <h3 className="text-lg font-bold text-[#2d3748]">Commission Received</h3>
        <button className="text-[#7f13ec] text-sm font-bold tracking-wide">View All</button>
      </div>

      {/* Commission List */}
      <div className="flex flex-col gap-0">
        {mockCommissions.map((commission, index) => (
          <div 
            key={commission.id}
            className={`flex items-center py-4 ${index !== mockCommissions.length - 1 ? 'border-b border-gray-100' : ''}`}
          >
            {/* User Icon */}
            <div className="w-12 h-12 rounded-full bg-[#f3e8ff] flex items-center justify-center mr-4 flex-shrink-0">
              <User className="text-[#a855f7] w-6 h-6" fill="currentColor" />
            </div>
            
            {/* Details & Amount */}
            <div className="flex-1 flex justify-between items-center">
              <div>
                <h4 className="text-[15px] font-bold text-gray-900 mb-0.5">{commission.name}</h4>
                <p className="text-[12px] text-gray-500">{commission.property}</p>
              </div>
              <div className="text-right">
                <p className="text-[15px] font-bold text-[#059669] mb-0.5">+ {commission.amount.toLocaleString()} UGX</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{commission.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}
