// src/components/Features.jsx
import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useTranslation } from "react-i18next";

const Features = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const features = [
    {
      title: t("games"),
      subtitle: t("experienceVirtualLabs"),
      description: t("safeInteractiveLabs"),
      img: "/game-preview.png",
      button: t("exploreLabs"),
      color: "from-green-500 to-green-600",
      icon: "🎮",
    },
    {
      title: t("virtualLabs"),
      subtitle: t("experienceVirtualLabs"),
      description: t("safeInteractiveLabs"),
      img: "/lab-preview.png",
      button: t("exploreLabs"),
      color: "from-indigo-500 to-purple-600",
      icon: "🔬",
    },
  ];

  // Track when section enters viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Only start feature switching when section is visible
  const featureProgress = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0, 1, 1, 1] // Only change between 30% and 70% scroll progress
  );

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Section becomes visible when scroll progress > 0.1
      if (latest > 0.1 && !isVisible) {
        setIsVisible(true);
      } else if (latest <= 0.1 && isVisible) {
        setIsVisible(false);
      }

      // Change feature only when section is visible
      if (latest > 0.3 && latest < 0.7) {
        const progressInRange = (latest - 0.3) / 0.4; // Normalize to 0-1
        const newIndex = Math.floor(progressInRange * features.length);
        setActiveIndex(Math.min(newIndex, features.length - 1));
      }
    });

    return () => unsubscribe();
  }, [isVisible]);

  // Smooth entrance animation
  const y = useTransform(scrollYProgress, [0, 0.2], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="w-full min-h-screen bg-white flex items-center justify-center py-20"
    >
      <div className="max-w-7xl mx-auto px-6 w-full">
        {/* Section Header */}
        <motion.div style={{ y, opacity }} className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            {t("exploreOurLearningTools")}{" "}
            <span className="text-green-600">{t("learningTools")}</span>
          </h2>
          <p className="text-lg text-gray-600">{t("scrollToDiscover")}</p>
        </motion.div>

        {/* Features Container - Normal Flow (No Fixed Positioning) */}
        <div className="relative h-auto min-h-[600px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              className="grid lg:grid-cols-2 gap-12 items-center w-full"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            >
              {/* Left Side - Feature Visual */}
              <motion.div
                className="flex justify-center order-2 lg:order-1"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`relative w-full max-w-md h-80 bg-gradient-to-br ${features[activeIndex].color} rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center`}
                >
                  <div className="text-white text-center p-8">
                    <motion.div
                      className="text-8xl mb-6"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      {features[activeIndex].icon}
                    </motion.div>
                    <h3 className="text-3xl font-bold mb-4">
                      {features[activeIndex].title}
                    </h3>
                    <p className="text-lg opacity-90">
                      {t("interactiveLearningExperience")}
                    </p>
                  </div>

                  {/* Floating elements */}
                  <motion.div
                    className="absolute top-6 right-6 w-16 h-16 bg-white/20 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute bottom-6 left-6 w-12 h-12 bg-white/20 rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  />
                </div>
              </motion.div>

              {/* Right Side - Feature Content */}
              <motion.div
                className="order-1 lg:order-2 text-center lg:text-left"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              >
                <motion.h3
                  className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {features[activeIndex].subtitle}
                </motion.h3>

                <motion.p
                  className="text-lg text-gray-600 mb-8 leading-relaxed"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {features[activeIndex].description}
                </motion.p>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <button
                    className={`px-8 py-4 bg-gradient-to-r ${features[activeIndex].color} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg`}
                  >
                    {features[activeIndex].button}
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Dots */}
        <motion.div
          className="flex justify-center mt-12 space-x-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 0.5 }}
        >
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? `bg-gradient-to-r ${features[activeIndex].color} w-8`
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
