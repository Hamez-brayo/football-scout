import { motion } from 'framer-motion';

export default function Route12() {
  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#E8E8E8] font-sans overflow-hidden flex flex-col justify-center items-center relative">
      
      {/* High gloss gold background gradients */}
      <div className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[radial-gradient(circle,rgba(212,175,55,0.15)_0%,transparent_70%)] z-0 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-[radial-gradient(circle,rgba(212,175,55,0.1)_0%,transparent_70%)] z-0 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Ball motif */}
      <motion.div 
        animate={{ rotate: 360 }} transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none flex items-center justify-center"
      >
        <svg viewBox="0 0 100 100" className="w-full max-w-4xl h-full fill-none stroke-[#D4AF37] stroke-[0.2]">
           <circle cx="50" cy="50" r="45" />
           <path d="M50 5 L50 95 M5 50 L95 50" />
           <path d="M20 20 L80 80 M20 80 L80 20" />
        </svg>
      </motion.div>

      <div className="z-10 w-full max-w-6xl px-4 md:px-12 flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
        
        <div className="flex-1 text-center lg:text-left pt-12 lg:pt-0">
           <h4 className="text-[#D4AF37] uppercase tracking-[0.4em] text-xs font-semibold mb-6 flex items-center justify-center lg:justify-start gap-4">
             <span className="w-8 h-[1px] bg-[#D4AF37]"></span> High Prestige <span className="w-8 h-[1px] bg-[#D4AF37]"></span>
           </h4>
           <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-[#FFF0C2] via-[#D4AF37] to-[#8C6D1F] leading-tight pb-2 tracking-tight">
             Golden <br/> Standard.
           </h1>
           <p className="mt-6 text-[#A0A0A0] max-w-md mx-auto lg:mx-0 font-light text-lg leading-relaxed">
             Reserved for world-class scouting directors. Access the purest data insights wrapped in unparalleled digital elegance.
           </p>
        </div>

        <div className="flex-1 w-full max-w-md relative">
          {/* Glassmorphism Card */}
          <div className="bg-[#1A1A1A]/40 backdrop-blur-xl border border-[#D4AF37]/30 rounded-3xl p-10 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-[#D4AF37]/60 transition-colors duration-500">
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#D4AF37]/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />

            <div className="text-center mb-10">
              <h2 className="text-2xl font-serif text-[#D4AF37] mb-2">Director's Box</h2>
              <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
            </div>

            <form className="space-y-6" onSubmit={e=>e.preventDefault()}>
              <div>
                <input type="text" placeholder="Executive Email" className="w-full bg-transparent border-b border-[#D4AF37]/30 text-[#E8E8E8] placeholder:text-[#A0A0A0]/50 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors font-light text-center" />
              </div>
              <div>
                <input type="password" placeholder="Access Cipher" className="w-full bg-transparent border-b border-[#D4AF37]/30 text-[#E8E8E8] placeholder:text-[#A0A0A0]/50 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors font-light tracking-widest text-center" />
              </div>

              <motion.button whileTap={{ scale: 0.98 }} className="w-full mt-10 relative overflow-hidden rounded-full p-px bg-gradient-to-b from-[#D4AF37] to-[#8C6D1F]">
                <div className="bg-[#1A1A1A] hover:bg-transparent transition-colors duration-300 w-full h-full rounded-full py-4 text-sm uppercase tracking-[0.2em] font-semibold text-[#D4AF37] hover:text-[#1A1A1A]">
                  Enter Vip Lounge
                </div>
              </motion.button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
