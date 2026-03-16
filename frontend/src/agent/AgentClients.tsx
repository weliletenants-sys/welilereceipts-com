import { useState } from 'react';
import { Search, Phone } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  property: string;
  unit?: string;
  status: 'Paid' | 'Not Paid';
  avatarUrl: string;
  phone: string;
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'Sarah Miller',
    property: 'Maple Heights',
    unit: 'Unit 402',
    status: 'Paid',
    avatarUrl: 'https://i.pravatar.cc/150?u=sarah',
    phone: '+1234567890'
  },
  {
    id: '2',
    name: 'Marcus Chen',
    property: 'Oak Ridge Apartments',
    unit: '#12B',
    status: 'Not Paid',
    avatarUrl: 'https://i.pravatar.cc/150?u=marcus',
    phone: '+1234567891'
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    property: 'Sunset Villas',
    unit: 'Villa 7',
    status: 'Paid',
    avatarUrl: 'https://i.pravatar.cc/150?u=elena',
    phone: '+1234567892'
  },
  {
    id: '4',
    name: 'Jordan Smith',
    property: 'Maple Heights',
    unit: 'Unit 105',
    status: 'Paid',
    avatarUrl: 'https://i.pravatar.cc/150?u=jordan',
    phone: '+1234567893'
  }
];

export default function AgentClients() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = mockClients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    client.property.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-4 py-4 mb-24 max-w-md mx-auto h-full bg-white">
      {/* Header */}
      <div className="mb-6 mt-2 text-center">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Clients</h1>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 stroke-2" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 border-none rounded-xl bg-[#f8f6fb] text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#7f13ec] focus:outline-none transition-all"
            placeholder="Find clients"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Clients List */}
      <div className="flex flex-col gap-4">
        {filteredClients.map(client => (
          <div 
            key={client.id}
            className="flex items-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm"
          >
            {/* Avatar */}
            <div className="flex-shrink-0 mr-4">
              <img 
                src={client.avatarUrl} 
                alt={client.name} 
                className="w-14 h-14 rounded-full object-cover border-2 border-transparent"
              />
            </div>
            
            {/* Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-bold text-gray-900 mb-0.5 truncate">
                {client.name}
              </h3>
              <p className="text-[13px] text-gray-500 truncate mb-1.5">
                {client.property} - {client.unit}
              </p>
              
              {/* Status Badge */}
              <div>
                {client.status === 'Paid' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#e6f7ef] text-[#059669]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                    Paid
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#fee2e2] text-[#e11d48]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e]"></span>
                    Not Paid
                  </span>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="flex-shrink-0 ml-4">
              <a 
                href={`tel:${client.phone}`}
                className="w-11 h-11 flex items-center justify-center rounded-full bg-[#7f13ec] shadow-md shadow-[#7f13ec]/20 hover:bg-[#6c0fca] transition active:scale-95"
              >
                <Phone className="h-5 w-5 text-white" fill="white" />
              </a>
            </div>
          </div>
        ))}

        {filteredClients.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">No clients found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
