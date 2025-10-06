"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function FlipCard({ value, label }: { value: number; label: string }) {
  const [prevValue, setPrevValue] = useState(value);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (value !== prevValue) {
      setFlipping(true);
      const timeout = setTimeout(() => {
        setPrevValue(value);
        setFlipping(false);
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [value, prevValue]);

  return (
    <motion.div
      className="relative w-28 sm:w-32 h-24 perspective-1000"
      animate={flipping ? { scale: [1, 0.98, 1] } : { scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* --- Cały kafelek --- */}
      <div className="relative w-full h-full rounded-2xl shadow-lg">
        {/* --- Górna połowa --- */}
        <div className="absolute top-0 left-0 w-full h-1/2 overflow-hidden rounded-t-2xl bg-white/90 border-b border-[#841D30] flex items-end justify-center">
          <span className="text-5xl font-bold text-[#4E0113] leading-none translate-y-1/2">
            {flipping ? value : prevValue}
          </span>
        </div>

        {/* --- Dolna połowa --- */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden rounded-b-2xl bg-white/80 flex items-start justify-center">
          <span className="text-5xl font-bold text-[#4E0113] leading-none -translate-y-1/2">
            {flipping ? prevValue : value}
          </span>
        </div>

        {/* --- Animowane klapki --- */}
        <AnimatePresence>
          {flipping && (
            <>
              {/* Klapka górna (stara wartość spada) */}
              <motion.div
                key="flip-top"
                initial={{ rotateX: 0, boxShadow: "0 0 0 rgba(0,0,0,0)" }}
                animate={{
                  rotateX: -90,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                }}
                transition={{ duration: 0.3, ease: "easeIn" }}
                className="absolute top-0 left-0 w-full h-1/2 origin-bottom bg-white border-b border-[#841D30] overflow-hidden rounded-t-2xl flex items-end justify-center"
                style={{ backfaceVisibility: "hidden" }}
              >
                <span className="text-5xl font-bold text-[#4E0113] leading-none translate-y-1/2">
                  {prevValue}
                </span>
                {/* Lekki cień pod klapką */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
              </motion.div>

              {/* Klapka dolna (nowa wartość podnosi się) */}
              <motion.div
                key="flip-bottom"
                initial={{
                  rotateX: 90,
                  boxShadow: "0 -10px 20px rgba(0,0,0,0.3)",
                }}
                animate={{ rotateX: 0, boxShadow: "0 0 0 rgba(0,0,0,0)" }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                  delay: 0.3,
                }}
                className="absolute bottom-0 left-0 w-full h-1/2 origin-top bg-white overflow-hidden rounded-b-2xl flex items-start justify-center"
                style={{ backfaceVisibility: "hidden" }}
              >
                <span className="text-5xl font-bold text-[#4E0113] leading-none -translate-y-1/2">
                  {value}
                </span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* --- Etykieta --- */}
      <p className="text-[#841D30] text-sm sm:text-base mt-2 text-center font-medium">
        {label}
      </p>
    </motion.div>
  );
}

export default function Timer() {
  const [now, setNow] = useState(new Date());
  const targetDate = new Date("2026-07-19T12:00:00+02:00");

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const diff = targetDate.getTime() - now.getTime();
  const days = Math.max(Math.floor(diff / (1000 * 60 * 60 * 24)), 0);
  const hours = Math.max(Math.floor((diff / (1000 * 60 * 60)) % 24), 0);
  const minutes = Math.max(Math.floor((diff / (1000 * 60)) % 60), 0);
  const seconds = Math.max(Math.floor((diff / 1000) % 60), 0);

  const timeUnits = [
    { label: "dni", value: days },
    { label: "godzin", value: hours },
    { label: "minut", value: minutes },
    { label: "sekund", value: seconds },
  ];

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center p-8 text-center text-white overflow-hidden">
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
        className="text-4xl md:text-5xl font-bold mb-8 drop-shadow-lg"
      >
        Nasz wielki dzień ❤️
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-xl md:text-2xl font-semibold mb-6 drop-shadow"
      >
        Aktualna godzina w Polsce:{" "}
        <span className="text-[#75897D] bg-white/70 px-2 py-1 rounded-lg">
          {new Date().toLocaleTimeString("pl-PL", {
            timeZone: "Europe/Warsaw",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
      </motion.div>

      <p className="text-lg md:text-xl mb-8 italic text-[#FBE4DA]">
        Do rozpoczęcia naszego ślubu zostało jeszcze:
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
        {timeUnits.map((unit) => (
          <FlipCard key={unit.label} value={unit.value} label={unit.label} />
        ))}
      </div>
    </section>
  );
}
