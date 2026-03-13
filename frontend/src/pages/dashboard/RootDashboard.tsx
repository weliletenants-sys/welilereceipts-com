import { useAuth } from '../../contexts/AuthContext';

import TenantDashboard from '../../tenant/TenantDashboard';
import AgentDashboard from '../../agent/AgentDashboard';
import LandlordDashboard from '../../owner/LandlordDashboard';
import FunderDashboard from '../../funder/FunderDashboard';

export default function RootDashboard() {
  const { role } = useAuth();

  const renderDashboardContent = () => {
    switch (role) {
      case 'TENANT':
        return <TenantDashboard />;
      case 'AGENT':
        return <AgentDashboard />;
      case 'LANDLORD':
        return <LandlordDashboard />;
      case 'FUNDER':
        return <FunderDashboard />;
      default:
        return (
          <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="p-6 text-center">
              <h2 className="text-xl text-gray-800 font-semibold mb-2">Welcome to Welile</h2>
              <p className="text-sm text-gray-500">Please log in to continue.</p>
            </div>
          </div>
        );
    }
  };

  return <>{renderDashboardContent()}</>;
}
