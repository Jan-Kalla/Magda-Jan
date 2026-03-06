"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useGuest } from "@/app/context/GuestContext";
import { ALBUMS, ACCESS_WEIGHTS, Album, AccessLevel } from "./data";
import AlbumCard from "./components/AlbumCard";
import AlbumModal from "./components/AlbumModal";
import PageWrapper from "@/app/components/PageWrapper";
import { motion, Variants } from "framer-motion";
import OrganicGlassPattern from "@/app/components/OrganicGlassPattern";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

export default function GalleryPage() {
  const { guest, loading } = useGuest();
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  const hasAccess = (requiredLevel: AccessLevel) => {
    if (!guest) return false;
    const userLevel = (guest.access_level || 'basic') as AccessLevel;
    const userWeight = ACCESS_WEIGHTS[userLevel] || 1;
    const requiredWeight = ACCESS_WEIGHTS[requiredLevel];
    return userWeight >= requiredWeight;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FDF9EC] text-[#4c4a1e]">
        <p className="font-serif italic text-xl tracking-widest uppercase">Ładowanie...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* GŁÓWNY KONTENER Z PŁYNNYM GRADIENTEM I SZKŁEM */}
      <section className="relative flex-grow bg-gradient-to-b from-[#FDF9EC] via-[#A46C6E] to-[#4E0113] pt-24 md:pt-32 pb-32 overflow-hidden text-[#4c4a1e]">
        
        <div className="absolute inset-0 z-0 pointer-events-none">
          <OrganicGlassPattern part="top" />
        </div>

        <div className="relative z-10 px-4 md:px-8">
          <PageWrapper className="max-w-6xl mx-auto w-full">
              
              <header className="text-center mb-16">
                <motion.h1 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="font-script text-6xl md:text-7xl text-[#4c4a1e] mb-6 drop-shadow-sm"
                >
                  Galeria Wspomnień
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                  className="font-sans font-light uppercase tracking-[0.15em] text-[#4c4a1e]/80 text-sm md:text-base max-w-2xl mx-auto"
                >
                  Zbiór chwil, które nas ukształtowały i tych, które dopiero nadejdą
                </motion.p>
              </header>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {ALBUMS.map((album) => {
                  if (!hasAccess(album.requiredLevel)) return null;

                  return (
                    <motion.div key={album.id} variants={itemVariants}>
                      <AlbumCard 
                        album={album} 
                        onClick={setSelectedAlbum} 
                      />
                    </motion.div>
                  );
                })}
              </motion.div>

              <AlbumModal 
                album={selectedAlbum} 
                userAccessLevel={guest?.access_level || 'basic'}
                onClose={() => setSelectedAlbum(null)} 
              />
          </PageWrapper>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}