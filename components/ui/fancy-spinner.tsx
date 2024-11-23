"use client";

import { motion } from "framer-motion";

export function FancySpinner({ size = 40, text = "Loading" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <motion.div className="relative" style={{ width: size * 2, height: size * 2 }}>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary/80"
            style={{ backgroundImage: 'linear-gradient(transparent, transparent)', }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
          />
        ))}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(var(--primary), 0.1) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      <motion.div
        className="text-primary/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", }}>
          {text}
        </motion.span>
      </motion.div>
    </div>
  );
}