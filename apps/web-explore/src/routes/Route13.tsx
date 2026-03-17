import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function Route13() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#1A202C] font-sans selection:bg-[#E53E3E] selection:text-white flex items-center justify-center p-4">
      
      {/* College Varsity styling background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-[0.04]">
        <h1 className="text-[30vw] font-black uppercase tracking-tighter" style={{ fontFamily: '"Impact", sans-serif' }}>VYSION</h1>
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        <header className="flex flex-col items-center justify-center mb-12 text-center">
          <div className="bg-[#2B6CB0] text-white p-4 rounded-full mb-6 shadow-xl border-4 border-white">
            <Shield size={48} />
          </div>
          <h2 className="text-[#E53E3E] font-bold tracking-[0.2em] uppercase text-sm mb-2">The Recruitment Platform</h2>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tight" style={{ color: '#1A202C', WebkitTextStroke: '2px #1A202C', textShadow: '4px 4px 0 #CBD5E0' }}>Draft Day</h1>
        </header>

        <div className="perspective-1000 flex justify-center">
          <motion.div 
            className="w-full max-w-md h-[500px] relative preserve-3d"
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {/* Front of Card */}
            <div className={`absolute w-full h-full backface-hidden bg-white border-8 border-[#2B6CB0] rounded-2xl shadow-2xl p-8 flex flex-col justify-between ${flipped ? 'hidden' : 'block'}`}>
              <div className="text-center border-b-4 border-[#E53E3E] pb-6">
                 <h3 className="text-3xl font-black uppercase text-[#2B6CB0]">Scout Access</h3>
                 <p className="text-[#A0AEC0] font-bold uppercase mt-2 text-xs">Login to prospect database</p>
              </div>

              <form className="space-y-6 mt-8" onSubmit={e=>e.preventDefault()}>
                <div>
                  <input type="text" placeholder="TEAM EMAIL" className="w-full border-b-4 border-[#E2E8F0] p-4 font-bold text-lg text-center uppercase focus:outline-none focus:border-[#2B6CB0] transition-colors placeholder:text-[#CBD5E0]" />
                </div>
                <div>
                  <input type="password" placeholder="PASSCODE" className="w-full border-b-4 border-[#E2E8F0] p-4 font-bold text-lg text-center uppercase focus:outline-none focus:border-[#2B6CB0] transition-colors placeholder:text-[#CBD5E0]" />
                </div>
                
                <button 
                  className="w-full bg-[#E53E3E] hover:bg-[#C53030] text-white font-black uppercase text-2xl py-4 rounded-xl shadow-[0_6px_0_#9B2C2C] active:shadow-none active:translate-y-[6px] transition-all mt-4"
                  onClick={() => setFlipped(true)}
                  type="button"
                >
                  Enter Draft
                </button>
              </form>
            </div>

            {/* Back of Card (Mocking successful login state briefly before redirect) */}
            <div className="absolute w-full h-full backface-hidden bg-[#2B6CB0] border-8 border-white rounded-2xl shadow-2xl p-8 flex flex-col justify-center items-center rotate-y-180" style={{ transform: 'rotateY(180deg)' }}>
              <div className="text-white text-center">
                 <Shield size={64} className="mx-auto mb-6 text-[#E53E3E]" />
                 <h3 className="text-4xl font-black uppercase mb-4">You're On The Clock</h3>
                 <p className="font-bold text-[#E2E8F0] uppercase text-sm animate-pulse">Initializing prospect grid...</p>
                 <button className="mt-8 text-xs underline uppercase" onClick={() => setFlipped(false)}>Cancel</button>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
