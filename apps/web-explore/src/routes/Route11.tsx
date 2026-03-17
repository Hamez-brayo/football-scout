import { motion } from 'framer-motion';
import { PenTool } from 'lucide-react';

export default function Route11() {
  return (
    <div className="min-h-screen bg-[#001D4A] text-[#E5F4FF] font-mono selection:bg-[#0088FF] overflow-hidden" style={{ backgroundImage: 'linear-gradient(rgba(0,136,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,136,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      
      {/* Blueprint Grid & Rulers */}
      <div className="absolute top-0 left-0 w-full h-8 border-b border-[#0088FF]/30 flex hidden md:flex">
         {[...Array(30)].map((_, i) => <div key={i} className="flex-1 border-r border-[#0088FF]/20 text-[6px] pl-1 pt-1 text-[#0088FF]/50">{i * 10}</div>)}
      </div>
      <div className="absolute top-0 left-0 w-8 h-full border-r border-[#0088FF]/30 hidden md:flex flex-col">
         {[...Array(20)].map((_, i) => <div key={i} className="flex-1 border-b border-[#0088FF]/20 text-[6px] text-[#0088FF]/50 pt-1 text-center">{i * 10}</div>)}
      </div>

      <div className="ml-0 md:ml-8 mt-0 md:mt-8 p-8 max-w-7xl mx-auto min-h-[calc(100vh-2rem)] flex flex-col justify-center relative">
        <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} className="absolute right-0 top-0 opacity-10">
          <svg width="400" height="400" viewBox="0 0 100 100" className="stroke-[#0088FF]">
             <path d="M50 10 L90 50 L50 90 L10 50 Z" fill="none" strokeWidth="0.5"/>
             <circle cx="50" cy="50" r="25" fill="none" strokeWidth="0.5" strokeDasharray="2 2" />
          </svg>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10 items-center">
          
          <div>
            <div className="flex items-center gap-3 text-[#0088FF] mb-6">
              <PenTool size={24} />
              <span className="uppercase tracking-[0.3em] font-bold text-sm">Draft Blueprint // Phase 1</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight text-[#E5F4FF] mb-8 leading-tight">
              Architecting <br/> The Perfect <br/> <span className="text-[#0088FF] border-b-2 border-dashed border-[#0088FF]">Squad.</span>
            </h1>
            
            <p className="text-xl font-light text-[#A8D1FF] max-w-md">
              Construct your team with mathematical precision. Blueprint your scouting vision.
            </p>
          </div>

          <div className="bg-[#002766]/50 backdrop-blur-md border-2 border-[#0088FF] p-8 md:p-12 relative shadow-[0_0_50px_rgba(0,136,255,0.15)]">
            {/* Trim */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-[#fff]" />
            <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-[#fff]" />
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-[#fff]" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-[#fff]" />
            <div className="absolute top-4 right-8 border border-[#0088FF] px-2 py-1 text-[8px] text-[#0088FF] uppercase">Not For Public Dist.</div>

            <h2 className="text-xl uppercase tracking-widest text-[#E5F4FF] mb-8 pb-4 border-b border-[#0088FF]/30">Scout Network Connect</h2>

            <form className="space-y-6" onSubmit={e=>e.preventDefault()}>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#0088FF] mb-2 font-bold">Node Identification</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-[#0088FF]">&gt;_</span>
                  <input type="text" className="w-full bg-[#001D4A] border border-[#0088FF] py-3 pl-10 pr-4 focus:outline-none focus:shadow-[0_0_15px_rgba(0,136,255,0.5)] transition-all text-[#E5F4FF] placeholder:text-[#0088FF]/50" placeholder="admin@vysion.io"/>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[#0088FF] mb-2 font-bold">Encrypted Token</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-[#0088FF]">&gt;_</span>
                  <input type="password" className="w-full bg-[#001D4A] border border-[#0088FF] py-3 pl-10 pr-4 focus:outline-none focus:shadow-[0_0_15px_rgba(0,136,255,0.5)] transition-all text-[#E5F4FF] tracking-[0.3em] placeholder:text-[#0088FF]/50" placeholder="••••••••"/>
                </div>
              </div>

              <button className="w-full bg-[#0088FF] text-[#001D4A] font-black uppercase tracking-widest py-4 mt-8 hover:bg-[#E5F4FF] transition-colors border border-transparent hover:border-[#0088FF]">
                Execute Build
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
