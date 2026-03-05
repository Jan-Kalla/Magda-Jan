"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

type Direction = "top" | "bottom" | "left" | "right" | "center";

const PhotoCard = ({ photo, globalIndex, direction }: { photo: any; globalIndex: number; direction: Direction }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const getInitialPosition = (dir: Direction) => {
    switch (dir) {
      case "top": return { opacity: 0, y: -200, x: 0 };
      case "bottom": return { opacity: 0, y: 200, x: 0 };
      case "left": return { opacity: 0, x: -200, y: 0 };
      case "right": return { opacity: 0, x: 200, y: 0 };
      case "center": return { opacity: 0, scale: 0.8, y: 0, x: 0 };
      default: return { opacity: 0, y: 50, x: 0 };
    }
  };

  const initialAnimation = getInitialPosition(direction);

  return (
    <motion.div
      role="button"
      tabIndex={0}
      initial={initialAnimation}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      // ZMIANA: Zwiększony amount do 0.35 + ujemny margines dolny zmuszają użytkownika do głębszego zjechania w dół!
      viewport={{ once: true, amount: 0.35, margin: "0px 0px -100px 0px" }}
      transition={{ duration: 0.9, delay: globalIndex * 0.1, ease: "easeOut" }}
      className="relative w-full group cursor-pointer perspective-1000"
      whileHover={!isFlipped ? { y: -5, scale: 1.03, transition: { duration: 0.2 } } : {}}
      onClick={() => setIsFlipped(!isFlipped)}
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
   // ZMIANA: Dodano drastycznie większy margines dolny (mb-96 lg:mb-[400px]) i padding (pb-48 lg:pb-64)
    // To utworzy potężny "oddech" przed przejściem do szczeliny z Timerem
    <section className="relative w-full max-w-7xl mx-auto px-4 md:px-8 pb-48 lg:pb-64 pt-48 mb-96 lg:mb-[300px] z-10">
      
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
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full items-start">
        
        {/* BLOK LEWY I ŚRODKOWY */}
        <div className="flex flex-col w-full lg:w-2/3 gap-4 lg:gap-6">
          
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 w-full">
            
            {/* Kolumna Lewa (Index 0, 1) */}
            <div className="flex flex-col w-full sm:w-1/2 gap-4 lg:gap-6">
              {/* ZMIANA: Indeksy podniesione na 4 i 5, by poczekały na środek */}
              <PhotoCard photo={photos[0]} globalIndex={4} direction="left" />
              <PhotoCard photo={photos[1]} globalIndex={5} direction="left" />
            </div>

            {/* Kolumna Środkowa (Index 3, 4, 5) */}
            <div className="flex flex-col w-full sm:w-1/2 gap-4 lg:gap-6">
              {/* ZMIANA: Wszystkie z dołu, indeksy 0, 1, 2 = pojawiają się jako PIERWSZE */}
              <PhotoCard photo={photos[3]} globalIndex={0} direction="bottom" />
              <PhotoCard photo={photos[4]} globalIndex={1} direction="bottom" />
              <PhotoCard photo={photos[5]} globalIndex={2} direction="bottom" />
            </div>

          </div>

          {/* DÓŁ: Ciasto (Index 2) */}
          <div className="w-full">
            {/* Ciasto wjeżdża jako ostatnie */}
            <PhotoCard photo={photos[2]} globalIndex={8} direction="bottom" />
          </div>

        </div>

        {/* BLOK PRAWY */}
        <div className="flex flex-col w-full lg:w-1/3 gap-4 lg:gap-6">
          {/* ZMIANA: Indeksy wyrównane z lewą kolumną, startują od 4 */}
          <PhotoCard photo={photos[6]} globalIndex={4} direction="right" />
          <PhotoCard photo={photos[7]} globalIndex={5} direction="right" />
          <PhotoCard photo={photos[8]} globalIndex={6} direction="right" />
          <PhotoCard photo={photos[9]} globalIndex={7} direction="right" />
        </div>

      </div>

    </section>
  );
}