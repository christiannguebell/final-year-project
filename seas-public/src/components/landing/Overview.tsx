import { motion } from "motion/react";
import { CheckCircle2, ArrowRight } from "lucide-react";

export const Overview = () => {
  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-8 bg-surface-container-lowest p-10 md:p-14 rounded-3xl shadow-sm"
        >
          <h2 className="text-3xl md:text-4xl font-headline font-extrabold text-primary mb-6">Pioneering Progress at SEAS</h2>
          <p className="text-lg text-on-surface-variant leading-relaxed mb-12 max-w-3xl">
            The School of Engineering and Applied Sciences is more than an institution; it is a laboratory for the future. We combine rigorous academic theory with hands-on technical application, preparing our candidates for the complexities of a globalized engineering landscape.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[
              { label: "Global Ranking", value: "#12" },
              { label: "Research Labs", value: "45+" },
              { label: "Placement Rate", value: "98%" }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <span className="text-5xl font-headline font-extrabold text-secondary">{stat.value}</span>
                <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-4 bg-primary p-10 md:p-12 rounded-3xl text-white flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center mb-6">
              <CheckCircle2 className="text-secondary-fixed" size={28} />
            </div>
            <h3 className="text-2xl font-headline font-bold mb-4">Accredited Excellence</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Our programs are globally recognized and fully accredited, ensuring your degree carries weight in any industry worldwide.
            </p>
          </div>
          
          <button className="mt-12 group flex items-center gap-2 text-secondary-fixed font-headline font-bold text-lg hover:gap-4 transition-all">
            Learn More <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
