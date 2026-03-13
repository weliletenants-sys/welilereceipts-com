import { Home, Star, MessageSquareHeart, Users } from 'lucide-react';

export default function LandlordDashboard() {
  return (
    <div className="bg-[#f7f6f8] min-h-screen font-sans text-slate-900 pb-24">
      <div className="w-full bg-white min-h-screen p-4 flex flex-col gap-6 shadow-xl">
        {/* Header Placeholder (can be replaced with a real header later) */}
        <header className="flex items-center justify-between pb-2 border-b border-gray-100">
          <h1 className="text-xl font-bold">Landlord Dashboard</h1>
        </header>

        {/* Property Overview */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-[2rem] text-white shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <p className="text-purple-100 font-medium">Your Properties</p>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md">Verified</span>
          </div>
          
          <h2 className="text-4xl font-bold tracking-tight mb-2">3</h2>
          <p className="text-sm text-purple-200">Active Rentals Occupied</p>

          <div className="flex space-x-2 mt-6">
            <button className="flex-1 bg-white text-purple-700 py-3 rounded-2xl font-semibold flex justify-center items-center gap-2 hover:bg-purple-50 transition">
              <Home size={18} />
              Manage Properties
            </button>
          </div>
        </div>

        {/* Grid Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-white p-4 rounded-2xl flex flex-col items-center gap-3 shadow-sm border border-gray-100 hover:bg-purple-50 transition text-center justify-center">
            <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
              <Users size={24} />
            </div>
            <span className="font-semibold text-gray-700 text-sm">Add Tenant</span>
          </button>
          <button className="bg-white p-4 rounded-2xl flex flex-col items-center gap-3 shadow-sm border border-gray-100 hover:bg-purple-50 transition text-center justify-center">
            <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
              <Star size={24} />
            </div>
            <span className="font-semibold text-gray-700 text-sm">Rate Tenants</span>
          </button>
        </div>

        {/* Communication Section */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-pink-100 text-pink-500 rounded-full flex justify-center items-center mx-auto mb-4">
            <MessageSquareHeart size={28} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Tenant Engagement</h3>
          <p className="text-sm text-gray-500 mb-6">Send an encouraging message to your top-performing tenants to build loyalty.</p>
          <button className="w-full bg-purple-50 text-purple-700 py-3 rounded-full font-semibold border border-purple-100 hover:bg-purple-100 transition">
            Send Encouragement
          </button>
        </div>
      </div>
    </div>
  );
}
