// src/components/Hero.jsx
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import hero from "../assets/hero.png";

const Hero = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Smooth parallax effects
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-white min-h-screen flex items-center justify-center"
      style={{ perspective: "1000px" }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col-reverse lg:flex-row items-center gap-12 w-full relative z-10">
        {/* Left Text Section */}
        <motion.div
          style={{ y: textY, opacity }}
          className="flex-1 text-center lg:text-left"
        >
          <motion.h1
            className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t("learnWithInteractiveGames")}{" "}
            <span className="text-green-600">{t("games")}</span>
            <br />
            {t("boostYourLearningJourney")}
          </motion.h1>

          <motion.p
            className="mt-6 text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t("playAndLearn")}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <a
              href="/home"
              className="px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              {t("startNow")}
            </a>

            <a
              href="#about"
              className="px-8 py-4 border-2 border-green-600 text-green-600 text-lg font-semibold rounded-xl hover:bg-green-600 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              {t("learnMore")}
            </a>
          </motion.div>
        </motion.div>

        {/* Right Image Section */}
        <motion.div
          style={{ y: imageY, opacity }}
          className="flex-1 flex justify-center"
        >
          <motion.img
            src={hero}
            alt={t("studentsLearning")}
            className="rounded-2xl shadow-2xl w-full max-w-md lg:max-w-lg"
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            whileHover={{
              scale: 1.05,
              rotate: 1,
              transition: { duration: 0.3 },
            }}
          />
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-sm mb-2">{t("scrollToExplore")}</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-gray-400 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
