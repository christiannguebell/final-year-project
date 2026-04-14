import { motion } from "motion/react";
import { UserPlus, FileText, CreditCard, Monitor, Award } from "lucide-react";

export const Timeline = () => {
  const steps = [
    {
      id: 1,
      title: "Account Creation",
      desc: "Securely register your credentials and verify your identity on our secure portal.",
      icon: <UserPlus size={24} />,
      color: "border-primary"
    },
    {
      id: 2,
      title: "Application",
      desc: "Select your engineering track and upload necessary academic transcripts and records.",
      icon: <FileText size={24} />,
      color: "border-primary/30"
    },
    {
      id: 3,
      title: "Payment",
      desc: "Complete the examination fee payment via our encrypted institutional gateway.",
      icon: <CreditCard size={24} />,
      color: "border-primary/30"
    },
    {
      id: 4,
      title: "Exam Hub",
      desc: "Attend the virtual or physical examination according to your assigned schedule.",
      icon: <Monitor size={24} />,
      color: "border-secondary"
    },
    {
      id: 5,
      title: "Results",
      desc: "Review your performance analytics and secure your admission offer letter.",
      icon: <Award size={24} />,
      color: "border-primary/30"
    }
  ];

  return (
    <section className="bg-surface-container-low py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-primary mb-4">Your Path to Enrollment</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-lg">
            A streamlined five-step process designed to get you from candidate to student with maximum efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-[2px] bg-outline-variant/20 z-0" />
          
          {steps.map((step, i) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`relative z-10 bg-surface-container-lowest p-8 rounded-2xl shadow-sm border-b-4 ${step.color} hover:translate-y-[-4px] transition-transform duration-300`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-headline font-extrabold text-xl mb-6 ${step.id === 4 ? "bg-secondary text-white" : step.id === 1 ? "bg-primary text-white" : "bg-surface-container-high text-primary"}`}>
                {step.id}
              </div>
              <h4 className="font-headline font-bold text-primary text-lg mb-3">{step.title}</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
