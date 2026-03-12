"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { Fragment } from "react";

export default function AboutSection() {
  const paragraphText = "Czeeeeeeeeeść! To My! Magda i Johny! Znamy się od września 2018 roku i już całkiem sporo razem przeżyliśmy. Nadszedł w końcu ten czas, że podjęliśmy wspólnie decyzję o tym, że chcemy spędzić ze sobą resztę życia. Traktujemy jednak tę decyzję śmiertelnie poważnie, dlatego chcemy jawnie wyznać oraz zapieczętować ją przed Bogiem i przed ludźmi. Pragniemy, by KAŻDY, kto towarzyszył nam w naszej drodze choćby przez moment, był również z nami w tym, być może, najważniejszym momencie naszego życia, bo zakładamy, że drugiego takiego już nie będzie! Super by było, jeżeli jak najwięcej z Was stanie się świadkami naszego sakramentalnego \"TAK\"!";
  const words = paragraphText.split(" ");

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02, 
        delayChildren: 0.3,
      }
    }
  };

  const wordVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 10,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as const 
      }
    }
  };

  return (
    <div className="w-full text-[#4c4a1e] overflow-hidden">
      {/* --- SEKCJA 1: CYTAT --- */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-3xl mx-auto px-6 mt-48 mb-48 md:mt-60 md:mb-60 text-center flex flex-col items-center"
      >
        <p className="font-serif italic text-xl md:text-2xl leading-relaxed mb-4">
          "Obleczcie się w serdeczne współczucie, w dobroć, pokorę, cichość, cierpliwość, znosząc jedni drugich i wybaczając sobie nawzajem..."
        </p>
        <p className="font-sans text-xs uppercase tracking-[0.2em] opacity-70">
          Kol 3, 12
        </p>
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: 48 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          className="h-[1px] bg-[#4c4a1e]/40 mt-8"
        />
      </motion.div>

      {/* --- SEKCJA 2: O NAS --- */}
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 lg:gap-12 mb-20 md:mb-32">
        
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex-shrink-0 relative w-full max-w-sm h-[460px] md:max-w-none md:w-[480px] md:h-[620px] lg:w-[520px] lg:h-[700px] overflow-hidden rounded-sm bg-black/5 shadow-lg"
        >
          <Image 
            src="/fotki/para_1.jpg"
            alt="Magda i Johny"
            fill
            className="object-cover object-center"
          />
        </motion.div>

        <div className="flex-1 flex flex-col items-start text-left pt-2 w-full">  
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-script text-xl md:text-2xl lg:text-3xl drop-shadow-sm mb-2 ml-2 md:ml-8 lg:ml-6"
          >
            Poznajamy się
          </motion.p>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="font-serif font-light text-3xl sm:text-4xl md:text-4xl lg:text-5xl uppercase tracking-[0.1em] lg:tracking-[0.15em] mb-12 md:mb-20 break-words w-full"
          >
            {/* ZMIANA: Dodano "whitespace-nowrap" obejmujące znak "&" i imię "Johny", dzięki czemu nie rozdzielą się na dwie linijki */}
            Magda <span className="whitespace-nowrap"><span className="italic pr-1">&amp;</span> Johny</span>
          </motion.h2>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            // ZMIANA: Przywrócono stałe "text-justify" zamiast "text-left sm:text-justify"
            className="font-serif font-normal text-lg md:text-xl leading-relaxed max-w-lg text-justify hyphens-auto block w-full"
          >
            {words.map((word, index) => (
              <Fragment key={index}>
                <motion.span
                  variants={wordVariants}
                  className="inline-block"
                >
                  {word}
                </motion.span>
                {index < words.length - 1 && " "}
              </Fragment>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}