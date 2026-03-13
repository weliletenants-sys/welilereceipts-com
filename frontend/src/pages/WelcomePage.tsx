import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PROFILE_IMAGES = [
  'https://i.pravatar.cc/150?img=11',
  'https://i.pravatar.cc/150?img=12',
  'https://i.pravatar.cc/150?img=13',
  'https://i.pravatar.cc/150?img=14',
  'https://i.pravatar.cc/150?img=15',
  'https://i.pravatar.cc/150?img=16',
  'https://i.pravatar.cc/150?img=31',
  'https://i.pravatar.cc/150?img=32',
  'https://i.pravatar.cc/150?img=33',
];

interface FloatingProfile {
  id: number;
  image: string;
  startX: number;
  startY: number;
}

export default function WelcomePage() {
  const navigate = useNavigate();
  const [poolAmount, setPoolAmount] = useState(32766811);
  const [floatingProfiles, setFloatingProfiles] = useState<FloatingProfile[]>([]);
  const [idCounter, setIdCounter] = useState(0);
  const [isHit, setIsHit] = useState(false);

  useEffect(() => {
    // Generate profiles less frequently since they move slower now
    const interval = setInterval(() => {
      setFloatingProfiles(prev => {
        // Keep a max of 15 on screen to avoid performance issues
        if (prev.length > 15) return prev;
        
        // Spawn from a random angle (0 to 2*PI) around the center
        const angle = Math.random() * Math.PI * 2;
        // Distance slightly outside the visible area (radius approx 300px)
        const distance = 300 + Math.random() * 50;
        
        const startX = Math.cos(angle) * distance;
        const startY = Math.sin(angle) * distance;
        
        return [...prev, {
          id: idCounter,
          image: PROFILE_IMAGES[Math.floor(Math.random() * PROFILE_IMAGES.length)],
          startX,
          startY,
        }];
      });
      setIdCounter(prev => prev + 1);
    }, 1200); // Slower spawn rate for a calmer effect

    return () => clearInterval(interval);
  }, [idCounter]);

  const handleProfileHit = (id: number) => {
    setFloatingProfiles(prev => prev.filter(p => p.id !== id));
    
    // Add realistic rent amounts (e.g. 10k to 100k UGX) to the big pool
    const amountAdded = Math.floor(Math.random() * 90000) + 10000;
    setPoolAmount(prev => prev + amountAdded);
    
    // Trigger the big circle "bump" animation
    setIsHit(true);
    setTimeout(() => setIsHit(false), 150);
  };

  return (
    <div className="min-h-screen bg-[#351A82] sm:p-4 flex justify-center items-center relative overflow-hidden text-white font-sans">
      <div className="w-full min-h-screen bg-[#351A82] relative flex flex-col overflow-hidden z-10">

        <div className="flex-1 flex flex-col px-6 pt-16 pb-10 relative z-20 h-full">
          
          <div className="text-center z-30 mb-8 mt-4 animate-fade-in relative">
            <h1 className="text-[34px] font-black mb-3 text-white tracking-tight drop-shadow-md">Welcome to Welile</h1>
            <p className="text-white/90 text-[15px] font-medium max-w-[280px] mx-auto leading-relaxed drop-shadow">
              Join over 25 Million tenants securing housing seamlessly everyday.
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center relative w-full mt-4">
            
            {/* The Big Pool Circle - Made smaller: 220px instead of 280px */}
            <motion.div 
              className="w-[220px] h-[220px] rounded-full bg-gradient-to-b from-[#8155E8] to-[#673AB7] shadow-[0_0_60px_rgba(129,85,232,0.6)] flex flex-col items-center justify-center border-[4px] border-[#9273F6]/50 z-30 overflow-hidden relative"
              animate={isHit ? { scale: 1.08 } : { scale: 1, y: [0, -8, 0] }}
              transition={
                isHit 
                ? { type: "spring", stiffness: 400, damping: 12 } 
                : { repeat: Infinity, duration: 5, ease: "easeInOut" }
              }
            >
              {/* Inner glow effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-full pointer-events-none"></div>

              <p className="text-white/95 font-bold uppercase tracking-[0.1em] text-[10px] mb-1 z-10">Total Tenant Pool</p>
              <div className="relative z-10 w-full px-2">
                 <motion.span 
                    key={poolAmount} // re-animate when amount changes
                    initial={{ scale: 1.15, color: "#fff" }}
                    animate={{ scale: 1, color: "#fff" }}
                    className="text-[28px] font-black text-white block text-center tracking-tighter"
                 >
                   <span className="text-[14px] font-semibold mr-1 align-top relative top-[4px]">UGX</span>
                   {poolAmount.toLocaleString()}
                 </motion.span>
              </div>
            </motion.div>

            {/* Floating Profiles Area */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl z-20">
              <AnimatePresence>
                {floatingProfiles.map(profile => (
                  <motion.div
                    key={profile.id}
                    initial={{ 
                      opacity: 0, 
                      y: profile.startY, 
                      x: profile.startX, 
                      scale: 0.2 // Start smaller
                    }}
                    animate={{ 
                      opacity: [0, 1, 1, 0], 
                      y: 0,     // Move towards center (0,0)
                      x: 0,     // Move towards center (0,0)
                      scale: [0.2, 0.8, 0.4] // Smaller peak size
                    }}
                    transition={{ 
                      duration: 4.5, // Much slower animation (was 2.2s)
                      ease: "easeInOut" 
                    }}
                    onAnimationComplete={() => handleProfileHit(profile.id)}
                    // Smaller profile pictures: 38px instead of 52px
                    className="absolute top-1/2 left-1/2 w-[38px] h-[38px] rounded-full border-[2px] border-white/90 overflow-hidden shadow-xl"
                    style={{ marginLeft: '-19px', marginTop: '-19px' }}
                  >
                    <img src={profile.image} alt="user profile" className="w-full h-full object-cover" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="z-30 mt-auto pt-8">
            <button 
              onClick={() => navigate('/signup')} 
              className="w-full bg-white text-[#512DA8] py-[18px] rounded-full font-black text-[17px] shadow-2xl flex items-center justify-center gap-2 transition active:scale-[0.98] hover:bg-slate-50 border border-white"
            >
              Request Rent <ArrowRight size={22} strokeWidth={2.5} className="ml-1" />
            </button>
          </div>

        </div>

        {/* Background decorative elements */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          <div className="absolute top-[-10%] left-[-20%] w-[400px] h-[400px] bg-[#8155E8] rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-20%] w-[400px] h-[400px] bg-[#673AB7] rounded-full blur-[100px]"></div>
        </div>
      </div>
    </div>
  );
}
