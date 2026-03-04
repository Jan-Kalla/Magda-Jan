"use client";

import { motion } from "framer-motion";
import AnimatedText from "./AnimatedText";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { useSound } from "@/app/context/SoundContext";

export default function ChurchSection() {
  const { playSound } = useSound();

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
    "/fotki/kosciol4.jpg",
    "/fotki/kosciol5.jpg",
    "/fotki/kosciol6.jpg",
    "/fotki/kosciol7.jpg"
  ];

  return (
    <section className="relative z-10 px-8 py-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 text-[#F6f4e5]">
      
      {/* --- MESH GRADIENT --- */}
      <div className="absolute top-[10%] right-[-10%] w-[40%] h-[300px] bg-[#A46C6E] blur-[120px] rounded-full mix-blend-multiply opacity-40 pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[40%] h-[250px] bg-[#FFFDF9] blur-[120px] rounded-full opacity-30 pointer-events-none" />

      {/* ========================================== */}
      {/* LEWA KOLUMNA - ZDJĘCIA (NIEUSTANNA ROLKA) */}
      {/* ========================================== */}
      <div className="relative w-full lg:flex-[1.2] h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-xl shadow-2xl z-10 bg-black/10 backdrop-blur-sm">
        <motion.div
          className="flex h-full w-max"
          animate={{ x: ["0%", "-50%"] }} 
          // ZMIANA: Wydłużono czas animacji do 120 sekund - rolka kręci się teraz dwa razy wolniej!
          transition={{ ease: "linear", duration: 120, repeat: Infinity }}
        >
          {[...churchImages, ...churchImages].map((src, i) => (
            <div key={i} className="relative h-full w-auto flex-shrink-0">
              <img
                src={src}
                alt="Kościół Apostołów Piotra i Pawła"
                className="h-full w-auto object-contain"
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* ========================================== */}
      {/* PRAWA KOLUMNA - TEKST (WYRÓWNANY DO LEWEJ) */}
      {/* ========================================== */}
      <div className="w-full lg:flex-[1] flex flex-col justify-center text-left relative z-10">
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <AnimatedText 
              text="Kościół pw. św. Piotra i Pawła" 
              className="font-serif font-bold text-3xl md:text-4xl leading-tight mb-1 text-[#F6f4e5]" 
              delay={0.2} 
              mode="line" 
          />
          
          <AnimatedText 
              text="rodzinny kościół Pana Młodego" 
              className="font-serif italic text-lg md:text-xl opacity-80 mb-8 text-[#F6f4e5]" 
              delay={0.3} 
              mode="line" 
          />
        </motion.div>

        <AnimatedText 
            text="ul. Staromiejska 91, 43-190 Mikołów" 
            className="font-serif text-xl md:text-2xl mb-6 text-[#F6f4e5]"
            delay={0.4} 
            mode="line" 
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="font-serif text-2xl md:text-3xl mb-8 leading-snug text-[#F6f4e5]"
        >
          Uroczystość rozpocznie się <span className="font-bold">19 lipca 2026</span> o godzinie <span className="font-bold">12:00</span>
        </motion.p>

        {/* --- SEKCJA KALENDARZA --- */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col items-start gap-4 mb-8"
        >
          <p className="font-serif text-sm font-bold uppercase tracking-widest opacity-80 text-[#F6f4e5]">
            Dodaj do kalendarza:
          </p>
          <div className="flex flex-wrap gap-4 justify-start">
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-5 py-3 bg-[#F6f4e5] text-[#4c4a1e] rounded-xl text-base font-bold shadow-md hover:bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-sans"
            >
              <CalendarDaysIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Google Calendar
            </a>
            <button
              onClick={handleDownloadICS}
              className="group flex items-center gap-2 px-5 py-3 bg-white/10 border-2 border-[#F6f4e5]/40 text-[#F6f4e5] rounded-xl text-base font-bold shadow-sm hover:bg-white/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm font-sans"
            >
              <svg className="w-5 h-5 mb-0.5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z"/>
              </svg>
              Apple / Outlook
            </button>
          </div>
        </motion.div>

        <AnimatedText
          text="Będziemy wdzięczni za dar Komunii ofiarowanej za nas podczas mszy świętej" 
          className="font-serif text-lg opacity-80 hover:opacity-100 cursor-pointer transition-opacity italic text-[#F6f4e5]"
          delay={1.2}
          mode="line"
        />
      </div>

    </section>
  );
}