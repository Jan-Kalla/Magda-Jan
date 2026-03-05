"use client";

import { motion } from "framer-motion";

export default function MapSection() {
  return (
    <section className="relative z-10 px-8 pt-20 pb-48 flex flex-col items-center text-[#F6f4e5]">
      
      {/* --- MESH GRADIENT DLA MAPY --- */}
      <div className="absolute top-0 left-[20%] w-[60%] h-[400px] bg-[#841D30] blur-[150px] rounded-full mix-blend-multiply opacity-30 pointer-events-none" />

      {/* RAMKA MAPY */}
      {/* ZMIANA: Zwiększono max-w na 6xl oraz h na 600px dla lepszej czytelności i efektu "WOW" */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-full max-w-6xl h-[600px] md:h-[800px] rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.4)] border-4 border-white/10 relative z-10 bg-black/20 backdrop-blur-sm"
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2567.435861597826!2d18.8195421!3d50.2111077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4716cb485ab357c1%3A0xfc642914f2d6cac0!2sKo%C5%9Bci%C3%B3%C5%82%20Rzymskokatolicki%20pw.%20%C5%9Bw.%20Piotra%20i%20Paw%C5%82a!5e0!3m2!1spl!2spl!4v1696600000000!5m2!1spl!2spl"
          width="100%"
          height="100%"
          style={{ border: 0, filter: "grayscale(0.2) contrast(1.1)" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="opacity-95 hover:opacity-100 transition-opacity duration-500"
        />
      </motion.div>
      
    </section>
  );
}