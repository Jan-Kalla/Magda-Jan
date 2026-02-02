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

export default function SharedWeddingLayout({ showNavbar = true }: { showNavbar?: boolean }) {
  const { guest, loading } = useGuest();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      // Krótkie opóźnienie, żeby upewnić się, że dane są gotowe
      const t = setTimeout(() => setReady(true), 300);
      return () => clearTimeout(t);
    }
  }, [loading]);

  // --- STARY, SPRAWDZONY SPOSÓB ŁADOWANIA ---
  // Jeśli ładuje -> pokazujemy TYLKO ekran ładowania.
  // Navbar i reszta nie istnieją, dopóki nie skończymy.
  if (loading || !ready) {
    return (
      <>
        {showNavbar && <Navbar />} {/* Navbar może być widoczny podczas ładowania dla stabilności */}
        <div className="flex items-center justify-center h-screen bg-[#FAD6C8] text-[#4E0113] text-lg fixed inset-0 z-50">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }} // Wolniejsze pulsowanie
            className="font-serif tracking-widest"
          >
            Ładowanie strony...
          </motion.p>
        </div>
      </>
    );
  }

  // --- WŁAŚCIWA TREŚĆ ---
  return (
    <>
      <CustomCursor />
      
      {showNavbar && <Navbar />}

      {/* Tło pod spodem */}
      <div className="fixed inset-0 -z-20">
        <Image 
          src="/fotki/raczki.jpg" 
          alt="Magda i Jan" 
          fill 
          priority 
          className="object-cover object-center" 
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <main 
        className={`relative z-10 transition-[padding] duration-700 ease-in-out ${
          guest ? "md:pt-24 pt-24" : "md:pt-12 pt-12"
        }`}
      >
        {/* Łata gradientowa pod navbarem */}
        <div className="absolute top-0 left-0 w-full h-[600px] bg-[#FAD6C8] -z-10 mask-gradient-to-b" />

        {/* Tutaj wchodzi PageWrapper. 
           Ponieważ wyżej użyliśmy 'return' dla loadera, 
           ten kod wykona się DOPIERO gdy loading=false.
           Wtedy PageWrapper odpali swoją animację startową (tę wolną i płynną).
        */}
        <PageWrapper>
            
            {/* Powitanie gościa */}
            <AnimatePresence>
              {guest && (
                <div className="w-full overflow-hidden flex justify-center pb-8">
                  <div className="px-4">
                    <div className="border border-[#4E0113]/20 rounded-2xl shadow-lg px-6 py-4 flex items-center gap-6 bg-white/70 backdrop-blur-md">
                      <p className="text-xl md:text-2xl font-semibold text-[#4E0113] drop-shadow-sm">
                        Cześć, {guest.first_name} {guest.last_name}! 💐
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>

            {/* Sekcje główne */}
            <PolaroidSection />
            <Timer />
            <ChurchSection />
            <MapSection />
            <Footer />
            
        </PageWrapper>

      </main>
    </>
  );
}