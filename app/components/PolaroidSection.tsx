"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

const PhotoCard = ({ photo, globalIndex }: { photo: any; globalIndex: number }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      // ZMIANA: Dodano role="button", co automatycznie aktywuje dźwięki z naszego globalnego SoundContext!
      role="button"
      tabIndex={0}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      transition={{ duration: 0.6, delay: globalIndex * 0.1, ease: "easeOut" }}
      className={`relative w-full group cursor-pointer perspective-1000 ${!isFlipped ? "hover:-translate-y-1 hover:scale-[1.03]" : ""} transition-transform duration-200`}
      onClick={() => setIsFlipped(!isFlipped)}
      // Dodano onKeyDown dla pełnej dostępności (obsługa klawiatury jak w prawdziwym przycisku)
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsFlipped(!isFlipped);
        }
      }}
    >
      <motion.div
        className="relative w-full [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* ========================================================= */}
        {/* PRZÓD: ZDJĘCIE */}
        {/* ========================================================= */}
        <div className="relative w-full [backface-visibility:hidden] rounded-sm overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-300 bg-black/5">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={800}
            height={800} 
            className="w-full h-auto object-cover block"
          />
          
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <p className="font-serif tracking-widest uppercase text-white border border-white px-4 py-2 rounded-full backdrop-blur-sm text-sm">
              Obróć
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TYŁ: OPIS (ODWRÓCONY) */}
        {/* ========================================================= */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-sm overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-300 bg-[#FDF9EC] flex items-center justify-center p-4 md:p-6 text-center border-2 border-[#4c4a1e]/10">
          <div className="flex flex-col items-center justify-center space-y-3 overflow-y-auto w-full h-full custom-scrollbar">
            <h3 className="font-serif font-medium text-base md:text-lg lg:text-xl text-[#4c4a1e] uppercase tracking-widest shrink-0">
              {photo.alt}
            </h3>
            <div className="w-8 h-[1px] bg-[#4c4a1e]/40 shrink-0"></div>
            <p className="font-serif font-normal text-xs md:text-sm lg:text-base text-[#4c4a1e] leading-relaxed">
              {photo.desc}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function PolaroidSection() {
  const photos = [
    { src: "/fotki/2020.jpg", alt: "Druga liceum", desc: "Siedzieliśmy w jednej ławce na polskim i na godzinie wychowawczej, do polskiego dzieliliśmy się jednym podręcznikiem" },
    { src: "/fotki/2024.05.jpg", alt: "Trzeci rok studiów", desc: "Maj 2024, gdzieś w krzokach." },
    { src: "/fotki/2025.05.jpg", alt: "Ciasta w naszym kolorze", desc: "Nie jest tajemnicą, że ciasta zwykle dobieramy pod swój kolor" },
    { src: "/fotki/2021.05.jpeg", alt: "Po maturach!", desc: "Maj 2021, chwila, kiedy można było trochę odpocząć, poimprezować i wymienić się dobrymi memami" },
    { src: "/fotki/2019.02.jpg", alt: "Pierwsza liceum", desc: "Krynica-Zdrój, luty 2019, szkolny wyjazd narciarski. Nasze pierwsze wspólne zdjęcie! Oczywiście załapał się tu również Szczyrbix😁" },
    { src: "/fotki/2024.08.jpg", alt: "Kierunki", desc: "Sierpień 2024. Madzia mówi, że trzeba iść tam, a ewidentnie widać, że Johny jest innego zdania" },
    { src: "/fotki/2022.04.jpeg", alt: "Pierwszy rok studiów", desc: "Wspólne podróże w Smarcie" },
    { src: "/fotki/2024.09.jpeg", alt: "Czwarty rok studiów", desc: "Wrzesień 2024 - pierwsze wspólne Tatry" },
    { src: "/fotki/2024.12_.jpg", alt: "Narty", desc: "Austria, Zillertal, grudzień 2024" },
    { src: "/fotki/2022.09.jpg", alt: "Pierwsze Mazury", desc: "Wrzesień 2022. Oboje uwielbiamy Mazury! Razem żeglowaliśmy już tam cztery razy i aż dziw bierze, że mamy tak mało wspólnych zdjęć z tych wyjazdów. Ale ponownie pozdrawiamy Szczyrbixa, który też załapał się na to zdjęcie🤗" },
  ];

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 md:px-8 pb-32 pt-16 z-10">
      
      {/* NAGŁÓWEK SEKCJI */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-16 md:mb-24"
      >
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.15em] text-[#4c4a1e] mb-6 px-4 leading-snug">
          Wspólne chwile ulotne jak motyle
        </h2>
        <div className="w-24 h-[1px] bg-[#4c4a1e]/40 mx-auto"></div>
      </motion.div>

      {/* UKŁAD ZDJĘĆ Z FIZYCZNYM PODZIAŁEM NA BLOKI */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full items-start">
        
        {/* BLOK LEWY I ŚRODKOWY (Obejmuje ciasto na dole) */}
        <div className="flex flex-col w-full lg:w-2/3 gap-4 lg:gap-6">
          
          {/* GÓRA: Dwie osobne kolumny */}
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 w-full">
            
            {/* Kolumna Lewa (Index 0, 1) */}
            <div className="flex flex-col w-full sm:w-1/2 gap-4 lg:gap-6">
              <PhotoCard photo={photos[0]} globalIndex={0} />
              <PhotoCard photo={photos[1]} globalIndex={1} />
            </div>

            {/* Kolumna Środkowa (Index 3, 4, 5) */}
            <div className="flex flex-col w-full sm:w-1/2 gap-4 lg:gap-6">
              <PhotoCard photo={photos[3]} globalIndex={3} />
              <PhotoCard photo={photos[4]} globalIndex={4} />
              <PhotoCard photo={photos[5]} globalIndex={5} />
            </div>

          </div>

          {/* DÓŁ: Ciasto (Index 2) - Automatycznie rozciąga się pod kolumną lewą i środkową! */}
          <div className="w-full">
            <PhotoCard photo={photos[2]} globalIndex={2} />
          </div>

        </div>

        {/* BLOK PRAWY: Oddzielna, długa kolumna (Index 6, 7, 8, 9) */}
        <div className="flex flex-col w-full lg:w-1/3 gap-4 lg:gap-6">
          <PhotoCard photo={photos[6]} globalIndex={6} />
          <PhotoCard photo={photos[7]} globalIndex={7} />
          <PhotoCard photo={photos[8]} globalIndex={8} />
          <PhotoCard photo={photos[9]} globalIndex={9} />
        </div>

      </div>

    </section>
  );
}