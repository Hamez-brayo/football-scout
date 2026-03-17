import { motion } from 'framer-motion';

export default function Route15() {
  return (
    <div className="min-h-screen bg-[#1F242A] text-[#D8D4C7] font-serif overflow-hidden relative selection:bg-[#8B2635] selection:text-white flex items-center justify-center">
      
      {/* Heavy textured background feeling like wood and leather */}
      <div className="absolute inset-0 opacity-10 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/leather-black.png')] z-0" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#2C323A]/80 to-[#0A0D11]/90 z-0" />

      {/* Elegant framing */}
      <div className="absolute inset-6 border border-[#D8D4C7]/20 z-0 pointer-events-none flex" />
      <div className="absolute inset-8 border border-[#D8D4C7]/10 z-0 pointer-events-none" />

      <main className="relative z-10 w-full max-w-5xl px-8 flex flex-col md:flex-row gap-16 md:gap-24 items-center">
        
        <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left">
          <div className="w-12 h-12 rounded-full border border-[#D8D4C7]/30 flex items-center justify-center mx-auto md:mx-0 mb-8 overflow-hidden bg-[#15191D]">
            <span className="text-[#D8D4C7] font-mono text-xs font-bold tracking-widest">VYS</span>
          </div>

          <p className="tracking-[0.3em] text-[#D8D4C7]/50 uppercase text-xs mb-4 font-sans font-semibold">The Gaffer's Desk</p>
          <h1 className="text-5xl md:text-7xl font-light italic text-[#D8D4C7] tracking-tight mb-8" style={{ fontFamily: '"Playfair Display", serif' }}>
            Absolute <br/> Authority.
          </h1>
          
          <div className="w-16 h-[1px] bg-[#8B2635] mx-auto md:mx-0 mb-6" />

          <p className="text-[#D8D4C7]/70 font-sans font-light leading-relaxed max-w-sm mx-auto md:mx-0">
            Strategic recruitment starts at the top. Secure login for sporting directors, head coaches, and executive management.
          </p>
        </div>

        <div className="w-full md:w-1/2 relative flex justify-center">
          
          {/* Faux leather/wood desk blotter aesthetic */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
            className="w-full max-w-md bg-[#15191D] border border-[#2A3038] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] p-12 relative"
          >
            {/* Corner brass tacks styling */}
            <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-gradient-to-br from-[#B38D4F] to-[#594627] shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)]" />
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-br from-[#B38D4F] to-[#594627] shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)]" />
            <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-gradient-to-br from-[#B38D4F] to-[#594627] shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)]" />
            <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-gradient-to-br from-[#B38D4F] to-[#594627] shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)]" />

            <h2 className="text-xl font-sans uppercase tracking-[0.2em] font-semibold mb-10 text-center border-b border-[#2A3038] pb-4">Unlock Ledger</h2>

            <form className="space-y-8 font-sans" onSubmit={e=>e.preventDefault()}>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#D8D4C7]/50 mb-2">Executive Alias</label>
                <input type="text" className="w-full bg-[#0F1215] border border-[#2A3038] px-4 py-3 text-[#D8D4C7] focus:outline-none focus:border-[#B38D4F] font-serif transition-colors" defaultValue="Director" />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#D8D4C7]/50 mb-2">Private Key</label>
                <input type="password" className="w-full bg-[#0F1215] border border-[#2A3038] px-4 py-3 text-[#D8D4C7] focus:outline-none focus:border-[#B38D4F] font-serif tracking-[0.3em] transition-colors" defaultValue="password" />
              </div>

              <div className="pt-4">
                <button className="w-full bg-[#8B2635] text-[#D8D4C7] font-semibold uppercase tracking-[0.2em] py-4 text-xs hover:bg-[#681C28] transition-colors shadow-[0_4px_15px_rgba(139,38,53,0.3)]">
                  Enter Office
                </button>
              </div>
            </form>
          </motion.div>

        </div>

      </main>
    </div>
  );
}
