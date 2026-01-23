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

  // Style (bez zmian)
  const containerShadow = "shadow-[0_4px_10px_rgba(0,0,0,0.1),0_8px_20px_rgba(0,0,0,0.1)]";
  const topHalfStyle = "bg-gradient-to-b from-white to-[#f2f2f2] shadow-[inset_0_-2px_5px_rgba(0,0,0,0.08)] border-b border-[#841D30]/20";
  const bottomHalfStyle = "bg-gradient-to-b from-[#e6e6e6] to-white shadow-[inset_0_2px_5px_rgba(0,0,0,0.08)]";

  return (
    <div className={`relative w-10 sm:w-14 h-14 sm:h-20 bg-white rounded-lg ${containerShadow} mx-0.5 sm:mx-1 perspective-1000`}>
      
      {/* --- TŁO STATYCZNE --- */}
      <div className="absolute inset-0 flex flex-col rounded-lg overflow-hidden">
        {/* Górna połowa */}
        <div className={`h-1/2 w-full relative overflow-hidden flex justify-center items-end ${topHalfStyle}`}>
          <span className="text-3xl sm:text-5xl font-bold text-[#4E0113] translate-y-[50%] leading-none">
            {flipping ? digit : prevDigit}
          </span>
        </div>
        
        {/* --- DOLNA POŁOWA (TU DODAJEMY CIEŃ) --- */}
        <div className={`h-1/2 w-full relative overflow-hidden flex justify-center items-start ${bottomHalfStyle}`}>
          <span className="text-3xl sm:text-5xl font-bold text-[#4E0113] -translate-y-[50%] leading-none relative z-0">
            {flipping ? prevDigit : digit}
          </span>

          {/* === NOWOŚĆ: DYNAMICZNY CIEŃ === */}
          <AnimatePresence>
            {flipping && (
              <motion.div
                key="dynamic-shadow"
                // Start: przezroczysty
                initial={{ opacity: 0 }}
                // Animacja: 0 -> 0.5 (najciemniej) -> 0
                animate={{ opacity: [0, 0.5, 0] }}
                // Timing: początek -> środek (0.5 czyli 300ms) -> koniec (1.0 czyli 600ms)
                transition={{ duration: 0.6, times: [0, 0.5, 1], ease: "easeInOut" }}
                // Gradient: mocny cień przy zawiasie, zanikający w dół. Z-index zeby przykryć tekst.
                className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent z-10 pointer-events-none"
              />
            )}
          </AnimatePresence>
           {/* =============================== */}
        </div>
      </div>

      {/* --- KLAPKI ANIMOWANE (bez zmian) --- */}
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
              <span className="text-3xl sm:text-5xl font-bold text-[#4E0113] translate-y-[50%] leading-none">
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
              <span className="text-3xl sm:text-5xl font-bold text-[#4E0113] -translate-y-[50%] leading-none">
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

// --- Reszta komponentów bez zmian ---
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
      <p className="text-[#FBE4DA] text-xs sm:text-sm mt-3 font-medium tracking-widest uppercase drop-shadow-sm">
        {label}
      </p>
    </div>
  );
}

function Separator() {
  return (
    <div className="h-14 sm:h-20 flex items-center justify-center px-1 sm:px-2 pb-2">
      <div className="flex flex-col gap-2 sm:gap-4 opacity-70">
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#FAD6C8] rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.2)]" />
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#FAD6C8] rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.2)]" />
      </div>
    </div>
  );
}

export default function Timer() {
  const [now, setNow] = useState(new Date());
  const [currentTime, setCurrentTime] = useState<string | null>(null);
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
      setCurrentTime(
        new Date().toLocaleTimeString("pl-PL", {
          timeZone: "Europe/Warsaw",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
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

      <motion.h1
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-3xl md:text-5xl font-bold mb-8 drop-shadow-lg"
      >
        Nasz wielki dzień ❤️
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-lg md:text-2xl font-semibold mb-6 drop-shadow"
      >
        Aktualna godzina w Polsce:{" "}
        <span className="text-[#75897D] bg-white/70 px-2 py-1 rounded-lg shadow-sm">
          {currentTime ?? "--:--:--"}
        </span>
      </motion.div>

      <p className="text-base md:text-xl mb-12 italic text-[#FBE4DA] drop-shadow-sm">
        Do rozpoczęcia naszego ślubu zostało jeszcze:
      </p>

      {/* --- TIMER KONTENER --- */}
      <div className="flex flex-row flex-wrap justify-center items-start gap-1 sm:gap-2">
        <FlipUnit value={days} label="Dni" isMuted={isMuted} getVolume={getDynamicVolume} minDigits={days > 99 ? 3 : 2} />
        <Separator />
        <FlipUnit value={hours} label="Godzin" isMuted={isMuted} getVolume={getDynamicVolume} />
        <Separator />
        <FlipUnit value={minutes} label="Minut" isMuted={isMuted} getVolume={getDynamicVolume} />
        <Separator />
        <FlipUnit value={seconds} label="Sekund" isMuted={isMuted} getVolume={getDynamicVolume} />
      </div>

      {matchingEvent && (
        <p className="mt-16 text-lg md:text-xl text-[#FBE4DA] font-semibold max-w-xl leading-relaxed px-4 drop-shadow-sm">
          Do naszego ślubu zostało już mniej czasu niż<br/>
          <span className="font-bold">{matchingEvent.name}</span>
        </p>
      )}
    </section>
  );
}