import { ArrowLeft, Bell, UserPlus, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AgentBottomNav from './components/AgentBottomNav';

export default function AgentSubAgents() {
  const navigate = useNavigate();

  const subAgents = [
    {
      id: 1,
      name: 'Marcus Tendo',
      clients: 15,
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80',
    },
    {
      id: 2,
      name: 'Joy Nalule',
      clients: 28,
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80',
    },
    {
      id: 3,
      name: 'David Okello',
      clients: 8,
      status: 'Pending',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80',
    },
    {
      id: 4,
      name: 'Sarah Chen',
      clients: 0,
      status: 'Inactive',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80',
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-[#dcfce7] text-[#15803d]';
      case 'Pending':
        return 'bg-[#fef3c7] text-[#b45309]';
      case 'Inactive':
        return 'bg-[#f3f4f6] text-[#475569]';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] pb-24 font-sans relative flex flex-col items-center">
      {/* 1. Standard Header */}
      <div className="w-full flex justify-between items-center px-6 py-5 bg-[#f8f9fa]">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} strokeWidth={2} />
        </button>
        <span className="text-[17px] font-bold text-[#1a1f36] tracking-tight">Sub Agents</span>
        <div className="w-9"></div> {/* Spacer to keep title centered */}
      </div>

      <div className="w-full px-4 max-w-md mt-4">
        {/* 2. Add Sub Agent Button */}
        <button className="w-full flex justify-center items-center gap-2 bg-[#7c3aed] text-white py-4 rounded-xl font-bold shadow-md active:scale-[0.98] transition-all">
          <UserPlus size={20} strokeWidth={2.5} />
          <span>Add Sub Agent</span>
        </button>

        {/* 3. Section Title */}
        <div className="flex justify-between items-end mt-8 mb-4 px-1">
          <h2 className="text-[18px] font-bold text-[#1a1f36]">Your Sub-Agents</h2>
          <span className="text-[13px] font-medium text-[#6b7280]">Total: {subAgents.length}</span>
        </div>

        {/* 4. Sub-Agents List */}
        <div className="space-y-4">
          {subAgents.map((agent) => (
            <div key={agent.id} className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99] border border-gray-50">
              <div className="flex items-center gap-4">
                <img 
                  src={agent.avatar} 
                  alt={agent.name} 
                  className="w-14 h-14 rounded-full object-cover shadow-sm bg-gray-100"
                />
                <div className="flex flex-col">
                  <span className="text-[15px] font-bold text-[#1a1f36]">{agent.name}</span>
                  <span className="text-[13px] text-[#6b7280]">{agent.clients} Clients recruited</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${getStatusStyle(agent.status)}`}>
                  {agent.status}
                </span>
                <ChevronRight size={16} strokeWidth={2} className="text-[#cbd5e1] mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Bottom Navigation */}
      <AgentBottomNav />
    </div>
  );
}
