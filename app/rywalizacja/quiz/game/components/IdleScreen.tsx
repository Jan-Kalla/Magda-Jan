"use client";
import { motion } from "framer-motion";
import { TrophyIcon } from "@heroicons/react/24/solid";

export default function IdleScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center bg-white/50 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-[#4E0113]/10 max-w-md w-full mx-auto"
    >
      <div className="w-20 h-20 bg-[#4E0113] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
        <TrophyIcon className="w-10 h-10 text-[#FAD6C8]" />
      </div>
      <h1 className="text-3xl font-bold text-[#4E0113] mb-2">Wielki Quiz</h1>
      <p className="text-lg text-[#4E0113]/80 mb-6">Czekaj na to co powie pan młody!</p>
      <div className="flex items-center justify-center gap-3 bg-white/60 py-3 px-6 rounded-full inline-flex">
        <div className="animate-spin text-2xl">⏳</div>
        <span className="font-semibold text-[#4E0113]">Czekamy na pytanie...</span>
      </div>
    </motion.div>
  );
}