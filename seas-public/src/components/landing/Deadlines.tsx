import { motion } from "motion/react";
import { Info } from "lucide-react";

export const Deadlines = () => {
  const dates = [
    { phase: "Phase 1: Early Bird", title: "Registration Opens", date: "SEP 15", year: "2024", highlight: true },
    { phase: "Standard Close", title: "Form Submission", date: "OCT 30", year: "2024", highlight: false },
    { phase: "Main Event", title: "Entrance Exam", date: "NOV 12", year: "2024", highlight: true },
    { phase: "Final Phase", title: "Result Publication", date: "DEC 05", year: "2024", highlight: false }
  ];

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="lg:w-1/3">
          <h2 className="text-4xl font-headline font-extrabold text-primary mb-6">Key Dates & <br />Deadlines</h2>
          <p className="text-on-surface-variant text-lg mb-10 leading-relaxed">
            Stay ahead of the competition by ensuring all your milestones are met within the academic calendar.
          </p>
          
          <div className="p-6 bg-secondary/5 rounded-2xl border-l-4 border-secondary flex gap-4">
            <Info className="text-secondary shrink-0" size={24} />
            <p className="text-sm font-medium text-on-surface leading-relaxed">
              Applications received after the final deadline will be moved to the waitlist for the next semester.
            </p>
          </div>
        </div>

        <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {dates.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl border border-outline-variant/30 hover:border-secondary/30 transition-colors flex justify-between items-start group"
            >
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${item.highlight ? "text-secondary" : "text-on-surface-variant/60"}`}>
                  {item.phase}
                </p>
                <h4 className="text-xl font-headline font-bold text-primary group-hover:text-secondary transition-colors">{item.title}</h4>
              </div>
              <div className="text-right">
                <p className="text-2xl font-headline font-extrabold text-primary">{item.date}</p>
                <p className="text-[10px] text-on-surface-variant/40 font-bold uppercase tracking-widest">{item.year}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};