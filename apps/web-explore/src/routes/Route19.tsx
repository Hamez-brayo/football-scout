import { useState } from 'react';
import { motion } from 'framer-motion';
import { Maximize, Minimize, AlertCircle } from 'lucide-react';

export default function Route19() {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <div className={`min-h-screen bg-[#050505] text-[#00E5FF] font-mono selection:bg-[#00E5FF] selection:text-black p-4 md:p-8 flex items-center justify-center transition-all ${fullscreen ? 'p-0' : ''}`}>
      
      <div className={`w-full max-w-[1400px] border border-[#00E5FF]/30 grid grid-cols-1 md:grid-cols-12 relative overflow-hidden transition-all duration-500 ${fullscreen ? 'h-screen max-w-full border-none' : 'min-h-[80vh]'}`}>
         
         {/* Grid lines and tech elements */}
         <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(0,229,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.2)_1px,transparent_1px)] bg-[length:2rem_2rem]" />
         
         <div className="absolute top-4 right-4 flex gap-4 text-[#00E5FF]/50 z-20 cursor-pointer hover:text-[#00E5FF] transition-colors" onClick={() => setFullscreen(!fullscreen)}>
           {fullscreen ? <Minimize size={20}/> : <Maximize size={20}/>}
         </div>

         {/* Left Side: Video Analysis simulation */}
         <div className="md:col-span-7 lg:col-span-8 border-b md:border-b-0 md:border-r border-[#00E5FF]/30 p-8 relative flex flex-col justify-center">
            
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="px-2 py-0.5 border border-red-500 text-red-500 text-[10px] uppercase font-bold animate-pulse">REC</div>
              <div className="px-2 py-0.5 border border-[#00E5FF] text-[#00E5FF] text-[10px] uppercase font-bold">VAR_RM_09</div>
            </div>

            <div className="relative w-full aspect-video border border-[#00E5FF]/20 mt-8 mb-4 flex items-center justify-center overflow-hidden group">
               <img src="https://images.unsplash.com/photo-1518605368461-1ee0c76ce733?q=80&w=1200&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover filter brightness-50 contrast-125 grayscale group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000" alt="Pitch Action" />
               <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none">
                 <rect x="30" y="20" width="40" height="60" fill="none" stroke="#00E5FF" strokeWidth="0.5" strokeDasharray="2 2" />
                 <line x1="10" y1="50" x2="90" y2="50" stroke="#00E5FF" strokeWidth="0.2" />
                 <line x1="50" y1="10" x2="50" y2="90" stroke="#00E5FF" strokeWidth="0.2" />
               </svg>
            </div>

            <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter shadow-sm mb-2">Video Assistant Recruitment</h1>
            <p className="text-xs text-[#00E5FF]/50 max-w-md">No angles missed. Review prospect footage frame by frame with advanced ML overlay integration.</p>
         </div>

         {/* Right Side: Login / Command Panel */}
         <div className="md:col-span-5 lg:col-span-4 bg-[#0A0D11] p-8 flex flex-col justify-center relative">
            
            <div className="flex items-center gap-2 text-xs font-bold uppercase mb-12 border-b border-[#00E5FF]/20 pb-4">
               <AlertCircle size={16} className="text-[#00E5FF]" />
               <span>Official Review Request</span>
            </div>

            <form className="space-y-6" onSubmit={e=>e.preventDefault()}>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#00E5FF]/50 mb-1 block">Operative ID</label>
                <input type="text" className="w-full bg-[#050505] border border-[#00E5FF]/20 p-3 text-sm focus:outline-none focus:border-[#00E5FF] transition-colors" placeholder="XXX-000-XX" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#00E5FF]/50 mb-1 block">Secure Pin</label>
                <div className="flex gap-2">
                  {[...Array(4)].map((_, i) => (
                    <input key={i} type="password" maxLength={1} className="w-full bg-[#050505] border border-[#00E5FF]/20 p-3 text-center text-xl focus:outline-none focus:border-[#00E5FF] transition-colors" />
                  ))}
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full bg-[#00E5FF] text-black font-bold uppercase tracking-widest py-4 mt-8 text-xs flex justify-between items-center px-6"
              >
                <span>Initiate Review</span>
                <span>▶</span>
              </motion.button>
            </form>

            <div className="absolute bottom-4 left-0 w-full flex justify-center gap-1 opacity-50">
               {[...Array(10)].map((_, i) => <div key={i} className="w-4 h-1 bg-[#00E5FF]" style={{ opacity: Math.random() }} />)}
            </div>

         </div>

      </div>

    </div>
  );
}
