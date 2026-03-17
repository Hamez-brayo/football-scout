import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function Route3() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2C2A] font-light selection:bg-[#D4AF37]/30 selection:text-black">
      
      {/* Editorial Grid Layout */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-24">
        
        {/* Elegant Header */}
        <header className="py-12 border-b border-[#2C2C2A]/10 flex justify-between items-baseline">
          <div className="text-sm font-sans tracking-[0.2em] uppercase text-[#2C2C2A]/60">Est. 2026</div>
          <div 
            className="text-3xl md:text-4xl text-center flex-1 font-serif italic tracking-wide text-[#1A1A18]" 
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Vysion Analytics
          </div>
          <div className="text-sm font-sans tracking-[0.2em] uppercase text-[#2C2C2A]/60 hidden md:block">The Archive</div>
        </header>

        <main className="mt-16 md:mt-32 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 relative">
          
          {/* Subtle Background Element */}
          <div className="absolute -top-12 -left-12 text-[20rem] font-serif italic text-black/[0.02] pointer-events-none select-none z-0" style={{ fontFamily: '"Playfair Display", serif' }}>
            V
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="lg:col-span-7 z-10 flex flex-col justify-center"
          >
            <h1 className="text-6xl md:text-[5.5rem] leading-[1.05] font-serif mb-10 text-[#1A1A18]" style={{ fontFamily: '"Bodoni Moda", serif', fontWeight: 400 }}>
              Curating <br/> the Vanguard <br/> of Football.
            </h1>
            
            <div className="border-l border-[#D4AF37] pl-8 max-w-lg mb-16">
              <p className="text-lg leading-relaxed text-[#5A5A58] font-sans font-light">
                For the discerning eyes. Our discrete intelligence synthesis provides unparalleled clarity on acquiring generational talent, refined for the highest echelons of the sport.
              </p>
            </div>

            <div className="flex items-center gap-6 font-sans">
              <div className="h-[1px] w-12 bg-[#D4AF37]"></div>
              <span className="uppercase tracking-[0.15em] text-xs font-semibold text-[#1A1A18]">Discover The Collection</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="lg:col-span-5 z-10 w-full max-w-md mx-auto lg:mx-0"
          >
            <div className="bg-white p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] h-full flex flex-col justify-center relative">
              
              <div className="text-center mb-10">
                <h2 className="text-2xl font-serif italic mb-2 text-[#1A1A18]" style={{ fontFamily: '"Playfair Display", serif' }}>Private Access</h2>
                <div className="h-[1px] w-8 bg-[#D4AF37] mx-auto"></div>
              </div>

              <form className="space-y-8 font-sans" onSubmit={(e) => e.preventDefault()}>
                <div className="group">
                  <label className="block text-[10px] uppercase tracking-[0.2em] mb-3 text-[#2C2C2A]/50">Credentials</label>
                  <input 
                    type="email" 
                    placeholder="Enter email address" 
                    className="w-full bg-transparent border-b border-[#2C2C2A]/20 pb-3 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors placeholder:text-[#2C2C2A]/30 font-light"
                  />
                </div>
                <div className="group">
                  <input 
                    type="password" 
                    placeholder="Enter security cipher" 
                    className="w-full bg-transparent border-b border-[#2C2C2A]/20 pb-3 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors placeholder:text-[#2C2C2A]/30 font-light"
                  />
                </div>

                <div className="pt-8">
                  <button className="w-full bg-[#1A1A18] text-white uppercase text-xs tracking-[0.2em] py-4 px-6 flex items-center justify-between hover:bg-[#D4AF37] transition-colors duration-500">
                    <span>Unlock Vault</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              <div className="mt-10 text-center text-[10px] uppercase tracking-[0.1em] text-[#2C2C2A]/40 font-sans">
                By invitation only. Inquiries: concierge@vysion.io
              </div>
            </div>
          </motion.div>

        </main>
      </div>
    </div>
  );
}
