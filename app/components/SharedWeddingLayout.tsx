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

      {/* --- TEKSTURY GLOBALNE: Tylko szum na samym wierzchu --- */}
      <div className="fixed inset-0 pointer-events-none z-[60]">
        <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-[0.6]" />
      </div>

      <main className="relative z-10">
        <PageWrapper>
            
            {/* ========================================================
                GÓRNY BLOK GRADIENTU
                ======================================================== */}
            <div className="relative w-full bg-gradient-to-b from-[#FDF9EC] via-[#F6EBE1] to-[#EBBFB8] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
              
              {/* --- KWIATY (TAPETA) - Ukryte głęboko pod treścią na z-0 --- */}
              <div className="absolute inset-0 bg-floral-pattern opacity-[0.5] mix-blend-multiply pointer-events-none z-0" />

              {/* --- MESH (Rozmyte plamy bazy) --- */}
              <div className="absolute top-[0%] left-[-10%] w-[50%] h-[600px] bg-[#FDF9EC] blur-[100px] rounded-full mix-blend-overlay opacity-60 pointer-events-none z-0" />
              <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[500px] bg-[#EBBFB8] blur-[120px] rounded-full opacity-60 pointer-events-none z-0" />
              <div className="absolute top-[40%] left-[20%] w-[40%] h-[400px] bg-[#C97B78] blur-[150px] rounded-full opacity-20 mix-blend-multiply pointer-events-none z-0" />

              {/* --- SZKLANE TAFLE (Potłuczone szkło) --- */}
              <div className="absolute inset-0 pointer-events-none z-0">
                {/* 1. Ogromne ukośne cięcie (góra-lewo do dół-prawo) */}
                <div className="absolute top-0 left-0 w-[80%] h-[50%] bg-gradient-to-br from-white/40 to-transparent [clip-path:polygon(0_0,100%_0,40%_100%,0_100%)] backdrop-blur-[4px] border-b border-r border-white/20" />
                
                {/* 2. Ostry klin z prawej strony */}
                <div className="absolute top-[10%] right-0 w-[50%] h-[70%] bg-gradient-to-bl from-[#C97B78]/10 to-transparent [clip-path:polygon(100%_0,100%_100%,0_60%)] backdrop-blur-[6px] border-l border-white/30" />
                
                {/* 3. Szeroki pas przecinający całą szerokość */}
                <div className="absolute top-[30%] left-[-10%] w-[120%] h-[40%] bg-gradient-to-t from-white/20 to-transparent [clip-path:polygon(0_30%,100%_0,100%_70%,0_100%)] backdrop-blur-[2px] border-t border-b border-white/10" />

                {/* 4. Mały, ostry odłamek dryfujący z lewej */}
                <div className="absolute top-[20%] left-[5%] w-[20%] h-[20%] bg-white/20 [clip-path:polygon(50%_0,100%_50%,0_100%)] backdrop-blur-[8px] border border-white/40" />

                {/* 5. Pionowy, cienki promień światła z prawej strony */}
                <div className="absolute top-[-10%] left-[70%] w-[8%] h-[120%] bg-gradient-to-b from-white/50 to-white/5 [clip-path:polygon(0_0,100%_0,50%_100%,20%_100%)] backdrop-blur-[3px] border-l border-white/50" />

                {/* 6. Duży klin na dole opierający się o zdjęcia polaroid */}
                <div className="absolute bottom-0 left-[20%] w-[60%] h-[40%] bg-gradient-to-t from-[#EBBFB8]/40 to-transparent [clip-path:polygon(50%_0,100%_100%,0_100%)] backdrop-blur-[8px] border-t border-white/40" />
              </div>

              {/* --- KONTENER NA TREŚĆ (z-10, czyli ZAWSZE NAD KWIATAMI I SZKŁEM) --- */}
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
              
              {/* --- KWIATY (TAPETA) - Kontynuacja --- */}
              <div className="absolute inset-0 bg-floral-pattern opacity-[0.4] mix-blend-multiply pointer-events-none z-0" />

              {/* --- MESH (Rozmyte plamy bazy) --- */}
              <div className="absolute top-[20%] left-[-15%] w-[60%] h-[500px] bg-[#C97B78] blur-[150px] rounded-full mix-blend-multiply opacity-40 pointer-events-none z-0" />
              <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[400px] bg-[#4E0113] blur-[180px] rounded-full mix-blend-overlay opacity-20 pointer-events-none z-0" />

              {/* --- SZKLANE TAFLE (Więcej geometrii na dolnej sekcji) --- */}
              <div className="absolute inset-0 pointer-events-none z-0">
                {/* 1. Potężne przecięcie całej górnej połowy */}
                <div className="absolute top-0 left-0 w-[100%] h-[60%] bg-gradient-to-b from-white/20 to-transparent [clip-path:polygon(0_0,100%_0,0_100%)] backdrop-blur-[5px] border-b border-white/20" />
                
                {/* 2. Diament lewitujący obok kościoła */}
                <div className="absolute top-[25%] left-[10%] w-[80%] h-[50%] bg-gradient-to-br from-white/15 to-transparent [clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)] backdrop-blur-[4px] border border-white/20" />
                
                {/* 3. Grube szkło przycinające prawy dolny róg mapy */}
                <div className="absolute bottom-0 right-0 w-[70%] h-[50%] bg-gradient-to-tl from-[#4E0113]/10 to-transparent [clip-path:polygon(100%_100%,100%_0,0_100%)] backdrop-blur-[10px] border-t border-l border-white/10" />
                
                {/* 4. Cienka igła załamująca światło przez środek */}
                <div className="absolute top-[10%] left-[45%] w-[12%] h-[80%] bg-white/10 [clip-path:polygon(0_0,100%_0,50%_100%,40%_100%)] backdrop-blur-[6px] border-l border-white/30" />

                {/* 5. Kolejny ostry odłamek na lewym dolnym boku */}
                <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-gradient-to-tr from-white/30 to-transparent [clip-path:polygon(0_0,100%_50%,0_100%)] backdrop-blur-[5px] border-r border-t border-white/30" />

                {/* 6. Półprzezroczysta łuska w prawym górnym rogu */}
                <div className="absolute top-[5%] right-[10%] w-[25%] h-[35%] bg-white/15 [clip-path:polygon(50%_0,100%_100%,0_80%)] backdrop-blur-[8px] border-b border-white/30" />
              </div>

              {/* --- KONTENER NA TREŚĆ (z-10) --- */}
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