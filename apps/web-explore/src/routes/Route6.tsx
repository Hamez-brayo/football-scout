import { useState } from 'react';
import { motion } from 'framer-motion';
import { PenTool, Target, Layers } from 'lucide-react';

export default function Route6() {
  const [, setActivePlay] = useState('');

  return (
    <div className="min-h-screen bg-[#111] text-[#eee] font-sans overflow-hidden relative">
      <div className="absolute inset-0 z-0 opacity-20" style={{ 
        backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 20%, #111 100%), repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 41px)' 
      }} />

      {/* Chalkboard pitch lines */}
      <svg className="absolute inset-0 w-full h-full z-0 opacity-10" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect x="5%" y="5%" width="90%" height="90%" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="10 5" />
        <circle cx="50%" cy="50%" r="15%" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="10 5" />
        <line x1="50%" y1="5%" x2="50%" y2="95%" stroke="#fff" strokeWidth="2" strokeDasharray="10 5" />
      </svg>

      <div className="relative z-10 p-8 flex flex-col md:flex-row h-screen">
        <div className="w-full md:w-1/2 flex flex-col justify-center pr-12">
          <motion.h1 
            initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-4"
          >
            Tactical <br/><span className="text-[#3b82f6]">Advantage</span>
          </motion.h1>
          <p className="text-xl text-[#aaa] mb-8 max-w-md font-light">
            Vysion Analytics. Orchestrate your recruitment strategy like a master tactician on the whiteboard.
          </p>
          
          <div className="flex gap-4">
            <button onMouseEnter={() => setActivePlay('4-3-3')} className="bg-[#222] hover:bg-[#333] border border-[#444] px-6 py-3 rounded-md transition flex items-center gap-2">
              <Layers size={18} /> High Press
            </button>
            <button onMouseEnter={() => setActivePlay('3-5-2')} className="bg-[#222] hover:bg-[#333] border border-[#444] px-6 py-3 rounded-md transition flex items-center gap-2">
              <Target size={18} /> Counter
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center relative mt-12 md:mt-0">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1a1a1a] p-10 rounded-xl border-2 border-[#333] shadow-2xl w-full max-w-md relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-[#3b82f6] transform origin-left transition-transform group-hover:scale-x-100" />
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <PenTool className="text-[#3b82f6]" /> Director Login
            </h2>
            <p className="text-[#777] mb-8 font-mono text-sm">SECURE_ACCESS // TACTICS_ROOM</p>

            <form className="space-y-5" onSubmit={e => e.preventDefault()}>
              <div>
                <input type="text" placeholder="Club Identifier" className="w-full bg-[#111] border border-[#333] rounded px-4 py-3 focus:outline-none focus:border-[#3b82f6] transition font-mono" />
              </div>
              <div>
                <input type="password" placeholder="Passcode" className="w-full bg-[#111] border border-[#333] rounded px-4 py-3 focus:outline-none focus:border-[#3b82f6] transition font-mono tracking-widest" />
              </div>
              <button className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-4 rounded transition tracking-wide">
                Draw Up the Play
              </button>
            </form>
          </motion.div>

          {/* Draggable tactical markers */}
          <motion.div drag dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }} className="absolute bg-[#ef4444] w-6 h-6 rounded-full cursor-grab active:cursor-grabbing border-2 border-white top-1/4 left-1/4 shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
          <motion.div drag dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }} className="absolute bg-[#3b82f6] w-6 h-6 rounded-full cursor-grab active:cursor-grabbing border-2 border-white bottom-1/4 right-1/4 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
        </div>
      </div>
    </div>
  );
}
