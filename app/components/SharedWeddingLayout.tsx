"use client";

import Navbar from "./Navbar";
import Timer from "./Timer";
import PolaroidSection from "./PolaroidSection";
import ChurchSection from "./ChurchSection";
import MapSection from "./MapSection";
import Footer from "./Footer";
import PageWrapper from "./PageWrapper"; 
import Image from "next/image";
import { useGuest } from "@/app/context/GuestContext";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import CustomCursor from "./CustomCursor";

// ============================================================================
// KOMPONENT GENERUJĄCY SZKLANĄ, ASYMETRYCZNĄ JODEŁKĘ (Na wzór Twojego szkicu)
// ============================================================================
const OrganicGlassPattern = () => {
  // Punkty definiujące krzywizny i załamania. Pełna asymetria, brak pionowej linii na środku!
  const rows = [
    {
      spineTop: {x: 50, y: 0}, spineBottom: {x: 62, y: 18},
      leftTopY: 0, leftBottomY: 7, rightTopY: 0, rightBottomY: 12,
      blurL: 2, blurR: 5, bgL: 'from-white/20 to-transparent', bgR: 'from-[#C97B78]/10 to-transparent'
    },
    {
      spineTop: {x: 62, y: 18}, spineBottom: {x: 35, y: 38},
      leftTopY: 7, leftBottomY: 28, rightTopY: 12, rightBottomY: 22,
      blurL: 6, blurR: 2, bgL: 'from-white/5 to-white/10', bgR: 'from-white/25 to-transparent'
    },
    {
      spineTop: {x: 35, y: 38}, spineBottom: {x: 65, y: 58},
      leftTopY: 28, leftBottomY: 48, rightTopY: 22, rightBottomY: 45,
      blurL: 3, blurR: 8, bgL: 'from-[#EBBFB8]/15 to-transparent', bgR: 'from-white/10 to-white/5'
    },
    {
      spineTop: {x: 65, y: 58}, spineBottom: {x: 42, y: 78},
      leftTopY: 48, leftBottomY: 72, rightTopY: 45, rightBottomY: 65,
      blurL: 5, blurR: 3, bgL: 'from-white/20 to-transparent', bgR: 'from-[#4E0113]/5 to-transparent'
    },
    {
      spineTop: {x: 42, y: 78}, spineBottom: {x: 50, y: 100},
      leftTopY: 72, leftBottomY: 100, rightTopY: 65, rightBottomY: 100,
      blurL: 2, blurR: 6, bgL: 'from-white/5 to-transparent', bgR: 'from-white/15 to-transparent'
    }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      
      {/* 1. SZKLANE TAFLE ROZMYWAJĄCE TŁO */}
      {rows.map((r, i) => (
        <div key={`pane-${i}`}>
          {/* Lewa tafla */}
          <div 
            className={`absolute inset-0 bg-gradient-to-br ${r.bgL}`} 
            style={{ 
              clipPath: `polygon(0% ${r.leftTopY}%, ${r.spineTop.x}% ${r.spineTop.y}%, ${r.spineBottom.x}% ${r.spineBottom.y}%, 0% ${r.leftBottomY}%)`,
              backdropFilter: `blur(${r.blurL}px)`,
              WebkitBackdropFilter: `blur(${r.blurL}px)`
            }} 
          />
          {/* Prawa tafla */}
          <div 
            className={`absolute inset-0 bg-gradient-to-bl ${r.bgR}`} 
            style={{ 
              clipPath: `polygon(${r.spineTop.x}% ${r.spineTop.y}%, 100% ${r.rightTopY}%, 100% ${r.rightBottomY}%, ${r.spineBottom.x}% ${r.spineBottom.y}%)`,
              backdropFilter: `blur(${r.blurR}px)`,
              WebkitBackdropFilter: `blur(${r.blurR}px)`
            }} 
          />
        </div>
      ))}

      {/* 2. SUPER-CIENKIE PĘKNIĘCIA (RYSUJĄCE SIĘ NA KRAWĘDZIACH TAFEL) */}
      <svg className="absolute inset-0 w-full h-full opacity-60">
        {rows.map((r, i) => (
          <g key={`lines-${i}`} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none">
            {/* Kręgosłup (Zygzak na środku) */}
            <line x1={`${r.spineTop.x}%`} y1={`${r.spineTop.y}%`} x2={`${r.spineBottom.x}%`} y2={`${r.spineBottom.y}%`} />
            {/* Lewe cięcie wędrujące do krawędzi */}
            <line x1="0%" y1={`${r.leftBottomY}%`} x2={`${r.spineBottom.x}%`} y2={`${r.spineBottom.y}%`} />
            {/* Prawe cięcie wędrujące do krawędzi */}
            <line x1="100%" y1={`${r.rightBottomY}%`} x2={`${r.spineBottom.x}%`} y2={`${r.spineBottom.y}%`} />
          </g>
        ))}
      </svg>

    </div>
  );
};
// ============================================================================


