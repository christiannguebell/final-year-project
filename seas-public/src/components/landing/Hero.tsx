import { motion } from "motion/react";

export const Hero = () => {
  return (
    <section className="relative h-[85vh] min-h-[700px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJPoApQ3Il2Z5a1lB3wWS7Se6f_YsPvb4-DV5YRhAjeibTC7vyHgGAKrBL1mnOphvjMaxN0nRlcOS9_PEOuSWxQv9EWs8t79ckTOQnXzHD17kb7o0Kr7SA20H9KTr-MK9OHM5bItgt_wYfy1YA0twlDBNKxYcxPbEdBe5_VgeYcJvkCykFUZX4Upikc-M4DBxuyzsA9JbBI785uWAaiBxerAi5YoH0XL8vr9B59gwO4z9OclaE2tOxqt0C-ROtfqM7ff3g5-KdT0X-" 
          alt="SEAS Campus"
          className="w-full h-full object-cover grayscale-[0.3] brightness-[0.4]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 border border-secondary/30 mb-8">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-secondary font-bold text-[10px] tracking-widest uppercase">Academic Session 2024-25</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-white leading-[1.1] tracking-tighter mb-8">
            Engineering Your <br />
            <span className="text-secondary-fixed">Future</span> Success.
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 font-medium leading-relaxed mb-10 max-w-lg">
            Join the next generation of innovators at the School of Engineering and Applied Sciences. Our streamlined examination portal ensures a focused, transparent, and seamless path to enrollment.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-4 bg-secondary text-white rounded-xl font-headline font-bold text-lg hover:translate-y-[-2px] transition-all shadow-lg shadow-secondary/20 active:scale-95">
              New Registration
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl font-headline font-bold text-lg hover:bg-white/20 transition-all active:scale-95">
              Explore Programs
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};