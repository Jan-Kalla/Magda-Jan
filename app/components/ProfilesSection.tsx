"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function ProfilesSection() {
  const [flipM, setFlipM] = useState(false);
  const [flipJ, setFlipJ] = useState(false);
  
  const [viewedM, setViewedM] = useState(false);
  const [viewedJ, setViewedJ] = useState(false);

  const [isMerged, setIsMerged] = useState(false);

  const handleJohnyClick = () => {
    if (isMerged) return; 
    
    if (!flipJ) {
      setFlipJ(true);
      setFlipM(false);
      setViewedJ(true);
    } else {
      setFlipJ(false);
      if (viewedM) {
        setTimeout(() => setIsMerged(true), 600); 
      }
    }
  };

  const handleMagdaClick = () => {
    if (isMerged) return;
    
    if (!flipM) {
      setFlipM(true);
      setFlipJ(false);
      setViewedM(true);
    } else {
      setFlipM(false);
      if (viewedJ) {
        setTimeout(() => setIsMerged(true), 600);
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 my-32 flex flex-col items-center">
      
      {/* Tytuł sekcji wjeżdżający przy scrollu */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        className="text-center mb-12"
      >
        <h2 className="font-script text-5xl md:text-6xl text-[#4c4a1e] mb-4">Poznajmy się bliżej</h2>
        <div className="w-16 h-[1px] bg-[#4c4a1e]/30 mx-auto"></div>
      </motion.div>

      <div className="relative w-full flex flex-col items-center justify-center perspective-[2000px]">
        
        {/* KONTENER GŁÓWNY */}
        <div 
          className={`flex w-full justify-center h-[400px] md:h-[550px] transition-all duration-[1500ms] ease-in-out ${
            isMerged ? "gap-0 max-w-3xl" : "gap-10 md:gap-32 max-w-4xl"
          }`}
        >
          {/* ========================================== */}
          {/* KARTA LEWA: JOHNY                          */}
          {/* ========================================== */}
          <motion.div
            initial={{ x: -600, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px -150px 0px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-1/2 h-full group perspective-1000"
          >
            <motion.div
              // ZMIANA: Dodano role="button" i tabIndex dla globalnych dźwięków!
              role={!isMerged ? "button" : undefined}
              tabIndex={!isMerged ? 0 : undefined}
              onKeyDown={(e) => {
                if (!isMerged && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  handleJohnyClick();
                }
              }}
              className={`relative w-full h-full [transform-style:preserve-3d] ${!isMerged ? "cursor-pointer" : "cursor-default"}`}
              animate={{ rotateY: flipJ ? 180 : 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              onClick={handleJohnyClick}
              whileHover={{ scale: (flipJ || isMerged) ? 1 : 1.03 }}
            >
              <div className="absolute inset-0 [backface-visibility:hidden] rounded-l-2xl overflow-hidden shadow-xl border-y-4 border-l-4 border-white/40 bg-black/5">
                <Image src="/fotki/johny_lewa.jpg" alt="Johny" fill className="object-cover object-right" />
                
                {!isMerged && (
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <p className="font-serif tracking-widest uppercase text-white border border-white px-4 py-2 rounded-full backdrop-blur-sm">Obróć</p>
                  </div>
                )}
              </div>
              
              <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-l-2xl shadow-xl bg-[#FDF9EC] border-y-4 border-l-4 border-white/40 p-6 md:p-10 flex flex-col justify-center text-center">
                <h3 className="font-serif text-2xl md:text-3xl text-[#4c4a1e] mb-4 uppercase tracking-widest">Jaaaaan</h3>
                <p className="font-serif font-normal text-sm md:text-base text-[#4c4a1e] leading-relaxed">
                  Świadomie i dobrowolnie zrzekamy się możliwości pójścia w inną stronę, nawet gdyby kiedyś miało być ciężko.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* ========================================== */}
          {/* KARTA PRAWA: MAGDA                         */}
          {/* ========================================== */}
          <motion.div
            initial={{ x: 600, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px -150px 0px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-1/2 h-full group perspective-1000"
          >
            <motion.div
              // ZMIANA: Dodano role="button" i tabIndex dla globalnych dźwięków!
              role={!isMerged ? "button" : undefined}
              tabIndex={!isMerged ? 0 : undefined}
              onKeyDown={(e) => {
                if (!isMerged && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  handleMagdaClick();
                }
              }}
              className={`relative w-full h-full [transform-style:preserve-3d] ${!isMerged ? "cursor-pointer" : "cursor-default"}`}
              animate={{ rotateY: flipM ? -180 : 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              onClick={handleMagdaClick}
              whileHover={{ scale: (flipM || isMerged) ? 1 : 1.03 }}
            >
              <div className="absolute inset-0 [backface-visibility:hidden] rounded-r-2xl overflow-hidden shadow-xl border-y-4 border-r-4 border-white/40 bg-black/5">
                <Image src="/fotki/magda_prawa.jpg" alt="Magda" fill className="object-cover object-left" />
                
                {!isMerged && (
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <p className="font-serif tracking-widest uppercase text-white border border-white px-4 py-2 rounded-full backdrop-blur-sm">Obróć</p>
                  </div>
                )}
              </div>
              
              <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(-180deg)] rounded-r-2xl shadow-xl bg-[#FDF9EC] border-y-4 border-r-4 border-white/40 p-6 md:p-10 flex flex-col justify-center text-center">
                <h3 className="font-serif text-2xl md:text-3xl text-[#4c4a1e] mb-4 uppercase tracking-widest">Madziaaaaa</h3>
                <p className="font-serif font-normal text-sm md:text-base text-[#4c4a1e] leading-relaxed">
                  Ale mi się knur trafił! Nie dość, że taki parówiasty knur, to na dodatek taka knurzasta parówa! Hehehehe
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}