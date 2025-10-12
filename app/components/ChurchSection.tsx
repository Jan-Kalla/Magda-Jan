"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedText from "./AnimatedText";
import { useState, useEffect } from "react";

export default function ChurchSection() {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const imgTimer = setInterval(() => setActiveImage((p) => (p === 0 ? 1 : 0)), 8000);
    return () => clearInterval(imgTimer);
  }, []);

  return (
    <section className="relative z-10 bg-gradient-to-b from-[#FAD6C8] to-[#A46C6E] px-8 py-20 flex flex-col lg:flex-row items-stretch gap-12 text-[#4E0113]">
      <div className="flex-1 flex flex-col justify-center text-lg md:text-xl leading-relaxed text-center lg:text-right space-y-3">
        <AnimatedText text="Kościół pw. św. Piotra i Pawła" className="font-bold" delay={0.2} mode="line" />
        <AnimatedText text="ul. Staromiejska 95, 43-190 Mikołów" delay={0.4} mode="line" />
        <AnimatedText
          text="Uroczystość rozpocznie się 19 lipca 2026 o godzinie 12:00"
          className="font-semibold"
          delay={0.6}
          mode="line"
        />
      </div>

      <div className="relative flex-1 h-[1600px] lg:h-auto min-h-[800px] overflow-hidden rounded-xl shadow-lg">
        <AnimatePresence mode="sync">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1.4 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1 },
              scale: { duration: 8, ease: "linear" },
            }}
            className="absolute inset-0"
          >
            <Image
              src={activeImage === 0 ? "/fotki/kosciol1.jpg" : "/fotki/kosciol2.jpg"}
              alt="Kościół"
              fill
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
