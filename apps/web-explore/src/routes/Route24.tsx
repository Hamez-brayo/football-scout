import { motion } from 'framer-motion';

export default function Route24() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#111827] font-sans flex items-center justify-center p-4">
      
      {/* VIP Access Lanyard aesthetic */}
      <div className="relative w-full max-w-sm">
        
        {/* Lanyard strap going up */}
        <div className="absolute -top-[500px] left-1/2 -translate-x-1/2 w-8 h-[500px] bg-gradient-to-b from-[#111827] to-[#1F2937] flex flex-col items-center justify-around z-0">
          {[...Array(5)].map((_, i) => (
             <span key={i} className="text-[#F3F4F6] font-black uppercase -rotate-90 tracking-widest text-xs">VYSION</span>
          ))}
        </div>

        {/* Clip */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-12 h-16 border-4 border-gray-400 rounded-t-3xl rounded-b-md z-10 bg-[#F3F4F6]" />
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-6 h-10 border-4 border-gray-400 rounded-full z-20" />

        <motion.div 
          initial={{ y: 50, opacity: 0, rotate: -3 }} 
          animate={{ y: 0, opacity: 1, rotate: 0 }} 
          transition={{ type: "spring", stiffness: 100 }}
          className="bg-white rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.15)] overflow-hidden relative z-30 border border-gray-200 p-8 pt-12"
        >
           {/* Hole punch */}
           <div className="w-16 h-4 bg-[#F3F4F6] rounded-full mx-auto mb-8 shadow-inner" />

           <div className="text-center border-b-2 border-dashed border-gray-200 pb-6 mb-8">
             <div className="bg-[#111827] text-white px-4 py-1 inline-block font-bold text-xs uppercase tracking-widest rounded-full mb-4">VIP ALL ACCESS</div>
             <h1 className="text-4xl font-black uppercase tracking-tight text-[#111827]">Scout Hub</h1>
             <p className="text-sm font-medium text-gray-500 mt-2">Zone A / Analytics</p>
           </div>

           <form className="space-y-6" onSubmit={e=>e.preventDefault()}>
             <div>
               <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 ml-4">Authorized Email</label>
               <input type="text" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-4 text-center font-bold focus:outline-none focus:border-[#111827] transition-colors" placeholder="Scan or Enter" />
             </div>
             
             <div>
               <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 ml-4">Security PIN</label>
               <input type="password" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-4 text-center font-bold tracking-[0.5em] focus:outline-none focus:border-[#111827] transition-colors" placeholder="••••" />
             </div>

             <button className="w-full bg-gradient-to-r from-[#111827] to-[#374151] text-white uppercase font-black tracking-widest py-5 rounded-xl mt-8 hover:shadow-lg hover:-translate-y-1 transition-all">
               Swipe Pass
             </button>
           </form>

           <div className="mt-8 flex justify-center">
             <svg width="200" height="40" viewBox="0 0 200 40">
               {[...Array(40)].map((_, i) => (
                 <rect key={i} x={i * 5} y="0" width={Math.random() > 0.5 ? 2 : 4} height="40" fill="#111827" />
               ))}
             </svg>
           </div>
        </motion.div>

      </div>
    </div>
  );
}
