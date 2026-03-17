import { motion } from 'framer-motion';

export default function Route8() {
  return (
    <div className="min-h-screen bg-[#E5E2DB] text-[#1E2322] flex items-center justify-center p-8 relative overflow-hidden font-serif">
      
      {/* Stadium Concrete Monolithic structure */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="w-full h-1/3 bg-gradient-to-b from-[#D1CECD] to-transparent clip-path-stadium-roof mix-blend-multiply" />
        <svg className="w-full h-full absolute inset-0 mix-blend-overlay opacity-30">
          <pattern id="concrete" width="100" height="100" patternUnits="userSpaceOnUse">
             <rect width="100" height="100" fill="#E5E2DB"/>
             <circle cx="20" cy="20" r="1" fill="#000" opacity="0.1"/>
             <circle cx="80" cy="60" r="1.5" fill="#000" opacity="0.1"/>
             <circle cx="40" cy="90" r="0.8" fill="#000" opacity="0.1"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#concrete)" />
        </svg>
      </div>

      <div className="absolute bottom-0 text-[15vw] font-black uppercase text-black/[0.03] whitespace-nowrap leading-none z-0" style={{ fontFamily: '"Inter", sans-serif' }}>
        TERRACE LEVEL // GATE D
      </div>

      <motion.div 
        initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}
        className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16"
      >
        <div className="flex flex-col justify-end pb-12">
          <div className="w-16 h-[2px] bg-[#C1272D] mb-8" />
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] text-[#111] mb-6" style={{ fontFamily: '"Bodoni Moda", serif', fontWeight: 700 }}>
            Foundation <br/> built on <br/><span className="italic font-light text-[#555]">monumental</span> talent.
          </h1>
          <p className="text-xl text-[#666] max-w-md font-sans font-light">
            Vysion. The architectural framework for building a dynasty. Secure your scouting access.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-10 md:p-16 border-t-[8px] border-[#C1272D] shadow-2xl relative">
          <h2 className="text-sm font-sans uppercase tracking-[0.2em] mb-12 text-[#888]">Staff Entrance</h2>
          
          <form className="space-y-8 font-sans" onSubmit={e => e.preventDefault()}>
            <div className="relative">
              <input type="text" id="id" className="peer w-full border-b pb-2 border-[#1E2322]/20 bg-transparent text-xl focus:outline-none focus:border-[#C1272D] transition-colors" placeholder=" " />
              <label htmlFor="id" className="absolute left-0 -top-4 text-xs tracking-wider text-[#A0A0A0] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-1 peer-placeholder-shown:text-[#666] peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#C1272D] uppercase">Club ID</label>
            </div>
            
            <div className="relative mt-8">
              <input type="password" id="pass" className="peer w-full border-b pb-2 border-[#1E2322]/20 bg-transparent text-xl focus:outline-none focus:border-[#C1272D] transition-colors tracking-widest" placeholder=" " />
              <label htmlFor="pass" className="absolute left-0 -top-4 text-xs tracking-wider text-[#A0A0A0] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-1 peer-placeholder-shown:text-[#666] peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#C1272D] uppercase">Security Code</label>
            </div>

            <button className="w-full bg-[#1E2322] hover:bg-[#C1272D] text-white py-5 px-8 font-medium tracking-widest uppercase transition-colors duration-500 mt-8">
              Proceed to Inner Sanctum
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
