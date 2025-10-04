"use client";

import Navbar from "@/app/components/Navbar";
import AnimatedText from "@/app/components/AnimatedText";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [now, setNow] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  const targetDate = new Date("2026-07-19T12:00:00+02:00");

  const polishTime = new Date().toLocaleTimeString("pl-PL", {
    timeZone: "Europe/Warsaw",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const diff = targetDate.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const timeUnits = [
    { label: "dni", value: days },
    { label: "godzin", value: hours },
    { label: "minut", value: minutes },
    { label: "sekund", value: seconds },
  ];

  return (
    <>
      <Navbar />



      {/* === Tło zdjęcia === */}
      <div className="fixed inset-0 -z-20">
        <Image
          src="/fotki/raczki.jpg"
          alt="Magda i Jan"
          fill
          priority
          className="object-cover"
        />
      </div>


          {/* Sekcja wprowadzająca - cytat + o nas + polaroidy */}
          <section className="relative min-h-screen bg-[#FAD6C8] flex flex-col lg:flex-row items-center justify-center gap-12 px-8 py-16 text-[#4E0113]">
            {/* Lewa część - zdjęcia na sznurku */}
            <div className="relative flex flex-col items-center w-full max-w-4xl mx-auto">
              {/* Sznurek pionowy */}
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-[#4E0113]/30 -z-10"></div>

              {[
                { src: "/fotki/2019.02.jpg", alt: "Pierwsza liceum" },
                { src: "/fotki/2020.jpg", alt: "Druga liceum" },
                { src: "/fotki/2021.05.jpeg", alt: "Trzecia liceum" },
                { src: "/fotki/2021.06.jpeg", alt: "Po liceum" },
                { src: "/fotki/2022.04.jpeg", alt: "Pierwszy rok studiów" },
                { src: "/fotki/2022.07.jpg", alt: "Drugi rok studiów" },
                { src: "/fotki/2024.07.jpeg", alt: "Trzeci rok studiów" },
                { src: "/fotki/2024.09.jpeg", alt: "Czwarty rok studiów" },
                { src: "/fotki/2024.11.jpg", alt: "Zaręczyny" },
                { src: "/fotki/2024.12.jpg", alt: "Narty" },
                { src: "/fotki/2025.06.jpg", alt: "Chudów" },
                { src: "/fotki/2025.09.jpg", alt: "Świnica" },
              ].map((photo, idx) => {
                const isLeft = idx % 2 === 0;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: idx * 0.15 }}
                    className={`
                      relative max-w-xs bg-white p-3 shadow-lg rounded-md
                      ${isLeft ? "mr-auto -rotate-6 -translate-x-2" : "ml-auto rotate-6 translate-x-2"}
                    `}
                    style={{ marginTop: "-5rem" }} // ⬅️ klucz – nakładanie w pionie
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



            {/* Prawa część - tekst */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7 }}
              className="flex-1 max-w-xl text-center lg:text-left"
            >
              <blockquote className="italic text-2xl mb-6">
                „Miłość cierpliwa jest, łaskawa jest...” <br /> (1 Kor 13, 4)
              </blockquote>
              <p className="text-lg leading-relaxed">
                 Jan, nudzę się, rób pompki<br /> 
<br /> 
                 Jan, jedz jak koń<br /> 
<br /> 
                 Po co Ci ta łyżka? Będę nią dogadzał Magdzie❤️<br /> 
<br /> 
                 Agata stópkara, to tak można? Jak kobieta może być stópkarą, <br /> 
                 przecież męskie stopy są chyba takie nieciekawe, to jest bardzo zabawne<br /> 
<br /> 
                 "rozmawiasz ze mną a w międzyczasie jest ci ładowany kij w dupe" Adam<br /> 
<br /> 
                 Gdzie jest ta świna? Bardzo lubię z nią spać<br /> 
<br /> 
                 Ooo, to mój kwasek<br /> 
<br /> 
                 A ja wkładam całą dłoń do buzi - Agi <br /> 
<br /> 
                "Rozwódka? Jaka wódka?" - Agi<br /> 
<br /> 
                "A ja sobie usiądę, bo mi się nogi męczą" - znowu Agi xD<br /> 
<br /> 
                Dał bym Brabusowi mięso wyrzygane przez kogoś<br /> 
<br /> 
                Ten stary jest pojebany - do The Lighthouse<br /> 
<br /> 
                Podsłuch dzieci, ciasto leci<br /> 
<br /> 
                Co Cię tu ugryzło? Nie wiem, jakiś chrząszcz<br /> 
<br /> 
                Wszystkiemu winni są GEJE I CYWILIZACJIA ŚMIERCI<br /> 

              </p>
            </motion.div>
          </section>


          <section className="relative w-full min-h-screen flex flex-col items-center justify-center p-8 text-center text-white overflow-hidden">
            {/* Gradient z maską pod treścią */}
            <div
              className="absolute inset-0 -z-10
                bg-gradient-to-br from-[#FBE4DA] via-[#FAD6C8] to-[#4E0113]
                [mask-image:linear-gradient(to_bottom,black_0%,transparent_0%,transparent_100%,black_100%)]
                [mask-repeat:no-repeat] [mask-size:100%_100%]"
            />

            {/* Treść hero */}
            <motion.h1
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-5xl font-bold mb-8 drop-shadow-lg"
            >
              Nasz wielki dzień ❤️
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-2xl font-semibold mb-6 drop-shadow"
            >
              Aktualna godzina w Polsce:{" "}
              <span className="text-[#75897D] bg-white/70 px-2 py-1 rounded-lg">
                {polishTime}
              </span>
            </motion.div>

            {/* Dopisek przed licznikiem */}
            <AnimatedText text="Do rozpoczęcia naszego ślubu zostało jeszcze:" />

            <motion.div
              className="grid grid-cols-4 gap-6 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.2 }, // pojawianie się jeden po drugim
                },
              }}
            >
              {timeUnits.map((unit) => (
                <motion.div
                  key={unit.label}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8, y: 20 },
                    visible: { opacity: 1, scale: 1, y: 0 },
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg w-28"
                >
                  <AnimatePresence mode="popLayout">
                    <motion.p
                      key={unit.value}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.2, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-4xl font-bold text-[#4E0113]"
                    >
                      {unit.value}
                    </motion.p>
                  </AnimatePresence>
                  <p className="text-[#841D30]">{unit.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </section>



      {/* === Dalsza zawartość strony === */}
      <section className="relative z-10 bg-gradient-to-b from-[#FAD6C8] to-[#4E0113] h-[150vh] flex items-center justify-center text-white text-3xl">
        w dół ➡️
      </section>
    </>
  );
}
