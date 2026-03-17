import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Eye } from 'lucide-react';

export default function Route4() {

  return (
    <div className="min-h-screen bg-[#FFE5F1] text-black font-sans overflow-hidden selection:bg-[#FF90E8] selection:text-black" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
      
      {/* Playful Background Elements */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute -top-20 -right-20 w-96 h-96 bg-[#FF90E8] rounded-full border-4 border-black mix-blend-multiply opacity-50 blur-3xl"
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-10 -left-10 w-72 h-72 bg-[#90E8FF] rounded-full border-4 border-black mix-blend-multiply opacity-50 blur-3xl"
      />

      <nav className="p-6 md:p-8 flex justify-between items-center relative z-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 border-4 border-black bg-[#90E8FF] px-4 py-2 rounded-2xl shadow-[4px_4px_0_0_#000]">
          <Eye className="w-6 h-6 stroke-[3]" />
          <span className="text-2xl font-bold uppercase tracking-tight">Vysion</span>
        </div>
        <button className="hidden md:block border-4 border-black bg-[#FFDE59] px-6 py-2 rounded-2xl shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-bold text-lg">
          Log In ✌️
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 md:px-8 mt-12 md:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
        
        {/* Left Col */}
        <div className="flex flex-col justify-center">
          <div className="inline-block border-4 border-black bg-white px-4 py-2 rounded-full w-max shadow-[4px_4px_0_0_#000] mb-8 font-bold flex items-center gap-2 transform -rotate-2">
            <Sparkles className="w-5 h-5 text-[#FF90E8] stroke-[3]" /> New: AI Scout Assistant
          </div>
          
          <h1 className="text-6xl md:text-[5.5rem] leading-[1.1] font-black tracking-tight mb-8">
            Find the <br/> next <span className="bg-[#FF90E8] border-4 border-black px-4 rounded-3xl shadow-[8px_8px_0_0_#000] inline-block -rotate-3 mt-4">superstars</span> <br/> before they do.
          </h1>
          
          <p className="text-xl font-medium mb-12 max-w-md leading-relaxed">
            Scouting shouldn't be boring. Dive into our colorful data playground to discover hidden gems worldwide.
          </p>

          <div className="flex gap-4">
            <button className="bg-[#A0FF90] border-4 border-black px-8 py-4 rounded-2xl shadow-[6px_6px_0_0_#000] hover:translate-x-[6px] hover:translate-y-[6px] hover:shadow-none transition-all font-bold text-xl flex items-center gap-3 w-max">
              Start Exploring <ArrowRight className="w-6 h-6 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Right Col - Neo-Brutalist Form */}
        <div className="relative">
          <motion.div 
            initial={{ y: 0 }}
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="bg-white border-4 border-black rounded-3xl p-8 md:p-12 shadow-[12px_12px_0_0_#000] relative z-20"
          >
            <div className="absolute -top-6 -right-6 bg-[#FFDE59] border-4 border-black w-16 h-16 rounded-full flex items-center justify-center shadow-[4px_4px_0_0_#000] text-3xl font-black rotate-12">
              !
            </div>
            
            <h2 className="text-3xl font-black mb-2">Club Access</h2>
            <p className="font-medium text-black/60 mb-8 border-b-4 border-black/10 pb-4">Welcome back! Ready to find some talent?</p>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block font-bold mb-2 text-lg">Email Address</label>
                <input 
                  type="email" 
                  defaultValue="scout@club.com"
                  className="w-full border-4 border-black bg-[#F4F4F4] px-4 py-4 rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] focus:bg-white focus:outline-none focus:ring-0 transition-colors font-bold text-lg"
                />
              </div>
              
              <div>
                <label className="block font-bold mb-2 text-lg">Password</label>
                <input 
                  type="password" 
                  defaultValue="password123"
                  className="w-full border-4 border-black bg-[#F4F4F4] px-4 py-4 rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] focus:bg-white focus:outline-none focus:ring-0 transition-colors font-bold text-lg"
                />
              </div>

              <motion.button 
                whileTap={{ scale: 0.95 }}
                className="w-full bg-[#FF90E8] border-4 border-black py-4 rounded-xl shadow-[6px_6px_0_0_#000] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all font-black text-2xl uppercase mt-4"
              >
                Let's Go! 🚀
              </motion.button>
            </form>
          </motion.div>

          {/* Decorative Blocks */}
          <div className="absolute -bottom-8 -left-8 bg-[#90E8FF] border-4 border-black w-24 h-24 rounded-2xl shadow-[4px_4px_0_0_#000] z-10 -rotate-12"></div>
        </div>
      </main>

    </div>
  );
}
