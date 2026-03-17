import { useState } from 'react';
import { ArrowRight, Activity, CornerRightDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Route1() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-white text-black font-mono overflow-hidden selection:bg-black selection:text-white">
      {/* Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'linear-gradient(black 1px, transparent 1px), linear-gradient(90deg, black 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      {/* Nav */}
      <nav className="border-b-[3px] border-black p-4 flex justify-between items-center bg-white relative z-10">
        <div className="text-3xl font-black uppercase tracking-tighter" style={{ fontFamily: '"Impact", sans-serif' }}>VYSION.RAW</div>
        <div className="hidden md:flex gap-8 font-bold text-sm tracking-widest uppercase">
          <a href="#" className="hover:line-through">Index</a>
          <a href="#" className="hover:line-through">Players</a>
          <a href="#" className="hover:line-through">Manifesto</a>
        </div>
        <button className="border-2 border-black px-6 py-2 font-bold uppercase hover:bg-black hover:text-[#ccff00] transition-colors">
          Sys.Login
        </button>
      </nav>

      {/* Main Content */}
      <main className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-80px)] relative z-10">
        
        {/* Left Col - Hero */}
        <div className="lg:col-span-7 border-r-[3px] border-black p-8 md:p-16 flex flex-col justify-center relative bg-white">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "circOut" }}
          >
            <h1 className="text-[10vw] lg:text-[7rem] leading-[0.85] font-black uppercase mb-8" style={{ fontFamily: '"Impact", sans-serif' }}>
              Unearth <br/>
              <span className="text-black/0 [-webkit-text-stroke:2px_black] hover:[-webkit-text-stroke:2px_#ccff00] hover:text-black transition-all cursor-crosshair">The Elite</span> <br/>
              F*ck The <br/> Noise.
            </h1>
            
            <p className="text-xl max-w-md font-medium border-l-[4px] border-[#ccff00] pl-4 mb-12">
              Raw data. Unfiltered scouting insights. Stop guessing, start knowing. Access the grid.
            </p>

            <div className="flex flex-col sm:flex-row gap-0 border-black border-[3px] w-max bg-white">
              <input 
                type="text" 
                placeholder="ENTER PLAYER ID OR NAME..." 
                className="px-6 py-4 outline-none font-bold placeholder:text-black/40 w-full sm:w-80 uppercase text-sm"
              />
              <button className="bg-black text-[#ccff00] px-8 py-4 font-black flex items-center gap-2 hover:bg-[#ccff00] hover:text-black transition-colors border-l-[3px] border-transparent sm:border-black uppercase">
                Query <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          <div className="absolute bottom-8 left-8 flex items-center gap-4 hidden md:flex">
            <Activity className="w-8 h-8 animate-pulse text-[#ccff00] mix-blend-difference" />
            <span className="font-bold text-xs">SYSTEM STATUS: OPTIMAL <br/> ACTIVE SCOUTS: 1,024</span>
          </div>
        </div>

        {/* Right Col - Auth / Metrics */}
        <div className="lg:col-span-5 bg-[#ccff00] p-8 md:p-16 flex flex-col justify-between border-t-[3px] lg:border-t-0 border-black relative">
          
          <div className="absolute top-8 right-8">
            <CornerRightDown className="w-16 h-16 opacity-50" />
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "circOut" }}
            className="mt-16 lg:mt-0"
          >
            <div className="border-[3px] border-black bg-white p-8 group hover:translate-x-2 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
              <h2 className="text-4xl font-black uppercase mb-6" style={{ fontFamily: '"Impact", sans-serif' }}>Club Access</h2>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block font-bold text-xs uppercase mb-2">Identifier // Email</label>
                  <input type="email" defaultValue="scout@realmadrid.com" className="w-full border-b-[3px] border-black pb-2 outline-none font-medium bg-transparent focus:border-[#ccff00] transition-colors rounded-none" />
                </div>
                <div>
                  <label className="block font-bold text-xs uppercase mb-2">Passcode</label>
                  <input type="password" defaultValue="******" className="w-full border-b-[3px] border-black pb-2 outline-none font-medium bg-transparent focus:border-[#ccff00] transition-colors rounded-none" />
                </div>
                <button 
                  className="w-full border-[3px] border-black bg-black text-white py-4 font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {isHovered ? 'AUTHENTICATING...' : 'INITIATE OVERRIDE'}
                </button>
              </form>
            </div>
          </motion.div>

          <div className="mt-16 border-t-[3px] border-black pt-8 grid grid-cols-2 gap-8">
            <div>
              <div className="text-5xl font-black" style={{ fontFamily: '"Impact", sans-serif' }}>94%</div>
              <div className="text-xs font-bold uppercase mt-2">Prediction <br/> Accuracy</div>
            </div>
            <div>
              <div className="text-5xl font-black" style={{ fontFamily: '"Impact", sans-serif' }}>12K</div>
              <div className="text-xs font-bold uppercase mt-2">Verified <br/> Prospects</div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
