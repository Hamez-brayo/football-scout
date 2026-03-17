import { motion } from 'framer-motion';

export default function Route18() {
  return (
    <div className="min-h-screen bg-[#111111] text-[#E0E0E0] font-sans overflow-hidden flex items-center justify-center relative">
      
      {/* Tunnel shadows and lighting */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,#000_100%)] opacity-80" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-full bg-white/5 blur-3xl z-0" />
      <div className="absolute inset-0 z-0 mix-blend-multiply opacity-30 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')]" />

      <motion.div 
        initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 2 }}
        className="relative z-10 w-full max-w-7xl px-6 md:px-12 flex flex-col items-center"
      >
        <div className="text-center mb-16 relative">
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 4 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-600 shadow-[0_0_20px_10px_rgba(220,38,38,0.5)]" 
          />
          <h2 className="text-xs uppercase tracking-[0.5em] text-[#666] font-bold mb-4">Entering The Pitch</h2>
          <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#FFF] to-[#333] leading-none" style={{ fontFamily: '"Impact", sans-serif' }}>
            THE TUNNEL
          </h1>
        </div>

        <div className="w-full max-w-md bg-[#0A0A0A] border border-[#222] p-8 md:p-12 relative shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-sm">
          {/* Concrete cracks styling */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 stroke-[#222] fill-none" preserveAspectRatio="none">
             <path d="M0,50 L20,40 L30,60 L50,45 L70,80 L100,70" strokeWidth="1" />
             <path d="M80,0 L75,20 L85,40 L70,100" strokeWidth="0.5" />
          </svg>

          <p className="text-center text-sm font-light text-[#888] mb-10 border-b border-[#222] pb-6">
            The pressure is on. Every signing defines your legacy. Authenticate to proceed.
          </p>

          <form className="space-y-6" onSubmit={e=>e.preventDefault()}>
            <div className="group">
              <input type="text" className="w-full bg-[#111] border border-[#333] px-4 py-3 text-center uppercase tracking-widest text-[#E0E0E0] focus:outline-none focus:border-white transition-colors" placeholder="Identification //" />
            </div>
            <div className="group">
              <input type="password" className="w-full bg-[#111] border border-[#333] px-4 py-3 text-center uppercase tracking-widest text-[#E0E0E0] focus:outline-none focus:border-white transition-colors" placeholder="Passphrase //" />
            </div>
            
            <button className="w-full border border-white text-white font-black uppercase tracking-widest py-4 hover:bg-white hover:text-black transition-all duration-500 mt-4 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] relative overflow-hidden group/btn">
              <span className="relative z-10">Walk Out</span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out z-0" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
