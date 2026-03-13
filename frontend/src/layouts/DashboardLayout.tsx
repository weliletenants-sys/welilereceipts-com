import type { ReactNode } from 'react';
import SharedHeader from '../components/layout/SharedHeader';
import BottomNavigation from '../components/layout/BottomNavigation';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string; // Optional title override
  hideHeader?: boolean; // Hides the universal SharedHeader
  customBottomNav?: ReactNode; // Replaces the universal BottomNavigation
  fullWidth?: boolean; // Removes the horizontal padding from the main scroll container
}

export default function DashboardLayout({ children, title, hideHeader, customBottomNav, fullWidth }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#8155FF] sm:p-4 flex justify-center items-center relative overflow-hidden">
      {/* Decorative background lines/curves */}
      <div className="absolute inset-0 opacity-20 pointer-events-none flex justify-center items-center">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="w-[150vw] h-[150vh]">
           <path d="M0,500 Q250,300 500,500 T1000,500" stroke="white" strokeWidth="2" fill="none"/>
           <path d="M0,700 Q250,500 500,700 T1000,700" stroke="white" strokeWidth="2" fill="none"/>
           <circle cx="200" cy="800" r="10" fill="white" />
           <circle cx="800" cy="200" r="10" fill="white" />
        </svg>
      </div>

      {/* Mobile Frame Wrapper */}
      <div className="w-full min-h-screen bg-[#F8F9FA] relative flex flex-col shadow-2xl overflow-hidden z-10">

        {/* Universal Top Header */}
        {!hideHeader && (
          <header className="px-6 pt-12 pb-2 bg-transparent z-10 shrink-0">
            <SharedHeader title={title} />
          </header>
        )}

        {/* Main Content Area (Scrollable) */}
        <main className={`flex-1 overflow-y-auto pb-28 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] z-10 ${fullWidth ? '' : 'px-6'} ${hideHeader ? 'pt-8 sm:pt-10' : ''}`}>
          {children}
        </main>

        {/* Bottom Navigation */}
        {customBottomNav ? customBottomNav : <BottomNavigation />}
      </div>
    </div>
  );
}
