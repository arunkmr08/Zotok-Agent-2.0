"use client";

import { motion } from "motion/react";

export function TypingIndicator() {
  const dotVariants = {
    initial: { y: 0, opacity: 0.3 },
    animate: {
      y: [0, -4, 0],
      opacity: [0.3, 1, 0.3],
    },
  };

  const transitionSettings = (delay: number) => ({
    duration: 1.2,
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay,
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 500, damping: 25 }}
      className="flex items-start w-full"
    >
      <div className="bg-[#f0f0f0] dark:bg-[#1f1f1f] rounded-[20px] px-[16px] py-[12px] max-w-[90%] md:max-w-[85%] flex items-center gap-1.5 min-h-[40px] shadow-sm">
        <span className="sr-only">AI is generating response...</span>
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-[#8c8c8c]"
          variants={dotVariants}
          initial="initial"
          animate="animate"
          transition={transitionSettings(0)}
        />
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-[#8c8c8c]"
          variants={dotVariants}
          initial="initial"
          animate="animate"
          transition={transitionSettings(0.2)}
        />
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-[#8c8c8c]"
          variants={dotVariants}
          initial="initial"
          animate="animate"
          transition={transitionSettings(0.4)}
        />
      </div>
    </motion.div>
  );
}
