"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { events } from "../data/events";
import { useSound } from "@/app/context/SoundContext";

// --- POJEDYNCZA CYFRA (Z DYNAMICZNYM CIENIEM) ---
interface FlipDigitProps {
  digit: string;
  isMuted: boolean;
  getVolume: () => number;
}

function FlipDigit({ digit, isMuted, getVolume }: FlipDigitProps) {
  const [prevDigit, setPrevDigit] = useState(digit);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    let soundTimeout: NodeJS.Timeout;

    if (digit !== prevDigit) {
      setFlipping(true);

      if (!isMuted) {
        soundTimeout = setTimeout(() => {
          const dynamicVol = getVolume();
          if (dynamicVol > 0.01) {
            const audio = new Audio("/sounds/ui/timer.mp3");
            audio.volume = 0.3 * dynamicVol;
            audio.playbackRate = 0.95 + Math.random() * 0.1;
            audio.play().catch(() => {});
          }
        }, 300); // 300ms delay
      }

      const timeout = setTimeout(() => {
        setPrevDigit(digit);
        setFlipping(false);
      }, 600); // 600ms duration

      return () => {
        clearTimeout(timeout);
        clearTimeout(soundTimeout);
      };
    }
  }, [digit, prevDigit, isMuted, getVolume]);

  const containerShadow = "shadow-[0_4px_10px_rgba(0,0,0,0.1),0_8px_20px_rgba(0,0,0,0.1)]";
  const topHalfStyle = "bg-gradient-to-b from-white to-[#f2f2f2] shadow-[inset_0_-2px_5px_rgba(0,0,0,0.08)] border-b border-[#841D30]/20";
  const bottomHalfStyle = "bg-gradient-to-b from-[#e6e6e6] to-white shadow-[inset_0_2px_5px_rgba(0,0,0,0.08)]";

  return (
    <div className={`relative w-10 sm:w-14 md:w-16 lg:w-20 h-14 sm:h-20 md:h-28 lg:h-32 bg-white rounded-lg ${containerShadow} mx-0.5 sm:mx-1 md:mx-1.5 perspective-1000`}>
      {/* ZMIANA: Dodano znacznie większe rozmiary dla md: i lg: (np. lg:w-20 lg:h-32) oraz większe marginesy */}
      
      {/* --- TŁO STATYCZNE --- */}
      <div className="absolute inset-0 flex flex-col rounded-lg overflow-hidden">
        {/* Górna połowa */}
        <div className={`h-1/2 w-full relative overflow-hidden flex justify-center items-end ${topHalfStyle}`}>
          {/* ZMIANA: Potężniejsze cyfry na desktopie (md:text-6xl lg:text-7xl) */}
          <span className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#4E0113] translate-y-[50%] leading-none">
            {flipping ? digit : prevDigit}
          </span>
        </div>
        
        {/* DOLNA POŁOWA */}
        <div className={`h-1/2 w-full relative overflow-hidden flex justify-center items-start ${bottomHalfStyle}`}>
          {/* ZMIANA: Potężniejsze cyfry na desktopie */}
          <span className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#4E0113] -translate-y-[50%] leading-none relative z-0">
            {flipping ? prevDigit : digit}
          </span>

          {/* DYNAMICZNY CIEŃ */}
          <AnimatePresence>
            {flipping && (
              <motion.div
                key="dynamic-shadow"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 0.6, times: [0, 0.5, 1], ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent z-10 pointer-events-none"
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- KLAPKI ANIMOWANE --- */}
      <AnimatePresence>
        {flipping && (
          <>
            <motion.div
              key="flip-top"
              initial={{ rotateX: 0 }}
              animate={{ rotateX: -90 }}
              transition={{ duration: 0.3, ease: "easeIn" }}
              className={`absolute top-0 left-0 w-full h-1/2 rounded-t-lg overflow-hidden flex justify-center items-end origin-bottom z-20 backface-hidden ${topHalfStyle}`}
              style={{ backfaceVisibility: "hidden" }}
            >
              <span className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#4E0113] translate-y-[50%] leading-none">
                {prevDigit}
              </span>
            </motion.div>

            <motion.div
              key="flip-bottom"
              initial={{ rotateX: 90 }}
              animate={{ rotateX: 0 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.3 }}
              className={`absolute bottom-0 left-0 w-full h-1/2 rounded-b-lg overflow-hidden flex justify-center items-start origin-top z-30 backface-hidden ${bottomHalfStyle}`}
              style={{ backfaceVisibility: "hidden" }}
            >
              <span className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#4E0113] -translate-y-[50%] leading-none">
                {digit}
              </span>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <div className="absolute inset-0 rounded-lg shadow-[inset_0_0_8px_rgba(0,0,0,0.1)] border border-white/40 pointer-events-none z-40" />
    </div>
  );
}

// --- Reszta komponentów ---
interface FlipUnitProps {
  value: number;
  label: string;
  isMuted: boolean;
  getVolume: () => number;
  minDigits?: number;
}

function FlipUnit({ value, label, isMuted, getVolume, minDigits = 2 }: FlipUnitProps) {
  const digits = value.toString().padStart(minDigits, "0").split("");

  return (
    <div className="flex flex-col items-center">
      <div className="flex">
        {digits.map((digit, index) => (
          <FlipDigit
            key={index}
            digit={digit}
            isMuted={isMuted}
            getVolume={getVolume}
          />
        ))}
      </div>
      {/* ZMIANA: Powiększony font etykiet na desktopie (md:text-base lg:text-lg) i większy odstęp w dół */}
      <p className="text-[#FDF9EC] font-serif text-xs sm:text-sm md:text-base lg:text-lg mt-4 lg:mt-6 tracking-[0.2em] uppercase drop-shadow-md">
        {label}
      </p>
    </div>
  );
}

function Separator() {
  return (
    <div className="h-14 sm:h-20 md:h-28 lg:h-32 flex items-center justify-center px-1 sm:px-2 md:px-3 lg:px-4 pb-2">
      {/* ZMIANA: Wysokość separatora dopasowana do nowych rozmiarów klapek oraz powiększone kropki */}
      <div className="flex flex-col gap-2 sm:gap-4 opacity-70">
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 bg-[#FDF9EC] rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 bg-[#FDF9EC] rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
      </div>
    </div>
  );
}

export default function Timer() {
  const [now, setNow] = useState(new Date());
  const { isMuted } = useSound();
  const sectionRef = useRef<HTMLElement>(null);

  const getDynamicVolume = useCallback(() => {
    if (!sectionRef.current || typeof window === "undefined") return 0;
    const rect = sectionRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportCenter = viewportHeight / 2;
    const elementCenter = rect.top + rect.height / 2;
    const distance = Math.abs(viewportCenter - elementCenter);
    const maxDistance = viewportHeight * 1.5;
    let vol = 1 - distance / maxDistance;
    return Math.max(0, Math.min(1, vol));
  }, []);

  const targetDate = new Date("2026-07-19T12:00:00+02:00");

  useEffect(() => {
    const update = () => {
      setNow(new Date());
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const diff = targetDate.getTime() - now.getTime();
  const days = Math.max(Math.floor(diff / (1000 * 60 * 60 * 24)), 0);
  const hours = Math.max(Math.floor((diff / (1000 * 60 * 60)) % 24), 0);
  const minutes = Math.max(Math.floor((diff / (1000 * 60)) % 60), 0);
  const seconds = Math.max(Math.floor((diff / 1000) % 60), 0);

  const matchingEvent = events
    .filter((e) => e.durationDays >= days)
    .sort((a, b) => a.durationDays - b.durationDays)[0];

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center p-4 text-center text-white overflow-hidden"
    >
      <div
        className="absolute inset-0 -z-10
          bg-gradient-to-br from-[#FBE4DA] via-[#FAD6C8] to-[#4E0113]
          [mask-image:linear-gradient(to_bottom,black_0%,transparent_0%,transparent_100%,black_100%)]
          [mask-repeat:no-repeat] [mask-size:100%_100%]"
      />

      <motion.h2
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="font-script text-6xl md:text-7xl lg:text-8xl text-[#FDF9EC] mb-4 drop-shadow-lg"
      >
        Nasz wielki dzień
      </motion.h2>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="font-serif text-base md:text-xl lg:text-2xl mb-12 uppercase tracking-[0.15em] text-[#FDF9EC] drop-shadow-md"
      >
        Do rozpoczęcia ślubu zostało:
      </motion.p>

      {/* --- TIMER KONTENER --- */}
      {/* ZMIANA: Zwiększono odstępy (gap) pomiędzy sekcjami (dni, godziny) na desktopie */}
      <div className="flex flex-row flex-wrap justify-center items-start gap-1 sm:gap-2 md:gap-4 lg:gap-6">
        <FlipUnit value={days} label="Dni" isMuted={isMuted} getVolume={getDynamicVolume} minDigits={days > 99 ? 3 : 2} />
        <Separator />
        <FlipUnit value={hours} label="Godzin" isMuted={isMuted} getVolume={getDynamicVolume} />
        <Separator />
        <FlipUnit value={minutes} label="Minut" isMuted={isMuted} getVolume={getDynamicVolume} />
        <Separator />
        <FlipUnit value={seconds} label="Sekund" isMuted={isMuted} getVolume={getDynamicVolume} />
      </div>

      {matchingEvent && (
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 font-serif text-lg md:text-xl text-[#FDF9EC] opacity-90 max-w-2xl leading-relaxed px-4 drop-shadow-md"
        >
          Do naszego ślubu zostało już mniej czasu niż<br/>
          <span className="font-medium italic">{matchingEvent.name}</span>
        </motion.p>
      )}
    </section>
  );
}