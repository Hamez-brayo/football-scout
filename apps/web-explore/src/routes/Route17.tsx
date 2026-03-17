import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Route17() {
  const [hoverArea, setHoverArea] = useState<null | number>(null);

  return (
    <div className="min-h-screen bg-[#111315] text-[#EEEEEE] font-mono selection:bg-white selection:text-black p-4 md:p-8">
      
      <div className="w-full max-w-[1800px] mx-auto min-h-[calc(100vh-4rem)] border border-[#333] grid grid-cols-1 lg:grid-cols-12 grid-rows-[auto_1fr] gap-0">
        
        {/* Top toolbar */}
        <div className="lg:col-span-12 border-b border-[#333] flex items-center justify-between px-6 py-4 bg-[#1A1C1E]">
          <div className="flex gap-4 items-center">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="font-bold tracking-widest text-xs uppercase text-[#888]">Live Data Feed</span>
          </div>
          <div className="font-bold text-sm bg-white text-black px-3 py-1 uppercase tracking-wider">Vysion Sub-System</div>
          <div className="text-xs text-[#555] font-mono">NODE: EU_WEST_1</div>
        </div>

        {/* Multi-monitor dashboard grid aesthetic */}
        <div className="lg:col-span-8 grid grid-cols-2 grid-rows-2 gap-[1px] bg-[#333]">
          
          <div className="bg-[#111315] p-6 relative overflow-hidden flex flex-col justify-end" onMouseEnter={()=>setHoverArea(1)} onMouseLeave={()=>setHoverArea(null)}>
            <div className="absolute top-4 left-4 text-[10px] text-[#555]">CAM_01 / HEATMAP</div>
            <img src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-20 filter grayscale" alt="Pitch" />
            {hoverArea === 1 && <div className="absolute inset-0 bg-red-500/10 mix-blend-color-dodge z-10" />}
            <h3 className="relative z-20 text-4xl font-black uppercase text-white/50">Tracking</h3>
          </div>
          
          <div className="bg-[#111315] p-6 relative overflow-hidden" onMouseEnter={()=>setHoverArea(2)} onMouseLeave={()=>setHoverArea(null)}>
            <div className="absolute top-4 left-4 text-[10px] text-[#555]">DATA_STREAM</div>
            <div className="flex flex-col gap-2 mt-8 opacity-40 text-xs">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex justify-between border-b border-[#333] pb-1">
                  <span>PLAYER_{i+100}</span>
                  <span className="text-[#00FF00]">{(Math.random() * 10).toFixed(1)} km</span>
                </div>
              ))}
            </div>
            {hoverArea === 2 && <div className="absolute inset-0 border-2 border-[#00FF00] z-10" />}
          </div>
          
          <div className="bg-[#111315] p-6 relative col-span-2 md:col-span-1" onMouseEnter={()=>setHoverArea(3)} onMouseLeave={()=>setHoverArea(null)}>
            <div className="absolute top-4 left-4 text-[10px] text-[#555]">PREDICTIVE_MODEL</div>
            <div className="w-full h-full flex items-end justify-between gap-2 px-4 pb-4 mt-8 opacity-30">
               {[40, 70, 45, 90, 65, 80, 50, 85].map((h, i) => (
                 <motion.div key={i} animate={{ height: [`${h}%`, `${h+10}%`, `${h-5}%`] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-full bg-white" />
               ))}
            </div>
            {hoverArea === 3 && <div className="absolute inset-0 bg-white/5 z-10" />}
          </div>
          
          <div className="bg-[#1A1C1E] p-8 relative col-span-2 md:col-span-1 flex flex-col justify-center">
            <h2 className="text-3xl font-black uppercase mb-4 leading-none">Analyst <br/> Room.</h2>
            <p className="text-xs text-[#888] mb-8 max-w-[200px]">Total immersion in the data. Find the needle in the haystack.</p>
          </div>

        </div>

        {/* Login Column */}
        <div className="lg:col-span-4 bg-[#151719] p-8 md:p-12 border-l border-[#333] flex flex-col justify-center">
          
          <div className="mb-12 border-b border-[#333] pb-6">
            <h1 className="text-xl font-bold uppercase tracking-widest">System Access</h1>
            <p className="text-xs text-[#555] mt-2 font-mono">ENTER CREDENTIALS TO SYNC DASHBOARDS</p>
          </div>

          <form className="space-y-6" onSubmit={e=>e.preventDefault()}>
            <div>
              <input type="text" className="w-full bg-black border border-[#333] p-4 font-mono text-sm focus:outline-none focus:border-white transition-colors uppercase placeholder:text-[#444]" placeholder="UserID //" />
            </div>
            <div>
              <input type="password" className="w-full bg-black border border-[#333] p-4 font-mono text-sm focus:outline-none focus:border-white transition-colors tracking-widest placeholder:tracking-normal placeholder:text-[#444]" placeholder="Password //" />
            </div>
            
            <button className="w-full border-2 border-white bg-transparent hover:bg-white hover:text-black font-bold uppercase tracking-widest py-4 mt-8 transition-colors text-sm">
              Connect Stream
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
