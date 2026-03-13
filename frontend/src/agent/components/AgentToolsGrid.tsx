import { UserPlus, ReceiptText, LineChart, HelpCircle } from 'lucide-react';

interface ToolItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function ToolItem({ icon, label, onClick }: ToolItemProps) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-[#7f13ec]/5 shadow-sm hover:border-[#7f13ec]/30 transition-all group active:scale-95 w-full"
    >
      <div className="w-12 h-12 bg-[#7f13ec]/10 rounded-full flex items-center justify-center text-[#7f13ec] mb-3 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-sm font-semibold text-gray-900">{label}</span>
    </button>
  );
}

interface AgentToolsGridProps {
  onNewClientClick?: () => void;
}

export default function AgentToolsGrid({ onNewClientClick }: AgentToolsGridProps) {
  return (
    <section className="px-4 py-6">
      <h3 className="text-lg font-bold mb-4 px-1 text-gray-900">Agent Tools</h3>
      <div className="grid grid-cols-2 gap-4">
        
        <ToolItem 
          icon={<UserPlus size={24} strokeWidth={2} />} 
          label="New Client" 
          onClick={onNewClientClick || (() => console.log('New Client Clicked'))}
        />
        
        <ToolItem 
          icon={<ReceiptText size={24} strokeWidth={2} />} 
          label="Invoices" 
          onClick={() => console.log('Invoices Clicked')}
        />
        
        <ToolItem 
          icon={<LineChart size={24} strokeWidth={2} />} 
          label="Reports" 
          onClick={() => console.log('Reports Clicked')}
        />
        
        <ToolItem 
          icon={<HelpCircle size={24} strokeWidth={2} />} 
          label="Support" 
          onClick={() => console.log('Support Clicked')}
        />
        
      </div>
    </section>
  );
}
