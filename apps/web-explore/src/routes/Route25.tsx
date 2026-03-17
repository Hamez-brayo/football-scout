import { motion } from 'framer-motion';

export default function Route25() {
  return (
    <div className="min-h-screen bg-[#112316] text-[#E0F0E4] font-serif overflow-hidden relative flex flex-col md:flex-row items-center justify-center p-8">
      
      {/* Turf organic textures & grid lines */}
      <div className="absolute inset-0 bg-[#0F2013] opacity-50 bg-[url('https://www.transparenttextures.com/patterns/grass.png')] pointer-events-none mix-blend-overlay z-0" />
      
      <div className="absolute inset-0 z-0 opacity-20 hidden md:block">
        <svg width="100%" height="100%" className="w-full h-full stroke-white">
           <circle cx="50%" cy="50%" r="20%" fill="none" strokeWidth="2" strokeDasharray="10 10"/>
           <line x1="50%" y1="0" x2="50%" y2="100%" strokeWidth="2" strokeDasharray="10 10" />
        </svg>
      </div>

      <motion.div 
        initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left relative z-10 pr-0 md:pr-16"
      >
        <div className="border border-[#7BD389]/30 p-4 rounded-full mb-8 bg-[#112316]/50 backdrop-blur-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="#7BD389" className="w-8 h-8 mx-auto"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20M7 7l10 10M17 7L7 17"/></svg>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6" style={{ fontFamily: '"Playfair Display", serif' }}>
          Rooted in <br/> <span className="italic font-light text-[#7BD389]">Performance.</span>
        </h1>
        <p className="max-w-md text-[#A8C9B0] font-sans font-light leading-relaxed mb-8">
          Step onto the pitch. Ground your scouting process in organic metrics and grounded statistics. Access the field notes.
        </p>

        <div className="h-[1px] w-1/2 bg-gradient-to-r from-[#7BD389]/50 to-transparent" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
        className="w-full md:w-1/2 max-w-md relative z-10 mt-16 md:mt-0"
      >
        <div className="bg-[#E0F0E4] text-[#112316] p-10 shadow-[20px_20px_0_0_rgba(123,211,137,0.2)] border border-[#7BD389]">
          
          <h2 className="text-2xl font-black uppercase tracking-widest font-sans mb-8 text-center pb-4 border-b-2 border-[#112316]/10">Pitch Access</h2>

          <form className="space-y-6 font-sans" onSubmit={e=>e.preventDefault()}>
            <div className="relative">
              <span className="absolute top-1/2 -translate-y-1/2 left-4 text-[#112316]/30">@</span>
              <input type="email" placeholder="Email Contact" className="w-full bg-white border border-[#112316]/20 p-4 pl-12 rounded-sm focus:outline-none focus:border-[#7BD389] font-medium transition-colors" />
            </div>
            
            <div className="relative">
              <span className="absolute top-1/2 -translate-y-1/2 left-4 text-[#112316]/30">#</span>
              <input type="password" placeholder="Passcode" className="w-full bg-white border border-[#112316]/20 p-4 pl-12 rounded-sm focus:outline-none focus:border-[#7BD389] font-medium transition-colors" />
            </div>

            <button className="w-full bg-[#112316] text-[#E0F0E4] border border-[#112316] font-bold uppercase tracking-widest py-4 mt-8 hover:bg-[#7BD389] hover:text-[#112316] hover:border-[#7BD389] transition-all duration-300">
              Step Onto Turf
            </button>
          </form>

        </div>
      </motion.div>
      
    </div>
  );
}
