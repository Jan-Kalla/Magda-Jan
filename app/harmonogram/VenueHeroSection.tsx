"use client";

import { motion } from "framer-motion";
import AnimatedText from "@/app/components/AnimatedText";
import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { useSound } from "@/app/context/SoundContext";

const images = [
  "/fotki/Szwajcaria1.jpg",
  "/fotki/Szwajcaria2.jpg",
  "/fotki/Szwajcaria3.jpg",
  "/fotki/Szwajcaria4.jpg",
  "/fotki/Szwajcaria5.jpg",
  "/fotki/Szwajcaria_6.jpg",
  "/fotki/Szwajcaria7.jpg",
  "/fotki/Szwajcaria8.jpg",
];

// Powielona tablica do płynnej, nieskończonej pętli
const duplicatedImages = [...images, ...images];

export default function VenueHeroSection() {
  const { playSound } = useSound();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Stan pauzy
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);

  // Refy do kontrolowania płynnego przewijania taśmy
  const directionRef = useRef<1 | -1>(1); 
  const speedMultiplierRef = useRef<number>(1); 
  const exactScrollRef = useRef<number>(0); 

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId: number;
    const baseSpeed = 0.5; // Prędkość bazowa
    exactScrollRef.current = el.scrollLeft;

    const step = () => {
      const halfWidth = el.scrollWidth / 2;
      const isManuallyMoving = speedMultiplierRef.current > 1;

      // Poruszamy się jeśli NIE jest zapauzowane LUB jeśli trzymamy strzałkę
      if (!isPausedRef.current || isManuallyMoving) {
        exactScrollRef.current += baseSpeed * directionRef.current * speedMultiplierRef.current;

        // Zapętlanie w obie strony
        if (exactScrollRef.current >= halfWidth) {
          exactScrollRef.current -= halfWidth;
        } else if (exactScrollRef.current <= 0) {
          exactScrollRef.current += halfWidth;
        }

        el.scrollLeft = exactScrollRef.current;
      }

      animationId = requestAnimationFrame(step);
    };

    animationId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const handlePointerDown = (direction: 1 | -1) => {
    directionRef.current = direction;
    speedMultiplierRef.current = 5; // Przyspieszenie 5x
  };

  const handlePointerUp = () => {
    speedMultiplierRef.current = 1; // Powrót do normy
  };

  const togglePause = () => {
    playSound("click");
    const newPaused = !isPaused;
    setIsPaused(newPaused);
    isPausedRef.current = newPaused;
  };

  return (
    <section className="flex flex-col md:flex-row w-full pt-20 md:pt-28 pb-16 items-center">
      
      {/* Lewa kolumna – slider (taśma zdjęć ze sterowaniem) */}
      <div className="w-[calc(100%-2rem)] md:w-1/2 relative h-[300px] md:h-[500px] shadow-2xl rounded-2xl md:rounded-3xl overflow-hidden border border-white/30 mx-auto md:ml-12 md:mr-0 bg-black/10 backdrop-blur-sm group select-none">
        
        {/* LEWA STRZAŁKA */}
        <button
          onPointerDown={() => handlePointerDown(-1)}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 active:bg-black/90 active:scale-95 text-white p-2 md:p-3 rounded-full backdrop-blur-md opacity-80 md:opacity-0 group-hover:opacity-100 transition-all duration-200 touch-none"
          aria-label="Przewiń w lewo"
        >
          <ChevronLeftIcon className="w-6 h-6 md:w-8 md:h-8 pointer-events-none" />
        </button>

        {/* PRZYCISK PAUZY (Centrum Dół) */}
        <button
          onClick={togglePause}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/40 hover:bg-black/70 active:bg-black/90 active:scale-95 text-white p-3 rounded-full backdrop-blur-md opacity-80 md:opacity-0 group-hover:opacity-100 transition-all duration-200 touch-none flex items-center justify-center"
          aria-label="Zatrzymaj przewijanie"
        >
          {isPaused ? (
            <PlayIcon className="w-6 h-6 md:w-7 md:h-7" />
          ) : (
            <PauseIcon className="w-6 h-6 md:w-7 md:h-7" />
          )}
        </button>

        {/* KONTENER ZE ZDJĘCIAMI */}
        <div
          ref={scrollRef}
          className="flex h-full w-full overflow-hidden pointer-events-none"
        >
          {duplicatedImages.map((src, i) => (
            <div key={i} className="relative h-full w-auto flex-shrink-0">
              <img
                src={src}
                alt="Sala weselna Stara Szwajcaria"
                className="h-full w-auto object-cover pointer-events-none"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* PRAWA STRZAŁKA */}
        <button
          onPointerDown={() => handlePointerDown(1)}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 active:bg-black/90 active:scale-95 text-white p-2 md:p-3 rounded-full backdrop-blur-md opacity-80 md:opacity-0 group-hover:opacity-100 transition-all duration-200 touch-none"
          aria-label="Przewiń w prawo"
        >
          <ChevronRightIcon className="w-6 h-6 md:w-8 md:h-8 pointer-events-none" />
        </button>
      </div>

      {/* Prawa kolumna – opis */}
      <div className="w-full md:w-1/2 px-6 md:px-16 flex flex-col justify-center mt-12 md:mt-0">
        <AnimatedText
          text="Stara Szwajcaria"
          className="font-serif text-4xl md:text-6xl font-light mb-4 text-[#4c4a1e] drop-shadow-md tracking-wide"
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
          <p className="font-sans font-light text-lg leading-relaxed mb-6 text-[#4c4a1e]">
            To tutaj rozegra się akcja naszego filmu. Właśnie w tych progach miejsce będzie miała ta legendarna i niezapomniana zabawa! Do naszej dyspozycji mamy łącznie około 750 m2 na salach i o wiele więcej w parku Szwajcaria tuż obok.
          </p>
          <p className="font-serif italic text-xl text-[#4c4a1e] tracking-wide">
            Przygotujcie się na 4 Akty pełne emocji.
          </p>
        </motion.div>
      </div>
    </section>
  );
}