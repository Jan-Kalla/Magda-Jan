"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { events } from "../data/events";
import { useSound } from "@/app/context/SoundContext";

// --- POJEDYNCZA CYFRA ---
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
        }, 300);
      }

      const timeout = setTimeout(() => {
        setPrevDigit(digit);
        setFlipping(false);
      }, 600);

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
      <div className="absolute inset-0 flex flex-col rounded-lg overflow-hidden">
        <div className={`h-1/2 w-full relative overflow-hidden flex justify-center items-end ${topHalfStyle}`}>
          <span className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#4E0113] translate-y-[50%] leading-none">
            {flipping ? digit : prevDigit}
          </span>
        </div>
        <div className={`h-1/2 w-full relative overflow-hidden flex justify-center items-start ${bottomHalfStyle}`}>
          <span className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#4E0113] -translate-y-[50%] leading-none relative z-0">
            {flipping ? prevDigit : digit}
          </span>
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
          <FlipDigit key={index} digit={digit} isMuted={isMuted} getVolume={getVolume} />
        ))}
      </div>
      <p className="text-[#FDF9EC] font-serif text-xs sm:text-sm md:text-base lg:text-lg mt-4 lg:mt-6 tracking-[0.2em] uppercase drop-shadow-md">
        {label}
      </p>
    </div>
  );
}

function Separator() {
  return (
    <div className="h-14 sm:h-20 md:h-28 lg:h-32 flex items-center justify-center px-1 sm:px-2 md:px-3 lg:px-4 pb-2">
      <div className="flex flex-col gap-2 sm:gap-4 opacity-70">
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 bg-[#FDF9EC] rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 bg-[#FDF9EC] rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
      </div>
    </div>
  );
}

export default function Timer() {
  const [now, setNow] = useState(new Date());
  const [eventImage, setEventImage] = useState<string | null>(null);
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
    const update = () => setNow(new Date());
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

  // AUTOMATYCZNE POBIERANIE ZDJĘCIA Z LINKU (META TAGI OPENGRAPH)
  useEffect(() => {
    if (!matchingEvent || !matchingEvent.url) {
      setEventImage(null);
      return;
    }

    let isMounted = true;
    
    // Zapytanie do darmowego API Microlink, które "odczytuje" obrazki z dowolnej strony internetowej
    fetch(`https://api.microlink.io/?url=${encodeURIComponent(matchingEvent.url)}`)
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.status === 'success' && data.data?.image?.url) {
          setEventImage(data.data.image.url);
        } else {
          setEventImage(null);
        }
      })
      .catch(() => setEventImage(null));

    return () => { isMounted = false; };
  }, [matchingEvent?.url]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[100svh] flex flex-col items-center justify-center px-4 py-24 md:py-32 text-center text-white overflow-hidden"
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
        className="font-serif font-light italic text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#FDF9EC] mb-10 md:mb-16 uppercase tracking-[0.15em] md:tracking-[0.2em] drop-shadow-lg"
      >
        Nasz wielki dzień
      </motion.h2>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="font-serif text-base md:text-xl lg:text-2xl mb-12 tracking-[0.15em] text-[#FDF9EC] drop-shadow-md"
      >
        Do rozpoczęcia ślubu zostało:
      </motion.p>

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
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 flex flex-col items-center"
        >
          <p className="font-serif text-lg md:text-xl text-[#FDF9EC] opacity-90 max-w-2xl leading-relaxed px-4 drop-shadow-md text-center mb-6">
            Do naszego ślubu zostało już mniej czasu niż<br/>
            <span className="font-medium italic">{matchingEvent.name}</span>
          </p>
          
          {/* NOWE: Wyświetlanie automatycznie pobranego zdjęcia z linku */}
          <AnimatePresence mode="wait">
            {eventImage && (
              <motion.div
                key="link-image"
                initial={{ opacity: 0, scale: 0.95, height: 0 }}
                animate={{ opacity: 1, scale: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full max-w-[280px] md:max-w-[360px] rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/20 mb-6 bg-white/5"
              >
                <img 
                  src={eventImage} 
                  alt="Podgląd wydarzenia" 
                  className="w-full h-32 md:h-48 object-cover hover:scale-105 transition-transform duration-700" 
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          {matchingEvent.url && matchingEvent.url.length > 0 && (
            <a 
              href={matchingEvent.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs md:text-sm font-sans uppercase tracking-widest text-[#FDF9EC] opacity-90 hover:opacity-100 border border-[#FDF9EC]/40 hover:border-[#FDF9EC]/90 hover:bg-[#FDF9EC]/10 px-8 py-3 rounded-full transition-all duration-300 shadow-lg"
            >
              Dowiedz się więcej
            </a>
          )}
        </motion.div>
      )}
    </section>
  );
}