import { motion } from 'framer-motion';

export default function Route10() {
  return (
    <div className="min-h-screen bg-[#DFD9CA] text-[#2B231D] font-serif p-4 md:p-12 selection:bg-[#AB3428] selection:text-[#DFD9CA]">
      
      {/* Paper texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-40 mix-blend-multiply z-50">
        <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>
          <filter id='noise'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/></filter>
          <rect width='100%' height='100%' filter='url(#noise)' opacity='0.5'/>
        </svg>
      </div>

      <div className="w-full max-w-4xl mx-auto bg-[#F2F0EA] border border-[#2B231D] shadow-[15px_15px_0_0_#2B231D] p-2 relative h-[calc(100vh-6rem)] min-h-[700px]">
        {/* Inner border */}
        <div className="border-[3px] border-double border-[#2B231D] p-8 md:p-12 h-full flex flex-col relative overflow-hidden">
          
          {/* Decorative Corner */}
          <div className="absolute top-0 left-0 w-16 h-16 border-b-[3px] border-r-[3px] border-double border-[#2B231D]" />
          <div className="absolute top-0 right-0 w-16 h-16 border-b-[3px] border-l-[3px] border-double border-[#2B231D]" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-t-[3px] border-r-[3px] border-double border-[#2B231D]" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-t-[3px] border-l-[3px] border-double border-[#2B231D]" />

          <header className="text-center border-b-[3px] border-[#2B231D] pb-8 mb-12 relative">
            <h4 className="uppercase tracking-[0.3em] text-xs font-bold mb-4 font-sans text-[#AB3428]">The Official</h4>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter" style={{ fontFamily: '"Playfair Display", serif' }}>
              VYSION
            </h1>
            <h2 className="text-2xl md:text-4xl italic mt-2">Scouting Register</h2>
            <p className="mt-4 text-sm font-sans uppercase tracking-widest border border-[#2B231D] inline-block px-4 py-1 rounded-full">Vol. XXVI</p>
          </header>

          <main className="flex-1 flex flex-col md:flex-row gap-12">
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <div className="text-center md:text-left pr-0 md:pr-8">
                <p className="text-xl md:text-2xl leading-relaxed italic mb-8">
                  "A meticulous ledger for the modern scout. Discover the finest athletic specimens curated through rigorous statistical observation."
                </p>
                <div className="w-24 h-1 bg-[#AB3428] mx-auto md:mx-0 mb-8" />
                <p className="font-sans uppercase text-xs tracking-widest leading-loose">
                  Includes full prospect indexing <br/>
                  Match analysis dossiers <br/>
                  Biometric profiles
                </p>
              </div>
            </div>

            <div className="w-full md:w-1/2 border-l-[3px] border-[#2B231D] pl-0 md:pl-12 flex items-center">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="w-full bg-[#DFD9CA] p-8 border border-[#2B231D]"
              >
                <h3 className="font-sans uppercase text-center font-bold tracking-[0.2em] mb-8 border-b border-[#2B231D] pb-2 text-[#AB3428]">Sign In</h3>
                
                <form className="space-y-6 flex flex-col items-center font-sans">
                  <div className="w-full">
                    <label className="block text-[10px] uppercase font-bold tracking-widest mb-1">Telegram / Identifier</label>
                    <input type="text" className="w-full bg-transparent border-b-2 border-[#2B231D] py-2 focus:outline-none focus:border-[#AB3428] text-lg font-serif italic text-center" defaultValue="Sir. Scout" />
                  </div>
                  
                  <div className="w-full">
                    <label className="block text-[10px] uppercase font-bold tracking-widest mb-1">Secret Cipher</label>
                    <input type="password" className="w-full bg-transparent border-b-2 border-[#2B231D] py-2 focus:outline-none focus:border-[#AB3428] text-lg font-serif italic text-center tracking-[0.5em]" defaultValue="••••••" />
                  </div>

                  <button className="bg-[#AB3428] text-[#F2F0EA] w-full font-bold uppercase tracking-[0.2em] py-4 mt-8 hover:bg-[#2B231D] transition-colors border-2 border-[#2B231D]">
                    Affix Seal
                  </button>
                </form>
              </motion.div>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
