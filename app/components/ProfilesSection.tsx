"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ProfilesSection() {
  const [flipM, setFlipM] = useState(false);
  const [flipJ, setFlipJ] = useState(false);
  
  const [viewedM, setViewedM] = useState(false);
  const [viewedJ, setViewedJ] = useState(false);

  const [isMerged, setIsMerged] = useState(false);

  const handleJohnyClick = () => {
    if (isMerged) {
      setIsMerged(false);
      setFlipJ(true);
      return;
    }
    
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
    if (isMerged) {
      setIsMerged(false);
      setFlipM(true);
      return;
    }
    
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
    // ZMIANA: mniejsze marginesy na mobile (mt-32), większe dla desktopów (md:mt-96)
    <div className="w-full max-w-5xl mx-auto px-4 mt-32 md:mt-96 mb-24 md:mb-32 flex flex-col items-center">
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        className="text-center mb-12"
      >
        <h2 className="font-script text-5xl md:text-6xl text-[#4c4a1e] mb-4">Poznajmy się bliżej</h2>
        <div className="w-16 h-[1px] bg-[#4c4a1e]/30 mx-auto"></div>
      </motion.div>

      {/* ZMIANA: Zastosowanie [perspective:1000px] w formacie akceptowanym natywnie przez Tailwind */}
      <div className="relative w-full flex flex-col items-center justify-center [perspective:1000px] md:[perspective:2000px]">
        
        <div 
          className={`flex w-full justify-center h-[400px] md:h-[550px] transition-all duration-[1500ms] ease-in-out ${
            isMerged ? "gap-0 max-w-3xl" : "gap-4 md:gap-32 max-w-4xl"
          }`}
        >
          {/* ========================================== */}
          {/* KARTA LEWA: JOHNY                            */}
          {/* ========================================== */}
          <motion.div
            // ZMIANA KLUCZOWA: x z -200 zmienione na -50, by karta nie wypadła poza viewport na małych ekranach
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-1/2 h-full group"
          >
            <motion.div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleJohnyClick();
                }
              }}
              style={{ transformStyle: "preserve-3d", WebkitTransformStyle: "preserve-3d" }}
              className="relative w-full h-full cursor-pointer"
              animate={{ rotateY: flipJ ? 180 : 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              onClick={handleJohnyClick}
              whileHover={{ scale: flipJ ? 1 : 1.03 }}
            >
              {/* FRONT KARTY (Zdjęcie) */}
              <div 
                className="absolute inset-0 shadow-xl border-y-4 border-l-4 border-r-none border-white/40 bg-black/5 rounded-l-2xl z-10 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:translateZ(1px)] [-webkit-transform:translateZ(1px)]"
              >
                <Image src="/fotki/johny_lewa.jpg" alt="Johny" fill className="object-cover object-right rounded-l-2xl" />
                
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-l-2xl">
                  <p className="font-serif tracking-widest uppercase text-white border border-white px-4 py-2 rounded-full backdrop-blur-sm text-xs md:text-base">Obróć</p>
                </div>
              </div>
              
              {/* TYŁ KARTY (Opis) */}
              <div 
                className="absolute inset-0 rounded-r-2xl rounded-l-none shadow-xl bg-[#FDF9EC] border-y-4 border-l-none border-r-4 border-white/40 p-4 md:p-10 flex flex-col justify-center text-center z-0 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)_translateZ(1px)] [-webkit-transform:rotateY(180deg)_translateZ(1px)]"
              >
                <h3 className="font-serif text-xl md:text-3xl text-[#4c4a1e] mb-4 uppercase tracking-widest break-words">Jaaaaan</h3>
                <p className="font-serif font-normal text-xs md:text-base text-[#4c4a1e] leading-relaxed">
                  Świadomie i dobrowolnie zrzekamy się możliwości pójścia w inną stronę, nawet gdyby kiedyś miało być ciężko.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* ========================================== */}
          {/* KARTA PRAWA: MAGDA                         */}
          {/* ========================================== */}
          <motion.div
            // ZMIANA KLUCZOWA: x z 200 zmienione na 50
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-1/2 h-full group"
          >
            <motion.div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleMagdaClick();
                }
              }}
              style={{ transformStyle: "preserve-3d", WebkitTransformStyle: "preserve-3d" }}
              className="relative w-full h-full cursor-pointer"
              animate={{ rotateY: flipM ? -180 : 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              onClick={handleMagdaClick}
              whileHover={{ scale: flipM ? 1 : 1.03 }}
            >
              {/* FRONT KARTY (Zdjęcie) */}
              <div 
                className="absolute inset-0 shadow-xl border-y-4 border-r-4 border-l-none border-white/40 bg-black/5 rounded-r-2xl z-10 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:translateZ(1px)] [-webkit-transform:translateZ(1px)]"
              >
                <Image src="/fotki/magda_prawa.jpg" alt="Magda" fill className="object-cover object-left rounded-r-2xl" />
                
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-r-2xl">
                  <p className="font-serif tracking-widest uppercase text-white border border-white px-4 py-2 rounded-full backdrop-blur-sm text-xs md:text-base">Obróć</p>
                </div>
              </div>
              
              {/* TYŁ KARTY (Opis) */}
              <div 
                className="absolute inset-0 rounded-l-2xl rounded-r-none shadow-xl bg-[#FDF9EC] border-y-4 border-r-none border-l-4 border-white/40 p-4 md:p-10 flex flex-col justify-center text-center z-0 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(-180deg)_translateZ(1px)] [-webkit-transform:rotateY(-180deg)_translateZ(1px)]"
              >
                <h3 className="font-serif text-xl md:text-3xl text-[#4c4a1e] mb-4 uppercase tracking-widest break-words">Madziaaaaa</h3>
                <p className="font-serif font-normal text-xs md:text-base text-[#4c4a1e] leading-relaxed">
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