import { motion } from 'framer-motion';
import { Flag } from 'lucide-react';

export default function Route21() {
  return (
    <div className="min-h-screen bg-[#E5F5E0] text-[#1A4314] font-sans overflow-hidden">
      
      {/* Massive waving flag aesthetic using pure CSS/SVG */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 origin-left scale-110 blur-sm">
        <svg viewBox="0 0 100 100" className="w-[150vw] h-full" preserveAspectRatio="none">
          <path d="M0 0 Q 25 50 50 0 T 100 0 L 100 100 L 0 100 Z" fill="#2E7D32">
            <animate attributeName="d" dur="5s" repeatCount="indefinite" values="
              M0 0 Q 25 20 50 0 T 100 0 L 100 100 L 0 100 Z;
              M0 0 Q 35 30 60 -10 T 100 -5 L 100 100 L 0 100 Z;
              M0 0 Q 25 20 50 0 T 100 0 L 100 100 L 0 100 Z
            "/>
          </path>
        </svg>
      </div>

      <div className="absolute inset-0 bg-[#E5F5E0] bg-opacity-[0.85] z-10" />

      <main className="relative z-20 w-full min-h-screen flex flex-col md:flex-row">
        
        <div className="w-full md:w-1/2 p-12 lg:p-24 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-8 text-[#2E7D32]">
            <Flag size={32} />
            <span className="font-bold tracking-widest uppercase border-b-2 border-[#2E7D32] pb-1">Vysion Sub-Culture</span>
          </div>

          <h1 className="text-6xl lg:text-8xl font-black uppercase italic tracking-tighter leading-none mb-6 text-[#1A4314]">
             Bleacher <br/> Access.
          </h1>
          <p className="text-2xl font-bold bg-[#1A4314] text-[#E5F5E0] w-max px-4 py-1 -rotate-2 mb-8 shadow-lg">
             For the real obsessives.
          </p>
          <p className="text-xl max-w-sm leading-relaxed text-[#2E7D32]">
             We hear the noise, but we trust the data. Connect your scout profile to access the terrace-level analytics.
          </p>
        </div>

        <div className="w-full md:w-1/2 bg-[#1A4314] p-12 lg:p-24 flex items-center justify-center relative overflow-hidden">
           
           {/* Paint splatter / smoke flare effect */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-[#2E7D32] rounded-full filter blur-[100px] opacity-50" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E5F5E0] rounded-full filter blur-[120px] opacity-20" />

           <motion.div 
             initial={{ rotate: -2, y: 50 }} animate={{ rotate: 0, y: 0 }}
             className="w-full max-w-md bg-[#E5F5E0] p-10 shadow-2xl relative block"
           >
              {/* Ticket stub jagged edge top */}
              <div className="absolute -top-3 inset-x-0 h-6 bg-[url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 20 20\\'><circle cx=\\'10\\' cy=\\'10\\' r=\\'10\\' fill=\\'%231A4314\\'/></svg>')] bg-[length:20px_20px]" />

              <h2 className="text-3xl font-black uppercase text-center mb-10 tracking-tighter border-b-4 border-[#1A4314] pb-4">Season Ticket</h2>

              <form className="space-y-6" onSubmit={e=>e.preventDefault()}>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#2E7D32] mb-1">Fan/Scout Register</label>
                  <input type="text" className="w-full bg-white border-2 border-[#1A4314] p-4 text-xl font-bold focus:outline-none focus:ring-4 focus:ring-[#2E7D32]/30 transition-shadow" placeholder="ID. Number" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#2E7D32] mb-1">Gate Passcode</label>
                  <input type="password" className="w-full bg-white border-2 border-[#1A4314] p-4 text-xl font-bold focus:outline-none focus:ring-4 focus:ring-[#2E7D32]/30 transition-shadow" placeholder="••••••••" />
                </div>

                <button className="w-full bg-[#1A4314] text-[#E5F5E0] font-black uppercase py-5 text-xl tracking-wider hover:bg-[#2E7D32] transition-colors shadow-[0_10px_0_0_#0F2A0B] active:translate-y-[10px] active:shadow-none mt-4">
                   Enter Turnstile
                </button>
              </form>
           </motion.div>
        </div>

      </main>
    </div>
  );
}
