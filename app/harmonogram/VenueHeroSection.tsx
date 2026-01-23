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
    <section className="flex flex-col md:flex-row w-full pt-20 md:pt-24 pb-12 overflow-hidden">
      {/* Lewa kolumna – slider */}
      <div className="w-full md:w-1/2 relative h-[300px] md:h-[500px] shadow-2xl md:ml-12 rounded-r-3xl overflow-hidden border-y-4 border-r-4 border-[#4E0113]/20">
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
          className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-[#841D30] transition"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-[#841D30] transition"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Prawa kolumna – opis */}
      <div className="w-full md:w-1/2 px-6 md:px-16 flex flex-col justify-center text-[#4E0113] mt-8 md:mt-0">
        <AnimatedText
          text="Stara Szwajcaria"
          className="text-4xl md:text-6xl font-black mb-2 text-left tracking-tighter"
          mode="letters"
        />
        <AnimatedText
          text="Gliwice, ul. Łabędzka 6"
          className="text-xl font-medium mb-8 opacity-80"
          mode="line"
          delay={0.3}
        />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/40 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-[#4E0113]/10"
        >
          <p className="text-lg leading-relaxed mb-4 text-[#4E0113]">
            To tutaj rozegra się akcja naszego filmu. Park, plac zabaw dla najmłodszych, a w środku – przestrzeń, która pomieści zarówno szalone tańce, jak i multimedialne widowisko.
          </p>
          <p className="text-lg leading-relaxed font-semibold">
            Przygotujcie się na 4 Akty pełne emocji!
          </p>
        </motion.div>
      </div>
    </section>
  );
}