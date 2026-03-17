import { motion } from 'framer-motion';

export default function Route16() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#0A0B09] font-sans selection:bg-[#FFE800] selection:text-black overflow-hidden relative">
      
      {/* Training Cone / Bib aesthetic */}
      <div className="absolute inset-0 z-0 pointer-events-none flex flex-wrap gap-8 p-12 opacity-[0.03]">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="w-16 h-16 bg-[#FFE800] rounded-full filter blur-xl" />
        ))}
      </div>

      <div className="relative z-10 w-full min-h-screen flex flex-col md:flex-row">
        
        {/* Left visually dominant block */}
        <div className="w-full md:w-[60%] bg-[#0A0B09] text-white p-8 md:p-16 flex flex-col justify-between relative overflow-hidden clip-path-slant-right">
          
          {/* Intense neon bib overlays */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFE800] rounded-full filter blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FF3366] rounded-full filter blur-[80px] opacity-20 translate-y-1/3 -translate-x-1/4" />

          <header className="relative z-10">
            <h3 className="text-[#FFE800] uppercase tracking-widest font-black text-xs mb-2">High Intensity</h3>
            <div className="w-8 h-2 bg-[#FFE800]" />
          </header>

          <div className="relative z-10 my-16 md:my-0">
            <h1 className="text-6xl md:text-8xl lg:text-[140px] font-black uppercase leading-[0.8] tracking-tighter" style={{ fontFamily: '"Inter", sans-serif' }}>
              TRAINING <br/> GROUND.
            </h1>
            <p className="text-xl md:text-2xl text-white/50 mt-12 max-w-md font-medium leading-relaxed">
              Raw metrics from the proving ground. No hiding on the turf. Identify work-rate anomalies.
            </p>
          </div>

          <footer className="relative z-10 flex gap-12 font-mono text-sm uppercase tracking-widest text-[#FFE800]/70">
            <div>GPS Tracking</div>
            <div>HRV Data</div>
            <div>Sprint Velocity</div>
          </footer>
        </div>

        {/* Right side form */}
        <div className="w-full md:w-[40%] bg-[#FDFDFD] p-8 md:p-16 flex flex-col justify-center">
          
          <div className="max-w-md mx-auto w-full">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 bg-[#FFE800] rounded-full flex items-center justify-center font-black text-xl border-4 border-[#0A0B09]">V</div>
              <h2 className="text-3xl font-black uppercase tracking-tight">Coach Access</h2>
            </div>

            <form className="space-y-8" onSubmit={e=>e.preventDefault()}>
               <div className="relative border-b-4 border-[#0A0B09] pb-2">
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#0A0B09]/50 absolute top-0">Staff Email</span>
                 <input type="text" className="w-full bg-transparent border-none focus:outline-none text-2xl font-bold mt-6 text-[#0A0B09] placeholder:text-[#0A0B09]/20" placeholder="coach@club.com" />
               </div>
               
               <div className="relative border-b-4 border-[#0A0B09] pb-2">
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#0A0B09]/50 absolute top-0">Clearance Code</span>
                 <input type="password" className="w-full bg-transparent border-none focus:outline-none text-2xl font-bold mt-6 text-[#0A0B09] placeholder:text-[#0A0B09]/20" placeholder="••••••••" />
               </div>

               <motion.button 
                 whileHover={{ x: 10 }}
                 className="w-full bg-[#0A0B09] text-white font-black text-2xl uppercase py-6 flex items-center justify-between px-8 hover:bg-[#FFE800] hover:text-[#0A0B09] transition-colors duration-300"
               >
                 <span>Blow Whistle</span>
                 <span className="text-3xl leading-none">&rarr;</span>
               </motion.button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
