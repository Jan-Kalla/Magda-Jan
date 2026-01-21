"use client";

import Navbar from "./Navbar";
import Timer from "./Timer";
import PolaroidSection from "./PolaroidSection";
import ChurchSection from "./ChurchSection";
import MapSection from "./MapSection";
import Footer from "./Footer";
import Image from "next/image";
import { useGuest } from "@/app/context/GuestContext";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedText from "./AnimatedText";
import { useEffect, useState } from "react";

export default function SharedWeddingLayout({ showNavbar = true }: { showNavbar?: boolean }) {
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
        <div className="flex items-center justify-center h-screen bg-[#FAD6C8] text-[#4E0113] text-lg">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
          >
            Ładowanie strony...
          </motion.p>
        </div>
      </>
    );
  }

  return (
    <>
      {showNavbar && <Navbar />}

      {/* Tło pod spodem (zdjęcie) */}
      <div className="fixed inset-0 -z-20">
        <Image src="/fotki/raczki.jpg" alt="Magda i Jan" fill priority className="object-cover" />
      </div>

      <main 
        className={`relative z-10 transition-[padding] duration-700 ease-in-out ${
          guest ? "md:pt-24 pt-24" : "md:pt-12 pt-12"
        }`}
      >
        {/* === FIX: "Łata" tła === 
            Ten div jest "podklejony" pod górną część strony. 
            Wypełnia lukę stworzoną przez padding-top, dzięki czemu nie widać zdjęcia pod navbarem.
        */}
        <div className="absolute top-0 left-0 w-full h-[600px] bg-[#FAD6C8] -z-10 mask-gradient-to-b" />

        {/* Powitanie gościa */}
        <AnimatePresence>
          {guest && (
            <motion.div 
              key="welcome-wrapper"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="w-full overflow-hidden flex justify-center" // Usunąłem bg-[#FAD6C8] stąd, bo "łata" wyżej to załatwia
            >
              <div className="py-8 px-4">
                <motion.div
                  key="welcome-box"
                  initial={{ opacity: 0, y: -20, scale: 0.95, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, scale: 0.95, filter: "blur(4px)" }}
                  transition={{ duration: 0.4 }}
                  className="border border-[#4E0113]/20 rounded-2xl shadow-lg px-6 py-4 flex items-center gap-6 bg-white/70 backdrop-blur-md"
                >
                  <p className="text-xl md:text-2xl font-semibold text-[#4E0113] drop-shadow">
                    Cześć, {guest.first_name} {guest.last_name}! 💐
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sekcje główne */}
        <PolaroidSection />
        <Timer />
        <ChurchSection />
        <MapSection />
        <Footer />
      </main>
    </>
  );
}