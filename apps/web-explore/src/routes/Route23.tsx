import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Route23() {
  const [activeKit, setActiveKit] = useState(0);
  const kits = ['#E53E3E', '#2B6CB0', '#38A169', '#F6E05E'];

  return (
    <div className="min-h-screen bg-[#1A202C] text-white font-sans overflow-hidden py-12 px-4 md:px-12 flex flex-col justify-center relative">
      
      {/* Dynamic background matching active kit */}
      <AnimatePresence>
         <motion.div 
           key={activeKit}
           initial={{ opacity: 0 }} 
           animate={{ opacity: 0.15 }} 
           exit={{ opacity: 0 }}
           transition={{ duration: 0.8 }}
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full filter blur-[100px] pointer-events-none z-0"
           style={{ backgroundColor: kits[activeKit] }}
         />
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto w-full relative z-10">
         
         <div className="flex flex-col justify-center order-2 lg:order-1">
            <h2 className="text-xl text-gray-400 font-bold tracking-widest uppercase mb-4">Locker Room</h2>
            <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-8" style={{ fontFamily: '"Inter", sans-serif' }}>
              Suit Up. <br/> Get Ready.
            </h1>

            <div className="flex gap-4 mb-16">
               {kits.map((color, idx) => (
                 <button 
                   key={idx}
                   onClick={() => setActiveKit(idx)}
                   className={`w-12 h-12 rounded-full border-4 transition-transform ${activeKit === idx ? 'scale-125 border-white' : 'border-transparent scale-100 hover:scale-110'}`}
                   style={{ backgroundColor: color }}
                 />
               ))}
            </div>

            <p className="text-gray-400 max-w-sm mb-12">Select your club affiliation to access tailored player analytics and team alignment tools.</p>
         </div>

         {/* Kit / Locker visualization block */}
         <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <motion.div 
              animate={{ borderColor: kits[activeKit] }}
              transition={{ duration: 0.5 }}
              className="bg-[#2D3748] border-l-8 p-10 shadow-2xl w-full max-w-md"
            >
               <div className="flex justify-between items-center border-b border-gray-600 pb-4 mb-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Player Portal</span>
                  <div className="w-8 h-8 flex items-center justify-center font-bold text-xs bg-white text-black">VYS</div>
               </div>

               <form className="space-y-6" onSubmit={e=>e.preventDefault()}>
                 <div className="space-y-2">
                   <label className="text-xs uppercase font-bold text-gray-400">Club Email</label>
                   <input type="text" className="w-full bg-[#1A202C] border border-gray-600 p-4 text-white focus:outline-none focus:border-white transition-colors" placeholder="player@club.com" />
                 </div>
                 
                 <div className="space-y-2">
                   <label className="text-xs uppercase font-bold text-gray-400">Locker Code</label>
                   <input type="password" className="w-full bg-[#1A202C] border border-gray-600 p-4 text-white focus:outline-none focus:border-white transition-colors tracking-widest" placeholder="••••••••" />
                 </div>

                 <motion.button 
                   animate={{ backgroundColor: kits[activeKit] }}
                   className="w-full py-4 mt-8 font-black uppercase text-xl shadow-lg transition-colors text-white"
                 >
                   Unlock Locker
                 </motion.button>
               </form>
            </motion.div>
         </div>

      </div>
    </div>
  );
}
