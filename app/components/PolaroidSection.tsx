"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function PolaroidSection() {
  const photos = [
    { src: "/fotki/2019.02.jpg", alt: "Pierwsza liceum" },
    { src: "/fotki/2020.jpg", alt: "Druga liceum" },
    { src: "/fotki/2022.04.jpeg", alt: "Pierwszy rok studiów" },
    { src: "/fotki/2024.09.jpeg", alt: "Czwarty rok studiów" },
    { src: "/fotki/2024.11.jpg", alt: "Zaręczyny" },
    { src: "/fotki/2024.12.jpg", alt: "Narty" },
    { src: "/fotki/2025.09.jpg", alt: "Świnica" },
  ];

  return (
    <section className="relative min-h-screen bg-[#FAD6C8] flex flex-col lg:flex-row items-start justify-between gap-16 px-32 py-24 text-[#4E0113]">
      <div className="relative flex flex-col items-center w-full max-w-md lg:max-w-lg">
        <div className="absolute left-[45%] lg:left-[40%] top-0 bottom-0 w-1 bg-[#4E0113]/30 -z-10"></div>

        {photos.map((photo, idx) => {
          const isLeft = idx % 2 === 0;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className={`relative bg-white p-2 md:p-3 shadow-lg rounded-md 
                w-52 sm:w-60 md:w-72
                ${isLeft ? "md:mr-auto md:-rotate-6 md:-translate-x-10" : "md:ml-auto md:rotate-6 md:translate-x-40"}
                ${isLeft ? "rotate-[-2deg]" : "rotate-[2deg]"}`}
              style={{ marginTop: idx === 0 ? "0" : "-3rem" }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={400}
                height={300}
                className="rounded-sm object-contain"
              />
              <p className="mt-2 text-sm text-center text-[#4E0113]">{photo.alt}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7 }}
        className="flex-1 max-w-xl text-center lg:text-left mt-12 lg:mt-0"
      >

        <p className="text-base md:text-lg leading-relaxed whitespace-pre-line">
          Czeeeeeeeeeść! To My! Magda i Johny!{"\n"}
          Znamy się od września 2018 roku i już całkiem sporo razem przeżyliśmy,{"\n"}
          Nadzszedł w końcu ten czas, że podjęliśmy wspólnie decyzję o tym, że chcemy spędzić ze sobą resztę życia,{"\n"}
          Traktujemy jednak tę decyzję śmiertelnie poważnie, a nie jako coś, co po prostu postalowiliśmy sobie w przypływie uniesienia,{"\n"}
          Dlatego chcemy jawnie wyznać i zapieczętować tę decyzję przed Bogiem, jak i przed ludźmi,{"\n"}
          Świadomie i dobrowolnie zrzekając się możliwości pójścia w inną stronę, nawet gdyby kiedyś miało być ciężko, {"\n"}
          Dobrze zdając sobie sprawę, z czym się to wiąże, chcemy pozostać ze sobą już do końca życia, bez możliwości rezygnacji z tej umowy,{"\n"}
          Chcemy, byście toważyszyli nam w tym, być może, najważniejszym momencie naszego życia, bo zakładamy, że drugiego takiego już nie będzie,{"\n"}
          Dlatego zależy nam na waszej obecności w tym dniu, na naszym ślubie każdy, kto towarzyszył nam na tej dorodze chćby przez moment, jest mile widziany! {"\n"}
          Super by było, jeżeli jak najwięcej z was stanie się świadkami naszego sakramwntalnego "TAK"!{"\n\n"}

        </p>

        <blockquote className="italic text-xl md:text-2xl mb-6">
          „Zwierzęta, które mają jądra zgniecione, starte, wyrwane albo wycięte, nie będziecie składać w ofierze Panu i nie będziecie takich rzeczy robić w waszym kraju” <br /> (Ks. Kpł 22, 24)
        </blockquote>
      </motion.div>
    </section>
  );
}
