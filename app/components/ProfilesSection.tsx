"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function ProfilesSection() {
  const [flipM, setFlipM] = useState(false);
  const [flipJ, setFlipJ] = useState(false);
  
  const [viewedM, setViewedM] = useState(false);
  const [viewedJ, setViewedJ] = useState(false);

  const [isMerged, setIsMerged] = useState(false);
  
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); 
    setHasMounted(true); 

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  if (!hasMounted) return <div className="min-h-[500px] w-full mt-64 mb-32" />;

  return (
    // ZMIANA: Usunięto sztywne px-4 z głównego kontenera, aby umożliwić swobodne wyjście kart za ekran
    <div className="w-full max-w-5xl mx-auto mt-64 md:mt-96 mb-24 md:mb-32 flex flex-col items-center overflow-x-hidden py-10">
      
      <motion.div
        key={isMobile ? "mobile-title" : "desktop-title"}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: isMobile ? 0.8 : 0.3 }}
        variants={{
          hidden: { opacity: 0, y: isMobile ? 40 : 30 },
          visible: { 
            opacity: 1, 
            y: 0, 
            transition: isMobile ? { duration: 1.5, ease: [0.16, 1, 0.3, 1] } : undefined 
          }
        }}
        className="text-center mb-16 md:mb-12 px-4"
      >
        <h2 className="font-script text-5xl md:text-6xl text-[#4c4a1e] mb-4">Poznajmy się bliżej</h2>
        <div className="w-16 h-[1px] bg-[#4c4a1e]/30 mx-auto"></div>
      </motion.div>

      <div className="relative w-full flex flex-col items-center justify-center [perspective:1000px] md:[perspective:2000px]">
        
        <motion.div 
          key={isMobile ? "mobile-container" : "desktop-container"}
          initial="hidden"
          whileInView="visible"
          viewport={isMobile ? { once: true, margin: "0px 0px -30% 0px" } : { once: true, amount: 0.2 }}
          variants={{
            visible: { transition: { staggerChildren: isMobile ? 0.7 : 0 } }
          }}
          // ZMIANA: Szerokość (w) na urządzeniach mobilnych zależy od stanu. 95% przed połączeniem, 90% po połączeniu.
          className={`flex justify-center h-[350px] sm:h-[400px] md:h-[550px] transition-all duration-[1500ms] ease-in-out ${
            isMerged 
              ? "w-[90%] sm:w-[90%] md:w-full max-w-3xl gap-0" 
              : "w-[95%] sm:w-[95%] md:w-full max-w-4xl gap-4 sm:gap-8 md:gap-32"
          }`}
        >
          {/* ========================================== */}
          {/* KARTA LEWA: JOHNY                            */}
          {/* ========================================== */}
          <motion.div
            variants={{
              hidden: isMobile ? { x: "-30vw", opacity: 0, y: 30, rotateZ: -5 } : { x: -200, opacity: 0, y: 0, rotateZ: 0 },
              visible: isMobile 
                ? { x: 0, opacity: 1, y: 0, rotateZ: 0, transition: { duration: 2.8, ease: [0.16, 1, 0.3, 1] } }
                : { x: 0, opacity: 1, y: 0, rotateZ: 0, transition: { duration: 2.2, ease: "easeOut" } }
            }}
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
              transition={{ duration: 0.6, ease: "easeInOut" }}
              onClick={handleJohnyClick}
              whileHover={{ scale: flipJ ? 1 : 1.03 }}
            >
              {/* FRONT KARTY */}
              <div 
                className="absolute inset-0 shadow-xl border-y-4 border-l-4 border-r-none border-white/40 bg-black/5 rounded-l-2xl z-10 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:translateZ(1px)] [-webkit-transform:translateZ(1px)]"
              >
                <Image 
                  src="/fotki/johny_lewa.jpg" 
                  alt="Johny" 
                  fill 
                  priority
                  sizes="(max-width: 768px) 60vw, 50vw"
                  className="object-cover object-right rounded-l-2xl" 
                />
                
                <div className="hidden md:flex absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center rounded-l-2xl">
                  <p className="font-serif tracking-widest uppercase text-white border border-white px-4 py-2 rounded-full backdrop-blur-sm text-base">Obróć</p>
                </div>

                <AnimatePresence>
                  {!viewedJ && (
                    <motion.div 
                      variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { delay: 3.5, duration: 0.8 } }
                      }}
                      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.9 } }}
                      className="flex md:hidden absolute bottom-3 left-1/2 -translate-x-1/2"
                    >
                      <p className="font-serif tracking-widest uppercase text-white bg-black/40 border border-white/60 px-3 py-1 rounded-full backdrop-blur-md text-[10px] shadow-lg animate-pulse">
                        Obróć
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* TYŁ KARTY */}
              <div 
                className="absolute inset-0 rounded-r-2xl rounded-l-none shadow-xl bg-[#FDF9EC] border-y-4 border-l-none border-r-4 border-white/40 z-0 overflow-hidden [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)_translateZ(1px)] [-webkit-transform:rotateY(180deg)_translateZ(1px)]"
              >
                {/* ZMIANA: Wyśrodkowanie bez mt-auto/pb-auto i mniejsze teksty */}
                <div className="w-full h-full overflow-y-auto p-4 sm:p-6 md:p-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#4c4a1e]/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                  <div className="min-h-full flex flex-col justify-center items-center text-center">
                    <h3 className="font-serif text-xl md:text-2xl text-[#4c4a1e] mb-2 sm:mb-3 uppercase tracking-widest break-words">
                      Johny
                    </h3>
                    <p className="font-serif font-normal text-[11px] sm:text-xs md:text-sm text-[#4c4a1e] leading-relaxed">
                      Jan - dali mi rodzice na imię, choć dla większości znajomych i krewnych jestem: Johny, dla swojej wybranki: Knur lub Parówa. Jestem inżynierem informatyki na wydziale AEI Politechniki Śląskiej, obecnie również dyplomantem studiów magisterskich tego samego kierunku tamże. Taką Madzię sobie wybrałem i to właśnie z nią planuję wytrwać aż do śmierci, świadomie i dobrowolnie zrzekam się możliwości pójścia w inną stronę, nawet gdyby kiedyś miało być ciężko.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ========================================== */}
          {/* KARTA PRAWA: MAGDA                         */}
          {/* ========================================== */}
          <motion.div
            variants={{
              hidden: isMobile ? { x: "30vw", opacity: 0, y: 30, rotateZ: 5 } : { x: 200, opacity: 0, y: 0, rotateZ: 0 },
              visible: isMobile 
                ? { x: 0, opacity: 1, y: 0, rotateZ: 0, transition: { duration: 2.8, ease: [0.16, 1, 0.3, 1] } }
                : { x: 0, opacity: 1, y: 0, rotateZ: 0, transition: { duration: 2.2, ease: "easeOut" } }
            }}
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
              transition={{ duration: 0.6, ease: "easeInOut" }}
              onClick={handleMagdaClick}
              whileHover={{ scale: flipM ? 1 : 1.03 }}
            >
              {/* FRONT KARTY */}
              <div 
                className="absolute inset-0 shadow-xl border-y-4 border-r-4 border-l-none border-white/40 bg-black/5 rounded-r-2xl z-10 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:translateZ(1px)] [-webkit-transform:translateZ(1px)]"
              >
                <Image 
                  src="/fotki/magda_prawa.jpg" 
                  alt="Magda" 
                  fill 
                  priority
                  sizes="(max-width: 768px) 60vw, 50vw"
                  className="object-cover object-left rounded-r-2xl" 
                />
                
                <div className="hidden md:flex absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center rounded-r-2xl">
                  <p className="font-serif tracking-widest uppercase text-white border border-white px-4 py-2 rounded-full backdrop-blur-sm text-base">Obróć</p>
                </div>

                <AnimatePresence>
                  {!viewedM && (
                    <motion.div 
                      variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { delay: 3.5, duration: 0.8 } }
                      }}
                      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.9 } }}
                      className="flex md:hidden absolute bottom-3 left-1/2 -translate-x-1/2"
                    >
                      <p className="font-serif tracking-widest uppercase text-white bg-black/40 border border-white/60 px-3 py-1 rounded-full backdrop-blur-md text-[10px] shadow-lg animate-pulse">
                        Obróć
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* TYŁ KARTY */}
              <div 
                className="absolute inset-0 rounded-l-2xl rounded-r-none shadow-xl bg-[#FDF9EC] border-y-4 border-r-none border-l-4 border-white/40 z-0 overflow-hidden [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(-180deg)_translateZ(1px)] [-webkit-transform:rotateY(-180deg)_translateZ(1px)]"
              >
                {/* ZMIANA: Wyśrodkowanie bez mt-auto/pb-auto i mniejsze teksty */}
                <div className="w-full h-full overflow-y-auto p-4 sm:p-6 md:p-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#4c4a1e]/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                  <div className="min-h-full flex flex-col justify-center items-center text-center">
                    <h3 className="font-serif text-xl md:text-2xl text-[#4c4a1e] mb-2 sm:mb-3 uppercase tracking-widest break-words">
                      Magda
                    </h3>
                    <p className="font-serif font-normal text-[11px] sm:text-xs md:text-sm text-[#4c4a1e] leading-relaxed">
                      Ale mi się knur trafił! Nie dość, że taki parówiasty knur, to na dodatek taka knurzasta parówa! Hehehehe
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}