import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Route5() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setCoords({
      x: e.clientX,
      y: e.clientY
    });
  };

  return (
    <div 
      className="min-h-screen bg-[#FF3B00] text-black overflow-hidden relative selection:bg-black selection:text-[#CCFF00]" 
      onMouseMove={handleMouseMove}
    >
      
      {/* Absolute Chaos Background */}
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiAvPgo8cGF0aCBkPSJNMCAwbDhfOHptOCAwTDBfOHoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')] z-0"></div>

      {/* Moving Marquees */}
      <div className="absolute top-1/4 -left-10 w-[120vw] bg-[#CCFF00] border-y-[6px] border-black text-4xl font-black uppercase whitespace-nowrap overflow-hidden transform rotate-3 z-0 py-2" style={{ fontFamily: '"Impact", sans-serif' }}>
        <motion.div animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} className="flex gap-4">
          {[...Array(20)].map((_, i) => <span key={i}>NO NOISE JUST DATA • </span>)}
        </motion.div>
      </div>

      <div className="absolute bottom-1/3 -left-10 w-[120vw] bg-black text-[#FF3B00] border-y-[6px] border-[#CCFF00] text-6xl font-black uppercase whitespace-nowrap overflow-hidden transform -rotate-6 z-10 py-4" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
        <motion.div animate={{ x: [-1000, 0] }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }} className="flex gap-8">
          {[...Array(20)].map((_, i) => <span key={i}>UNcover the elite /// </span>)}
        </motion.div>
      </div>

      <main className="relative z-20 min-h-screen flex flex-col items-center justify-center p-4">
        
        {/* Collage Core Section */}
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-0 mt-32 lg:mt-0">
          
          <div className="relative z-30 pointer-events-none mixing-blend-difference w-full lg:w-3/5 text-center lg:text-left">
            <h1 className="text-[12vw] lg:text-[150px] leading-[0.8] font-black uppercase mix-blend-color-burn" style={{ fontFamily: '"Impact", sans-serif' }}>
              VYSION
            </h1>
            <h2 className="text-[6vw] lg:text-[80px] leading-[0.8] font-black uppercase text-white drop-shadow-[4px_4px_0_#000] mt-4" style={{ fontFamily: '"Impact", sans-serif' }}>
              ANALYTICS
            </h2>
          </div>

          <div className="w-full lg:w-2/5 relative z-40 flex justify-center lg:justify-end">
            <motion.div 
              drag
              dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
              className="bg-white border-[8px] border-black p-8 w-[400px] shadow-[-20px_20px_0_0_#000] transform lg:-translate-x-12 rotate-[-2deg]"
            >
              <div className="bg-black text-[#CCFF00] font-bold text-center py-2 px-4 uppercase text-2xl mb-8 tracking-widest border border-[#CCFF00]" style={{ fontFamily: '"Fira Code", monospace' }}>
                SCOUT_LOGIN.exe
              </div>

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <input 
                    type="email" 
                    placeholder="ENTER ID //" 
                    className="w-full bg-[#E5E5E5] border-[4px] border-black p-4 font-black uppercase text-xl placeholder:text-black/30 focus:bg-[#CCFF00] focus:outline-none"
                    style={{ fontFamily: '"Inter", sans-serif' }}
                  />
                </div>
                <div>
                  <input 
                    type="password" 
                    placeholder="PASSCODE //" 
                    className="w-full bg-[#E5E5E5] border-[4px] border-black p-4 font-black uppercase text-xl placeholder:text-black/30 focus:bg-[#CCFF00] focus:outline-none"
                    style={{ fontFamily: '"Inter", sans-serif' }}
                  />
                </div>

                <div className="pt-4">
                  <button className="relative w-full overflow-hidden group border-[6px] border-black bg-[#FF3B00] pt-4 pb-2">
                    <span className="relative z-10 text-white font-black text-5xl uppercase block group-hover:scale-110 transition-transform" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                      AUTHENTICATE
                    </span>
                    <div className="absolute inset-0 bg-[#CCFF00] translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0 border-t-[4px] border-black"></div>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>

        {/* Sticker overlays tied to mouse */}
        <motion.div 
          animate={{ x: coords.x / 40, y: coords.y / 40 }}
          className="absolute top-20 right-20 bg-[#CCFF00] border-4 border-black p-4 rounded-full font-black text-3xl rotate-12 z-50 pointer-events-none shadow-[8px_8px_0_0_#000]"
          style={{ fontFamily: '"Inter", sans-serif' }}
        >
          100% RAW
        </motion.div>

        <motion.div 
          animate={{ x: -coords.x / 30, y: -coords.y / 30 }}
          className="absolute bottom-20 left-20 bg-white border-4 border-black p-2 font-black text-xl -rotate-12 z-50 pointer-events-none shadow-[4px_4px_0_0_#000]"
          style={{ fontFamily: '"Courier New", monospace' }}
        >
          [ACCESS GRANTED]
        </motion.div>

      </main>
    </div>
  );
}
