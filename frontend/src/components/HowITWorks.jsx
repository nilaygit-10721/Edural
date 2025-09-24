// src/components/HowItWorks.jsx
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Sign Up & Create Profile",
    description: "Quick registration to start your learning journey",
    icon: "👤",
    color: "from-blue-500 via-cyan-500 to-cyan-600",
  },
  {
    number: "02",
    title: "Choose Learning Path",
    description: "Select games, labs, or quizzes based on your interests",
    icon: "🎯",
    color: "from-purple-500 via-fuchsia-500 to-pink-600",
  },
  {
    number: "03",
    title: "Start Interactive Learning",
    description: "Engage with immersive educational content",
    icon: "🚀",
    color: "from-green-500 via-teal-500 to-emerald-600",
  },
  {
    number: "04",
    title: "Track Progress & Improve",
    description: "Monitor your growth and achievements",
    icon: "📈",
    color: "from-orange-500 via-rose-500 to-red-600",
  },
];

const HowItWorks = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // Changed offset to prevent overflow into next section
    offset: ["start end", "end center"],
  });

  // Animate header with better bounds
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section
      ref={sectionRef}
      // Removed min-h-screen to let content determine height naturally
      className="w-full bg-gradient-to-b from-gray-50 via-white to-gray-100 py-16 md:py-24 flex items-center relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 w-full">
        {/* Header */}
        <motion.div
          style={{ opacity, y }}
          className="text-center mb-16 md:mb-20 relative"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
            How It{" "}
            <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple steps to start your interactive learning journey
          </p>
        </motion.div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Animated Vertical Line with better scaling */}
          <motion.div
            className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-green-500 to-purple-500 hidden lg:block"
            style={{
              scaleY: useTransform(scrollYProgress, [0.2, 0.8], [0, 1]),
              transformOrigin: "top",
            }}
          />

          <div className="space-y-12 md:space-y-16 lg:space-y-20 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className={`flex flex-col lg:flex-row items-center gap-8 md:gap-10 ${
                  index % 2 === 0 ? "lg:flex-row-reverse" : ""
                }`}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.2,
                  ease: "easeOut",
                }}
                viewport={{ once: true, margin: "-50px" }}
              >
                {/* Step Content */}
                <motion.div
                  className="lg:w-1/2 text-center lg:text-left"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.span
                    className="text-5xl md:text-6xl lg:text-7xl mb-4 md:mb-6 block"
                    whileHover={{
                      rotate: [0, -10, 10, 0],
                      transition: { duration: 0.6 },
                    }}
                  >
                    {step.icon}
                  </motion.span>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
                    {step.title}
                  </h3>
                  <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>

                {/* Step Number Circle */}
                <motion.div
                  className="lg:w-1/2 flex justify-center lg:justify-start"
                  whileHover={{ scale: 1.1 }}
                >
                  <div
                    className={`relative bg-gradient-to-r ${step.color} w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center shadow-2xl group`}
                  >
                    <span className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                      {step.number}
                    </span>
                    {/* Pulse Animation */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-white/40"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: index * 0.2,
                      }}
                    />
                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-full bg-white/10 blur-xl opacity-70 group-hover:opacity-100 transition" />
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <motion.div
          className="text-center mt-16 md:mt-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.button
            whileHover={{
              scale: 1.1,
              boxShadow: "0px 0px 25px rgba(16,185,129,0.7)",
            }}
            whileTap={{ scale: 0.95 }}
            className="relative px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white text-lg font-semibold rounded-2xl shadow-lg overflow-hidden"
          >
            <span className="relative z-10">Get Started Today</span>
            {/* Shimmer Effect */}
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
