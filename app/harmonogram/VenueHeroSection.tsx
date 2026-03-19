"use client";

import { motion } from "framer-motion";
import AnimatedText from "@/app/components/AnimatedText";

const images = [
  "/fotki/Szwajcaria1.jpg",
  "/fotki/Szwajcaria2.jpg",
  "/fotki/Szwajcaria3.jpg",
  "/fotki/Szwajcaria4.jpg",
  "/fotki/Szwajcaria5.jpg",
  "/fotki/Szwajcaria_6.jpg",
  "/fotki/Szwajcaria7.jpg",
  "/fotki/Szwajcaria8.jpg",
];

// Przy 5 zdjęciach wystarczy powielić tablicę tylko raz, 
// by animacja x: ["0%", "-50%"] zrobiła idealną pętlę.
const duplicatedImages = [...images, ...images];

export default function VenueHeroSection() {
  return (
    // ZMIANA 1: Usunięto 'overflow-hidden', aby cień mógł swobodnie opadać, oraz zwiększono lekko dolny padding na pb-16
    <section className="flex flex-col md:flex-row w-full pt-20 md:pt-28 pb-16 items-center">
      
      {/* Lewa kolumna – slider (taśma zdjęć) */}
      {/* ZMIANA 2: Poprawiono marginesy i szerokość dla mobile, dodano pełne zaokrąglenie rogów (md:rounded-3xl) */}
      <div className="w-[calc(100%-2rem)] md:w-1/2 relative h-[300px] md:h-[500px] shadow-2xl rounded-2xl md:rounded-3xl overflow-hidden border border-white/30 mx-auto md:ml-12 md:mr-0 bg-black/10 backdrop-blur-sm">
        <motion.div
          className="flex h-full w-max"
          animate={{ x: ["0%", "-50%"] }} 
          transition={{ ease: "linear", duration: 60, repeat: Infinity }}
        >
          {duplicatedImages.map((src, i) => (
            <div key={i} className="relative h-full w-auto flex-shrink-0">
              <img
                src={src}
                alt="Sala weselna Stara Szwajcaria"
                className="h-full w-auto object-cover"
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Prawa kolumna – opis */}
      <div className="w-full md:w-1/2 px-6 md:px-16 flex flex-col justify-center mt-12 md:mt-0">
        <AnimatedText
          text="Stara Szwajcaria"
          className="font-serif text-4xl md:text-6xl font-light mb-4 text-[#2C2B14] drop-shadow-md tracking-wide"
          mode="letters"
        />
        <AnimatedText
          text="Gliwice, ul. Łabędzka 6"
          className="font-sans font-light uppercase tracking-[0.2em] text-sm md:text-base text-[#2C2B14]/80 mb-10"
          mode="line"
          delay={0.3}
        />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/30 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-white/50 relative overflow-hidden"
        >
          <p className="font-sans font-light text-lg leading-relaxed mb-6 text-[#2C2B14]">
            To tutaj rozegra się akcja naszego filmu. Właśnie w tych progach miejsce będzie miała ta legendarna i niezapomniana zabawa! Do naszej dyspozycji mamy łącznie około 750 m2 na salach i o wiele więcej w parku Szwajcaria tuż obok.
          </p>
          <p className="font-serif italic text-xl text-[#2C2B14] tracking-wide">
            Przygotujcie się na 4 Akty pełne emocji.
          </p>
        </motion.div>
      </div>
    </section>
  );
}