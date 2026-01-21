"use client";

import Navbar from "@/app/components/Navbar";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Phone, Heart, Send } from "lucide-react";
import { useGuest } from "@/app/context/GuestContext";
import Footer from "@/app/components/Footer";

export default function ContactPage() {
  const { guest, loading } = useGuest();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FAD6C8] text-[#4E0113]">
        <p>Ładowanie...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <section className="relative min-h-screen bg-gradient-to-b from-[#FAD6C8] to-[#4E0113] flex flex-col items-center justify-center text-white px-8 py-20">
        {/* Nagłówek */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold mb-12 text-center"
        >
          Skontaktuj się z nami <Heart className="inline ml-3 text-[#FAD6C8]" />
        </motion.h1>

        {/* Kontener na dwa profile */}
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between w-full max-w-3xl px-6 gap-20 lg:gap-32 xl:gap-48">
          {/* === Profil Jana === */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center"
          >
            <a
              href="https://www.facebook.com/jan.kalla.3"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-48 h-48 rounded-full overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <Image
                src="/fotki/Jaaan.jpg"
                alt="Jaaan"
                fill
                className="object-cover"
              />
            </a>
            <h2 className="text-2xl font-semibold mt-4 text-[#FBE4DA]">Jaaan</h2>
            <div className="mt-2 space-y-2 text-[#FBE4DA]/90">
              <p className="flex items-center justify-center gap-2">
                <Phone size={18} /> +48 69 555 68 30
              </p>
              <p className="flex items-center justify-center gap-2">
                <Mail size={18} /> kallajan02@gmail.com
              </p>
            </div>
          </motion.div>

          {/* === Profil Magdy === */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center text-center"
          >
            <a
              href="https://www.facebook.com/magda.panek.142"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-48 h-48 rounded-full overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <Image
                src="/fotki/Madziaaa.jpg"
                alt="Madziaaa"
                fill
                className="object-cover"
              />
            </a>
            <h2 className="text-2xl font-semibold mt-4 text-[#FBE4DA]">
              Madziaaa
            </h2>
            <div className="mt-2 space-y-2 text-[#FBE4DA]/90">
              <p className="flex items-center justify-center gap-2">
                <Phone size={18} /> +48 725 210 959
              </p>
              <p className="flex items-center justify-center gap-2">
                <Mail size={18} /> magdalenapanek21@gmail.com
              </p>
            </div>
          </motion.div>
        </div>

        {/* Sekcja z dopiskiem */}
        <motion.h2
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-xl md:text-xl font-semibold mt-20 mb-8 text-center"
        >
          W razie potrzeby przyjmujemy również listy wysyłane tradycyjną pocztą ✉️
        </motion.h2>

        {/* Adresy pocztowe */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col md:flex-row items-center justify-center md:justify-between w-full max-w-2xl px-6 gap-20 lg:gap-32 xl:gap-48 text-[#FBE4DA]/90"
        >
          <div className="text-center">
            <Send className="mx-auto mb-3 text-[#FBE4DA]" size={36} />
            <p className="font-semibold text-lg">Jan Kalla</p>
            <p>ul. Solna 10</p>
            <p>43-190 Mikołów</p>
          </div>

          <div className="text-center">
            <Send className="mx-auto mb-3 text-[#FBE4DA]" size={36} />
            <p className="font-semibold text-lg">Magdalena Panek</p>
            <p>ul. Spółdzielczości 36</p>
            <p>40-642 Katowice</p>
          </div>
        </motion.div>
      </section>
      <Footer />
    </div>
  );
}
