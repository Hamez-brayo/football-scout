import { useEffect, useState } from 'react';
import { Terminal, Database, ShieldAlert, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Route2() {
  const [text, setText] = useState('');
  const fullText = "INITIALIZING VYSION_CORE OVERRIDE... \n> LOCATING HIGH-POTENTIAL TARGETS... \n> ACCESSING CLUB MAINFRAME...";
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.substring(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050510] text-[#00ffcc] font-mono p-4 md:p-8 relative overflow-hidden" style={{ fontFamily: '"Fira Code", monospace' }}>
      
      {/* CRT Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-40 mix-blend-overlay"></div>

      <div className="absolute top-0 inset-x-0 h-1 bg-[#00ffcc] opacity-50 shadow-[0_0_20px_#00ffcc] animate-pulse"></div>

      <header className="flex justify-between items-center border-b border-[#00ffcc]/30 pb-4 mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <Terminal className="text-[#ff00cf] w-8 h-8" />
          <span className="text-2xl font-bold tracking-widest text-white drop-shadow-[0_0_8px_#ff00cf]">VYSION.OS.v2</span>
        </div>
        <div className="text-xs text-[#00ffcc]/60 flex gap-4">
          <span>SEC: ENCRYPTED</span>
          <span>NODE: 192.168.0.x</span>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 relative z-10 max-w-7xl mx-auto mt-12 md:mt-24">
        
        {/* Left Col - Terminal Output */}
        <div className="flex flex-col gap-6">
          <div className="border border-[#00ffcc]/40 bg-[#00ffcc]/5 p-6 shadow-[inset_0_0_20px_rgba(0,255,204,0.1)] rounded-sm relative backdrop-blur-md">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00ffcc]"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00ffcc]"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#00ffcc]"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00ffcc]"></div>
            
            <p className="whitespace-pre-line h-24 text-sm leading-relaxed text-[#00ffcc]/80">
              {text}
              <span className="animate-pulse inline-block w-2 h-4 bg-[#00ffcc] ml-1 align-middle"></span>
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white uppercase tracking-tight mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              Digital <br/> <span className="text-[#ff00cf]">Scouting</span>
            </h1>
            <p className="max-w-md text-[#00ffcc]/70 text-sm leading-relaxed mt-6">
              Bypass traditional subjective biases. Tap directly into the neuro-analytics matrix to discover 
              undervalued athletic assets globally.
            </p>

            <div className="mt-8 flex gap-4">
              <div className="flex items-center gap-2 text-xs border border-[#ff00cf]/50 px-3 py-1 text-[#ff00cf] bg-[#ff00cf]/10">
                <Database className="w-3 h-3" /> DATABANKS: ONLINE
              </div>
              <div className="flex items-center gap-2 text-xs border border-[#00ffcc]/50 px-3 py-1 text-[#00ffcc] bg-[#00ffcc]/10">
                <Cpu className="w-3 h-3" /> NEURAL NET: STABLE
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Col - Sci-Fi Form */}
        <div className="lg:pl-12">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5, type: "spring" }}
            className="border border-[#00ffcc] bg-black/60 backdrop-blur-md p-8 relative shadow-[0_0_30px_rgba(0,255,204,0.15)] group"
          >
            <div className="absolute -top-3 left-4 bg-[#050510] px-2 text-[#00ffcc] text-xs font-bold tracking-widest flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> AUTHORIZED PERSONNEL ONLY
            </div>

            <form className="mt-6 flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder=" " 
                  defaultValue="sys_admin_scout"
                  className="peer w-full bg-transparent border-b border-[#00ffcc]/50 px-0 py-2 text-[#00ffcc] focus:outline-none focus:border-[#ff00cf] focus:shadow-[0_4px_10px_-4px_rgba(255,0,207,0.5)] transition-all font-mono"
                />
                <label className="absolute left-0 top-2 text-[#00ffcc]/50 text-xs transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#ff00cf] peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-[10px]">
                  IDENTIFICATION SEQUENCE
                </label>
              </div>

              <div className="relative">
                <input 
                  type="password" 
                  placeholder=" " 
                  defaultValue="hunter2"
                  className="peer w-full bg-transparent border-b border-[#00ffcc]/50 px-0 py-2 text-[#00ffcc] focus:outline-none focus:border-[#ff00cf] focus:shadow-[0_4px_10px_-4px_rgba(255,0,207,0.5)] transition-all font-mono tracking-[0.3em]"
                />
                <label className="absolute left-0 top-2 text-[#00ffcc]/50 text-xs transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#ff00cf] peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-[10px]">
                  ENCRYPTION KEY
                </label>
              </div>

              <button className="relative w-full overflow-hidden border border-[#00ffcc] text-[#00ffcc] font-bold tracking-widest py-3 mt-4 group-hover:shadow-[0_0_20px_rgba(0,255,204,0.4)] transition-all duration-300">
                <span className="relative z-10 group-hover:text-black transition-colors duration-300">ESTABLISH UPLINK</span>
                <div className="absolute inset-0 bg-[#00ffcc] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out z-0"></div>
              </button>
            </form>
            
            {/* Decals */}
            <div className="absolute bottom-2 right-2 flex gap-1">
              <div className="w-1 h-3 bg-[#00ffcc]/80"></div>
              <div className="w-1 h-3 bg-[#00ffcc]/50"></div>
              <div className="w-1 h-3 bg-[#00ffcc]/20"></div>
            </div>
          </motion.div>
        </div>
      </main>

    </div>
  );
}
