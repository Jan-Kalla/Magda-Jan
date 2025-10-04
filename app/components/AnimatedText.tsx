"use client";
import { motion } from "framer-motion";

const AnimatedText = ({ text }: { text: string }) => {
  return (
    <div className="text-2xl font-semibold mb-4 drop-shadow flex flex-wrap justify-center">
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
};

export default AnimatedText;
