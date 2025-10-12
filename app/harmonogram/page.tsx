"use client";

import Navbar from "@/app/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "/fotki/Szwajcaria1.jpg",
  "/fotki/Szwajcaria2.jpg",
];

export default function HarmonogramPage() {
    const [current, setCurrent] = useState(0);

      // automatyczne przesuwanie co 5 sekund
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
    <section className="flex flex-col md:flex-row items-center md:items-start justify-center gap-10 max-w-6xl mx-auto px-6 py-16">
      {/* Lewa kolumna – slider */}
      <div className="w-full md:w-1/2 relative h-64 md:h-96 overflow-hidden rounded-xl shadow-lg">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={images[current]}
            alt="Sala weselna Stara Szwajcaria"
            className="w-full h-full object-cover"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.9 } }}
            exit={{ opacity: 0, x: -100, transition: { duration: 0.5 } }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </AnimatePresence>

        {/* Strzałki */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-2 -translate-y-1/2 bg-[#4E0113]/70 text-white p-2 rounded-full hover:bg-[#4E0113]"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-2 -translate-y-1/2 bg-[#4E0113]/70 text-white p-2 rounded-full hover:bg-[#4E0113]"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Prawa kolumna – opis */}
      <div className="w-full md:w-1/2 text-[#4E0113]">
        <h1 className="text-4xl font-bold mb-6">
          Stara Szwajcaria – Gliwice
        </h1>
        <p className="text-lg leading-relaxed">
          Stara Szwajcaria lorem ipsum fifa rafa fifa rafa, wszyscy dobrze wiemy co oni tam mają. 
          Czy my to w ogóle musimy przedstawiać?
        </p>
        <p className="mt-4 text-lg leading-relaxed">
          No nie no wiadomo, wypadałoby, trzeba czymś zaintrygować gości.
          Powiemy coś o parku, placu zabaw, ale też o dużej sali dla dzieci i może o dwóch salach do żarcia i tańców.
        </p>
      </div>
    </section>

{/* Mapka w większym okienku */}
<div className="flex justify-center my-10">
  <div className="w-[100%] md:w-[1080px] h-[720px] rounded-2xl overflow-hidden shadow-lg border-8 border-[#4E0113]">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2560.123456789!2d18.662!3d50.297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471130123456789%3A0xabcdef!2sStara%20Szwajcaria%2C%20%C5%81ab%C4%99dzka%206%2C%20Gliwice!5e0!3m2!1spl!2spl!4v1690000000000"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  </div>
</div>


      {/* Harmonogram */}
      <section className="max-w-3xl mx-auto my-12 px-6 text-[#FAD6C8]">
        <h2 className="text-3xl font-bold text-center mb-8">
          Plan naszego wielkiego dnia
        </h2>
        <ul className="space-y-6 text-lg">
          <li>
            <span className="font-semibold">14:00</span> – Powitanie gości w Starej Szwajcarii
          </li>
          <li>
            <span className="font-semibold">16:30</span> – Sztuczka z krabem
          </li>
          <li>
            <span className="font-semibold">17:00</span> – Chujnia z grzybnią
          </li>
          <li>
            <span className="font-semibold">19:00</span> – Drugi taniec
          </li>
          <li>
            <span className="font-semibold">20:00</span> – Proszę państwa! Jan będzie jeść jak koń 🎉🐎
          </li>
        </ul>
      </section>
    </div>
  );
}
