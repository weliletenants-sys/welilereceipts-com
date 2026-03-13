import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AgentHeader from './components/AgentHeader';
import CommissionWalletCard from './components/CommissionWalletCard';
import RecruitmentProgressCard from './components/RecruitmentProgressCard';
import AgentToolsGrid from './components/AgentToolsGrid';
import AgentBottomNav from './components/AgentBottomNav';
import VisitPaymentWizard from './components/VisitPaymentWizard';
import AgentDepositDialog from './components/dialogs/AgentDepositDialog';
import AgentWithdrawalDialog from './components/dialogs/AgentWithdrawalDialog';
import AgentTopUpTenantDialog from './components/dialogs/AgentTopUpTenantDialog';
import AgentRegisterUserDialog from './components/dialogs/AgentRegisterUserDialog';
import { useOfflineAgentDashboard } from '../hooks/useOfflineAgentDashboard';
import { ShieldAlert, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AgentDashboard() {
  const navigate = useNavigate();
  const { isOnline } = useOfflineAgentDashboard();
  const { user } = useAuth();
  
  // Dialog States
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  
  // MOCK KYC STATUS: 'NONE' | 'UNDER_REVIEW' | 'APPROVED'
  const [kycStatus] = useState<'NONE' | 'UNDER_REVIEW' | 'APPROVED'>('NONE');
  
  return (
    <div className="bg-[#f7f6f8] min-h-screen flex flex-col font-sans text-gray-900 pb-24">
      
      {/* 1. Header */}
      <AgentHeader 
        user={{
          fullName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Agent Name',
          role: 'AGENT',
          avatarUrl: ''
        }}
        onAvatarClick={() => navigate('/settings')}
        onNotificationClick={() => console.log('Notifications clicked')}
      />

      <main className="flex-1">
        {/* Offline Alert */}
        {!isOnline && (
          <div className="mx-4 mt-4 bg-amber-50 text-amber-800 text-xs py-2 px-4 text-center font-medium rounded-xl border border-amber-200 shadow-sm animate-pulse">
            You are currently offline. Field operations may be restricted.
          </div>
        )}

        {/* KYC Banner Alerts */}
        {kycStatus === 'NONE' && (
          <div 
            onClick={() => navigate('/agent-kyc')}
            className="mx-4 mt-4 bg-blue-50 text-blue-800 text-sm py-3 px-4 rounded-xl text-center font-medium border border-blue-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer hover:bg-blue-100 transition"
          >
            <ShieldAlert size={16} /> Tap to complete KYC verification to unlock withdraws.
          </div>
        )}
        {kycStatus === 'UNDER_REVIEW' && (
          <div className="mx-4 mt-4 bg-amber-50 text-amber-800 text-sm py-3 px-4 rounded-xl text-center font-medium border border-amber-200 shadow-sm flex items-center justify-center gap-2">
            <Clock size={16} /> KYC under review. Expected time: 24h.
          </div>
        )}

        {/* 2. Wallet Banner */}
        <CommissionWalletCard 
          balance={12000} 
          onDeposit={() => setIsDepositOpen(true)}
          onWithdraw={() => {
            if (kycStatus === 'APPROVED') {
               setIsWithdrawalOpen(true);
            } else {
               alert('You must complete KYC verification before withdrawing commissions.');
               navigate('/agent-kyc');
            }
          }}
          onTransfer={() => setIsTopUpOpen(true)}
        />

        {/* 3. Recruitment Progress */}
        <RecruitmentProgressCard 
          totalClients={128}
          pendingPayments={36}
          conversionRate={64}
        />

        {/* 4. Agent Tools */}
        <AgentToolsGrid 
          onNewClientClick={() => setIsRegisterOpen(true)}
        />
      </main>

      {/* 5. Bottom Navigation */}
      <AgentBottomNav />

      {/* Feature Modals & Dialogs */}
      <AgentDepositDialog isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} />
      <AgentWithdrawalDialog isOpen={isWithdrawalOpen} onClose={() => setIsWithdrawalOpen(false)} availableBalance={12000} />
      <AgentTopUpTenantDialog isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} />
      <AgentRegisterUserDialog isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
      <VisitPaymentWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />

      {/* Existing Proxy Invest Modal Placeholder */}
      {isInvestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4">
           <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
             <h3 className="font-bold text-lg mb-2">Invest for Partner</h3>
             <p className="text-sm text-gray-500 mb-4">You are acting on behalf of a partner to invest into the Rent Pool.</p>
             <button onClick={() => setIsInvestModalOpen(false)} className="bg-gray-200 w-full py-2 rounded-lg font-bold">Close</button>
           </div>
        </div>
      )}
    </div>
  );
}
