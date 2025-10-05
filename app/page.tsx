"use client";

import Navbar from "@/app/components/Navbar";
import AnimatedText from "@/app/components/AnimatedText";
import Timer from "@/app/components/Timer";
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

      {/* === Sekcja wprowadzająca: zdjęcia + tekst === */}
      <section className="relative min-h-screen bg-[#FAD6C8] flex flex-col lg:flex-row items-start justify-between gap-16 px-32 py-32 text-[#4E0113]">
        {/* Lewa część – polaroidy */}
        <div className="relative flex flex-col items-center w-full max-w-md lg:max-w-lg">
          {/* Sznurek */}
          <div className="absolute left-[45%] lg:left-[40%] top-0 bottom-0 w-1 bg-[#4E0113]/30 -z-10"></div>

          {[
            { src: "/fotki/2019.02.jpg", alt: "Pierwsza liceum" },
            { src: "/fotki/2020.jpg", alt: "Druga liceum" },
            { src: "/fotki/2022.04.jpeg", alt: "Pierwszy rok studiów" },
            { src: "/fotki/2024.09.jpeg", alt: "Czwarty rok studiów" },
            { src: "/fotki/2024.11.jpg", alt: "Zaręczyny" },
            { src: "/fotki/2024.12.jpg", alt: "Narty" },
            { src: "/fotki/2025.09.jpg", alt: "Świnica" },
          ].map((photo, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className={`
                  relative bg-white p-2 md:p-3 shadow-lg rounded-md 
                  w-52 sm:w-60 md:w-72
                  ${isLeft ? "md:mr-auto md:-rotate-6 md:-translate-x-10" : "md:ml-auto md:rotate-6 md:translate-x-40"}
                  ${isLeft ? "rotate-[-2deg]" : "rotate-[2deg]"}
                `}
                style={{ marginTop: idx === 0 ? "0" : "-3rem" }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={400}
                  height={300}
                  className="rounded-sm object-contain"
                />
                <p className="mt-2 text-sm text-center text-[#4E0113]">
                  {photo.alt}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Prawa część – tekst */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="flex-1 max-w-xl text-center lg:text-left mt-12 lg:mt-0"
        >
          <blockquote className="italic text-xl md:text-2xl mb-6">
            „Miłość cierpliwa jest, łaskawa jest...” <br /> (1 Kor 13, 4)
          </blockquote>
          <p className="text-base md:text-lg leading-relaxed whitespace-pre-line">
            Jan, nudzę się, rób pompki{"\n\n"}
            Jan, jedz jak koń{"\n\n"}
            Po co Ci ta łyżka? Będę nią dogadzał Magdzie ❤️{"\n\n"}
            Agata stópkara, to tak można? Jak kobieta może być stópkarą...{"\n\n"}
            ...
          </p>
        </motion.div>
      </section>

      {/* === Sekcja z licznikiem === */}
      <Timer />

      {/* Dalsza zawartość */}
      <section className="relative z-10 bg-gradient-to-b from-[#FAD6C8] to-[#4E0113] h-[100vh] flex items-center justify-center text-white text-2xl md:text-3xl">
        w dół ➡️
      </section>
    </>
  );
}
