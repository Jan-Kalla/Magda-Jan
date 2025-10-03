"use client";

import Navbar from "@/app/components/Navbar";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [now, setNow] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  const targetDate = new Date("2026-07-19T12:00:00+02:00");

  const polishTime = new Date().toLocaleTimeString("pl-PL", {
    timeZone: "Europe/Warsaw",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const diff = targetDate.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const timeUnits = [
    { label: "dni", value: days },
    { label: "godzin", value: hours },
    { label: "minut", value: minutes },
    { label: "sekund", value: seconds },
  ];

  return (
    <>
      <Navbar />



      {/* === Tło zdjęcia === */}
      <div className="fixed inset-0 -z-20">
        <Image
          src="/fotki/raczki.jpg"
          alt="Magda i Jan"
          fill
          priority
          className="object-cover"
        />
      </div>
{/* Górna sekcja w kolorze #FAD6C8 */}
<section className="h-[100vh] bg-[#FAD6C8] flex items-center justify-center text-[#4E0113] text-3xl">
  pusta przestrzeń
</section>

<section className="relative w-full min-h-screen flex flex-col items-center justify-center p-8 text-center text-white overflow-hidden">
  {/* Gradient z maską pod treścią */}
  <div className="absolute inset-0 -z-10
    bg-gradient-to-br from-[#FBE4DA] via-[#FAD6C8] to-[#4E0113]
    [mask-image:linear-gradient(to_bottom,black_0%,transparent_0%,transparent_100%,black_100%)]
    [mask-repeat:no-repeat] [mask-size:100%_100%]" />

  {/* Tutaj treść hero */}
  <h1 className="text-5xl font-bold mb-8 drop-shadow-lg">Nasz wielki dzień ❤️</h1>

  <div className="text-2xl font-semibold mb-6 drop-shadow">
    Aktualna godzina w Polsce:{" "}
    <span className="text-[#75897D] bg-white/70 px-2 py-1 rounded-lg">
      {polishTime}
    </span>
  </div>

  <div className="grid grid-cols-4 gap-6 text-center">
    {timeUnits.map((unit) => (
      <div
        key={unit.label}
        className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg w-28"
      >
        <AnimatePresence mode="popLayout">
          <motion.p
            key={unit.value}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-4xl font-bold text-[#4E0113]"
          >
            {unit.value}
          </motion.p>
        </AnimatePresence>
        <p className="text-[#841D30]">{unit.label}</p>
      </div>
    ))}
  </div>
</section>

      {/* === Dalsza zawartość strony === */}
      <section className="relative z-10 bg-gradient-to-b from-[#FAD6C8] to-[#4E0113] h-[150vh] flex items-center justify-center text-white text-3xl">
        w dół ➡️
      </section>
    </>
  );
}
