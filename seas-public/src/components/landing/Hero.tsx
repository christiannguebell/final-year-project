import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative flex h-[85vh] min-h-[700px] items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJPoApQ3Il2Z5a1lB3wWS7Se6f_YsPvb4-DV5YRhAjeibTC7vyHgGAKrBL1mnOphvjMaxN0nRlcOS9_PEOuSWxQv9EWs8t79ckTOQnXzHD17kb7o0Kr7SA20H9KTr-MK9OHM5bItgt_wYfy1YA0twlDBNKxYcxPbEdBe5_VgeYcJvkCykFUZX4Upikc-M4DBxuyzsA9JbBI785uWAaiBxerAi5YoH0XL8vr9B59gwO4z9OclaE2tOxqt0C-ROtfqM7ff3g5-KdT0X-"
          alt="SEAS Campus"
          className="h-full w-full object-cover brightness-[0.4] grayscale-[0.3]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/20 px-3 py-1">
            <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
            <span className="text-[10px] font-bold tracking-widest text-secondary uppercase">
              Academic Session 2024-25
            </span>
          </div>

          <h1 className="mb-8 font-headline text-5xl leading-[1.1] font-extrabold tracking-tighter text-white md:text-7xl">
            Engineering Your <br />
            <span className="text-secondary-fixed">Future</span> Success.
          </h1>

          <p className="mb-10 max-w-lg text-lg leading-relaxed font-medium text-white/80 md:text-xl">
            Join the next generation of innovators at the School of Engineering and Applied Sciences. Our
            streamlined examination portal ensures a focused, transparent, and seamless path to enrollment.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="rounded-xl bg-secondary px-8 py-4 font-headline text-lg font-bold text-white shadow-lg shadow-secondary/20 transition-all hover:-translate-y-0.5 active:scale-95"
            >
              New Registration
            </button>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('programs');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else navigate('/login', { state: { from: '/programs' } });
              }}
              className="rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-headline text-lg font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
            >
              Explore Programs
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
