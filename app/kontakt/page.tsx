"use client";

import Navbar from "@/app/components/Navbar";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Phone, Send, Facebook } from "lucide-react"; 
import { useGuest } from "@/app/context/GuestContext";
import Footer from "@/app/components/Footer";
import PageWrapper from "@/app/components/PageWrapper";
import OrganicGlassPattern from "@/app/components/OrganicGlassPattern";
import CustomCursor from "@/app/components/CustomCursor";
import { useEffect, useState } from "react";

// ==========================================
// ZMIANA: Zbudowana od zera, autentyczna ikona Messengera. 
// Błyskawica to teraz oryginalny wektor z logo aplikacji.
// ==========================================
const MessengerIcon = ({ size = 22, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Dymek czatu (obrys) */}
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    {/* Autentyczna, wyśrodkowana błyskawica Messengera */}
    <path d="m14.59 14.53 3.32-5.31c.25-.41-.24-.92-.68-.66l-4.13 3-2.61-2.99a.8.8 0 0 0-1.11 0l-3.32 5.3c-.26.42.23.93.68.67l4.13-3 2.61 2.99c.31.3.8.3 1.11 0z" fill="currentColor" stroke="none" />
  </svg>
);

export default function ContactPage() {
  const { guest, loading } = useGuest();
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FDF9EC] text-[#4c4a1e]">
        <p className="font-serif italic text-xl tracking-widest uppercase">Ładowanie...</p>
      </div>
    );
  }

  const janLink = isMobile ? "https://m.me/jan.kalla.3" : "https://www.facebook.com/jan.kalla.3";
  const magdaLink = isMobile ? "https://m.me/magda.panek.142" : "https://www.facebook.com/magda.panek.142";

  return (
    <div className="flex flex-col min-h-screen relative">
      <CustomCursor />
      
      <Navbar />
      
      <section className="relative flex-grow w-full bg-gradient-to-b from-[#FDF9EC] via-[#A46C6E] to-[#4E0113] pt-24 md:pt-32 pb-32 overflow-hidden flex flex-col items-center justify-center">
        
        <div className="absolute inset-0 z-0 pointer-events-none hidden md:block">
          <OrganicGlassPattern part="top" />
        </div>

        <div className="relative z-10 px-4 md:px-8 w-full">
          <PageWrapper className="w-full flex flex-col items-center">
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="font-serif font-light text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-16 text-center text-[#4c4a1e] drop-shadow-sm uppercase tracking-widest"
            >
              Skontaktuj się z nami
            </motion.h1>

            <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl gap-8 md:gap-12">
              
              {/* === Profil Jana === */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-white/40 backdrop-blur-xl border border-white/60 p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col items-center text-center w-full max-w-sm"
              >
                <a
                  href={janLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative w-44 h-44 md:w-52 md:h-52 group cursor-pointer block"
                >
                  <div className="absolute inset-0 rounded-full overflow-hidden shadow-lg hover:scale-[1.03] transition-transform duration-500 border-4 border-white/50">
                    <Image
                      src="/fotki/Jaaan.jpg"
                      alt="Jan Kalla"
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {/* ZMIANA: Zastosowano oficjalny niebieski kolor Facebooka (#0866FF) zamiast zieleni (#4c4a1e) */}
                  <div className="absolute bottom-0 right-0 md:bottom-2 md:right-2 bg-white/90 p-3 rounded-full shadow-xl border border-white/80 text-[#0866FF] transition-all duration-500 group-hover:scale-110 group-hover:bg-[#0866FF] group-hover:text-white z-10">
                    {isMobile ? <MessengerIcon size={22} /> : <Facebook size={22} strokeWidth={1.5} />}
                  </div>
                </a>
                
                <h2 className="font-serif text-3xl md:text-4xl font-light mt-6 text-[#4c4a1e] tracking-wide">
                  Jan
                </h2>
                <div className="mt-5 flex flex-col gap-3 text-[#4c4a1e]/80">
                  <a href="tel:+48695556830" className="flex items-center justify-center gap-3 hover:text-[#4c4a1e] transition-colors group cursor-pointer">
                    <Phone size={18} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" /> 
                    <span className="font-sans font-light tracking-widest text-sm md:text-base">+48 695 556 830</span>
                  </a>
                  <a href="mailto:kallajan02@gmail.com" className="flex items-center justify-center gap-3 hover:text-[#4c4a1e] transition-colors group cursor-pointer">
                    <Mail size={18} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" /> 
                    <span className="font-sans font-light tracking-widest text-sm md:text-base">kallajan02@gmail.com</span>
                  </a>
                </div>
              </motion.div>

              {/* === Profil Magdy === */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="bg-white/40 backdrop-blur-xl border border-white/60 p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col items-center text-center w-full max-w-sm"
              >
                <a
                  href={magdaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative w-44 h-44 md:w-52 md:h-52 group cursor-pointer block"
                >
                  <div className="absolute inset-0 rounded-full overflow-hidden shadow-lg hover:scale-[1.03] transition-transform duration-500 border-4 border-white/50">
                    <Image
                      src="/fotki/Madziaaa.jpg"
                      alt="Magdalena Panek"
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {/* ZMIANA: Zastosowano oficjalny niebieski kolor Facebooka (#0866FF) zamiast zieleni (#4c4a1e) */}
                  <div className="absolute bottom-0 right-0 md:bottom-2 md:right-2 bg-white/90 p-3 rounded-full shadow-xl border border-white/80 text-[#0866FF] transition-all duration-500 group-hover:scale-110 group-hover:bg-[#0866FF] group-hover:text-white z-10">
                    {isMobile ? <MessengerIcon size={22} /> : <Facebook size={22} strokeWidth={1.5} />}
                  </div>
                </a>

                <h2 className="font-serif text-3xl md:text-4xl font-light mt-6 text-[#4c4a1e] tracking-wide">
                  Magdalena
                </h2>
                <div className="mt-5 flex flex-col gap-3 text-[#4c4a1e]/80">
                  <a href="tel:+48725210959" className="flex items-center justify-center gap-3 hover:text-[#4c4a1e] transition-colors group cursor-pointer">
                    <Phone size={18} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" /> 
                    <span className="font-sans font-light tracking-widest text-sm md:text-base">+48 725 210 959</span>
                  </a>
                  <a href="mailto:magdalenapanek21@gmail.com" className="flex items-center justify-center gap-3 hover:text-[#4c4a1e] transition-colors group cursor-pointer">
                    <Mail size={18} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" /> 
                    <span className="font-sans font-light tracking-widest text-sm md:text-base">magdalenapanek21@gmail.com</span>
                  </a>
                </div>
              </motion.div>
            </div>

            {/* SEKCJA TRADYCYJNEJ POCZTY */}
            {guest && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mt-32 w-full max-w-4xl"
              >
                <h2 className="font-serif text-xl md:text-2xl font-light mb-12 text-center text-[#FDF9EC] uppercase tracking-widest drop-shadow-sm">
                  Przyjmujemy również tradycyjną pocztę
                </h2>

                <div className="flex flex-col md:flex-row items-center justify-center w-full gap-8 md:gap-12 text-[#FDF9EC]">
                  
                  {/* Adres Jana */}
                  <div className="bg-black/20 backdrop-blur-xl border border-white/20 p-8 md:p-10 rounded-3xl shadow-2xl flex flex-col items-center text-center w-full max-w-sm">
                    <div className="bg-white/10 p-4 rounded-full mb-6 border border-white/10">
                      <Send className="text-[#FDF9EC]" size={28} strokeWidth={1.5} />
                    </div>
                    <p className="font-serif text-2xl tracking-wide mb-4">Jan Kalla</p>
                    <div className="font-sans font-light uppercase tracking-widest text-sm text-[#FDF9EC]/80 space-y-2">
                      <p>ul. Solna 10</p>
                      <p>43-190 Mikołów</p>
                    </div>
                  </div>

                  {/* Adres Magdy */}
                  <div className="bg-black/20 backdrop-blur-xl border border-white/20 p-8 md:p-10 rounded-3xl shadow-2xl flex flex-col items-center text-center w-full max-w-sm">
                    <div className="bg-white/10 p-4 rounded-full mb-6 border border-white/10">
                      <Send className="text-[#FDF9EC]" size={28} strokeWidth={1.5} />
                    </div>
                    <p className="font-serif text-2xl tracking-wide mb-4">Magdalena Panek</p>
                    <div className="font-sans font-light uppercase tracking-widest text-sm text-[#FDF9EC]/80 space-y-2">
                      <p>ul. Spółdzielczości 36</p>
                      <p>40-642 Katowice</p>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

          </PageWrapper>
        </div>
      </section>

      <div className="relative z-10 w-full">
        <Footer />
      </div>
    </div>
  );
}