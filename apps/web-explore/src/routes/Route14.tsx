import { motion } from 'framer-motion';
import { Fingerprint, Scan, Activity } from 'lucide-react';

export default function Route14() {
  return (
    <div className="min-h-screen bg-[#00050A] text-[#00FFFF] font-mono overflow-hidden flex items-center justify-center relative">
      
      {/* Cybernetic grid background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[length:50px_50px] [transform:perspective(500px)_rotateX(60deg)_translateY(-100px)_scale(2)] opacity-50" />
      
      <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_at_center,transparent_0%,#00050A_80%)] z-0 pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl p-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
          className="flex flex-col items-center md:items-start text-center md:text-left"
        >
          <div className="w-24 h-24 rounded-full border border-[#00FFFF]/30 flex items-center justify-center mb-8 relative">
            <div className="absolute inset-2 border-t-2 border-[#00FFFF] rounded-full animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-4 border-b-2 border-[#00FFFF]/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }} />
            <Scan className="w-8 h-8 text-[#00FFFF]" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-widest uppercase mb-4 text-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
            Biometric
          </h1>
          <h2 className="text-3xl tracking-widest uppercase text-[#00FFFF]/70 mb-8 font-light">
            Analysis
          </h2>

          <p className="text-sm tracking-widest leading-loose text-[#00FFFF]/50 max-w-sm">
            PHYSICAL TELEMETRY. RECOVERY METRICS. KINEMATIC PROFILING. 
            <br/><br/>
            ACCESS RESTRICTED TO MEDICAL & SPORT SCIENCE DEPARTMENTS.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-[#00111A]/80 border border-[#00FFFF]/30 backdrop-blur-md p-8 relative overflow-hidden"
        >
          {/* Scanning line effect */}
          <motion.div 
            animate={{ top: ['-10%', '110%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 w-full h-1 bg-[#00FFFF] opacity-50 shadow-[0_0_20px_#00FFFF] z-0" 
          />

          <div className="relative z-10">
            <div className="flex justify-between items-end mb-8 border-b border-[#00FFFF]/20 pb-4">
              <span className="text-xs tracking-widest uppercase">Identity Verification</span>
              <Activity className="w-4 h-4 text-[#00FFFF]/50" />
            </div>

            <form className="space-y-8" onSubmit={e=>e.preventDefault()}>
              <div className="relative">
                <input type="text" className="w-full bg-transparent border-b border-[#00FFFF]/30 text-[#00FFFF] py-2 focus:outline-none focus:border-[#00FFFF] transition-colors pl-8 text-sm" placeholder="ID.NUMBER //" />
                <span className="absolute left-0 top-2 text-[#00FFFF]/50 text-xs text-mono">&gt;</span>
              </div>
              
              <div className="relative">
                <input type="password" className="w-full bg-transparent border-b border-[#00FFFF]/30 text-[#00FFFF] py-2 focus:outline-none focus:border-[#00FFFF] transition-colors pl-8 text-sm tracking-widest" placeholder="KEY.SEQUENCE //" />
                <span className="absolute left-0 top-2 text-[#00FFFF]/50 text-xs text-mono">&gt;</span>
              </div>

              <div className="flex flex-col items-center justify-center pt-8">
                <button className="group relative w-32 h-32 rounded-full border border-[#00FFFF]/30 hover:border-[#00FFFF] flex items-center justify-center transition-colors bg-[#00FFFF]/5 hover:bg-[#00FFFF]/10 focus:outline-none">
                   <Fingerprint className="w-12 h-12 text-[#00FFFF]/50 group-hover:text-[#00FFFF] transition-colors" />
                   <div className="absolute inset-0 rounded-full border border-[#00FFFF]/0 group-hover:animate-ping" />
                </button>
                <span className="mt-4 text-[10px] tracking-widest uppercase text-[#00FFFF]/50">Initiate Scan</span>
              </div>
            </form>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
