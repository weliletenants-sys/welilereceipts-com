import { useState } from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import DashboardHeader from './components/DashboardHeader';
import WalletCard from './components/WalletCard';
import RentProgressCard from './components/RentProgressCard';
import RecentActivitiesCard from './components/RecentActivitiesCard';
import TenantBottomNav from './components/TenantBottomNav';
import FullScreenWalletSheet from './components/FullScreenWalletSheet';
import { useAuth } from '../contexts/AuthContext';
import TenantPayments from './TenantPayments';
import TenantProfile from './TenantProfile';

export default function TenantDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const hideHeader = location.pathname.includes('/profile') || location.pathname.includes('/payments');

  // --- MOCK DATA LAYER ---
  const [wallet] = useState({
    balance: 24000
  });

  const [activeRent] = useState({
    amountPaid: 123000,
    totalRent: 185000,
    daysLeft: 8,
    remainingAmount: 65000,
    currentMonth: 'June 2024'
  });

  // --- STATE LAYER ---
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  return (
    <div className="bg-[#f7f6f8] min-h-screen font-sans text-slate-900">
      <div className="w-full bg-white min-h-screen flex flex-col relative">
        
        {/* Header Section */}
        {!hideHeader && (
          <DashboardHeader 
            user={{
              fullName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Alex Johnson',
              role: 'Tenant',
              isVerified: true,
              avatarUrl: ''
            }} 
            onAvatarClick={() => navigate('/settings')} 
            onNotificationClick={() => console.log('Notifications')}
          />
        )}

        <main className="flex-1 pb-24 border-0">
          <Routes>
            <Route path="/" element={
              <div className="p-4 space-y-6">
                {/* Wallet Card */}
                <WalletCard 
                  balance={wallet.balance} 
                  onDeposit={() => setIsWalletOpen(true)}
                  onWithdraw={() => setIsWalletOpen(true)}
                  onTransfer={() => setIsWalletOpen(true)}
                />

                {/* Rent Progress Section */}
                <RentProgressCard 
                  amountPaid={activeRent.amountPaid}
                  totalRent={activeRent.totalRent}
                  daysLeft={activeRent.daysLeft}
                  remainingAmount={activeRent.remainingAmount}
                  currentMonth={activeRent.currentMonth}
                />

                {/* Quick Actions / Recent */}
                <RecentActivitiesCard />
              </div>
            } />
            
            {/* The new Payments Route */}
            <Route path="/payments" element={<TenantPayments />} />
            
            {/* The new Profile Route */}
            <Route path="/profile" element={<TenantProfile />} />
          </Routes>
        </main>

        {/* Bottom Navigation */}
        <TenantBottomNav />
        
        {/* Action Sheets */}
        <FullScreenWalletSheet 
          isOpen={isWalletOpen} 
          onClose={() => setIsWalletOpen(false)} 
          balance={wallet.balance}
        />
      </div>
    </div>
  );
}
