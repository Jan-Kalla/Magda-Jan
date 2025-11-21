"use client";

import Navbar from "./Navbar";
import Timer from "./Timer";
import PolaroidSection from "./PolaroidSection";
import ChurchSection from "./ChurchSection";
import MapSection from "./MapSection";
import Image from "next/image";
import { useGuest } from "@/app/context/GuestContext";
import { motion, AnimatePresence } from "framer-motion";
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

      {/* Tło pod spodem */}
      <div className="fixed inset-0 -z-20">
        <Image src="/fotki/raczki.jpg" alt="Magda i Jan" fill priority className="object-cover" />
      </div>

      {/* Kontener strony: brak top paddingu na mobile (sticky), padding na desktop (fixed) */}
      <main className="relative z-10 md:pt-16">
        {/* Powitanie gościa bez dodatkowego mt */}
        <AnimatePresence>
          {guest && (
            <div className="w-full bg-[#FAD6C8] py-8 flex justify-center">
              <motion.div
                key="welcome-box"
                initial={{ opacity: 0, y: -30, scale: 0.95, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -30, scale: 0.95, filter: "blur(6px)" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="border border-[#4E0113]/20 rounded-2xl shadow-lg px-6 py-4 flex items-center gap-6 bg-white/70 backdrop-blur-md"
              >
                <p className="text-xl md:text-2xl font-semibold text-[#4E0113] drop-shadow">
                  Cześć, {guest.first_name} {guest.last_name}! 💐
                </p>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Sekcje główne */}
        <PolaroidSection />
        <Timer />
        <ChurchSection />
        <MapSection />
      </main>
    </>
  );
}
