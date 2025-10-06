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
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    const imageInterval = setInterval(() => {
      setActiveImage((prev) => (prev === 0 ? 1 : 0));
    }, 8000); 

    return () => {
      clearInterval(timer);
      clearInterval(imageInterval);
    };
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

{/* === Sekcja z kościołem i mapą === */}
<section className="relative z-10 bg-gradient-to-b from-[#FAD6C8] to-[#A46C6E] px-8 py-20 flex flex-col lg:flex-row items-stretch gap-12 text-[#4E0113]">

  {/* Tekst po lewej */}
  <div className="flex-1 flex flex-col justify-center text-lg md:text-xl leading-relaxed text-center lg:text-right">
    <p><strong>Kościół pw. św. Piotra i Pawła</strong></p>
    <p>ul. Staromiejska 95, 43-190 Mikołów</p>
    <p>Uroczystość rozpocznie się <strong>19 lipca 2026 o godzinie 12:00</strong></p>
  </div>

  {/* Zdjęcie po prawej – pełna wysokość sekcji */}
  <div className="relative flex-1 h-[1200px] lg:h-auto min-h-[1000px] overflow-hidden rounded-xl shadow-lg">
    <AnimatePresence mode="sync">
      <motion.div
        key={activeImage}
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 1, scale: 1.4 }}
        exit={{ opacity: 0 }}
        transition={{
          opacity: { duration: 1 },
          scale: { duration: 8, ease: "linear" }
        }}
        className="absolute inset-0"
      >
        <Image
          src={activeImage === 0 ? "/fotki/kosciol1.jpg" : "/fotki/kosciol2.jpg"}
          alt="Kościół"
          fill
          className="object-cover object-center"
        />
      </motion.div>
    </AnimatePresence>
  </div>
</section>

{/* === Mapa i przycisk === */}
<section className="relative z-10 bg-gradient-to-b from-[#A46C6E] to-[#4E0113] px-8 pb-20 flex flex-col items-center gap-8 text-[#4E0113]">
  <div className="w-full max-w-5xl h-96 rounded-xl overflow-hidden shadow-lg">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2567.435861597826!2d18.8195421!3d50.2111077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4716cb485ab357c1%3A0xfc642914f2d6cac0!2sKo%C5%9Bci%C3%B3%C5%82%20Rzymskokatolicki%20pw.%20%C5%9Bw.%20Piotra%20i%20Paw%C5%82a!5e0!3m2!1spl!2spl!4v1696600000000!5m2!1spl!2spl"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  </div>

<a
  href="https://www.google.com/maps/place/Kościół+Rzymskokatolicki+pw.+św.+Piotra+i+Pawła/@50.208576,18.8218448,17z/data=!4m6!3m5!1s0x4716cb485ab357c1:0xfc642914f2d6cac0!8m2!3d50.208576!4d18.8218448!16s%2Fg%2F122qyybm"
  target="_blank"
  rel="noopener noreferrer"
  className="mt-6 px-6 py-3 bg-[#75897D] text-[#4E0113] rounded-full text-lg hover:bg-[#FAD6C8] transition"
>
  Otwórz w Google Maps
</a>
</section>
    </>
  );
}
