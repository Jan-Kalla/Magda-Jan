"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AnimatedText from "@/app/components/AnimatedText";

const images = [
  "/fotki/Szwajcaria1.jpg",
  "/fotki/Szwajcaria2.jpg",
];

export default function VenueHeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [current]);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <section className="flex flex-col md:flex-row w-full pt-20 md:pt-28 pb-12 overflow-hidden items-center">
      {/* Lewa kolumna – slider */}
      <div className="w-full md:w-1/2 relative h-[300px] md:h-[500px] shadow-2xl md:ml-12 rounded-2xl md:rounded-r-3xl md:rounded-l-none overflow-hidden border border-white/30 mx-4 md:mx-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={images[current]}
            alt="Sala weselna Stara Szwajcaria"
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.5 } }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          />
        </AnimatePresence>

        <button
          onClick={prevSlide}
          className="absolute bottom-4 left-4 bg-black/20 backdrop-blur-md border border-white/20 text-white p-3 rounded-full hover:bg-white/20 transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute bottom-4 right-4 bg-black/20 backdrop-blur-md border border-white/20 text-white p-3 rounded-full hover:bg-white/20 transition-all"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Prawa kolumna – opis */}
      <div className="w-full md:w-1/2 px-6 md:px-16 flex flex-col justify-center mt-12 md:mt-0">
        <AnimatedText
          text="Stara Szwajcaria"
          className="font-serif text-4xl md:text-6xl font-light mb-4 text-[#2C2B14] drop-shadow-md tracking-wide"
          mode="letters"
        />
        <AnimatedText
          text="Gliwice, ul. Łabędzka 6"
          className="font-sans font-light uppercase tracking-[0.2em] text-sm md:text-base text-[#2C2B14]/80 mb-10"
          mode="line"
          delay={0.3}
        />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/30 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-white/50 relative overflow-hidden"
        >
          <p className="font-sans font-light text-lg leading-relaxed mb-6 text-[#2C2B14]">
            To tutaj rozegra się akcja naszego filmu. Park, plac zabaw dla najmłodszych, a w środku – przestrzeń, która pomieści zarówno szalone tańce, jak i multimedialne widowisko.
          </p>
          <p className="font-serif italic text-xl text-[#2C2B14] tracking-wide">
            Przygotujcie się na 4 Akty pełne emocji.
          </p>
        </motion.div>
      </div>
    </section>
  );
}