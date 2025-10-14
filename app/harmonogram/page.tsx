"use client";

import Navbar from "@/app/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AnimatedText from "@/app/components/AnimatedText";
import MapTrackSection from "@/app/components/MapTrackSection";

const images = [
  "/fotki/Szwajcaria1.jpg",
  "/fotki/Szwajcaria2.jpg",
];

export default function HarmonogramPage() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [current]);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAD6C8] to-[#4E0113]">
      <Navbar />
    {/* Sekcja zdjęcia + opis lokalu */}
      <section className="flex flex-col md:flex-row w-full py-16">
      {/* Lewa kolumna – slider */}
      <div className="flex-1 relative h-64 md:h-[600px] overflow-hidden shadow-lg my-[100px] ml-[100px]">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={images[current]}
            alt="Sala weselna Stara Szwajcaria"
            className="w-full h-full object-cover"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
            transition={{ ease: "easeInOut" }}
          />
        </AnimatePresence>

        {/* Strzałki */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-[#4E0113]/70 text-white p-2 rounded-full hover:bg-[#4E0113]"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-[#4E0113]/70 text-white p-2 rounded-full hover:bg-[#4E0113]"
        >
          <ChevronRight size={24} />
        </button>
      </div>

    {/* Prawa kolumna – opis z animacją */}
    <div className="flex-1 px-8 md:px-16 flex flex-col justify-center text-[#4E0113]">
      <AnimatedText
        text="Stara Szwajcaria – Gliwice"
        className="text-4xl font-bold mb-6 text-left"
        mode="letters"
      />
      <AnimatedText
        text="ul. Łabędzka, 44-100"
        className="font-bold mb-4"
        mode="line"
        delay={0.3}
      />

      <AnimatedText
        text="Stara Szwajcaria lorem ipsum fifa rafa fifa rafa, wszyscy dobrze wiemy co oni tam mają. Czy my to w ogóle musimy przedstawiać?"
        className="text-lg leading-relaxed mb-4 text-left"
        mode="line"
        delay={0.6}
      />

      <AnimatedText
        text="No nie no wiadomo, wypadałoby, trzeba czymś zaintrygować gości. Powiemy coś o parku, placu zabaw, ale też o dużej sali dla dzieci i może o dwóch salach do żarcia i tańców."
        className="text-lg leading-relaxed text-left"
        mode="line"
        delay={0.9}
      />
    </div>

  </section>


      {/* Mapka w większym okienku */}
       <MapTrackSection />

      {/* Harmonogram */}
      <section className="max-w-3xl mx-auto my-12 px-6 text-[#FAD6C8]">
        <h2 className="text-3xl font-bold text-center mb-8">
          Plan naszego wielkiego dnia
        </h2>
        <ul className="space-y-6 text-lg">
          <li>
            <span className="font-semibold">14:00</span> – Powitanie gości w Starej Szwajcarii i życzenia
          </li>
          <li>
            <span className="font-semibold">15:00</span> – Dwudaniowy obiad
          </li>
          <li>
            <span className="font-semibold">16:00</span> – Pierwszy taniec
          </li>
          <li>
            <span className="font-semibold">19:00</span> – Proszę państwa! Jan będzie jeść jak koń 🎉🐎
          </li>
          <li>
            <span className="font-semibold">00:00</span> – Oczepiny
          </li>
            <li>
            <span className="font-semibold">06:00</span> – Koniec
          </li>
        </ul>
      </section>
    </div>
  );
}