export default function SharedWeddingLayout({ 
  showNavbar = true, 
  children 
}: { 
  showNavbar?: boolean;
  children?: React.ReactNode; 
}) {
  const { guest, loading } = useGuest();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setReady(true), 300);
      return () => clearTimeout(t);
    }
  }, [loading]);

  if (loading || !ready) {
    return (
      <>
        {showNavbar && <Navbar />} 
        <div className="flex items-center justify-center h-screen bg-[#FDF9EC] text-[#4E0113] text-lg fixed inset-0 z-50">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
            className="font-serif tracking-widest"
          >
            Ładowanie strony...
          </motion.p>
        </div>
      </>
    );
  }

  return (
    <>
      <CustomCursor />
      
      {showNavbar && <Navbar />}

      {/* --- NAJDALSZA WARSTWA: ZDJĘCIE --- */}
      <div className="fixed inset-0 -z-20">
        <Image 
          src="/fotki/raczki.jpg" 
          alt="Magda i Jan" 
          fill 
          priority 
          className="object-cover object-center" 
        />
        <div className="absolute inset-0 bg-black/20" /> 
      </div>

      {/* --- TEKSTURY GLOBALNE: Tylko sterylny szum papieru --- */}
      <div className="fixed inset-0 pointer-events-none z-[60]">
        <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-[0.6]" />
      </div>

      <main className="relative z-10">
        <PageWrapper>
            
            {/* ========================================================
                GÓRNY BLOK GRADIENTU
                ======================================================== */}
            <div className="relative w-full bg-gradient-to-b from-[#FDF9EC] via-[#F6EBE1] to-[#EBBFB8] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
              
              {/* Nasza nowa, asymetryczna jodełka ze szkła! */}
              <OrganicGlassPattern />

              {/* Plamy gradientu wzmacniające kolory bazy (głęboko pod szkłem) */}
              <div className="absolute top-[0%] left-[-10%] w-[50%] h-[600px] bg-[#FDF9EC] blur-[100px] rounded-full mix-blend-overlay opacity-60 pointer-events-none z-0" />
              <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[500px] bg-[#EBBFB8] blur-[120px] rounded-full opacity-60 pointer-events-none z-0" />
              <div className="absolute top-[40%] left-[20%] w-[40%] h-[400px] bg-[#C97B78] blur-[150px] rounded-full opacity-20 mix-blend-multiply pointer-events-none z-0" />

              {/* Kontener na treść */}
              <div className={`relative z-10 w-full transition-[padding] duration-700 ease-in-out ${guest ? "pt-32" : "pt-24"}`}>
                
                {children}

                <AnimatePresence>
                  {guest && (
                    <div className="w-full flex justify-center pb-8 relative z-10">
                      <div className="px-4">
                        <div className="border border-white/40 rounded-2xl shadow-xl px-8 py-5 flex items-center gap-6 bg-white/50 backdrop-blur-lg">
                          <p className="text-xl md:text-2xl font-serif text-[#4E0113]">
                            Cześć, <span className="font-bold">{guest.first_name} {guest.last_name}</span>! 💐
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </AnimatePresence>

                <PolaroidSection />

              </div>
            </div>

            {/* ========================================================
                ŚRODKOWY BLOK (SZCZELINA NA ZDJĘCIE)
                ======================================================== */}
            <Timer />

            {/* ========================================================
                DOLNY BLOK GRADIENTU
                ======================================================== */}
            <div className="relative w-full bg-gradient-to-b from-[#EBBFB8] via-[#DE9F9B] to-[#C97B78] overflow-hidden shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
              
              {/* Nasza nowa, asymetryczna jodełka ze szkła! (Kontynuacja na dolnej sekcji) */}
              <OrganicGlassPattern />

              {/* Plamy gradientu w dolnej sekcji */}
              <div className="absolute top-[20%] left-[-15%] w-[60%] h-[500px] bg-[#C97B78] blur-[150px] rounded-full mix-blend-multiply opacity-40 pointer-events-none z-0" />
              <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[400px] bg-[#4E0113] blur-[180px] rounded-full mix-blend-overlay opacity-20 pointer-events-none z-0" />

              {/* Kontener na treść */}
              <div className="relative z-10">
                <ChurchSection />
                <MapSection />
                <Footer />
              </div>
            </div>
            
        </PageWrapper>
      </main>
    </>
  );
}