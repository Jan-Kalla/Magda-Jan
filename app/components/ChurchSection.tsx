"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedText from "./AnimatedText";
import { useState, useEffect } from "react";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { useSound } from "@/app/context/SoundContext";

export default function ChurchSection() {
  const [activeImage, setActiveImage] = useState(0);
  const { playSound } = useSound();

  // --- 1. KONFIGURACJA WYDARZENIA ---
  const eventDetails = {
    title: "Ślub Magdy i Jana",
    description: "Uroczystość zaślubin w kościele pw. św. Piotra i Pawła.",
    location: "Kościół pw. św. Piotra i Pawła, ul. Staromiejska 91, 43-190 Mikołów",
    start: "20260719T120000", 
    end: "20260719T131500", 
  };

  // --- 2. LINK DO GOOGLE CALENDAR ---
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    eventDetails.title
  )}&dates=${eventDetails.start}/${eventDetails.end}&details=${encodeURIComponent(
    eventDetails.description
  )}&location=${encodeURIComponent(eventDetails.location)}&ctz=Europe/Warsaw`;

  // --- 3. GENEROWANIE PLIKU .ICS ---
  const handleDownloadICS = () => {
    playSound("click");

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//MagdaJan//Wedding//PL",
      "BEGIN:VEVENT",
      `DTSTART:${eventDetails.start}`,
      `DTEND:${eventDetails.end}`,
      `SUMMARY:${eventDetails.title}`,
      `DESCRIPTION:${eventDetails.description}`,
      `LOCATION:${eventDetails.location}`,
      "BEGIN:VALARM",
      "TRIGGER:-P1D",
      "ACTION:DISPLAY",
      "DESCRIPTION:Jutro ślub Magdy i Jana!",
      "END:VALARM",
      "BEGIN:VALARM",
      "TRIGGER:-PT3H",
      "ACTION:DISPLAY",
      "DESCRIPTION:Za 3h ślub Magdy i Jana!",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "slub-magdy-i-jana.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- SLIDESHOW ---
  useEffect(() => {
    const imgTimer = setInterval(() => setActiveImage((p) => (p === 0 ? 1 : 0)), 8000);
    return () => clearInterval(imgTimer);
  }, []);

  return (
    <section className="relative z-10 bg-gradient-to-b from-[#FAD6C8] to-[#A46C6E] px-8 py-20 flex flex-col lg:flex-row items-stretch gap-12 text-[#4E0113]">
      
      {/* LEWA KOLUMNA - TEKST 
         Zmiana: lg:flex-[1] zamiast flex-1. 
         To sprawia, że zajmuje 1/3 dostępnej przestrzeni w poziomie.
      */}
      <div className="w-full lg:flex-[1] flex flex-col justify-center text-lg md:text-xl leading-relaxed text-center lg:text-right space-y-4">
        
        <AnimatedText 
            text="Kościół pw. św. Piotra i Pawła" 
            className="font-bold text-2xl md:text-3xl mb-2" 
            delay={0.2} 
            mode="line" 
        />
        
        <AnimatedText 
            text="ul. Staromiejska 91, 43-190 Mikołów" 
            delay={0.4} 
            mode="line" 
        />
        
        <div className="pt-2 pb-6">
            <AnimatedText
              text="Uroczystość rozpocznie się 19 lipca 2026 o godzinie 12:00"
              className="font-semibold text-xl"
              delay={0.6}
              mode="line"
            />
        </div>

        {/* --- SEKCJA KALENDARZA --- */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center lg:items-end gap-3"
        >
          {/* NAGŁÓWEK */}
          <p className="text-xs font-bold uppercase tracking-widest opacity-70">
            Dodaj do kalendarza:
          </p>

          <div className="flex flex-wrap gap-3 justify-center lg:justify-end">
            
            {/* Przycisk Google */}
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playSound("click")}
              className="group flex items-center gap-2 px-4 py-2.5 bg-[#4E0113] text-[#FAD6C8] rounded-xl text-sm font-bold shadow-md hover:bg-[#6b1326] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <CalendarDaysIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Google Calendar
            </a>

            {/* Przycisk Apple / Outlook */}
            <button
              onClick={handleDownloadICS}
              className="group flex items-center gap-2 px-4 py-2.5 bg-white/40 border border-[#4E0113]/20 text-[#4E0113] rounded-xl text-sm font-bold shadow-sm hover:bg-white/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm"
            >
              <svg className="w-4 h-4 mb-0.5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z"/>
              </svg>
              Apple / Outlook
            </button>
            
          </div>
        </motion.div>
        
        <AnimatedText
          text="Będziemy wdzięczni za dar Komunii ofiarowanej za nas podczas mszy świętej" 
          className="text-base opacity-70 hover:opacity-100 cursor-pointer transition-opacity italic mt-6"
          delay={1.0}
          mode="line"
        />
      </div>

      {/* PRAWA KOLUMNA - ZDJĘCIA 
         Zmiana: lg:flex-[2].
         Zajmuje 2/3 dostępnej przestrzeni.
      */}
      <div className="relative w-full lg:flex-[2] h-[600px] lg:h-auto min-h-[500px] overflow-hidden rounded-xl shadow-2xl border-4 border-white/30">
        <AnimatePresence mode="sync">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1.25 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.5 },
              scale: { duration: 10, ease: "linear" },
            }}
            className="absolute inset-0"
          >
            <Image
              src={activeImage === 0 ? "/fotki/kosciol1.jpg" : "/fotki/kosciol2.jpg"}
              alt="Kościół w Mikołowie"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}