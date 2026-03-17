import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Route7() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTime(t => (t + 1) % 90), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#00ff88] text-black font-mono overflow-hidden flex flex-col items-center justify-center p-4">
      
      {/* Stadium Floodlights Effect */}
      <div className="fixed top-0 left-1/4 w-[1px] h-screen bg-white/20 shadow-[0_0_100px_50px_rgba(255,255,255,0.3)] rotate-12 blur-md z-0" />
      <div className="fixed top-0 right-1/4 w-[1px] h-screen bg-white/20 shadow-[0_0_100px_50px_rgba(255,255,255,0.3)] -rotate-12 blur-md z-0" />

      {/* Scoreboard Matrix */}
      <div className="fixed inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMwMGZmODgiIC8+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiMwMDAiIG9wYWNpdHk9IjAuMSIgLz48L3N2Zz4=')] opacity-50 mix-blend-multiply" />

      <motion.div 
        initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="relative z-10 w-full max-w-5xl bg-black border-4 border-black p-2 shadow-[20px_20px_0_0_rgba(0,0,0,1)]"
      >
        <div className="border border-[#333] p-8 md:p-16 flex flex-col md:flex-row gap-12 text-[#00ff88]">
          
          <div className="w-full md:w-1/2 flex flex-col justify-between">
            <div>
              <div className="text-xl tracking-[0.3em] font-bold mb-4 uppercase">Matchday Access</div>
              <h1 className="text-6xl md:text-8xl font-black uppercase leading-none tracking-tighter" style={{ fontFamily: '"Impact", sans-serif' }}>
                Vysion <br/> Live
              </h1>
            </div>
            
            <div className="mt-12 flex items-center gap-6">
              <div className="text-8xl font-black bg-[#00ff88] text-black px-4 rounded-sm italic">
                {time.toString().padStart(2, '0')}<span className="animate-pulse">'</span>
              </div>
              <div className="flex flex-col text-sm tracking-widest font-bold">
                <span>SCOUTING</span>
                <span>IN PROGRESS</span>
                <span>DATABANKS : SYNCED</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex items-center justify-center border-l-2 border-[#333] pl-0 md:pl-12">
            <form className="w-full max-w-sm space-y-6" onSubmit={e => e.preventDefault()}>
              <div className="text-xs tracking-widest mb-8 border-b border-[#00ff88]/30 pb-2">ENTER SCOUT CREDENTIALS</div>
              
              <div className="relative group">
                <input type="text" className="w-full bg-transparent border-b-4 border-[#333] text-[#00ff88] text-2xl py-2 focus:outline-none focus:border-[#00ff88] uppercase transition-colors" placeholder="MAIL //" />
              </div>
              
              <div className="relative group">
                <input type="password" className="w-full bg-transparent border-b-4 border-[#333] text-[#00ff88] text-2xl py-2 focus:outline-none focus:border-[#00ff88] uppercase transition-colors tracking-widest" placeholder="KEY //" />
              </div>

              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="w-full bg-[#00ff88] text-black font-black text-3xl py-4 mt-8 uppercase tracking-widest shadow-[0_0_30px_rgba(0,255,136,0.3)] hover:shadow-[0_0_50px_rgba(0,255,136,0.6)] transition-all"
              >
                KICK OFF
              </motion.button>
            </form>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
