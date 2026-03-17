import { motion } from 'framer-motion';

export default function Route22() {
  return (
    <div className="min-h-screen bg-black text-[#F4F4F4] font-serif overflow-hidden relative">
      
      {/* Flashing camera bulbs effect */}
      <motion.div 
        animate={{ opacity: [0, 0, 1, 0, 0, 0.8, 0, 0] }} 
        transition={{ repeat: Infinity, duration: 3, times: [0, 0.8, 0.82, 0.85, 0.9, 0.92, 0.95, 1] }}
        className="fixed inset-0 bg-white z-50 pointer-events-none mix-blend-overlay"
      />

      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 grayscale filter blur-sm z-0" />

      <div className="relative z-10 w-full max-w-7xl mx-auto min-h-screen flex flex-col justify-center px-4 py-12">
         
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Newspaper headline block */}
            <div className="lg:col-span-7 bg-[#F4F4F4] text-black p-8 md:p-12 shadow-2xl relative">
              <div className="flex justify-between items-end border-b-2 border-black pb-2 mb-6">
                 <span className="font-bold text-sm tracking-widest uppercase">The Daily Scout</span>
                 <span className="text-xs font-mono uppercase">Vol. 42 // Press Embargo</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8" style={{ fontFamily: '"Impact", sans-serif' }}>
                 BREAKING: <br/> NEW TALENT <br/> IDENTIFIED.
              </h1>

              <div className="flex gap-8 border-t-2 border-black pt-6">
                <div className="w-1/2">
                   <p className="font-medium text-sm leading-relaxed text-justify column-count-1">
                     Rumors confirm that the core intelligence network, Vysion, has successfully indexed the next generational athletes. The media awaits the official release. Secure access required for full details.
                   </p>
                </div>
                <div className="w-1/2 bg-black text-white p-6 flex flex-col justify-between">
                   <h3 className="font-bold uppercase tracking-widest text-xs mb-4">Official Statement</h3>
                   <div className="w-full h-[2px] bg-white mb-4" />
                   <p className="text-3xl font-serif italic mb-4">"No comment until the data is verified."</p>
                   <p className="text-xs uppercase text-gray-400">— Chief Recruiter</p>
                </div>
              </div>
            </div>

            {/* Media Login Portal */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
               <div className="w-full max-w-sm border border-white/20 p-8 backdrop-blur-md bg-white/5 relative">
                  
                  {/* Subtle corner frames */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white" />

                  <h2 className="text-2xl font-bold uppercase tracking-widest mb-2 border-b border-white/20 pb-4 text-center">Press Pass</h2>
                  
                  <form className="space-y-6 mt-8" onSubmit={e=>e.preventDefault()}>
                    <div>
                      <input type="text" className="w-full bg-transparent border-b border-white/40 pb-2 text-center text-xl font-light focus:outline-none focus:border-white transition-colors placeholder:text-white/20" placeholder="Credential ID" />
                    </div>
                    <div>
                      <input type="password" className="w-full bg-transparent border-b border-white/40 pb-2 text-center text-xl font-light focus:outline-none focus:border-white tracking-[0.5em] transition-colors placeholder:text-white/20 placeholder:tracking-normal" placeholder="Passcode" />
                    </div>

                    <button className="w-full bg-white text-black font-black uppercase tracking-[0.3em] py-4 mt-8 hover:bg-black hover:text-white border-2 border-transparent hover:border-white transition-all duration-300">
                      Release Info
                    </button>
                  </form>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
}
