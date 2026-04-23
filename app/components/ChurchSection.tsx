"use client";

import { motion, AnimatePresence } from "framer-motion";
import AnimatedText from "./AnimatedText";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { useSound } from "@/app/context/SoundContext";

export default function ChurchSection() {
  const { playSound } = useSound();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Stan pauzy
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);

  // Refy do kontrolowania płynnego przewijania
  const directionRef = useRef<1 | -1>(1); 
  const speedMultiplierRef = useRef<number>(1); 
  const exactScrollRef = useRef<number>(0); 

  const eventDetails = {
    title: "Ślub Magdy i Johnego",
    description: "Uroczystość zaślubin w kościele pw. św. Piotra i Pawła w Paniowach.",
    location: "Kościół pw. św. Piotra i Pawła, ul. Staromiejska 91, 43-190 Mikołów",
    start: "20260719T120000",
    end: "20260719T131500",
  };

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    eventDetails.title
  )}&dates=${eventDetails.start}/${eventDetails.end}&details=${encodeURIComponent(
    eventDetails.description
  )}&location=${encodeURIComponent(eventDetails.location)}&ctz=Europe/Warsaw`;

  const handleDownloadICS = () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//MagdaJohny//Wedding//PL",
      "BEGIN:VEVENT",
      `DTSTART:${eventDetails.start}`,
      `DTEND:${eventDetails.end}`,
      `SUMMARY:${eventDetails.title}`,
      `DESCRIPTION:${eventDetails.description}`,
      `LOCATION:${eventDetails.location}`,
      "BEGIN:VALARM",
      "TRIGGER:-P1D",
      "ACTION:DISPLAY",
      "DESCRIPTION:Jutro ślub Magdy i Johnego!",
      "END:VALARM",
      "BEGIN:VALARM",
      "TRIGGER:-PT3H",
      "ACTION:DISPLAY",
      "DESCRIPTION:Za 3h ślub Magdy i Johnego!",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "slub-magdy-i-johnego.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const churchImages = [
    "/fotki/kosciol1.jpg",
    "/fotki/kosciol2.jpg",
    "/fotki/kosciol3.jpg",
    "/fotki/kosciol5.jpg",
    "/fotki/kosciol6.jpg",
    "/fotki/kosciol7.jpg"
  ];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId: number;
    const baseSpeed = 0.5;
    exactScrollRef.current = el.scrollLeft;

    const step = () => {
      const halfWidth = el.scrollWidth / 2;
      const isManuallyMoving = speedMultiplierRef.current > 1;

      // Poruszamy się tylko jeśli NIE jest zapauzowane LUB jeśli użytkownik trzyma strzałkę
      if (!isPausedRef.current || isManuallyMoving) {
        exactScrollRef.current += baseSpeed * directionRef.current * speedMultiplierRef.current;

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
    speedMultiplierRef.current = 5;
  };

  const handlePointerUp = () => {
    speedMultiplierRef.current = 1;
  };

  const togglePause = () => {
    playSound("click");
    const newPaused = !isPaused;
    setIsPaused(newPaused);
    isPausedRef.current = newPaused;
  };

  return (
    <section className="relative z-10 px-6 lg:px-8 pt-[150px] lg:pt-[300px] pb-20 flex flex-col lg:flex-row items-center lg:items-stretch gap-10 lg:gap-16 text-[#F6f4e5]">
      
      <div className="absolute top-[10%] right-[-10%] w-[40%] h-[300px] bg-[#A46C6E] blur-[120px] rounded-full mix-blend-multiply opacity-40 pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[40%] h-[250px] bg-[#FFFDF9] blur-[120px] rounded-full opacity-30 pointer-events-none" />

      {/* LEWA KOLUMNA - GALERIA Z PAUZĄ */}
      <div 
        className="relative w-full lg:flex-[1.2] h-[300px] sm:h-[400px] lg:h-[600px] overflow-hidden rounded-xl shadow-2xl z-10 bg-black/10 backdrop-blur-sm group select-none"
      >
        {/* LEWA STRZAŁKA */}
        <button
          onPointerDown={() => handlePointerDown(-1)}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 active:bg-black/90 active:scale-95 text-white p-2 md:p-3 rounded-full backdrop-blur-md opacity-80 md:opacity-0 group-hover:opacity-100 transition-all duration-200 touch-none"
        >
          <ChevronLeftIcon className="w-6 h-6 md:w-8 md:h-8 pointer-events-none" />
        </button>

        {/* PRZYCISK PAUZY (Centrum Dół) */}
        <button
          onClick={togglePause}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/40 hover:bg-black/70 active:bg-black/90 active:scale-95 text-white p-3 rounded-full backdrop-blur-md opacity-80 md:opacity-0 group-hover:opacity-100 transition-all duration-200 touch-none flex items-center justify-center"
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
          {[...churchImages, ...churchImages].map((src, i) => (
            <div key={i} className="relative h-full w-auto flex-shrink-0">
              <img
                src={src}
                alt="Kościół Apostołów Piotra i Pawła"
                className="h-full w-auto object-contain px-0.5 pointer-events-none"
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
        >
          <ChevronRightIcon className="w-6 h-6 md:w-8 md:h-8 pointer-events-none" />
        </button>
      </div>

      {/* PRAWA KOLUMNA - TEKST */}
      <div className="w-full lg:flex-[1] flex flex-col items-center lg:items-start text-center lg:text-left relative z-10 pt-2">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8 flex flex-col items-center lg:items-start w-full"
        >
          <AnimatedText 
              text={"Kościół pw. św.\u00A0 Apostołów Piotra i\u00A0Pawła"} 
              className="font-serif font-normal w-full text-3xl md:text-4xl lg:text-5xl leading-tight mb-2 text-[#F6f4e5] mx-auto lg:mx-0" 
              delay={0.2} 
              mode="line" 
          />
          <AnimatedText 
              text={"rodzinny kościół Pana\u00A0Młodego"} 
              className="font-serif italic font-light text-lg md:text-xl opacity-80 text-[#F6f4e5]" 
              delay={0.3} 
              mode="line" 
          />
        </motion.div>

        <div className="mt-4 md:mt-12 flex flex-col items-center lg:items-start w-full">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-serif font-normal text-2xl md:text-3xl mb-4 leading-snug text-[#F6f4e5] w-full mx-auto lg:mx-0"
          >
            Uroczystość rozpocznie się <br className="md:hidden" />
            <span className="font-medium whitespace-nowrap">19 lipca 2026</span> o&nbsp;godzinie <span className="font-medium">12:00</span>
          </motion.p>

          <AnimatedText 
              text={"ul.\u00A0Staromiejska 91, 43-190\u00A0Mikołów"} 
              className="font-serif font-light text-xl md:text-2xl opacity-90 text-[#F6f4e5]"
              delay={0.6} 
              mode="line" 
          />

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col items-center lg:items-start gap-6 mt-12 lg:mt-20 mb-12 w-full"
          >
            <p className="font-serif font-light text-sm tracking-widest uppercase opacity-80 text-[#F6f4e5]">
              Dodaj do kalendarza:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a
                href={googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 px-5 py-3 w-full sm:w-auto bg-[#F6f4e5] text-[#4c4a1e] rounded-xl text-base font-bold shadow-md hover:bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-sans"
              >
                <CalendarDaysIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                Google Calendar
              </a>
              <button
                onClick={handleDownloadICS}
                className="group flex items-center justify-center gap-2 px-5 py-3 w-full sm:w-auto bg-white/10 border-2 border-[#F6f4e5]/40 text-[#F6f4e5] rounded-xl text-base font-bold shadow-sm hover:bg-white/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm font-sans"
              >
                <svg className="w-5 h-5 mb-0.5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z"/>
                </svg>
                Apple / Outlook
              </button>
            </div>
          </motion.div>

          <AnimatedText
            text={"Będziemy wdzięczni za\u00A0dar Komunii ofiarowanej za\u00A0nas podczas mszy\u00A0świętej"} 
            className="font-serif font-light text-lg md:text-xl opacity-80 hover:opacity-100 cursor-pointer transition-opacity italic text-[#F6f4e5] max-w-[320px] md:max-w-lg text-center lg:text-left mx-auto lg:mx-0"
            delay={1.0}
            mode="line"
          />
        </div>
      </div>
    </section>
  );
}