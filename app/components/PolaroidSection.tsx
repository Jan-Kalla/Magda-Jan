"use client";

import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useState } from "react";

type Direction = "top" | "bottom" | "left" | "right" | "center";

const PhotoCard = ({ photo, globalIndex, direction }: { photo: any; globalIndex: number; direction: Direction }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const [isInView, setIsInView] = useState(false);

  const mobileHintVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        delay: 5, 
        duration: 0.8, 
        ease: "easeOut" 
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.5, 
      transition: { duration: 0.3 } 
    }
  };

  const getInitialPosition = (dir: Direction) => {
    switch (dir) {
      case "top": return { opacity: 0, y: -75, x: 0 };
      case "bottom": return { opacity: 0, y: 75, x: 0 };
      case "left": return { opacity: 0, x: -75, y: 0 };
      case "right": return { opacity: 0, x: 75, y: 0 };
      case "center": return { opacity: 0, scale: 0.8, y: 0, x: 0 };
      default: return { opacity: 0, y: 50, x: 0 };
    }
  };

  const initialAnimation = getInitialPosition(direction);

  const handleInteraction = () => {
    if (hintVisible) setHintVisible(false);
    setIsFlipped(!isFlipped);
  };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      initial={initialAnimation}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      onViewportEnter={() => setIsInView(true)}
      transition={{ duration: 0.9, delay: globalIndex * 0.1, ease: "easeOut" }}
      className="relative w-full group cursor-pointer perspective-1000 flex flex-col flex-auto min-h-0"
      whileHover={!isFlipped ? { y: -5, scale: 1.03, transition: { duration: 0.2 } } : {}}
      onClick={handleInteraction}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleInteraction();
        }
      }}
    >
      <motion.div
        className="relative w-full h-full flex flex-col flex-auto [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* ========================================================= */}
        {/* PRZÓD: ZDJĘCIE */}
        {/* ========================================================= */}
        <div className="relative w-full h-full flex-auto [backface-visibility:hidden] rounded-sm overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-300 bg-black/5 min-h-0">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={800}
            height={800} 
            sizes="(max-width: 768px) 50vw, 33vw"
            className="w-full h-full object-cover block"
          />
          
          {/* Desktop Overlay */}
          <div className="hidden md:flex absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center">
            <p className="font-serif tracking-widest uppercase text-white border border-white px-4 py-2 rounded-full backdrop-blur-sm text-sm">
              Obróć
            </p>
          </div>

          {/* MOBILNA PLAKIETKA */}
          <AnimatePresence>
            {isInView && hintVisible && !isFlipped && (
              <motion.div
                variants={mobileHintVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex md:hidden absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none"
              >
                <p className="font-serif tracking-widest uppercase text-white bg-black/50 border border-white/60 px-2.5 py-1 rounded-full backdrop-blur-md text-[9px] shadow-lg animate-pulse whitespace-nowrap">
                  Obróć
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ========================================================= */}
        {/* TYŁ: OPIS (ODWRÓCONY) */}
        {/* ========================================================= */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-sm overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-300 bg-[#FDF9EC] border-2 border-[#4c4a1e]/10">
          {/* ZMIANA: Usunięto flex z tego poziomu i przeniesiono padding. Ustawiono przewijanie na cały kontener. */}
          <div className="w-full h-full overflow-y-auto custom-scrollbar p-2.5 sm:p-4 md:p-6 flex flex-col">
            
            {/* ZMIANA: m-auto sprawia, że blok centruje się gdy jest mały, a gdy duży - zaczyna się od góry bez ucinania! */}
            <div className="m-auto flex flex-col items-center justify-center w-full">
              <h3 className="font-serif font-medium text-[11px] sm:text-sm md:text-lg lg:text-xl text-[#4c4a1e] uppercase tracking-widest shrink-0 text-center">
                {photo.alt}
              </h3>
              <div className="w-6 sm:w-8 h-[1px] bg-[#4c4a1e]/40 shrink-0 my-1.5 sm:my-3"></div>
              {/* ZMIANA: Mniejszy font (text-[10px]) i węższa interlinia (leading-[1.4]) dla mobile */}
              <p className="font-serif font-normal text-[10px] sm:text-xs md:text-sm lg:text-base text-[#4c4a1e] leading-[1.4] md:leading-relaxed text-center">
                {photo.desc}
              </p>
            </div>

          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function PolaroidSection() {
  const photos = [
    { src: "/fotki/2020.jpg", alt: "Druga liceum", desc: "Siedzieliśmy w jednej ławce na polskim i na godzinie wychowawczej, do polskiego dzieliliśmy się jednym podręcznikiem" },
    { src: "/fotki/2024.05.jpg", alt: "Trzeci rok studiów", desc: "Maj 2024, kajś w krzokach" },
    { src: "/fotki/2025.05.jpg", alt: "Ciasta w naszym kolorze", desc: "Nie jest tajemnicą, że ciasta zwykle dobieramy pod swój kolor" },
    { src: "/fotki/2021.05.jpg", alt: "Po maturach!", desc: "Maj 2021, odpoczynek po nauce i dzielenie się dobrymi memami" },
    { src: "/fotki/2019.02.jpg", alt: "Pierwsza liceum", desc: "Krynica-Zdrój, luty 2019, szkolny wyjazd narciarski. Nasze pierwsze wspólne selfie! Oczywiście załapał się tu również Szczyrbix😁" },
    { src: "/fotki/2024.08.jpg", alt: "Kierunki", desc: "Sierpień 2024, Madzia mówi, że trzeba iść tam, a przecież ewidentnie widać, że Johny jest innego zdania" },
    { src: "/fotki/2022.04.jpg", alt: "Pierwszy rok studiów", desc: "Wspólne podróże w Smarcie" },
    { src: "/fotki/2024.09.jpg", alt: "Czwarty rok studiów", desc: "Wrzesień 2024 - pierwsze wspólne Tatry" },
    { src: "/fotki/2024.12.jpg", alt: "Narty", desc: "Austria, Zillertal, grudzień 2024" },
    { src: "/fotki/2025.08__.jpg", alt: "Mazury", desc: "Wrzesień 2025, to już nasze czwarte wspólne Mazury! Mazury są super!" },
  ];

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 md:px-8 pb-24 lg:pb-32 pt-48 mb-48 lg:mb-[150px] z-10">
      
      {/* NAGŁÓWEK SEKCJI */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-16 md:mb-24"
      >
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.15em] text-[#4c4a1e] mb-6 px-4 leading-snug">
         <p>
          Wspólne chwile 
         </p>
          ulotne jak motyle
         <p/>
        </h2>
        <div className="w-24 h-[1px] bg-[#4c4a1e]/40 mx-auto"></div>
      </motion.div>

      {/* UKŁAD ZDJĘĆ Z FIZYCZNYM PODZIAŁEM NA BLOKI */}
      <div className="flex flex-col lg:flex-row gap-3 md:gap-4 lg:gap-6 w-full items-stretch">
        
        {/* BLOK LEWY I ŚRODKOWY */}
        <div className="flex flex-col w-full lg:w-2/3 gap-3 md:gap-4 lg:gap-6 flex-auto min-h-0">
          
          <div className="flex flex-row gap-3 md:gap-4 lg:gap-6 w-full items-stretch flex-auto min-h-0">
            
            {/* Kolumna Lewa (Index 0, 1) */}
            <div className="flex flex-col w-1/2 gap-3 md:gap-4 lg:gap-6 items-stretch flex-auto min-h-0">
              <PhotoCard photo={photos[0]} globalIndex={4} direction="left" />
              <PhotoCard photo={photos[1]} globalIndex={5} direction="left" />
            </div>

            {/* Kolumna Środkowa (Index 3, 4, 5) */}
            <div className="flex flex-col w-1/2 gap-3 md:gap-4 lg:gap-6 items-stretch flex-auto min-h-0">
              <PhotoCard photo={photos[3]} globalIndex={0} direction="bottom" />
              <PhotoCard photo={photos[4]} globalIndex={1} direction="bottom" />
              <PhotoCard photo={photos[5]} globalIndex={2} direction="bottom" />
            </div>

          </div>

          {/* DÓŁ: Ciasto (Index 2) */}
          <div className="w-full flex flex-col flex-auto min-h-0">
            <PhotoCard photo={photos[2]} globalIndex={8} direction="bottom" />
          </div>

        </div>

        {/* BLOK PRAWY */}
        <div className="flex flex-row lg:flex-col w-full lg:w-1/3 gap-3 md:gap-4 lg:gap-6 items-stretch flex-auto min-h-0">
          
          {/* Kolumna 1 na telefonie (lewa strona tego bloku) */}
          <div className="flex flex-col w-1/2 lg:w-full gap-3 md:gap-4 lg:gap-6 items-stretch flex-auto min-h-0">
            <PhotoCard photo={photos[6]} globalIndex={4} direction="right" />
            <PhotoCard photo={photos[7]} globalIndex={5} direction="right" />
          </div>

          {/* Kolumna 2 na telefonie (prawa strona tego bloku) */}
          <div className="flex flex-col w-1/2 lg:w-full gap-3 md:gap-4 lg:gap-6 items-stretch flex-auto min-h-0">
            <PhotoCard photo={photos[8]} globalIndex={6} direction="right" />
            <PhotoCard photo={photos[9]} globalIndex={7} direction="right" />
          </div>

        </div>

      </div>

    </section>
  );
}