"use client";
import { motion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  mode?: "letters" | "line";
}

const AnimatedText = ({ text, className = "", delay = 0, mode = "letters" }: AnimatedTextProps) => {
  if (mode === "line") {
    return (
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, delay }}
        className={className}
      >
        {text}
      </motion.p>
    );
  }

  // tryb "letters"
  return (
    <div className={`flex flex-wrap justify-center ${className}`}>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.3, delay: index * 0.05 + (delay ?? 0) }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
};

export default AnimatedText;

