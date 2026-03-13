import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Distinct notes to pull from the phone
const MONEY_NOTES = [
  { value: 10000, color: 'bg-green-600' },
  { value: 20000, color: 'bg-blue-600' },
  { value: 50000, color: 'bg-yellow-600' },
];

interface FloatingNote {
  id: number;
  value: number;
  color: string;
}

export default function AgentWelcome() {
  const navigate = useNavigate();
  // We keep intendedRole in context if needed, but not strictly used here
  const { } = useAuth();
  
  const [earningsCount, setEarningsCount] = useState(35600000);
  const [floatingNotes, setFloatingNotes] = useState<FloatingNote[]>([]);
  const [idCounter, setIdCounter] = useState(0);

  // Spawner for money notes
  useEffect(() => {
    const interval = setInterval(() => {
      setFloatingNotes(prev => {
        if (prev.length > 8) return prev; // Limit notes on screen
        
        const randomNote = MONEY_NOTES[Math.floor(Math.random() * MONEY_NOTES.length)];
        return [...prev, {
          id: idCounter,
          value: randomNote.value,
          color: randomNote.color
        }];
      });
      setIdCounter(prev => prev + 1);
    }, 1500); // Pull money every 1.5s

    return () => clearInterval(interval);
  }, [idCounter]);

  const handleNoteComplete = (id: number, value: number) => {
    setFloatingNotes(prev => prev.filter(n => n.id !== id));
    setEarningsCount(prev => prev + value);
  };

  return (
    <div className="min-h-screen bg-[#351A82] sm:p-4 flex justify-center items-center relative overflow-hidden text-white font-sans">
      <div className="w-full min-h-screen bg-[#351A82] relative flex flex-col shadow-2xl overflow-hidden z-10">

        <div className="flex-1 flex flex-col px-6 pt-16 pb-10 relative z-20 h-full">
          
          <div className="text-center z-30 mb-6 mt-2 animate-fade-in relative text-white">
            <h1 className="text-[34px] font-black mb-3 tracking-tight drop-shadow-md">Welile Agents</h1>
            <p className="text-white/90 text-[15px] font-medium max-w-[280px] mx-auto leading-relaxed drop-shadow">
              Earn by connecting businesses and people to Welile services.
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center relative w-full mt-2">
            
            {/* The Animated "Phone" Screen */}
            <div className="relative w-[180px] h-[320px] bg-gradient-to-b from-[#8155E8] to-[#4A3AFF] rounded-[32px] border-[6px] border-[#9273F6]/40 shadow-[0_0_50px_rgba(74,58,255,0.5)] flex flex-col items-center justify-end overflow-hidden z-30">
              
              {/* Inner glow and notch for the internal phone */}
              <div className="absolute top-2 w-12 h-1.5 bg-black/20 rounded-full"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>

              {/* Hand Icon Pulling Money */}
              <motion.div 
                className="absolute top-1/2 left-1/2 text-6xl drop-shadow-xl z-40"
                style={{ marginLeft: '-30px', marginTop: '-10px' }}
                animate={{ y: [0, -30, 0], scale: [1, 0.95, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                🖐🏽
              </motion.div>

              {/* Money Flying Out Animation */}
              <AnimatePresence>
                {floatingNotes.map((note) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 80, scale: 0.5, rotate: -10 }}
                    animate={{ opacity: [0, 1, 1, 0], y: -200, scale: 1, rotate: [10, -5, 10] }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    onAnimationComplete={() => handleNoteComplete(note.id, note.value)}
                    className={`absolute bottom-[80px] w-24 h-12 ${note.color} rounded-md shadow-2xl flex items-center justify-center border-2 border-white/20 z-30`}
                  >
                    <div className="w-[85%] h-[75%] border border-white/30 rounded flex items-center justify-center">
                       <span className="text-white font-bold text-xs">{note.value / 1000}k</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Bottom Earnings Display inside the "Phone" */}
              <div className="relative z-40 w-full bg-black/30 backdrop-blur-md pb-5 pt-4 px-2 text-center border-t border-white/10">
                <p className="text-white/80 font-bold uppercase tracking-[0.05em] text-[10px] mb-1">Total Agent Earnings</p>
                <motion.div 
                  key={earningsCount}
                  initial={{ scale: 1.1, color: "#4ADE80" }}
                  animate={{ scale: 1, color: "#ffffff" }}
                  className="font-black text-white text-[22px] tracking-tight"
                >
                  <span className="text-[12px] font-semibold mr-1 align-top relative top-[3px]">UGX</span>
                  {earningsCount.toLocaleString()}
                </motion.div>
              </div>

            </div>
          </div>

          <div className="z-30 mt-auto pt-8 space-y-4">
            <button 
              onClick={() => navigate('/agent-signup')} 
              className="w-full bg-white text-[#512DA8] py-[18px] rounded-full font-black text-[17px] shadow-2xl flex items-center justify-center gap-2 transition active:scale-[0.98] hover:bg-slate-50 border border-white"
            >
              Become an Agent <ArrowRight size={22} strokeWidth={2.5} className="ml-1" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-[#351A82] text-white py-[16px] rounded-full font-bold text-[16px] border border-white/30 transition-all hover:bg-white/10"
            >
              Log In
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
