import { motion } from 'framer-motion';
import { PencilLine } from 'lucide-react';

export default function Route20() {
  return (
    <div className="min-h-screen bg-[#EFECE6] text-[#1D1B18] font-serif overflow-hidden flex items-center justify-center p-4">
      
      {/* Torn notebook paper aesthetic */}
      <div className="absolute inset-0 pointer-events-none opacity-50 bg-[linear-gradient(transparent_95%,rgba(0,0,0,0.1)_100%)] bg-[length:100%_40px]" />
      <div className="absolute left-10 top-0 w-[1px] h-full bg-red-400/50 z-0 hidden md:block" />

      <motion.div 
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="relative z-10 w-full max-w-3xl bg-white shadow-[10px_10px_0_0_rgba(0,0,0,0.1)] p-8 md:p-16 border-t-[20px] border-black/80"
      >
        
        <header className="mb-12 border-b-2 border-black pb-8 relative flex justify-between items-end">
          <div className="absolute top-0 right-0 w-16 h-16 opacity-10 rotate-12 bg-[url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\'><circle cx=\\'50\\' cy=\\'50\\' r=\\'45\\' fill=\\'none\\' stroke=\\'%23000\\' stroke-width=\\'2\\'/><text x=\\'20\\' y=\\'55\\' font-family=\\'serif\\' font-size=\\'14\\'>APPROVED</text></svg>')] bg-no-repeat" />
          
          <div>
            <h2 className="text-xl italic text-black/60 mb-1 flex items-center gap-2">
              <PencilLine size={20} /> Field Notes
            </h2>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter" style={{ fontFamily: '"Arial Black", sans-serif' }}>VYSION.</h1>
          </div>
          
          <div className="text-right text-xs uppercase font-bold tracking-widest hidden md:block">
            Date: <span className="underline decoration-dashed text-blue-800 ml-2 italic text-lg">Current Season</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm leading-relaxed text-black/80 font-mono">
          
          <div className="pr-4 border-r-0 md:border-r border-dashed border-black/30">
            <p className="mb-6 font-handwriting text-xl italic text-blue-900 leading-loose">
              Needs access to the master database. The raw stuff. None of the polished agency noise. Real metrics.
            </p>
            <p className="uppercase font-bold text-black border border-black p-2 bg-yellow-100 inline-block rotate-[-2deg]">
              URGENT REQUIREMENT
            </p>
          </div>

          <div>
            <h3 className="uppercase tracking-widest font-bold mb-6 text-black border-b border-black pb-2">Scout Login</h3>
            
            <form className="space-y-8" onSubmit={e=>e.preventDefault()}>
              <div>
                <label className="block text-xs uppercase mb-1">Affiliation / Club</label>
                <input type="text" className="w-full bg-transparent border-b border-black font-bold py-2 focus:outline-none focus:border-blue-600 transition-colors" defaultValue="Head Scout" />
              </div>

              <div>
                <label className="block text-xs uppercase mb-1">Access Token</label>
                <input type="password" className="w-full bg-transparent border-b border-black font-bold py-2 focus:outline-none focus:border-blue-600 transition-colors tracking-widest" defaultValue="password" />
              </div>

              <button className="w-full border-2 border-black py-4 uppercase font-black hover:bg-black hover:text-white transition-colors mt-4 text-center block">
                Open Notebook
              </button>
            </form>
          </div>

        </div>

      </motion.div>
    </div>
  );
}
