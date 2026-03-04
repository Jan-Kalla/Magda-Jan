"use client";

import Navbar from "./Navbar";
import Timer from "./Timer";
import PolaroidSection from "./PolaroidSection";
import ChurchSection from "./ChurchSection";
import MapSection from "./MapSection";
import Footer from "./Footer";
import PageWrapper from "./PageWrapper"; 
import OrganicGlassPattern from "./OrganicGlassPattern"; 
import AboutSection from "./AboutSection"; 
import Image from "next/image";
import { useGuest } from "@/app/context/GuestContext";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import CustomCursor from "./CustomCursor";
import ProfilesSection from "./ProfilesSection";

export default function SharedWeddingLayout({ 
  showNavbar = true, 
  children 
}: { 
  showNavbar?: boolean;
  children?: React.ReactNode; 
}) {
  const { guest, loading } = useGuest();
  const [ready, setReady] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("siteUnlocked") === "true") {
      setIsUnlocked(true);
    }
    if (!loading) {
      const t = setTimeout(() => setReady(true), 300);
      return () => clearTimeout(t);
    }
  }, [loading]);

  const handleUnlock = () => {
    setIsUnlocked(true);
    sessionStorage.setItem("siteUnlocked", "true");
  };

  if (loading || !ready) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FDF9EC] text-[#4c4a1e] text-lg fixed inset-0 z-50">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
          className="font-serif tracking-widest"
        >
          Ładowanie strony...
        </motion.p>
      </div>
    );
  }

  return (
    <>
      <CustomCursor />
      
      <AnimatePresence>
        {showNavbar && isUnlocked && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 w-full z-[100]"
          >
            <Navbar />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 -z-20">
        <Image 
          src="/fotki/raczki.jpg" 
          alt="Tło szczeliny" 
          fill 
          priority 
          className="object-cover object-center" 
        />
        <div className="absolute inset-0 bg-black/20" /> 
      </div>

      <div className="fixed inset-0 pointer-events-none z-[60]">
        <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-[0.6]" />
      </div>

      <main className="relative z-10">
        <PageWrapper>
            
            {/* 1. OKŁADKA (HERO SECTION) */}
            <section 
              className={`relative w-full h-screen flex flex-col items-center justify-center overflow-hidden ${!isUnlocked ? "cursor-pointer" : ""}`}
              onClick={() => !isUnlocked && handleUnlock()}
            >
              <Image 
                src="/fotki/gory.jpg" 
                alt="Magdalena i Johny - Góry" 
                fill 
                priority
                className="object-cover object-center" 
              />
              
              <div className="absolute inset-0 bg-black/20 transition-opacity duration-1000" />

              <AnimatePresence mode="wait">
                {!isUnlocked ? (
                  <motion.div
                    key="prompt"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 text-[#FDF9EC] text-center px-4"
                  >
                    <p className="font-sans animate-pulse tracking-widest uppercase text-sm md:text-base font-semibold drop-shadow-md">
                      Kliknij, aby otworzyć zaproszenie
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="title"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                    className="relative z-10 text-center text-[#FDF9EC] drop-shadow-2xl px-4 -mt-16 md:-mt-24 lg:-mt-32"
                  >
                    <div className="relative inline-block">
                      <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-light tracking-widest uppercase z-10">
                        Magdalena <span className="italic pr-1">&amp;</span> Johny
                      </h1>
                      <p className="absolute -bottom-12 md:-bottom-20 right-16 md:right-24 lg:right-40 text-3xl md:text-4xl lg:text-5xl font-script text-[#FDF9EC] drop-shadow-md z-20 whitespace-nowrap">
                        Pobieramy się!
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* 2. RESZTA STRONY PO ODBLOKOWANIU */}
            {isUnlocked && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                
                {/* --- A. GÓRNY BLOK GRADIENTU --- */}
                <div className="relative w-full bg-gradient-to-b from-[#FDF9EC] via-[#F6EBE1] to-[#EBBFB8] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
                  
                  <OrganicGlassPattern part="top" />

                  <div className="absolute top-[0%] left-[-10%] w-[50%] h-[600px] bg-[#FDF9EC] blur-[100px] rounded-full mix-blend-overlay opacity-60 pointer-events-none z-0" />
                  <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[500px] bg-[#EBBFB8] blur-[120px] rounded-full opacity-60 pointer-events-none z-0" />
                  <div className="absolute top-[40%] left-[20%] w-[40%] h-[400px] bg-[#C97B78] blur-[150px] rounded-full opacity-20 mix-blend-multiply pointer-events-none z-0" />

                  <div className="relative z-10 w-full pt-20 md:pt-32 pb-8">
                    
                    {/* ZMIANA: Niezawodne powitanie wyciągnięte na samą górę! */}
                    <AnimatePresence>
                      {guest && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="w-full flex justify-center pb-12 px-4 relative z-10"
                        >
                          <div className="border border-white/40 rounded-2xl shadow-xl px-8 py-5 flex items-center gap-6 bg-white/60 backdrop-blur-lg">
                            <p className="text-xl md:text-2xl font-serif text-[#4c4a1e]">
                              Cześć, <span className="font-bold font-sans">{guest.first_name} {guest.last_name}</span>! 💐
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AboutSection />
                    <ProfilesSection />
                    {children}
                    <PolaroidSection />
                  </div>
                </div>

                {/* --- B. SZCZELINA TIMERA --- */}
                <Timer />

                {/* --- C. DOLNY BLOK GRADIENTU --- */}
                {/* ZMIANA: Dokładnie proporcje 70/30 oraz ciepły koralowy kolor ze zdjęcia na dół (#CE776E) */}
                <div className="relative w-full bg-gradient-to-b from-[#EBBFB8] from-10% via-[#D9948A] via-70% to-[#CE776E] to-100% overflow-hidden shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
                  
                  <OrganicGlassPattern part="bottom" />
                  
                  {/* ZMIANA: Usunięto zieleń, dodano jedynie miękki blask podbijający czystość korali */}
                  <div className="absolute top-[10%] left-[-15%] w-[60%] h-[500px] bg-[#EBBFB8] blur-[150px] rounded-full opacity-30 pointer-events-none z-0" />

                  <div className="relative z-10">
                    <ChurchSection />
                    <MapSection />
                    <Footer />
                  </div>
                </div>

              </motion.div>
            )}

        </PageWrapper>
      </main>
    </>
  );
}