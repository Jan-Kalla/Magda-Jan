"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/app/components/Navbar"; 
import MapTrackSection from "./MapTrackSection"; 
import VenueHeroSection from "./VenueHeroSection"; 
import TimelineSection from "./TimelineSection";
import Footer from "@/app/components/Footer";
import PageWrapper from "@/app/components/PageWrapper";
import { motion, useScroll, useTransform } from "framer-motion";
import { useGuest } from "@/app/context/GuestContext";
import { useRouter } from "next/navigation";

type Star = {
  id: number;
  top: string;
  left: string;
  size: number;
  opacity: number;
  pulseDelay: number;
};

export default function HarmonogramPage() {
  const { guest, loading } = useGuest(); // Pobranie stanu
  const router = useRouter(); // Router
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start start", "end end"]
  });

  // --- FAZY NIEBA ---
  const afternoonOpacity = useTransform(scrollYProgress, [0, 0.35, 0.45], [1, 1, 0]); 
  const sunsetOpacity = useTransform(scrollYProgress, [0.35, 0.4, 0.5, 0.6], [0, 1, 1, 0]); 
  const nightOpacity = useTransform(scrollYProgress, [0.45, 0.6, 0.85, 1], [0, 1, 1, 0]); 
  const dawnOpacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);

  // --- CIAŁA NIEBIESKIE ---
  const sun1Y = useTransform(scrollYProgress, [0, 0.45], ["15vh", "110vh"]);
  const sun1Opacity = useTransform(scrollYProgress, [0, 0.35, 0.45], [1, 1, 0]);
  
  const moonY = useTransform(scrollYProgress, [0.45, 0.6, 1], ["100vh", "15vh", "15vh"]);
  const moonOpacity = useTransform(scrollYProgress, [0.45, 0.55, 0.85, 0.95], [0, 1, 1, 0]);
  
  // Animacja blasku słońca przy stopce
  const sunGlow = useTransform(scrollYProgress, [0.9, 1], [0.8, 1]);
  const starsOpacity = useTransform(scrollYProgress, [0.45, 0.6, 0.85, 0.92], [0, 1, 1, 0]);

  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 80 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        pulseDelay: Math.random() * 3,
      }))
    );
  }, []);

  // DODANE: Nasłuchiwanie wylogowania
  useEffect(() => {
    if (!loading && !guest) {
      router.push("/");
    }
  }, [guest, loading, router]);

  // DODANE: Blokada ekranu (umieszczone po wszystkich hookach!)
  if (loading || !guest) {
    return <div className="min-h-screen bg-[#050510]" />; // Pokazujemy puste nocne niebo na ułamek sekundy
  }

  return (
    <div className="relative min-h-screen bg-[#050510] overflow-x-hidden">
      
      {/* 1. TŁA PARALAKSY */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div style={{ opacity: afternoonOpacity }} className="absolute inset-0 bg-gradient-to-b from-[#7FB1D6] via-[#9ABCE0] to-[#FAD6C8]" />
        <motion.div style={{ opacity: sunsetOpacity }} className="absolute inset-0 bg-gradient-to-b from-[#FF6B00] via-[#E62719] to-[#6B0013]" />
        <motion.div style={{ opacity: nightOpacity }} className="absolute inset-0 bg-gradient-to-b from-[#0B0B2A] to-[#050510]" />

        {/* TŁO: Świt */}
        <motion.div 
          style={{ opacity: dawnOpacity }} 
          className="absolute inset-0 bg-gradient-to-b from-[#1a1a3a] via-[#4a2a5a] to-[#ff8c00]" 
        />

        {/* GWIAZDY */}
        <motion.div style={{ opacity: starsOpacity }} className="absolute inset-0">
          {stars.map((star) => (
            <motion.div
              key={star.id}
              className="absolute bg-white rounded-full"
              style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                opacity: star.opacity,
              }}
              animate={{ opacity: [star.opacity, star.opacity * 0.2, star.opacity] }}
              transition={{ duration: 3 + star.pulseDelay, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </motion.div>

        {/* Słońce Popołudniowe */}
        <motion.div 
          style={{ y: sun1Y, opacity: sun1Opacity, x: "-50%" }}
          className="absolute left-[80%] md:left-[70%] w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-[#FFF9E6] to-[#F9D423] shadow-[0_0_80px_#F9D423]"
        />

        {/* Księżyc */}
        <motion.div 
          style={{ y: moonY, opacity: moonOpacity, x: "-50%" }}
          className="absolute left-[20%] md:left-[30%] w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[#FDF9EC] to-[#A9A9A9] shadow-[0_0_60px_#FDF9EC]"
        >
          <div className="absolute top-[20%] left-[20%] w-4 h-4 rounded-full bg-black/10" />
          <div className="absolute top-[50%] left-[60%] w-6 h-6 rounded-full bg-black/10" />
          <div className="absolute top-[70%] left-[30%] w-3 h-3 rounded-full bg-black/10" />
        </motion.div>
      </div>

      {/* 2. SEKCJA GÓRNA */}
      <div className="relative z-20 bg-[#FAD6C8]">
        <Navbar />
        <PageWrapper>
            <VenueHeroSection />
            <MapTrackSection />
        </PageWrapper>
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-b from-[#FAD6C8] to-transparent translate-y-full pointer-events-none z-10" />
      </div>

      {/* 3. SEKCJA HARMONOGRAMU */}
      <div ref={timelineRef} className="relative z-10 pt-40 pb-[50vh]">
        <PageWrapper>
            <TimelineSection />
        </PageWrapper>
      </div>

      {/* 4. STOPKA ZE SŁOŃCEM */}
      <div className="relative z-30 overflow-visible">
        
        {/* WSCHODZĄCE SŁOŃCE - Zmniejszone rozmiary i lekko przesunięte w dół */}
        <motion.div 
          style={{ 
            opacity: dawnOpacity,
            scale: sunGlow,
          }}
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[50%] w-[150px] h-[150px] md:w-[280px] md:h-[280px] rounded-full bg-gradient-to-t from-[#FFCC33] via-[#FFB347] to-[#FF4D00] shadow-[0_0_100px_rgba(255,77,0,0.5)] pointer-events-none"
        />

        {/* Sama stopka */}
        <div className="relative z-10">
          <Footer />
        </div>
      </div>

    </div>
  );
}