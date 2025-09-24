// src/components/CTAEducation.jsx
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Users, Trophy } from "lucide-react";

const CTA = () => {
  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-green-600 via-green-500 to-blue-600 py-20 flex items-center justify-center">
      <div className="max-w-5xl mx-auto px-6 text-center text-white">
        {/* Main Heading */}
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Transform your{" "}
          <span className="text-yellow-300">classroom experience</span>.
          <br />
          Start learning with games today.
        </motion.h1>

        {/* Divider */}
        <motion.div
          className="w-24 h-1 bg-yellow-300 mx-auto my-8 rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: 96 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
        />

        {/* Features */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          viewport={{ once: true }}
        >
          {[
            { icon: BookOpen, text: "Interactive Lessons" },
            { icon: Users, text: "Collaborative Learning" },
            { icon: Trophy, text: "Gamified Progress" },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-center gap-3">
              <item.icon size={24} className="text-yellow-300" />
              <span className="text-lg font-medium">{item.text}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          viewport={{ once: true }}
        >
          <button className="px-8 py-4 bg-white text-green-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
            Get started for free
            <ArrowRight size={20} />
          </button>

          <button className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-green-600 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
            See how it works
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
