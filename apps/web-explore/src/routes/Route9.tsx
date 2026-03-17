import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export default function Route9() {
  return (
    <div className="min-h-screen bg-[#07090F] text-white font-sans overflow-hidden flex relative">
      
      {/* Pitch Heatmap Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#FF3B30] rounded-full mix-blend-screen filter blur-[150px] opacity-40 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-[#34C759] rounded-full mix-blend-screen filter blur-[120px] opacity-30" />
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#007AFF] rounded-full mix-blend-screen filter blur-[180px] opacity-20" />
      </div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        
        {/* Radar / Analytics side */}
        <div className="lg:col-span-7 p-12 flex flex-col justify-center border-r border-white/10 hidden lg:flex">
          <div className="flex items-center gap-4 mb-16">
            <Activity className="text-[#34C759] w-8 h-8" />
            <h1 className="text-2xl font-semibold tracking-widest text-[#A1A1A6] uppercase">Vysion Analytics Core</h1>
          </div>
          
          <div className="relative w-full aspect-square max-w-lg mx-auto border border-white/5 rounded-full flex items-center justify-center">
            {/* Decentered concentric circles */}
            <div className="absolute inset-4 border border-white/10 rounded-full" />
            <div className="absolute inset-12 border border-white/10 rounded-full" />
            <div className="absolute inset-24 border border-white/10 rounded-full text-center flex items-center justify-center" />
            
            {/* Mock Radar Chart Polygon */}
            <svg className="absolute inset-0 w-full h-full text-[#007AFF]/30" viewBox="0 0 100 100">
              <polygon points="50,10 80,30 90,70 50,90 20,60 30,20" fill="currentColor" stroke="#007AFF" strokeWidth="1" />
            </svg>

            {/* Floating metrics */}
            <motion.div initial={{y:10}} animate={{y:-10}} transition={{repeat:Infinity, repeatType: "reverse", duration:2}} className="absolute top-[10%] left-[45%] text-xs font-mono text-[#A1A1A6]">xG: 0.89</motion.div>
            <motion.div initial={{x:-10}} animate={{x:10}} transition={{repeat:Infinity, repeatType: "reverse", duration:2.5}} className="absolute top-[30%] right-[10%] text-xs font-mono text-[#A1A1A6]">PACE: 94</motion.div>
            <motion.div initial={{y:-5}} animate={{y:5}} transition={{repeat:Infinity, repeatType: "reverse", duration:1.5}} className="absolute bottom-[20%] left-[20%] text-xs font-mono text-[#A1A1A6]">PASS: 88</motion.div>
          </div>
        </div>

        {/* Login Form */}
        <div className="lg:col-span-5 p-8 md:p-16 flex flex-col justify-center bg-transparent backdrop-blur-2xl">
          <div className="mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">Signal to Noise.</h2>
            <p className="text-[#A1A1A6] text-lg font-light leading-relaxed">
              Authenticate to access real-time player telemetry and deep-learning recruitment networks.
            </p>
          </div>

          <form className="space-y-6" onSubmit={e => e.preventDefault()}>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-2 flex items-center focus-within:border-[#007AFF] focus-within:bg-white/10 transition-colors">
              <input type="email" placeholder="scout@club.net" className="w-full bg-transparent border-none text-white px-4 py-3 focus:outline-none" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-2 flex items-center focus-within:border-[#007AFF] focus-within:bg-white/10 transition-colors">
              <input type="password" placeholder="Passphrase" className="w-full bg-transparent border-none text-white px-4 py-3 focus:outline-none" />
            </div>

            <button className="w-full bg-white text-black font-semibold rounded-2xl py-4 mt-8 hover:bg-[#34C759] hover:text-white transition-colors duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Initialize Dashboards
            </button>
            
            <div className="text-center mt-6 text-xs text-[#A1A1A6] font-mono">
              VYSION PROTOCOL v4.9.1
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
